import json
import os
import uuid
import boto3
from botocore.config import Config

# Configuration
REGION = os.getenv("AWS_REGION", "us-east-1")
BUCKET = os.getenv("BUCKET", "my-meme-database-2026")
UPLOAD_PREFIX = os.getenv("UPLOAD_PREFIX", "uploads/")
URL_EXPIRATION_SECONDS = int(os.getenv("URL_EXPIRATION_SECONDS", "300"))  # 5 minutes
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/jpg"}

# S3 Client with standard retries
s3_config = Config(retries={"max_attempts": 3, "mode": "standard"}, signature_version="s3v4")
s3 = boto3.client("s3", region_name=REGION, config=s3_config)

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
}


def lambda_handler(event, context):
    """Generates a secure presigned S3 PUT URL for direct browser-to-S3 uploads."""
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
        content_type = body.get("contentType", "image/jpeg").lower().strip()

        # Validate content type
        if content_type not in ALLOWED_TYPES:
            return {
                "statusCode": 400,
                "headers": CORS_HEADERS,
                "body": json.dumps({
                    "error": f"Invalid contentType '{content_type}'. Must be image/jpeg or image/png."
                })
            }

        # Determine file extension
        extension = "png" if "png" in content_type else "jpg"

        # Check if caller is authenticated via Cognito or anonymous guest
        user_sub = "guest"
        claims = event.get("requestContext", {}).get("authorizer", {}).get("jwt", {}).get("claims", {})
        if not claims:
            claims = event.get("requestContext", {}).get("authorizer", {}).get("claims", {})
        if claims and "sub" in claims:
            user_sub = claims["sub"]

        # Generate unique object key: uploads/<user_sub>/<uuid>.<ext>
        unique_file_name = f"{uuid.uuid4()}.{extension}"
        object_key = f"{UPLOAD_PREFIX}{user_sub}/{unique_file_name}"

        # Generate S3 Presigned PUT URL
        upload_url = s3.generate_presigned_url(
            ClientMethod="put_object",
            Params={
                "Bucket": BUCKET,
                "Key": object_key,
                "ContentType": content_type,
            },
            ExpiresIn=URL_EXPIRATION_SECONDS,
        )

        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps({
                "uploadUrl": upload_url,
                "objectKey": object_key,
                "bucket": BUCKET,
                "expiresIn": URL_EXPIRATION_SECONDS
            })
        }

    except Exception as exc:
        print(f"Error creating presigned upload URL: {exc}")
        return {
            "statusCode": 500,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": "Failed to create upload URL", "details": str(exc)})
        }
