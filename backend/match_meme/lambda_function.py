import json
import logging
import os
import random
import boto3
from botocore.config import Config
from botocore.exceptions import ClientError

# Logger setup
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Configuration
REGION = os.getenv("AWS_REGION", "us-east-1")
BUCKET = os.getenv("BUCKET", "my-meme-database-2026")
METADATA_KEY = os.getenv("METADATA_KEY", "metadata/memes_metadata.json")
MEME_URL_EXPIRATION = int(os.getenv("MEME_URL_EXPIRATION", "900"))  # 15 minutes
ALLOWED_ORIGIN = os.getenv("ALLOWED_ORIGIN", "https://d2tuc83mjm02el.cloudfront.net")
UPLOAD_PREFIX = os.getenv("UPLOAD_PREFIX", "uploads/")

s3_config = Config(retries={"max_attempts": 3, "mode": "standard"}, signature_version="s3v4")
s3 = boto3.client("s3", region_name=REGION, config=s3_config)
rekognition = boto3.client("rekognition", region_name=REGION, config=s3_config)

# In-memory cache for warm Lambda execution environments (avoids re-fetching 800+ memes from S3)
CACHED_METADATA = None


def get_cors_headers(request_origin=None):
    """Returns CORS headers. Allows local development or restricted CloudFront production origin."""
    origin = ALLOWED_ORIGIN
    if request_origin:
        if "localhost" in request_origin or "127.0.0.1" in request_origin:
            origin = request_origin
        elif request_origin == ALLOWED_ORIGIN:
            origin = request_origin

    return {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
    }


def get_metadata():
    """Fetches and caches the precomputed meme metadata from S3."""
    global CACHED_METADATA
    if CACHED_METADATA is not None:
        return CACHED_METADATA

    try:
        logger.info(f"Loading metadata from s3://{BUCKET}/{METADATA_KEY}...")
        response = s3.get_object(Bucket=BUCKET, Key=METADATA_KEY)
        payload = response["Body"].read().decode("utf-8")
        CACHED_METADATA = json.loads(payload)
        logger.info(f"Successfully loaded {len(CACHED_METADATA)} meme metadata records into memory.")
        return CACHED_METADATA
    except Exception:
        logger.exception("Error loading metadata from S3")
        return {}


def get_primary_face(faces):
    """Picks the largest face by bounding box area."""
    if not faces:
        return None
    if len(faces) == 1:
        return faces[0]

    def face_area(face):
        box = face.get("BoundingBox", {})
        return box.get("Width", 0.0) * box.get("Height", 0.0)

    return max(faces, key=face_area)


def calculate_match_score(user_face, meme_face):
    """
    Computes an explainable weighted affinity score (0.0 to 1.0) between user and meme:
    - Dominant Emotion: 0.50
    - Smile:            0.25
    - Mouth Open:       0.10
    - Pose Similarity:  0.10
    - Eyeglasses:       0.05
    """
    score = 0.0

    # 1. Dominant Emotion (0.50)
    user_emotions = user_face.get("Emotions", [])
    user_top_emotion = user_emotions[0]["Type"] if user_emotions else None
    meme_top_emotion = meme_face.get("dominant_emotion")

    if user_top_emotion and meme_top_emotion:
        if user_top_emotion.upper() == meme_top_emotion.upper():
            score += 0.50
        else:
            # Check secondary emotion overlap
            user_emotion_types = [e["Type"].upper() for e in user_emotions[:3]]
            meme_emotions = [e["type"].upper() for e in meme_face.get("emotions", [])[:3]]
            if any(e in meme_emotions for e in user_emotion_types):
                score += 0.25

    # 2. Smile Agreement (0.25)
    user_smile = bool(user_face.get("Smile", {}).get("Value", False))
    meme_smile = bool(meme_face.get("smile", {}).get("value", False))
    if user_smile == meme_smile:
        score += 0.25

    # 3. Mouth Open Agreement (0.10)
    user_mouth = bool(user_face.get("MouthOpen", {}).get("Value", False))
    meme_mouth = bool(meme_face.get("mouth_open", {}).get("value", False))
    if user_mouth == meme_mouth:
        score += 0.10

    # 4. Pose Similarity (Pitch & Yaw) (0.10)
    user_pose = user_face.get("Pose", {})
    meme_pose = meme_face.get("pose", {})
    user_pitch = user_pose.get("Pitch", 0.0)
    user_yaw = user_pose.get("Yaw", 0.0)
    meme_pitch = meme_pose.get("pitch", 0.0)
    meme_yaw = meme_pose.get("yaw", 0.0)

    pitch_diff = abs(user_pitch - meme_pitch)
    yaw_diff = abs(user_yaw - meme_yaw)

    pose_pitch_score = max(0.0, 1.0 - (pitch_diff / 45.0))
    pose_yaw_score = max(0.0, 1.0 - (yaw_diff / 45.0))
    score += 0.10 * ((pose_pitch_score + pose_yaw_score) / 2.0)

    # 5. Eyewear Agreement (0.05)
    user_glasses = bool(user_face.get("Eyeglasses", {}).get("Value", False)) or \
                   bool(user_face.get("Sunglasses", {}).get("Value", False))
    meme_glasses = bool(meme_face.get("eyeglasses", {}).get("value", False)) or \
                   bool(meme_face.get("sunglasses", {}).get("value", False))
    if user_glasses == meme_glasses:
        score += 0.05

    return round(score, 4)


