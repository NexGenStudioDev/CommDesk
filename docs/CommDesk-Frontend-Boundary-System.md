# CommDesk Frontend Boundary System (Desktop + Website)

## Overview

This document defines ownership boundaries between CommDesk Desktop App and CommDesk Website.

Goal:

- avoid duplicate feature implementation across both frontends
- keep one primary write-owner per capability
- preserve a clear handoff between operations-side and participant/public-side workflows

This is the anti-duplication contract for product, design, frontend, backend, and QA teams.

Related system docs:

- [CommDesk Overall System Master Guide](./CommDesk-Overall-System-Summary.md)
- [CommDesk Website Public Platform System](./CommDesk-Website-System.md)
- [CommDesk Event System](./CommDesk-Event-System.md)
- [CommDesk RSVP System](./CommDesk-RSVP-System.md)
- [CommDesk Check-In and Badge System](./CommDesk-CheckIn-and-Badge-System.md)
- [CommDesk Participant Platform System](./CommDesk-Participant-Platform-System.md)
- [CommDesk Judging System](./CommDesk-Judging-System.md)
- [CommDesk Sponsor and Partner System](./CommDesk-Sponsor-Partner-System.md)
- [CommDesk Community Trust, Review, and AI Scoring System](./CommDesk-Community-Trust-Scoring-System.md)

---

## 1. Product Surfaces

## 1.1 Desktop App (Tauri + React)

Purpose:

- internal operations workspace for community owner/admin/organizer teams

Current codebase modules indicate desktop operations ownership:

- `src/features/AddMember`
- `src/features/Dashboard`
- `src/features/Events`
- `src/features/Member`
- `src/features/Contact_And_Support`

## 1.2 Website (React Web)

Purpose:

- public discovery and participant/sponsor/recruiter interaction surface

Website covers:

- discovery
- applications
- participation
- transparency
- public trust pages

## 1.3 Shared Backend (Single Source of Truth)

Both frontends use the same backend contracts.

Rule:

- data is shared
- write authority is not shared

---

## 2. Non-Duplication Principles

Use these rules before building any screen.

1. Single write owner per capability.
2. Other frontend can be read-only or deep-link to owner surface.
3. No duplicate create/edit forms for the same entity lifecycle stage.
4. Admin override is allowed only in desktop and must be audited.
5. Publish and state transitions must happen from owner surface only.

Architecture shorthand:

```text
Read-Many, Write-One
```

---

## 3. Ownership Matrix (Desktop vs Website)

| Capability                                                    | Desktop App                                           | Website                                            | Primary Write Owner                                        |
| ------------------------------------------------------------- | ----------------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------------- |
| Community registration                                        | Review/approve/reject                                 | Community signup form                              | Website (submit), Desktop/Admin (review)                   |
| Member onboarding and bulk import                             | Full create/invite/import                             | Activation completion only                         | Desktop                                                    |
| Event create/edit/publish/archive                             | Full control                                          | View only                                          | Desktop                                                    |
| RSVP configuration                                            | Full control                                          | Read config for forms                              | Desktop                                                    |
| RSVP submission/update/cancel                                 | Monitor/report view                                   | Full participant actions                           | Website                                                    |
| Registration review (approve/reject/waitlist/check-in/export) | Full control                                          | Self-status view only                              | Desktop                                                    |
| Check-in desk and badge operations                            | Full control (config, scan, print, reprint, revoke)   | Self status/pass view only                         | Desktop                                                    |
| Team discovery and join requests                              | Exception override only                               | Full participant flow                              | Website                                                    |
| Submission draft/finalize                                     | Override/disqualify only                              | Full participant flow                              | Website                                                    |
| Judging criteria/settings/assignments                         | Full control                                          | Read policy where needed                           | Desktop                                                    |
| Judge scoring workspace                                       | No duplicate scoring UI                               | Full judge portal                                  | Website                                                    |
| Leaderboard publishing/finalization                           | Finalization authority                                | Public display                                     | Desktop (finalize), Website (display)                      |
| Sponsor/partner apply                                         | Review + activation                                   | Public apply form                                  | Website (apply), Desktop/Admin (review)                    |
| Sponsor event assignment and benefit fulfillment              | Full control                                          | Read-only sponsor display                          | Desktop                                                    |
| Job posting moderation                                        | Full control                                          | No posting UI                                      | Desktop                                                    |
| Job discovery and applications                                | View metrics                                          | Full user-facing flow                              | Website                                                    |
| Certificate issuance                                          | Generate and issue                                    | View and verify                                    | Desktop (issue), Website (consume)                         |
| Notification template/rule management                         | Full control                                          | Preference controls + inbox                        | Desktop (rules), Website (consume)                         |
| Community trust scoring and review intelligence               | Rule config, moderation, appeals, override governance | Review submission, trust display, AI summary cards | Website (collect/display), Desktop (governance/moderation) |
| Analytics and reports                                         | Full operational analytics                            | Public funnel summaries                            | Desktop                                                    |

---

## 4. End-to-End Handoff Flows

## 4.1 Event Operations to Public Website

