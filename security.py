```python
"""
VulnGuard AI Security Features
==============================
This module implements security best practices for VulnGuard AI.

Security features included:
1. Rate limiting
2. Input validation and sanitisation
3. CVE ID validation
4. API key masking
5. Security headers middleware
6. Trusted origins (CORS)
"""

from __future__ import annotations

import re
import time
import logging
from collections import defaultdict
from fastapi import Request, HTTPException

logger = logging.getLogger(__name__)


# ── 1. Rate Limiting ───────────────────────────────────
class RateLimiter:
    """
    Prevents API abuse and excessive requests.
    """

    def __init__(self):
        self._requests = defaultdict(list)

    def _cleanup(self, timestamps, window=60):
        now = time.time()
        return [t for t in timestamps if now - t < window]

    def check_limit(self, identifier: str, limit: int = 20):
        self._requests[identifier] = self._cleanup(
            self._requests[identifier]
        )

        if len(self._requests[identifier]) >= limit:
            raise HTTPException(
                status_code=429,
                detail={
                    "error": "rate_limit_exceeded",
                    "message": "Too many requests. Please try again later.",
                    "retry_after_seconds": 60,
                },
            )

        self._requests[identifier].append(time.time())


rate_limiter = RateLimiter()


# ── 2. Input Sanitisation ──────────────────────────────
MAX_MESSAGE_LENGTH = 2000

_INJECTION_PATTERNS = [
    r"ignore previous instructions",
    r"system prompt",
    r"jailbreak",
    r"act as",
    r"forget everything",
]

_COMPILED_PATTERNS = [
    re.compile(p, re.IGNORECASE)
    for p in _INJECTION_PATTERNS
]


def sanitise_input(text: str) -> str:
    if not text or not text.strip():
        raise HTTPException(
            status_code=400,
            detail="Input cannot be empty."
        )

    text = text.strip()

    if len(text) > MAX_MESSAGE_LENGTH:
        text = text[:MAX_MESSAGE_LENGTH]

    for pattern in _COMPILED_PATTERNS:
        if pattern.search(text):
            raise HTTPException(
                status_code=400,
                detail={
                    "error": "invalid_input",
                    "message": "Potential prompt injection detected."
                }
            )

    return text


# ── 3. CVE Validation ──────────────────────────────────
CVE_PATTERN = re.compile(
    r"^CVE-\d{4}-\d{4,}$",
    re.IGNORECASE
)


def validate_cve_id(cve_id: str):
    """
    Validate CVE format.
    Example:
        CVE-2021-44228
    """
    if not CVE_PATTERN.match(cve_id):
        raise HTTPException(
            status_code=400,
            detail={
                "error": "invalid_cve",
                "message": "Invalid CVE ID format."
            }
        )

    return cve_id.upper()


# ── 4. API Key Masking ─────────────────────────────────
def mask_api_key(key: str | None) -> str:
    if not key or len(key) < 8:
        return ""

    return key[:3] + "*" * (len(key) - 6) + key[-3:]


# ── 5. Security Headers Middleware ─────────────────────
async def add_security_headers(
    request: Request,
    call_next
):
    response = await call_next(request)

    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = (
        "strict-origin-when-cross-origin"
    )
    response.headers["X-XSS-Protection"] = (
        "1; mode=block"
    )
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'"
    )

    return response


# ── 6. Trusted Origins (CORS) ──────────────────────────
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://vulnguard-ai.vercel.app",
    "https://vulnguard-ai.up.railway.app",
]
```
