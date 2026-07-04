```python
"""
VulnGuard AI - Google ADK Agent
==============================
An AI-powered cybersecurity assistant that provides CVE information,
severity analysis, and remediation recommendations.

Usage:
    pip install google-adk
    python vulnguard_agent.py
"""

import asyncio
import httpx
from google.adk.agents import Agent
from google.adk.tools import FunctionTool
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types

# ── Config ──────────────────────────────────────────────
VULNGUARD_API_URL = "https://your-api-url.com"


# ── Tool 1: Fetch CVE Details ───────────────────────────
async def get_cve_details(cve_id: str) -> dict:
    """
    Fetch detailed information about a CVE.
    """
    async with httpx.AsyncClient(timeout=15.0) as client:
        try:
            response = await client.get(
                f"{VULNGUARD_API_URL}/cve/{cve_id}"
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            return {"error": f"Unable to fetch CVE details: {str(e)}"}


# ── Tool 2: Analyze Severity ────────────────────────────
async def analyze_severity(cve_id: str) -> dict:
    """
    Analyze the severity and risk level of a CVE.
    """
    async with httpx.AsyncClient(timeout=15.0) as client:
        try:
            response = await client.get(
                f"{VULNGUARD_API_URL}/analyze/{cve_id}"
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            return {
                "cve_id": cve_id,
                "severity": "Unknown",
                "risk": "Analysis unavailable",
                "error": str(e)
            }


# ── Tool 3: Generate Recommendations ────────────────────
async def get_remediation(cve_id: str) -> dict:
    """
    Provide remediation and mitigation recommendations.
    """
    async with httpx.AsyncClient(timeout=15.0) as client:
        try:
            response = await client.get(
                f"{VULNGUARD_API_URL}/remediation/{cve_id}"
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            return {
                "cve_id": cve_id,
                "recommendation": "Apply latest patches and monitor vendor advisories.",
                "error": str(e)
            }


# ── Build the Agent ─────────────────────────────────────
def create_vulnguard_agent() -> Agent:
    tools = [
        FunctionTool(get_cve_details),
        FunctionTool(analyze_severity),
        FunctionTool(get_remediation),
    ]

    agent = Agent(
        name="vulnguard_agent",
        model="gemini-2.0-flash",
        description=(
            "VulnGuard AI is an intelligent cybersecurity assistant that "
            "helps security analysts understand vulnerabilities, assess risks, "
            "and receive remediation guidance."
        ),
        instruction="""
You are VulnGuard AI, an expert cybersecurity assistant.

Your responsibilities:
- Retrieve CVE information.
- Analyze vulnerability severity and impact.
- Provide remediation recommendations.
- Combine multiple tools when necessary.
- Explain vulnerabilities in simple and professional language.
- If a tool fails, provide general cybersecurity guidance.

Rules:
- When a user provides a CVE ID, call get_cve_details.
- When the user asks about severity or impact, call analyze_severity.
- When the user asks how to fix a vulnerability, call get_remediation.
- Be concise, accurate, and professional.
        """,
        tools=tools,
    )

    return agent


# ── CLI Demo ────────────────────────────────────────────
async def run_agent_cli():
    session_service = InMemorySessionService()

    agent = create_vulnguard_agent()

    runner = Runner(
        agent=agent,
        app_name="vulnguard",
        session_service=session_service
    )

    session = await session_service.create_session(
        app_name="vulnguard",
        user_id="security_analyst"
    )

    print("=" * 55)
    print("🛡️ VulnGuard AI - ADK Demo")
    print("=" * 55)
    print("Enter a CVE ID or ask a cybersecurity question.")
    print("Type 'quit' to exit.\n")

    while True:
        user_input = input("You: ").strip()

        if not user_input or user_input.lower() in ("quit", "exit"):
            print("Goodbye!")
            break

        message = types.Content(
            role="user",
            parts=[types.Part(text=user_input)]
        )

        print("VulnGuard: ", end="", flush=True)

        async for event in runner.run_async(
            user_id="security_analyst",
            session_id=session.id,
            new_message=message
        ):
            if event.is_final_response() and event.content:
                for part in event.content.parts:
                    if hasattr(part, "text") and part.text:
                        print(part.text)

        print()


if __name__ == "__main__":
    asyncio.run(run_agent_cli())
```