```text
Desktop: Create Draft Event
-> Desktop: Configure RSVP rules and publish
-> Website: Show event listing and detail page
-> Website: Accept registrations
-> Desktop: Review and approve/waitlist/check-in
```

## 4.2 Hackathon Participation Pipeline

```text
Desktop: Publish hackathon + rules
-> Website: RSVP, team formation, submission
-> Website: Judge scoring portal
-> Desktop: Finalize rounds and winner status
-> Website: Publish leaderboard, project showcase, certificates view
```

## 4.3 Sponsor/Partner Pipeline

```text
Website: Sponsor/Partner applies
-> Desktop/Admin: Verify and approve
-> Desktop: Assign sponsor to event + define benefits
-> Website: Public sponsor visibility + participant challenge access
```

## 4.4 Jobs and Talent Pipeline

```text
Desktop: Create/moderate job opportunities
-> Website: List jobs and collect applications
-> Desktop: Review hiring funnel and outcomes
```

---

## 5. Desktop-Owned Modules (Do Not Duplicate on Website)

Website should not implement full duplicate UIs for these:

- event authoring wizard
- event publish/archive controls
- RSVP config editing
- registration admin queue actions
- judging criteria editing and judge assignment
- sponsor benefit fulfillment management
- job posting moderation panel
- certificate generation workflows
- platform-level analytics consoles

Website may expose read-only snapshots where useful.

---

## 6. Website-Owned Modules (Do Not Duplicate on Desktop)

Desktop should not implement full duplicate UIs for these:

- public discovery pages
- community join and RSVP public forms
- team formation UX
- submission builder UX
- public project gallery
- public judging visibility pages
- public leaderboard pages
- job seeker application flow
- sponsor/partner public onboarding forms

Desktop may show minimal monitoring views when operationally needed.

---

## 7. Shared Domain Contracts (Both Frontends Must Use)

Common identifiers:

- `communityId`
- `userId`
- `memberId`
- `eventId`
- `registrationId`
- `teamId`
- `submissionId`
- `judgeId`
- `organizationId`

Shared state machines must stay identical across frontends:

- event lifecycle
- RSVP lifecycle
- submission lifecycle
- judging score lifecycle
- sponsor negotiation and contract lifecycle

Rule:

- frontends can render status differently
- frontends cannot invent different statuses

---

## 8. API Boundary Rules

## 8.1 Desktop-Primary Write APIs

Examples:

```text
POST /api/v1/events
PATCH /api/v1/events/:eventId
POST /api/v1/events/:eventId/publish

PATCH /api/v1/events/:eventId/rsvp-config
PATCH /api/v1/events/:eventId/registrations/:registrationId/approve
PATCH /api/v1/events/:eventId/registrations/:registrationId/reject

POST /api/v1/events/:eventId/criteria
PATCH /api/v1/events/:eventId/judging-settings
POST /api/v1/events/:eventId/judging/finalize-round
```

## 8.2 Website-Primary Write APIs

Examples:

```text
POST /api/v1/public/communities/:communityId/join-requests
POST /api/v1/events/:eventId/rsvp
POST /api/v1/events/:eventId/teams
POST /api/v1/events/:eventId/submissions
POST /api/v1/events/:eventId/submissions/:submissionId/finalize
POST /api/v1/public/jobs/:jobId/apply
POST /api/v1/sponsors/apply
```

## 8.3 Guardrail

If a write API is desktop-owned, website should not expose an equivalent full-edit UI for same transition.

If a write API is website-owned, desktop should not re-implement the same participant-first UX.

---

## 9. UX and Product Guardrails

## 9.1 Desktop UX Bias

- operational throughput
- bulk actions
- governance and approvals
- auditability

## 9.2 Website UX Bias

- discoverability
- conversion
- clarity for first-time users
- progress/status visibility

## 9.3 Anti-Pattern List

Do not do these:

- duplicate RSVP form on desktop and website with separate validation logic
- allow event publishing from website while desktop has publish rules
- allow criteria edits in website judge pages
- implement two different submission finalize flows
- create parallel sponsor onboarding forms with different fields

---

## 10. Delivery Checklist (Before Building a Feature)

For each feature, answer all questions before implementation.

1. Which frontend is write-owner?
2. Is the other frontend read-only or hidden?
3. Which lifecycle state transitions are allowed here?
4. Which roles can execute transitions?
5. Which audit events must be logged?
6. Which API contract is canonical?
7. Does this conflict with existing owner surface?

If any answer is unclear, do not start UI implementation.

---

## 11. Governance and Change Management

When a team wants to move ownership from one frontend to another:

1. update this boundary doc first
2. update module-level doc (event/rsvp/judging/sponsor/etc.)
3. update API authorization and audit rules
4. run migration plan for old UI deprecation
5. communicate to design, QA, and support teams

No ownership transfer should happen by code change alone.

---

## 12. Final Boundary Definition

One-line rule:

```text
Desktop runs operations; Website runs discovery and participation; backend state remains single-source and lifecycle-consistent.
```

This is the contract to keep CommDesk all-in-one without frontend duplication chaos.
