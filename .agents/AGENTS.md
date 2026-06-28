# Project-Scoped Rules for CVE Analysis

When analyzing a CVE or a vulnerability description, always respond using the following structured layout. Do not deviate from this structure:

---

ALWAYS start your response with these two blocks before anything else:

BLOCK 1 — SEVERITY BADGE (first line of response, no exceptions):
Based on CVSS score, output exactly one of these on the very first line:
🔴 CRITICAL  → CVSS 9.0–10.0
🟠 HIGH      → CVSS 7.0–8.9
🟡 MEDIUM    → CVSS 4.0–6.9
🟢 LOW       → CVSS 0.1–3.9

BLOCK 2 — RISK SUMMARY CARD (immediately after the badge, before the report):
┌─────────────────────────────────────────┐
│         ⚡ RISK SUMMARY                 │
├─────────────────────────────────────────┤
│ CVSS Score     : X.X / 10.0            │
│ Severity       : 🔴 Critical           │  ← use correct colored circle here too
│ Exploitable    : ✅ Yes / ❌ No         │
│ PoC Public     : ✅ Yes / ❌ No         │
│ Patch Available: ✅ Yes / ❌ No         │
│ Active in Wild : ✅ Yes / ❌ No         │
└─────────────────────────────────────────┘

Only after these two blocks, begin the full report below.

---

## 🛡️ CVE Intelligence Report

### 📋 Executive Summary
(2-3 lines — CVE enti, edi affect avutundi, risk level enti. Clear and non-technical ga undo)

---

### 🔍 CVE Details
- **CVE ID:** CVE-XXXX-XXXXX
- **CVSS Score:** X.X / 10.0
- **Severity:** 🔴 Critical / 🟠 High / 🟡 Medium / 🟢 Low   ← always include colored circle
- **CVSS Vector:** CVSS:3.1/AV:.../AC:...
- **CWE Type:** (e.g. CWE-502: Deserialization)
- **Published Date:**
- **Last Modified:**

---

### ⚙️ Technical Analysis
(Root cause, attack vector, trigger point, internal mechanism. Step-by-step how the bug works. Code-level details if available.)

---

### 🕒 Timeline
- **Discovered:**
- **Publicly Disclosed:**
- **Patch Released:**
- **Active Exploitation Observed:**

---

### 💻 Affected Products
| Software / Library | Affected Versions | Fixed Version |
|--------------------|-------------------|---------------|
|                    |                   |               │

---

### 💥 Impact
| Category        | Level                       |
|----------------|-----------------------------|
| Confidentiality| 🔴 High / 🟡 Medium / 🟢 Low |
| Integrity      | 🔴 High / 🟡 Medium / 🟢 Low |
| Availability   | 🔴 High / 🟡 Medium / 🟢 Low |

**What can attacker do?** (RCE, privilege escalation, data theft, DoS, lateral movement — specific ga explain cheyyi)

---

### 🔓 Exploitation
- **Exploit Available?** ✅ Yes / ❌ No / ⚠️ Unknown
- **PoC Public?** ✅ Yes (link) / ❌ No
- **Active Exploitation in Wild?** ✅ Yes / ❌ No / ⚠️ Unknown
- **Exploit Complexity:** 🔴 Low (easier to exploit) / 🟢 High (harder to exploit)
- **Authentication Required?** ✅ Yes / ❌ No
- **Known Threat Actors / Campaigns:** (ransomware groups, APTs if any)

---

### 🔎 Detection Methods
- **Scanner Tools:** (LunaSec, Nuclei templates, Nessus plugin ID, etc.)
- **Log Indicators / IOCs:** (strings or patterns to look for in logs)
- **SIEM / Sigma Rules:** (if publicly available)

---

### 🩹 Mitigation (Temporary Fix)
(Workarounds, config changes, env variable disables, WAF rules — official patch lekapote chesukogale steps)

---

### ✅ Patch / Official Fix
(Exact version to upgrade to, vendor patch link, upgrade command if applicable)

---

### 🔗 Related CVEs / Attack Patterns
(Related CVEs or attack chains that can be combined with this vulnerability)

---

### 📎 References
- **NVD:** https://nvd.nist.gov/vuln/detail/CVE-XXXX-XXXXX
- **MITRE:** https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-XXXX-XXXXX
- **Vendor Advisory:** (real URL)
- **PoC / Exploit:** (real URL if public)
- **GitHub Advisory:** (if available)

---

COPY VARIANTS

[FOR CLAUDE]:
Analyze this CVE with full technical depth: <paste CVE ID and one-line description>

[FOR CHATGPT]:
You are a cybersecurity analyst. Provide a detailed CVE breakdown for: <paste CVE ID and one-line description>. Include CVSS score, technical root cause, affected versions, exploitation status, mitigation, and references.

[FOR PLAIN TEXT]:
Output the full report again as clean plain text — no markdown, no symbols, no bold — just readable paragraphs under labeled headings.

---

RULES:
- ALWAYS start with the severity badge (🔴/🟠/🟡/🟢) on line 1
- ALWAYS show the Risk Summary Card before the report
- ALWAYS use the correct colored circle (🔴🟠🟡🟢) at the Severity field inside CVE Details
- ALWAYS use ✅ / ❌ / ⚠️ for boolean fields throughout the report
- If any section data is unavailable, write "Not Available / Undisclosed" — never skip or merge sections
- Always cite real URLs. Be factual, technical, and precise.
