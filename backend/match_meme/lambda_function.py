import json
import os
import random
import boto3
from botocore.config import Config
from botocore.exceptions import ClientError

# Configuration
REGION = os.getenv("AWS_REGION", "us-east-1")
BUCKET = os.getenv("BUCKET", "my-meme-database-2026")
METADATA_KEY = os.getenv("METADATA_KEY", "metadata/memes_metadata.json")
MEME_URL_EXPIRATION = int(os.getenv("MEME_URL_EXPIRATION", "900"))  # 15 minutes

s3_config = Config(retries={"max_attempts": 3, "mode": "standard"}, signature_version="s3v4")
s3 = boto3.client("s3", region_name=REGION, config=s3_config)
rekognition = boto3.client("rekognition", region_name=REGION, config=s3_config)

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

# In-memory cache for warm Lambda execution environments (avoids re-fetching 800+ memes from S3)
CACHED_METADATA = None


def get_metadata():
    """Fetches and caches the precomputed meme metadata from S3."""
    global CACHED_METADATA
    if CACHED_METADATA is not None:
        return CACHED_METADATA

    try:
        print(f"Loading metadata from s3://{BUCKET}/{METADATA_KEY}...")
        response = s3.get_object(Bucket=BUCKET, Key=METADATA_KEY)
        payload = response["Body"].read().decode("utf-8")
        CACHED_METADATA = json.loads(payload)
        print(f"Successfully loaded {len(CACHED_METADATA)} meme metadata records into memory.")
        return CACHED_METADATA
    except Exception as exc:
        print(f"Error loading metadata from S3: {exc}")
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
    yaw_diff = abs(user_pose.get("Yaw", 0.0) - meme_pose.get("Yaw", 0.0))
    pitch_diff = abs(user_pose.get("Pitch", 0.0) - meme_pose.get("Pitch", 0.0))
    # Normalize differences up to 90 degrees
    pose_penalty = min(1.0, (yaw_diff + pitch_diff) / 90.0)
    score += 0.10 * (1.0 - pose_penalty)

    # 5. Eyeglasses Agreement (0.05)
    user_glasses = bool(user_face.get("Eyeglasses", {}).get("Value", False)) or bool(user_face.get("Sunglasses", {}).get("Value", False))
    meme_glasses = bool(meme_face.get("eyeglasses", {}).get("value", False)) or bool(meme_face.get("sunglasses", {}).get("value", False))
    if user_glasses == meme_glasses:
        score += 0.05

    return round(score, 3)


def lambda_handler(event, context):
    """Analyzes a student selfie and returns the best matching meme from the catalog."""
    # Handle CORS preflight OPTIONS request
    http_method = event.get("httpMethod") or event.get("requestContext", {}).get("http", {}).get("method", "")
    if http_method == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": ""
        }

    try:
        # Parse incoming request body
        body_raw = event.get("body", "{}")
        if event.get("isBase64Encoded", False):
            import base64
            body_raw = base64.b64decode(body_raw).decode("utf-8")

        body = json.loads(body_raw) if isinstance(body_raw, str) else (body_raw or {})
        object_key = body.get("objectKey", "").strip()

        if not object_key:
            return {
                "statusCode": 400,
                "headers": CORS_HEADERS,
                "body": json.dumps({"error": "Missing 'objectKey' in request body."})
            }

        # Verify object exists in S3
        try:
            head = s3.head_object(Bucket=BUCKET, Key=object_key)
            if head["ContentLength"] > 10 * 1024 * 1024:
                return {
                    "statusCode": 400,
                    "headers": CORS_HEADERS,
                    "body": json.dumps({"error": "Uploaded image exceeds 10MB limit."})
                }
        except ClientError as exc:
            return {
                "statusCode": 404,
                "headers": CORS_HEADERS,
                "body": json.dumps({"error": f"Image not found in S3: {object_key}"})
            }

        # Analyze uploaded selfie with Rekognition DetectFaces
        rekog_response = rekognition.detect_faces(
            Image={"S3Object": {"Bucket": BUCKET, "Name": object_key}},
            Attributes=["ALL"]
        )

        detected_faces = rekog_response.get("FaceDetails", [])
        if not detected_faces:
            return {
                "statusCode": 200,
                "headers": CORS_HEADERS,
                "body": json.dumps({
                    "status": "no_face",
                    "message": "No face detected in your photo. Please take a clearer selfie with good lighting!"
                })
            }

        # Select primary face
        user_face = get_primary_face(detected_faces)
        user_emotions = sorted(
            user_face.get("Emotions", []),
            key=lambda x: x.get("Confidence", 0.0),
            reverse=True
        )
        primary_emotion = user_emotions[0]["Type"] if user_emotions else "UNKNOWN"
        emotion_confidence = round(user_emotions[0]["Confidence"], 1) if user_emotions else 0.0

        is_smiling = bool(user_face.get("Smile", {}).get("Value", False))
        mouth_open = bool(user_face.get("MouthOpen", {}).get("Value", False))
        glasses = bool(user_face.get("Eyeglasses", {}).get("Value", False)) or bool(user_face.get("Sunglasses", {}).get("Value", False))

        # Retrieve catalog metadata
        metadata = get_metadata()
        if not metadata:
            return {
                "statusCode": 500,
                "headers": CORS_HEADERS,
                "body": json.dumps({"error": "Meme catalogue metadata is currently unavailable."})
            }

        # Score all eligible memes that have detected faces
        scored_memes = []
        for meme_key, meme_data in metadata.items():
            if meme_data.get("status") != "success" or not meme_data.get("faces"):
                continue

            # Pick the primary face of the meme
            meme_faces = meme_data["faces"]
            meme_primary_face = meme_faces[0]

            score = calculate_match_score(user_face, meme_primary_face)
            scored_memes.append({
                "memeKey": meme_key,
                "score": score,
                "memeEmotion": meme_primary_face.get("dominant_emotion"),
            })

        if not scored_memes:
            return {
                "statusCode": 500,
                "headers": CORS_HEADERS,
                "body": json.dumps({"error": "No indexed face memes found in catalogue."})
            }

        # Sort descending by score
        scored_memes.sort(key=lambda item: item["score"], reverse=True)

        # Select randomly from top 5 candidates for variety
        candidate_pool = scored_memes[:5]
        chosen_match = random.choice(candidate_pool)

        # Generate a temporary presigned GET URL for the chosen meme image
        presigned_meme_url = s3.generate_presigned_url(
            ClientMethod="get_object",
            Params={"Bucket": BUCKET, "Key": chosen_match["memeKey"]},
            ExpiresIn=MEME_URL_EXPIRATION
        )

        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
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

    except Exception as exc:
        print(f"Error matching meme: {exc}")
        return {
            "statusCode": 500,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": "Failed to match meme", "details": str(exc)})
        }
