# CommDesk Cashfree Production Whitelisting & Desktop Payment Architecture Guide

# Introduction

This document defines the complete payment security and whitelisting strategy for CommDesk.

It explains:

* Why Cashfree requires whitelisting
* Why localhost is problematic
* How production desktop applications should handle payments
* Security implications
* Tauri-specific considerations
* Recommended architecture
* Scaling considerations
* Future gateway support

This document serves as the official payment integration reference for CommDesk.

---

# What Is Whitelisting?

Whitelisting is a security mechanism used by payment providers to ensure that payment requests originate only from trusted applications.

When a payment checkout is opened, Cashfree validates:

* Origin
* Domain
* Application Identity
* Merchant Configuration

Before allowing users to proceed.

Example:

Allowed:

https://app.commdesk.in

Rejected:

http://localhost:1420

Unknown domains

Unregistered applications

---

# Why Cashfree Uses Whitelisting

Payment providers process real money.

Without whitelisting, attackers could:

* Clone merchant websites
* Spoof payment pages
* Create fake checkout flows
* Redirect users to malicious applications
* Harvest customer payment information

Whitelisting prevents these attacks.

---

# Security Threats Without Whitelisting

## Fake Frontend Attack

Attacker creates:

https://commdesk-fake.xyz

Copies CommDesk UI.

Attempts:

```txt
Create Cashfree Checkout
Collect Payments
Pretend To Be CommDesk
```

Without origin validation:

Users could unknowingly pay attackers.

---

## Session Hijacking

Attacker steals:

```json
{
  "paymentSessionId": "session_xxx"
}
```

Attempts to launch checkout from another application.

Whitelisting prevents unauthorized origins.

---

## Desktop Application Spoofing

Attacker creates:

```txt
CommDesk Desktop.exe
```

Fake application.

Attempts:

```txt
Use CommDesk Merchant Credentials
Collect User Payments
```

App identity validation reduces this risk.

---

# Why Localhost Is Usually Rejected

Localhost:

```txt
http://localhost:1420
http://localhost:3000
http://127.0.0.1
```

Cannot be uniquely owned.

Every computer on Earth has localhost.

Cashfree cannot verify:

* Ownership
* Authenticity
* Merchant Control

Because of this:

Production systems generally reject localhost.

---

# Sandbox vs Production

## Sandbox

Purpose:

Testing

Allowed:

* Localhost
* Temporary Domains
* Development Machines

Typical Usage:

```txt
localhost:1420
localhost:5173
```

---

## Production

Purpose:

Real Transactions

Requirements:

* Verified Ownership
* Secure Domains
* Merchant Approval

Expected:

```txt
https://app.commdesk.in
```

Not:

```txt
http://localhost:1420
```

---

# CommDesk Architecture

## Frontend

Technology:

* React
* TypeScript
* Tauri

Responsibilities:

* Create Payment Intent
* Open Checkout
* Display Status

Never:

* Credit Wallet
* Mark Success
* Process Refunds

---

## Backend

Technology:

* Node.js
* Express
* PostgreSQL
* Redis
* RabbitMQ

Responsibilities:

* Create Orders
* Verify Payments
* Process Webhooks
* Generate Invoices
* Credit Wallets

Backend is the source of truth.

---

# Tauri Desktop Application Challenge

Tauri applications run locally.

Example:

```txt
http://localhost:1420
```

during development.

Production users may run:

```txt
CommDesk.exe
```

without a public website.

This creates challenges for payment providers because:

```txt
No public domain
No browser origin
No ownership verification
```

---

# Possible Production Strategies

## Strategy A

### Domain Whitelisting

Whitelist:

```txt
https://app.commdesk.in
```

Benefits:

* Simple
* Official
* Easily Approved

Recommended.

---

## Strategy B

### Bundle Identifier Approval

Tauri Identifier:

```txt
com.commdesk.desktop
```

Request approval from Cashfree.

Benefits:

Native desktop experience.

Limitations:

Requires manual approval.

---

## Strategy C

### Hosted Payment Window

Flow:

```txt
Desktop App
↓
Create Order
↓
Open Payment Window
↓
Cashfree Hosted Checkout
↓
Webhook
↓
Backend Verification
```

Benefits:

* Reliable
* Scalable
* Cross-platform

Recommended fallback.

---

# Why Whitelisting Matters For CommDesk

Without proper whitelisting:

Users experience:

```txt
Payment Session Invalid
Origin Not Approved
Checkout Refused
```

These issues become production outages.

Proper whitelisting prevents:

* Checkout failures
* Fraud
* Unauthorized integrations
* Merchant account risks

---

# CommDesk Production Requirements

## Domains

Frontend

https://app.commdesk.in

Backend

https://api.commdesk.in

Website

https://commdesk.in

---

## Desktop Identity

Bundle Identifier:

```txt
com.commdesk.desktop
```

Platforms:

* Windows
* Linux
* macOS

---

# Whitelisting Request Template

Merchant Name:

CommDesk

Application Type:

Desktop Application

Framework:

Tauri

Website:

https://commdesk.in

Frontend:

https://app.commdesk.in

Backend:

https://api.commdesk.in

Bundle Identifier:

com.commdesk.desktop

Platforms:

Windows
Linux
macOS

Requirement:

Need Cashfree Checkout support for CommDesk Desktop Application.

---

# Recommended Payment Flow

User
↓
Create Intent
↓
Backend Creates Order
↓
Store Payment(PENDING)
↓
Return Session
↓
Open Checkout
↓
User Pays
↓
Cashfree Webhook
↓
Verify Signature
↓
Store Audit Log
↓
Publish RabbitMQ Event
↓
Payment Success Consumer
↓
Credit Wallet
↓
Create Ledger Entry
↓
Generate Invoice
↓
Send Notification
↓
Update Dashboard

---

# Why Frontend Must Never Be Trusted

Bad:

```txt
Frontend
↓
Payment Success
↓
Credit Wallet
```

User can manipulate frontend.

Result:

Financial fraud.

---

Good:

```txt
Frontend
↓
Payment Success
↓
Wait For Webhook

Webhook
↓
Verify Signature
↓
Credit Wallet
```

Only verified provider events modify money.

---

# Multi-Gateway Future

The same architecture supports:

* Cashfree
* Razorpay
* Stripe
* PayPal
* PhonePe
* Juspay

without redesign.

---

# Enterprise Scaling

Supports:

* Wallet Top-ups
* Membership Fees
* Event Registrations
* Sponsorship Contributions
* Subscription Billing
* GST Invoicing
* Multi-Tenant Communities

For:

* Colleges
* Universities
* Clubs
* NGOs
* Enterprises

---

# Compliance

Maintain:

* Audit Logs
* Payment Logs
* Refund Logs
* Invoice Logs
* Webhook Logs

Retention:

Minimum 7 Years

Never Delete Financial Records.

---

# Final Recommendation For CommDesk

Use:

Primary:

https://app.commdesk.in

Secondary:

com.commdesk.desktop

Fallback:

Hosted Checkout Window

Never rely on localhost for production.

Treat localhost only as a development environment.

Production source of truth:

Verified Cashfree Webhook + Backend Verification.

Never trust browser redirects.
Never trust frontend callbacks.
Never trust success pages.

Trust only verified payment provider events.
