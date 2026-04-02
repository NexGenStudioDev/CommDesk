# CommDesk Check-In and Badge System

## Overview

This document defines the complete check-in and badge management system for CommDesk.

It is designed for:

- hackathons
- workshops
- bootcamps
- meetups
- competitions

The system covers:

- registration-to-entry validation
- online and on-site check-in workflows
- badge generation and printing
- desk/gate operations
- anti-fraud controls
- audit-safe operational history

Related docs:

- [CommDesk Overall System Master Guide](./CommDesk-Overall-System-Summary.md)
- [CommDesk Event System](./CommDesk-Event-System.md)
- [CommDesk RSVP System](./CommDesk-RSVP-System.md)
- [CommDesk Member System](./CommDesk-Member-System.md)
- [CommDesk Website Public Platform System](./CommDesk-Website-System.md)
- [CommDesk Frontend Boundary System (Desktop + Website)](./CommDesk-Frontend-Boundary-System.md)
- [CommDesk Integration and Webhook System](./CommDesk-Integration-and-Webhook-System.md)

---

## 1. Goals

The Check-In and Badge system must:

- allow only eligible attendees to check in
- support fast queue handling at venue entry
- support role-based badges (participant, mentor, judge, speaker, sponsor, staff)
- support offline-first check-in during weak network conditions
- prevent duplicate or fraudulent check-ins
- provide real-time operational visibility and export
- produce reliable attendance analytics

---

## 2. Scope

## 2.1 In Scope

- event entry check-in
- check-in desk operations
- gate-level scan validation
- badge template setup and printing
- badge issue, reprint, and revoke workflow
- QR/token verification
- no-show tracking
- attendance exports and audit logs

## 2.2 Out of Scope

- full ticketing payment engine (covered by future ticketing doc)
- hardware driver implementation details for every printer/scanner model

---

## 3. Frontend Ownership (No Duplication)

Aligned with frontend boundary rules.

## 3.1 Desktop Ownership

Desktop app should own:

- check-in configuration and gate setup
- check-in desk UI
- badge template management
- badge print queue and reprint controls
- exception and override operations
- attendance operational dashboard

## 3.2 Website Ownership

Website should own:

- attendee self check-in status visibility
- personal badge preview/download (when enabled)
- QR pass display for entry

## 3.3 Shared Rule

- no duplicate operational check-in admin panel on website
- no duplicate attendee self check-in flow on desktop

---

## 4. Roles and Permissions

| Role                         | Actions                                  |
| ---------------------------- | ---------------------------------------- |
| Owner/Admin/Organizer        | full check-in and badge control          |
| Volunteer (Desk Staff)       | scan, check-in, issue badge (restricted) |
| Gate Staff                   | validate entry scan only                 |
| Participant                  | view own pass/check-in status            |
| Mentor/Judge/Speaker/Sponsor | view own pass/check-in status            |

Permission controls:

- only privileged roles can perform manual override check-in
- reprint and revoke require reason capture
- every write action must be audited

---

## 5. Check-In Eligibility Rules

A registration is check-in eligible only when:

- registration status is `Approved`
- event is check-in active (`checkInWindowOpen = true`)
- attendee is not already checked in
- attendee is not blocked or revoked

RSVP lifecycle alignment:

```text
Pending -> Approved -> CheckedIn
Pending -> Rejected
Pending -> Waitlisted -> Approved -> CheckedIn
Approved -> Cancelled
```

Hard checks:

- rejected users cannot check in
- cancelled users cannot check in
- waitlisted users cannot check in unless promoted

---

## 6. Check-In Modes

## 6.1 QR Scan Check-In (Primary)

Flow:

```text
Scan attendee QR
-> validate token and event context
-> verify eligibility
-> mark checked-in
-> issue badge state update
```

## 6.2 Search-and-Verify Check-In (Fallback)

Used when QR unavailable.

Lookup keys:

- registration number
- email
- mobile

Flow includes identity confirmation before check-in write.

## 6.3 Offline Check-In

When network is unavailable:

- scanner app/desk client stores signed local check-in entries
- local duplicate protection enabled
- sync job reconciles to server when online
- conflicts are resolved with deterministic policy

---

## 7. Badge System

## 7.1 Badge Types

Default types:

- Participant
- Mentor
- Judge
- Speaker
- Volunteer
- Sponsor
- Partner
- Organizer
- Staff
- VIP

## 7.2 Badge Data Fields

Minimum fields on badge:

- full name
- role label
- event name
- badge ID
- QR code
- optional company/college

## 7.3 Badge Lifecycle

```text
TemplateCreated
-> Generated
-> Printed
-> Issued
-> Reprinted (optional)
-> Revoked (optional)
```

## 7.4 Reprint Policy

Reprint allowed only for:

- damaged badge
- lost badge
- print failure

Reprint requires:

- operator role check
- reason
- audit entry

## 7.5 Color and Visual Encoding

Role-based visual encoding recommended:

- Participant: blue
- Mentor: green
- Judge: red
- Speaker: purple
- Staff/Organizer: black
- Sponsor/Partner: gold

(Exact palette configurable per community brand.)

---

## 8. QR Token and Security

## 8.1 Token Properties

Each badge/pass token should include:

- unique token ID
- eventId
- registrationId
- expiry timestamp
- signature hash

## 8.2 Token Rules

- short-lived or revocable tokens
- token signed server-side
- replay attempts flagged
- duplicate scan in short interval rejected

## 8.3 Security Controls

- HMAC or JWT signed QR payload
- clock skew handling
- brute-force scan attempt throttling
- suspicious scan pattern detection