def lambda_handler(event, context):
    """
    Validates uploaded selfie, invokes Rekognition DetectFaces once,
    evaluates against the in-memory meme catalogue, and returns top match.
    Enforces path containment and generic client-facing error sanitation.
    """
    request_headers = event.get("headers") or {}
    request_origin = request_headers.get("origin") or request_headers.get("Origin")
    cors_headers = get_cors_headers(request_origin)

    # Handle CORS preflight OPTIONS request
    http_method = event.get("httpMethod") or event.get("requestContext", {}).get("http", {}).get("method", "")
    if http_method == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": cors_headers,
            "body": ""
        }

    try:
        # Parse incoming request body
        body_raw = event.get("body", "{}")
        if event.get("isBase64Encoded", False):
            import base64
            body_raw = base64.b64decode(body_raw).decode("utf-8")

        body = json.loads(body_raw) if isinstance(body_raw, str) else (body_raw or {})
        object_key = body.get("objectKey")

        if not object_key:
            return {
                "statusCode": 400,
                "headers": cors_headers,
                "body": json.dumps({"error": "Missing required field 'objectKey'."})
            }

        # Security check: Enforce prefix containment to prevent arbitrary S3 inspection
        clean_key = os.path.normpath(object_key)
        if not clean_key.startswith(UPLOAD_PREFIX) or ".." in clean_key:
            logger.warning(f"Unauthorized objectKey access attempt: {object_key}")
            return {
                "statusCode": 403,
                "headers": cors_headers,
                "body": json.dumps({"error": "Access denied. Object key must reside within uploads prefix."})
            }

        logger.info(f"Analyzing facial attributes for s3://{BUCKET}/{clean_key}...")

        # 1. Detect faces in uploaded selfie using Amazon Rekognition
        try:
            rekog_response = rekognition.detect_faces(
                Image={"S3Object": {"Bucket": BUCKET, "Name": clean_key}},
                Attributes=["ALL"]
            )
        except ClientError as e:
            code = e.response.get("Error", {}).get("Code", "")
            if code == "InvalidImageFormatException":
                return {
                    "statusCode": 400,
                    "headers": cors_headers,
                    "body": json.dumps({"status": "no_face", "message": "Uploaded file is not a supported image format."})
                }
            logger.exception("Rekognition client error")
            raise

        face_details = rekog_response.get("FaceDetails", [])
        if not face_details:
            logger.info("No faces detected in the provided image.")
            return {
                "statusCode": 200,
                "headers": cors_headers,
                "body": json.dumps({
                    "status": "no_face",
                    "message": "No face detected in the image. Please look directly at the camera and ensure good lighting."
                })
            }

        # 2. Pick primary face and extract attributes
        primary_face = get_primary_face(face_details)
        emotions = primary_face.get("Emotions", [])
        primary_emotion = emotions[0]["Type"] if emotions else "UNKNOWN"
        emotion_confidence = round(emotions[0]["Confidence"], 1) if emotions else 0.0

        is_smiling = bool(primary_face.get("Smile", {}).get("Value", False))
        mouth_open = bool(primary_face.get("MouthOpen", {}).get("Value", False))
        glasses = bool(primary_face.get("Eyeglasses", {}).get("Value", False)) or \
                  bool(primary_face.get("Sunglasses", {}).get("Value", False))

        # 3. Load precomputed catalogue from warm cache
        catalogue = get_metadata()
        if not catalogue:
            logger.error("Meme metadata catalogue is empty or failed to load.")
            return {
                "statusCode": 500,
                "headers": cors_headers,
                "body": json.dumps({"error": "Meme catalogue is temporarily unavailable. Please try again later."})
            }

        # 4. Score all catalogue memes against user's face
        scored_memes = []
        for meme_key, meme_info in catalogue.items():
            faces = meme_info.get("faces", [])
            if not faces:
                continue

            best_meme_face = faces[0]
            score = calculate_match_score(primary_face, best_meme_face)
            scored_memes.append({
                "memeKey": meme_key,
                "score": score,
                "details": best_meme_face
            })

        if not scored_memes:
            return {
                "statusCode": 404,
                "headers": cors_headers,
                "body": json.dumps({"error": "No matching memes found in catalogue."})
            }

        # Sort descending by affinity score
        scored_memes.sort(key=lambda item: item["score"], reverse=True)

        # Select with entropy from top 5 candidates to prevent repetitive matches
        candidate_pool = scored_memes[:5]
        chosen_match = random.choice(candidate_pool)

        # Generate a temporary presigned GET URL for the chosen meme image
        presigned_meme_url = s3.generate_presigned_url(
            ClientMethod="get_object",
            Params={"Bucket": BUCKET, "Key": chosen_match["memeKey"]},
            ExpiresIn=MEME_URL_EXPIRATION
        )

        logger.info(f"Matched {clean_key} to {chosen_match['memeKey']} with score {chosen_match['score']}")

        return {
            "statusCode": 200,
            "headers": cors_headers,
            "body": json.dumps({
                "status": "success",
                "memeKey": chosen_match["memeKey"],
                "memeUrl": presigned_meme_url,
                "score": chosen_match["score"],
                "detectedEmotion": primary_emotion,
                "emotionConfidence": emotion_confidence,
                "userTraits": {
                    "smiling": is_smiling,
                    "mouthOpen": mouth_open,
                    "wearingGlasses": glasses
                },
                "explanation": f"Matched your {primary_emotion.lower()} expression with {chosen_match['score'] * 100:.0f}% confidence!"
            })
        }

    except Exception:
        # Diagnostic stack trace preserved in CloudWatch
        logger.exception("Internal error processing facial expression match")
        # Client receives sanitized safe response
        return {
            "statusCode": 500,
            "headers": cors_headers,
            "body": json.dumps({"error": "Failed to complete facial expression match. Please try again."})
        }
