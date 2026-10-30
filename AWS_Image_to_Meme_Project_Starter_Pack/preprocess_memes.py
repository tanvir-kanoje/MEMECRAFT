#!/usr/bin/env python3
"""One-time face-attribute preprocessing for the meme dataset in S3.

Safe first run: processes only 20 images unless LIMIT=0 is specified.
Run from AWS CloudShell in the same AWS account, using the CloudShell role/user
that has the required S3 and Rekognition permissions.

Required IAM actions:
  s3:ListBucket on arn:aws:s3:::my-meme-database-2026
  s3:GetObject on arn:aws:s3:::my-meme-database-2026/images/*
  s3:GetObject and s3:PutObject on arn:aws:s3:::my-meme-database-2026/metadata/*
  rekognition:DetectFaces on * (Rekognition IAM resources are not object-scoped)
"""

import json
import os
import sys
import time
from datetime import datetime, timezone
from botocore.config import Config
from botocore.exceptions import ClientError
import boto3

BUCKET = os.getenv("BUCKET", "my-meme-database-2026")
REGION = os.getenv("PROJECT_AWS_REGION", "us-east-1")
IMAGE_PREFIX = os.getenv("IMAGE_PREFIX", "images/")
OUTPUT_KEY = os.getenv("OUTPUT_KEY", "metadata/memes_metadata.json")
CHECKPOINT_KEY = os.getenv("CHECKPOINT_KEY", OUTPUT_KEY)
CHECKPOINT_EVERY = int(os.getenv("CHECKPOINT_EVERY", "25"))
# Safe by default. Use LIMIT=0 only after reviewing a successful small run.
LIMIT = int(os.getenv("LIMIT", "20"))
PAUSE_SECONDS = float(os.getenv("PAUSE_SECONDS", "0.15"))
FRESH_START = os.getenv("FRESH_START", "0").lower() in ("1", "true", "yes")
EXTENSIONS = (".jpg", ".jpeg", ".png")

client_config = Config(retries={"max_attempts": 8, "mode": "standard"})
s3 = boto3.client("s3", region_name=REGION, config=client_config)
rekognition = boto3.client("rekognition", region_name=REGION, config=client_config)


def list_image_keys():
    paginator = s3.get_paginator("list_objects_v2")
    keys = []
    for page in paginator.paginate(Bucket=BUCKET, Prefix=IMAGE_PREFIX):
        for obj in page.get("Contents", []):
            key = obj["Key"]
            if key.lower().endswith(EXTENSIONS):
                keys.append(key)
    return sorted(keys)


def load_existing_results():
    if FRESH_START:
        print("[FRESH_START active] Starting a completely clean metadata index (ignoring previous checkpoint).")
        return {}
    try:
        response = s3.get_object(Bucket=BUCKET, Key=CHECKPOINT_KEY)
        payload = response["Body"].read().decode("utf-8")
        results = json.loads(payload)
        if not isinstance(results, dict):
            raise ValueError("Existing metadata root must be a JSON object")
        return results
    except ClientError as exc:
        code = exc.response.get("Error", {}).get("Code", "")
        if code in ("NoSuchKey", "404", "NotFound"):
            return {}
        raise


def attr_value(attribute):
    return {
        "value": bool(attribute.get("Value", False)),
        "confidence": round(float(attribute.get("Confidence", 0.0)), 2),
    }


def analyze_one(key):
    response = rekognition.detect_faces(
        Image={"S3Object": {"Bucket": BUCKET, "Name": key}},
        Attributes=["ALL"],
    )
    faces = []
    for face in response.get("FaceDetails", []):
        emotions = sorted(
            [
                {"type": emotion.get("Type"), "confidence": round(float(emotion.get("Confidence", 0.0)), 2)}
                for emotion in face.get("Emotions", [])
            ],
            key=lambda item: item["confidence"],
            reverse=True,
        )
        faces.append({
            "face_confidence": round(float(face.get("Confidence", 0.0)), 2),
            "dominant_emotion": emotions[0]["type"] if emotions else None,
            "emotions": emotions,
            "smile": attr_value(face.get("Smile", {})),
            "mouth_open": attr_value(face.get("MouthOpen", {})),
            "eyeglasses": attr_value(face.get("Eyeglasses", {})),
            "sunglasses": attr_value(face.get("Sunglasses", {})),
            "beard": attr_value(face.get("Beard", {})),
            "mustache": attr_value(face.get("Mustache", {})),
            "eyes_open": attr_value(face.get("EyesOpen", {})),
            "pose": face.get("Pose", {}),
            "quality": face.get("Quality", {}),
            "bounding_box": face.get("BoundingBox", {}),
        })

    status = "success" if faces else "no_face"
    return {
        "key": key,
        "status": status,
        "face_count": len(faces),
        "faces": faces,
        "analyzed_at_utc": datetime.now(timezone.utc).isoformat(),
        "analysis_api": "Rekognition DetectFaces",
    }


