# Security Policy

## 🔐 Supported Versions

The following versions of CommDesk are currently supported with security updates:

| Version | Supported |
| ------- | --------- |
| 0.1.x   | ✅ Yes    |
| < 0.1   | ❌ No     |

We recommend always using the latest release for security fixes and improvements.

---

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly.

### 📩 How to Report

- Email: **security@nexgenstudio.dev**
- Or open a **private security advisory** via GitHub:
  - Go to the repository
  - Click **Security → Advisories → Report a vulnerability**

### ❗ Please DO NOT:

- Open public issues for security vulnerabilities
- Share exploits publicly before disclosure

---

## 🛡️ What to Include in a Report

To help us respond quickly, include:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Screenshots or proof-of-concept (if applicable)
- Suggested fix (optional but appreciated)

---

## ⏱️ Response Timeline

| Stage               | Timeline            |
| ------------------- | ------------------- |
| Acknowledgement     | Within 48 hours     |
| Initial assessment  | Within 3–5 days     |
| Fix & patch release | Depends on severity |

We aim to resolve critical issues as quickly as possible.

---

## 🔒 Security Practices

CommDesk follows these security practices:

- Role-based access control (RBAC)
- Strict frontend-backend boundary enforcement
- Input validation and sanitization
- Dependency auditing (via `pnpm audit`)
- Signed desktop updates using Tauri updater
- Secure key handling (`~/.tauri/commdesk.key`)

---

## 📦 Desktop App Security

- All production releases should be **signed**
- Auto-updates must use **verified signatures**
- Do not distribute unsigned binaries in production

---

## 🧪 Responsible Disclosure

We appreciate responsible disclosure and will:

- Credit researchers (if desired)
- Work collaboratively on fixes
- Keep communication transparent

---

## ⚠️ Disclaimer

This project is under active development. While we strive for strong security practices, users should:

- Avoid using in high-risk production environments without audit
- Regularly update to latest versions

---

## ❤️ Acknowledgements

We thank the open-source community and contributors for helping improve the security of CommDesk.

---
