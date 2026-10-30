import json
import logging
import os
import uuid
import boto3
from botocore.config import Config

# Logger setup
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Configuration from Environment Variables
REGION = os.getenv("AWS_REGION", "us-east-1")
BUCKET = os.getenv("BUCKET", "my-meme-database-2026")
UPLOAD_PREFIX = os.getenv("UPLOAD_PREFIX", "uploads/")
URL_EXPIRATION_SECONDS = int(os.getenv("URL_EXPIRATION_SECONDS", "300"))  # 5 minutes
MAX_CONTENT_LENGTH = int(os.getenv("MAX_CONTENT_LENGTH", "10485760"))    # 10 MB limit
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/jpg"}

# CORS origin configuration (Restrict to production CloudFront origin by default)
ALLOWED_ORIGIN = os.getenv("ALLOWED_ORIGIN", "https://d2tuc83mjm02el.cloudfront.net")

# S3 Client with standard retries
s3_config = Config(retries={"max_attempts": 3, "mode": "standard"}, signature_version="s3v4")
s3 = boto3.client("s3", region_name=REGION, config=s3_config)


def get_cors_headers(request_origin=None):
    """Returns CORS headers. Allows local development or restricted CloudFront production origin."""
    origin = ALLOWED_ORIGIN
    if request_origin:
        # Allow localhost / 127.0.0.1 for local development
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


def lambda_handler(event, context):
    """
    Generates a secure presigned S3 PUT URL for direct browser-to-S3 uploads.
    Enforces MIME type validation, pre-flight CORS, and sanitized logging.
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
        content_type = body.get("contentType", "image/jpeg").lower().strip()
        declared_size = body.get("contentLength")

        # Validate content type
        if content_type not in ALLOWED_TYPES:
            logger.warning(f"Rejected upload request with unsupported contentType: {content_type}")
            return {
                "statusCode": 400,
                "headers": cors_headers,
                "body": json.dumps({
                    "error": f"Invalid contentType '{content_type}'. Must be image/jpeg or image/png."
                })
            }

        # Validate declared file size if provided by the client
        if declared_size is not None:
            try:
                declared_size = int(declared_size)
                if declared_size > MAX_CONTENT_LENGTH:
                    logger.warning(f"Rejected upload exceeding maximum size limit: {declared_size} bytes")
                    return {
                        "statusCode": 400,
                        "headers": cors_headers,
                        "body": json.dumps({
                            "error": f"File size exceeds the 10 MB maximum limit."
                        })
                    }
            except (ValueError, TypeError):
                pass

        # Determine safe file extension
        extension = "png" if "png" in content_type else "jpg"

        # Check caller identity (Cognito authorizer claim or isolated anonymous session)
        user_sub = "guest"
        claims = event.get("requestContext", {}).get("authorizer", {}).get("jwt", {}).get("claims", {})
        if not claims:
            claims = event.get("requestContext", {}).get("authorizer", {}).get("claims", {})
        if claims and "sub" in claims:
            user_sub = claims["sub"]

        # Generate unique object key under uploads/<user_sub>/<uuid>.<ext>
        unique_file_name = f"{uuid.uuid4()}.{extension}"
        object_key = f"{UPLOAD_PREFIX}{user_sub}/{unique_file_name}"

        logger.info(f"Issuing presigned upload URL for objectKey: {object_key}")

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
            "headers": cors_headers,
            "body": json.dumps({
                "uploadUrl": upload_url,
                "objectKey": object_key,
                "bucket": BUCKET,
                "expiresIn": URL_EXPIRATION_SECONDS,
                "maxSize": MAX_CONTENT_LENGTH
            })
        }

    except Exception:
        # Retain detailed diagnostic traceback in protected CloudWatch logs
        logger.exception("Failed to generate presigned upload URL")
        # Return generic, safe client-facing message without leaking internal exceptions
        return {
            "statusCode": 500,
            "headers": cors_headers,
            "body": json.dumps({
                "error": "Failed to create upload ticket. Please try again."
            })
        }