---

## 9. On-Site Operations Model

## 9.1 Desk and Gate Structure

Recommended setup:

- Desk A: pre-verified QR scan
- Desk B: manual verification and issue handling
- Gate scanner: final entry validation

## 9.2 Queue Management

Operational features:

- queue length counters
- average check-in time
- desk utilization metrics
- overflow routing

## 9.3 Exception Cases

Must support:

- name mismatch handling
- duplicate registration detection
- special access approvals
- emergency manual allow with reason

---

## 10. API Contract

## 10.1 Check-In Configuration (Desktop)

```text
GET   /api/v1/events/:eventId/check-in/config
PATCH /api/v1/events/:eventId/check-in/config
POST  /api/v1/events/:eventId/check-in/open
POST  /api/v1/events/:eventId/check-in/close
```

## 10.2 Check-In Operations

```text
POST /api/v1/events/:eventId/check-in/scan
POST /api/v1/events/:eventId/check-in/manual
POST /api/v1/events/:eventId/check-in/:registrationId/revoke
GET  /api/v1/events/:eventId/check-in/records
GET  /api/v1/events/:eventId/check-in/summary
```

## 10.3 Badge Operations

```text
POST   /api/v1/events/:eventId/badges/templates
GET    /api/v1/events/:eventId/badges/templates
PATCH  /api/v1/events/:eventId/badges/templates/:templateId
POST   /api/v1/events/:eventId/badges/generate
POST   /api/v1/events/:eventId/badges/print
POST   /api/v1/events/:eventId/badges/:badgeId/reprint
POST   /api/v1/events/:eventId/badges/:badgeId/revoke
GET    /api/v1/events/:eventId/badges/print-jobs
```

## 10.4 Exports and Reports

```text
GET /api/v1/events/:eventId/check-in/export?format=csv
GET /api/v1/events/:eventId/badges/export?format=csv
```

---

## 11. Data Model Outline

Recommended collections:

- `CheckInConfig`
- `CheckInRecord`
- `CheckInDevice`
- `BadgeTemplate`
- `Badge`
- `BadgePrintJob`
- `BadgeIssueAudit`

## 11.1 CheckInConfig

```text
communityId
eventId
checkInWindowStart
checkInWindowEnd
allowManualCheckIn
allowReEntry
maxReEntryCount
offlineModeEnabled
qrValidationMode
createdBy
updatedBy
```

## 11.2 CheckInRecord

```text
checkInId
communityId
eventId
registrationId
userId
status (CheckedIn | Revoked | ReEntry)
method (QR | Manual | OfflineSync)
gateId
deskId
operatorUserId
deviceId
checkedInAt
notes
```

Required indexes:

- unique `(eventId, registrationId, status=CheckedIn)` for strict single check-in mode
- index `(eventId, checkedInAt)`
- index `(eventId, gateId, checkedInAt)`

## 11.3 Badge

```text
badgeId
communityId
eventId
registrationId
userId
badgeType
templateId
printStatus (Queued | Printed | Failed)
issueStatus (Issued | Revoked)
qrTokenId
printedAt
issuedAt
revokedAt
```

---

## 12. Validation Rules

Backend must enforce:

- event exists and belongs to same community scope
- registration exists and status is `Approved`
- check-in window open for normal flow
- duplicate check-in blocked unless `allowReEntry` enabled
- manual check-in requires privileged role
- reprint/revoke requires reason

---

## 13. Fraud and Abuse Controls

Required controls:

- duplicate scan detection
- suspicious rapid-scan velocity checks
- forged token signature rejection
- blocked/revoked token deny list
- manual override monitoring and audit alerts

Recommended controls:

- gate-level anomaly dashboards
- risk flags for repeated manual overrides by same operator
- optional selfie/ID verification step for high-risk events

---

## 14. Notifications

Trigger events:

- check-in successful
- badge ready/issued
- badge reprinted
- check-in revoked

Channels:

- in-app
- email
- SMS/WhatsApp (optional)

---

## 15. Analytics and KPIs

Track real-time and post-event metrics:

- approved-to-checked-in conversion rate
- peak check-in throughput per 5 minutes
- average check-in time per attendee
- desk and gate utilization
- manual check-in ratio
- reprint rate and causes
- no-show ratio

These metrics should feed trust scoring and event quality models.

---

## 16. Integration and Webhooks

Emit these events for integration layer:

- `check_in_window_opened`
- `check_in_successful`
- `check_in_revoked`
- `badge_generated`
- `badge_printed`
- `badge_issued`
- `badge_reprinted`
- `badge_revoked`

Used by:

- external attendance dashboards
- sponsor activation systems
- notification engines
- compliance archives

---

## 17. Security and Compliance

Required:

- role-based access checks on all check-in writes
- signed QR/token payloads
- encrypted sensitive attendee fields at rest
- immutable audit logs for check-in and badge state changes
- retention and deletion policy for attendance data

Compliance support:

- export with redaction rules
- audit trail for every manual override
- purpose-limited access to personal data

---

## 18. Rollout Plan

Phase 1:

- check-in config
- QR scan check-in
- basic badge template and print

Phase 2:

- offline check-in sync
- desk/gate analytics
- reprint/revoke workflows

Phase 3:

- advanced anti-fraud detection
- multi-gate optimization
- integration automations and partner connectors

---

## 19. Final Definition

One-line definition:

```text
CommDesk Check-In and Badge System is the operational entry and identity layer that turns approved registrations into secure, fast, and auditable on-ground attendance.
```