def save_checkpoint(results):
    body = json.dumps(results, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    s3.put_object(
        Bucket=BUCKET,
        Key=CHECKPOINT_KEY,
        Body=body,
        ContentType="application/json; charset=utf-8",
        ServerSideEncryption="AES256",
    )
    # Keep a local copy too, useful for viewing/downloading from CloudShell.
    with open("memes_metadata_checkpoint.json", "w", encoding="utf-8") as file:
        file.write(json.dumps(results, ensure_ascii=False, indent=2))


def main():
    print(f"Region: {REGION}")
    print(f"Bucket: {BUCKET}")
    print(f"Image prefix: {IMAGE_PREFIX}")
    print(f"Metadata output: s3://{BUCKET}/{OUTPUT_KEY}")
    print(f"LIMIT: {LIMIT} (0 means all images)")
    print(f"FRESH_START: {FRESH_START}")

    keys = list_image_keys()
    print(f"JPEG/PNG images found: {len(keys)}")
    if not keys:
        print("No JPEG/PNG images found. Check the bucket name and prefix.", file=sys.stderr)
        return 2

    results = load_existing_results()
    # Skip successfully processed images and images that were correctly found to contain no face.
    remaining = [
        key for key in keys
        if results.get(key, {}).get("status") not in ("success", "no_face")
    ]
    if LIMIT > 0:
        remaining = remaining[:LIMIT]

    print(f"Previously completed: {sum(1 for v in results.values() if v.get('status') in ('success', 'no_face'))}")
    print(f"This run will attempt: {len(remaining)} images")

    processed_this_run = 0
    failures = 0
    for index, key in enumerate(remaining, start=1):
        try:
            results[key] = analyze_one(key)
            if results[key]["status"] == "no_face":
                print(f"[{index}/{len(remaining)}] NO FACE: {key}")
            else:
                print(f"[{index}/{len(remaining)}] OK ({results[key]['face_count']} face(s)): {key}")
        except ClientError as exc:
            error = exc.response.get("Error", {})
            results[key] = {
                "key": key,
                "status": "error",
                "error_code": error.get("Code", "UnknownError"),
                "error_message": error.get("Message", str(exc))[:500],
                "analyzed_at_utc": datetime.now(timezone.utc).isoformat(),
            }
            failures += 1
            print(f"ERROR: {key}: {error.get('Code', 'UnknownError')} - {error.get('Message', str(exc))}", file=sys.stderr)
        except Exception as exc:
            results[key] = {
                "key": key,
                "status": "error",
                "error_code": type(exc).__name__,
                "error_message": str(exc)[:500],
                "analyzed_at_utc": datetime.now(timezone.utc).isoformat(),
            }
            failures += 1
            print(f"ERROR: {key}: {exc}", file=sys.stderr)

        processed_this_run += 1
        if processed_this_run % CHECKPOINT_EVERY == 0:
            save_checkpoint(results)
            print(f"Checkpoint saved to s3://{BUCKET}/{CHECKPOINT_KEY}")
        if PAUSE_SECONDS > 0:
            time.sleep(PAUSE_SECONDS)

    save_checkpoint(results)
    complete = sum(1 for v in results.values() if v.get("status") in ("success", "no_face"))
    faces_found = sum(1 for v in results.values() if v.get("status") == "success")
    no_faces = sum(1 for v in results.values() if v.get("status") == "no_face")
    errors = sum(1 for v in results.values() if v.get("status") == "error")
    print("\nSUMMARY")
    print(f"Completed image records: {complete}")
    print(f"Images with one or more faces: {faces_found}")
    print(f"Images with no detected face: {no_faces}")
    print(f"Images with errors still recorded: {errors} (rerun to retry errors)")
    print(f"Metadata: s3://{BUCKET}/{OUTPUT_KEY}")
    print("Review the 20-image run before using LIMIT=0 for the full dataset.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
