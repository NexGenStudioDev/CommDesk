# CommDesk Overall System Summary

## Overview

This is a short combined reference of all current CommDesk system documents.

It explains:

- what each system owns
- how systems connect
- the end-to-end product flow
- shared contracts and governance

Related source docs:

- [Community Signup System](./Community-Signup-System.md)
- [CommDesk Member Creation & Onboarding System](./CommDesk-Member-System.md)
- [CommDesk Event System](./CommDesk-Event-System.md)
- [CommDesk RSVP System](./CommDesk-RSVP-System.md)
- [CommDesk Participant Platform System](./CommDesk-Participant-Platform-System.md)
- [CommDesk Judging System](./CommDesk-Judging-System.md)
- [CommDesk Sponsor & Partner Management System](./CommDesk-Sponsor-Partner-System.md)

---

## 1. System Ownership (Short)

| System | Owns |
|---|---|
| Community Signup | Community registration, organizer account bootstrap, approval lifecycle |
| Member System | Identity, onboarding, role governance, activation, auth-linked member records |
| Event System | Event creation, lifecycle, speakers/mentors/judges, partners, pricing and prize setup |
| RSVP System | Event registration, approvals, waitlist, check-in, registration compliance |
| Participant Platform | Participant UI journey: discovery, teams, submissions, judging view, leaderboard, profile |
| Judging System | Judge invitations, score lifecycle, locking, audit trail, leaderboard logic |
| Sponsor/Partner System | Sponsor marketplace, opportunity requests, deals/contracts, sponsor tracks and analytics |

---

## 2. Unified Product Lifecycle

```text
Community signs up
  -> Members onboarded (organizers, mentors, judges, participants)
  -> Event created and published
  -> RSVP opens (approve/waitlist/check-in)
  -> Teams form and submissions are finalized
  -> Judges score using event criteria
  -> Leaderboard + winners published
  -> Prizes distributed + sponsor outcomes tracked
  -> Certificates, reputation, and hiring signals updated
```

---

## 3. Integration Map

```text
Community Signup
  -> Member System
      -> Event System
          -> RSVP System
          -> Sponsor/Partner System
          -> Judging System
      -> Participant Platform (consumes Event/RSVP/Judging/Sponsor APIs)
```

Key integration rules:

- `communityId` scopes all business data.
- Event people (`speakers`, `mentors`, `judges`) are Member-linked, not duplicated.
- Judging consumes finalized submissions and criteria snapshots.
- Leaderboard ordering must match Judging policy everywhere.
- Sponsor track prizes must align with Event pricing and sponsor criteria.

---

## 4. Shared Core Entities

Common IDs and records across docs:

- `communityId`
- `userId`
- `memberId`
- `eventId`
- `registrationId`
- `teamId`
- `submissionId`
- `judgeId`
- `organizationId` (sponsor/partner)

Operational records used across modules:

- audit logs
- status lifecycle fields
- visibility/publish settings
- verification and payout metadata

---

## 5. Cross-System Non-Negotiables

- standard API error shape and stable versioning
- role-based authorization (`Owner`, `Admin`, `Organizer`, judge/member/participant roles)
- immutable or versioned critical transitions (submission finalization, score submission, winner publish)
- anti-abuse controls (rate limits, duplicate prevention, plagiarism checks, audit trail)
- transparent rules before judging and payout

---

## 6. Current Documentation Gaps (Planned)

These are already referenced as planned in current docs:

- `CommDesk-Team-System.md`
- `CommDesk-Submission-System.md`
- `CommDesk-Auth-System.md`
- `CommDesk-Notification-System.md`

---

## 7. One-Line Architecture

```text
CommDesk = Community + Identity + Events + RSVP + Participant Experience + Judging + Sponsor Marketplace, all linked by shared IDs, lifecycle rules, and auditable workflows.
```
