# CommDesk Overall System Master Guide (0 to Hero)

## Why This Document Exists

This is the all-in-one master context for CommDesk.

Use this when you need one place that explains:

- the full product from zero setup to scale
- how every system connects
- what each team should build
- what AI tools need to know before coding, design, or PPT work

If any detailed implementation rule is needed, this guide points to source docs:

- [CommDesk Implementation Status Matrix (Android branch)](./CommDesk-Implementation-Status.md)
- [Community Signup System](./Community-Signup-System.md)
- [CommDesk Member Creation and Onboarding System](./CommDesk-Member-System.md)
- [CommDesk Event System](./CommDesk-Event-System.md)
- [CommDesk RSVP System](./CommDesk-RSVP-System.md)
- [CommDesk Participant Platform System](./CommDesk-Participant-Platform-System.md)
- [CommDesk Judging System](./CommDesk-Judging-System.md)
- [CommDesk Sponsor and Partner System](./CommDesk-Sponsor-Partner-System.md)
- [CommDesk Website Public Platform System](./CommDesk-Website-System.md)
- [CommDesk Frontend Boundary System (Desktop + Website)](./CommDesk-Frontend-Boundary-System.md)
- [CommDesk Community Trust, Review, and AI Scoring System](./CommDesk-Community-Trust-Scoring-System.md)
- [CommDesk Integration and Webhook System](./CommDesk-Integration-and-Webhook-System.md)
- [CommDesk Check-In and Badge System](./CommDesk-CheckIn-and-Badge-System.md)

---

## 1. CommDesk in One Minute

CommDesk is a community-first operating system for developer ecosystems.

It starts with community onboarding, then powers members, events, RSVP, team participation, project submission, judging, sponsor marketplace, reputation, certificates, and hiring signals.

```text
Community signs up
-> Owner account and workspace created
-> Members onboarded with roles
-> Event created and published
-> RSVP and waitlist managed
-> Teams build and submit projects
-> Judges score with audit-safe workflow
-> Leaderboard and winners published
-> Prize distribution and sponsor outcomes tracked
-> Certificates, reputation, and hiring visibility updated
```

---

## 2. Product Vision and Positioning

### Vision

Build the trusted infrastructure where developer communities run their full lifecycle.

### Product Position

CommDesk combines:

- community CRM
- event operations stack
- participant platform
- judging and trust engine
- sponsor marketplace and growth engine

### Outcome

Communities scale operations with less chaos.
Participants build long-term developer identity.
Sponsors get measurable ecosystem ROI.

---

## 3. Who Uses CommDesk

### Community Side

- Community Owner
- Admin
- Organizer
- Partnerships Lead
- Sponsorship Lead
- Industry Relations Lead

### Delivery Side

- Mentor
- Speaker
- Judge
- Volunteer

### Participant Side

- Solo participant
- Team leader
- Team member

### Sponsor Side

- Sponsor Admin
- Sponsor Manager
- DevRel Manager
- Hiring Manager

---

## 4. Full System Ownership Map

| System | Core Ownership | Key Output |
| --- | --- | --- |
| Community Signup | Community registration, owner bootstrap, verification, admin approval | Active community workspace |
| Member System | User to member mapping, onboarding, role and status lifecycle | Trustworthy identity layer |
| Event System | Event authoring, publication, people panels, pricing and prizes | Runnable event blueprint |
| RSVP System | Registrations, approvals, waitlist, check-in, compliance fields | Controlled participant entry |
| Participant Platform | Discovery, teams, submissions, profile, leaderboard, certificates | Participant experience and growth |
| Judging System | Judge onboarding, scoring lifecycle, lock rules, auditing, ranking | Fair and traceable results |
| Sponsor and Partner System | Organization marketplace, opportunities, negotiations, deals | Revenue and ecosystem partnerships |
| Website Public Platform | Communities/jobs discovery, public applications, sponsor onboarding | Visitor to applicant conversion |

---

## 5. Shared Data Backbone (Cross-System)

### Must-Keep IDs

- `communityId`
- `userId`
- `memberId`
- `eventId`
- `registrationId`
- `teamId`
- `submissionId`
- `judgeId`
- `organizationId`

### Shared Records Across Modules

- audit logs
- lifecycle status fields
- publish and visibility settings
- consent snapshots and policy versions
- verification and payout metadata

### Golden Integration Rules

- `communityId` is the top-level scope for business data.
- Event people (`speakers`, `mentors`, `judges`) must be member-linked, not duplicate person records.
- Leaderboard sorting must match judging tie-break policy everywhere.
- Sponsor-track criteria and event prize setup must stay in sync.
- Sensitive personal fields must never be stored in plaintext.

---

## 6. Global Lifecycle Matrix

### Community Lifecycle

```text
pending -> under_review -> approved -> active
```

Optional states:

```text
rejected, suspended
```

### Member Lifecycle

```text
On Boarding -> Active -> Inactive -> Suspended -> Banned
```

### Event Lifecycle

```text
Draft -> Upcoming -> Live -> Completed -> Archived
```

### RSVP Lifecycle

```text
Pending -> Approved -> CheckedIn
Pending -> Rejected
Pending -> Waitlisted -> Approved
Approved -> Cancelled
```

### Submission Lifecycle

```text
Draft -> Submitted -> UnderReview -> Finalist -> Winner
Draft/Submitted -> Disqualified
```

### Judging Score Lifecycle

```text
Draft -> Submitted -> Finalized
```

### Negotiation and Contract Lifecycle

```text
Pending -> Negotiation -> Accepted | Rejected | Withdrawn | Expired
Draft -> PendingSignature -> Signed -> Completed | Cancelled | Disputed
```

---

## 7. Module by Module Blueprint

## 7.1 Community Signup System

Purpose:
Onboard real communities first, not isolated users.

Key flow:

```text
Register community -> create owner account -> verify email -> admin approval -> workspace activation
```

Main API:

```text
POST /api/v1/auth/signup-community
POST /api/v1/auth/verify-email
PATCH /api/v1/admin/communities/:id/status
```

Non-negotiables:

- duplicate checks by community name, email, domain
- email verification before full activation
- signup rate limiting and audit logs

## 7.2 Member System

Purpose:
Single identity pipeline for all people in the ecosystem.

Core concept:

```text
User = authentication account
Member = community-specific role record
```

Main APIs:

```text
POST /api/v1/members
POST /api/v1/members/import
POST /api/v1/auth/activate-member
```

Non-negotiables:

- one user can belong to multiple communities
- onboarding source tracked (dashboard, API, import)
- activation-token based onboarding, no plaintext passwords

## 7.3 Event System

Purpose:
Create, configure, and publish events with full operational data.

Core capabilities:

- draft-first event authoring
- separate speaker, mentor, and judge panels
- partner and sponsor assignment
- ticketing and pricing setup
- prize pool and sponsor reward configuration

Main APIs:

```text
POST /api/v1/events
PATCH /api/v1/events/:eventId
POST /api/v1/events/:eventId/publish
GET  /api/v1/events
```

Non-negotiables:

- price validation (`Free` must not have price, `Paid` must have price)
- time validation (`endAt` after `startAt`)
- publish guardrails and audit logs

## 7.4 RSVP System

Purpose:
Collect secure registration data and manage participant admission.

Supported modes:

- global RSVP page
- event-specific RSVP page

Core capabilities:

- solo and team registration
- event-configurable custom questions
- admin approval and waitlist
- check-in controls and export

Main APIs:

```text
POST /api/v1/events/:eventId/rsvp
GET  /api/v1/events/:eventId/registrations
PATCH /api/v1/events/:eventId/registrations/:registrationId/approve
PATCH /api/v1/events/:eventId/registrations/:registrationId/check-in
```

Non-negotiables:

- consent flags and version snapshot
- duplicate prevention by email/mobile (configurable)
- sensitive field encryption (example: Aadhaar)

## 7.5 Participant Platform

Purpose:
Give participants a complete product journey from event discovery to reputation growth.

Core modules:

- hackathon discovery
- RSVP and application
- team discovery and formation
- submission workspace
- judging visibility
- leaderboard
- builder profile and reputation
- notifications and certificates
- sponsor challenges and hiring opt-in

Main participant routes:

```text
/hackathons
/hackathons/:slug
/hackathons/:eventId/rsvp
/hackathons/:eventId/teams
/hackathons/:eventId/submission
/hackathons/:eventId/judging
/hackathons/:eventId/leaderboard
/builders/:username
```

Non-negotiables:

- immutable submission timestamp after final submit
- team role and lock policy
- privacy controls for hiring visibility

## 7.6 Judging System

Purpose:
Make scoring fair, transparent (when configured), and audit-ready.

Core capabilities:

- judge invite and access control
- per-criteria scoring
- score locking and controlled unlock
- conflict of interest handling
- round-based assignment and finalization
- deterministic leaderboard ranking

Main APIs:

```text
POST /api/v1/events/:eventId/judges/invite
POST /api/v1/judge/events/:eventId/submissions/:submissionId/scores/submit
POST /api/v1/events/:eventId/judging/finalize-round
GET  /api/v1/events/:eventId/leaderboard
```

Non-negotiables:

- no edits after submit without privileged unlock reason
- unique score constraint per judge per submission
- full judging audit trail for every write action

## 7.7 Sponsor and Partner Marketplace

Purpose:
Convert sponsorship from manual outreach into a structured marketplace pipeline.

Core capabilities:

- organization onboarding and verification
- opportunity creation and discovery
- two-way request flow (community to sponsor, sponsor to community)
- negotiation, deal, contract, and payment lifecycle
- sponsor challenge and workshop integration in events
- sponsor analytics and talent outcomes

Main APIs:

```text
POST /api/v1/sponsors/apply
POST /api/v1/opportunities
POST /api/v1/requests
POST /api/v1/contracts/:contractId/sign
GET  /api/v1/sponsors/:organizationId/analytics
```

Non-negotiables:

- maintain compatibility with existing event sponsor categories
- immutable timeline for request and deal state transitions
- role-based controls on both community side and organization side

## 7.8 Website Public Platform

Purpose:
Provide public website journeys for discovery and application before users enter internal operations.

Core capabilities:

- list all communities with search and filters
- job discovery and role applications
- community join applications
- hackathon join applications
- sponsor and partner self-registration
- applicant status tracking and notification

Main APIs:

```text
GET  /api/v1/public/communities
GET  /api/v1/events
GET  /api/v1/public/jobs
POST /api/v1/public/communities/:communityId/join-requests
POST /api/v1/events/:eventId/rsvp
POST /api/v1/sponsors/apply
```

For complete website route and API coverage, refer to:

- [CommDesk Website Public Platform System](./CommDesk-Website-System.md)

Non-negotiables:

- anti-bot and rate limit controls on all public forms
- verification before approval for sponsor and partner onboarding
- auditable status transitions for every application lifecycle

---

## 8. End-to-End Product Story (Real Operation)

```text
Step 1: A community registers and gets approved
Step 2: Owner creates core team members and assigns roles
Step 3: Organizer creates an event as Draft
Step 4: Event people (speakers, mentors, judges) are assigned from members
Step 5: Prize and sponsor structure is configured
Step 6: Event is published and RSVP opens
Step 7: Participants register (solo/team), approval or waitlist applied
Step 8: Teams build and submit projects before deadline
Step 9: Judges score by configured criteria in rounds
Step 10: Leaderboard is computed and winners are announced
Step 11: Prize distribution and sponsor deliverables are completed
Step 12: Certificates, reputation points, and hiring signals are updated
Step 13: Analytics close the loop for next event improvements
```

---

## 9. API and Contract Standards

### API Style

- base prefix: `/api/v1`
- resource-first naming
- predictable query params (`page`, `limit`, `search`, `status`)

### Standard Error Shape

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable summary",
    "fieldErrors": {
      "field.path": "Reason"
    }
  }
}
```

### Required Reliability Controls

- idempotency for risky transitions (publish, finalize, payout)
- optimistic concurrency or version check for concurrent edits
- strict request validation with Zod

---

## 10. Security, Trust, and Compliance Baseline

### Always Required

- JWT auth with role and community scoping
- API key permissions for external onboarding paths
- rate limits on signup, RSVP, and public endpoints
- audit logging on all critical state transitions
- encryption for sensitive fields

### High-Risk Areas to Protect

- RSVP personal identity data
- score mutation after judging submit
- payout and sponsor contract metadata
- bulk exports of participant records

### Fairness Rules

- conflict-of-interest enforcement for judges
- tie-break policy published before judging
- criteria snapshots for historical integrity

---

## 11. Data and Indexing Guidance

### Recommended Core Collections

- `Community`
- `User`
- `Member`
- `Event`
- `EventRSVPConfig`
- `EventRegistration`
- `EventSubmission`
- `EventJudgingCriteria`
- `SubmissionScore`
- `JudgingAudit`
- `Organization`
- `Opportunity`
- `Request`
- `Deal`
- `Contract`
- `Payment`

### High-Value Index Examples

- `(communityId, status, startAt)` for event listing
- `(eventId, status, createdAt)` for registration operations
- unique `(eventId, submissionId, judgeId)` for score integrity
- unique normalized organization domain for sponsor directory quality

---

## 12. Event-Driven Integration Signals

These events should be emitted and consumed across modules:

- `community_signup_requested`
- `community_approved`
- `member_created`
- `event_published`
- `rsvp_submitted`
- `rsvp_promoted_from_waitlist`
- `submission_finalized`
- `score_submitted`
- `round_finalized`
- `leaderboard_published`
- `contract_signed`
- `payment_released`
- `certificate_issued`

This improves notification, analytics, and audit consistency.

---

## 13. Analytics and KPI Layer

### Community and Ops Metrics

- community activation rate
- member onboarding completion rate
- RSVP conversion rate
- waitlist to approved promotion rate
- check-in rate

### Participant Metrics

- team formation success rate
- submission completion rate
- judging publish latency
- repeat participation rate

### Sponsor Metrics

- request response speed
- negotiation to deal conversion rate
- sponsor retention rate
- challenge participation and hiring funnel impact

---

## 14. 0 to Hero Delivery Roadmap

### Phase 0: Foundation

- finalize shared IDs and API standards
- stabilize signup, member onboarding, event draft to publish flow
- connect event people panels to real member data

### Phase 1: Event Operations Core

- complete RSVP config and registration operations
- ship waitlist and check-in
- connect participant routes to backend contracts

### Phase 2: Trust Engine

- complete judging rounds, locking, and audit layer
- publish leaderboard with tie-break integrity
- enforce plagiarism and anti-abuse checks

### Phase 3: Ecosystem Expansion

- release sponsor marketplace with negotiation and deals
- enable sponsor challenges, workshops, and resources in events
- launch certificates and reputation growth loop

### Phase 4: Scale and Intelligence

- add matching intelligence for sponsor and talent
- strengthen analytics and predictive insights
- optimize for multi-community multi-event scale

---

## 15. AI Handoff Kit (Coding, PPT, Design, Content)

This section is made for AI agents so they can produce useful outputs fast.

### 15.1 For Coding Agents

Before implementation, agent must collect:

- target module owner (signup/member/event/rsvp/participant/judging/sponsor)
- required status transitions
- required IDs and indexes
- RBAC rules
- audit events that must be written
- error codes and response shape

Definition of done checklist:

- request and response contract defined
- lifecycle transitions validated
- auth and role checks enforced
- logs and audits added
- happy-path and edge-path tests present

### 15.2 For PPT Creation Agents

Use this slide storyline:

1. Problem and market gap
2. CommDesk vision and product map
3. End-to-end lifecycle (community to certificate)
4. Module architecture and ownership
5. Trust and fairness engine
6. Sponsor revenue flywheel
7. Roadmap and milestones
8. KPIs and expected impact

### 15.3 For Design Creation Agents

Use this screen inventory baseline:

- community signup and approval states
- member onboarding and activation
- event create and publish wizard
- RSVP form and admin queue
- participant discovery, teams, submission, leaderboard
- judge dashboard and scoring page
- sponsor marketplace inbox and negotiation panel

Use these UX principles:

- status-first UI (every record shows lifecycle state clearly)
- trust-first UI (audit visibility and rule clarity)
- action-first UI (next action obvious for each role)

### 15.4 For Content and Docs Agents

Tone guidelines:

- simple words
- low jargon
- direct sentences
- explain "what", "why", and "next action"

Use these quick one-liners:

- "CommDesk helps communities run events with trust and speed."
- "From signup to sponsor outcomes, everything is connected."
- "Participants build identity, not just one-time submissions."

---

## 16. Implementation Reality and Planned Docs

Current implementation status tracker:

- [CommDesk Implementation Status Matrix (Android branch)](./CommDesk-Implementation-Status.md)

Use the status matrix as primary truth for what is currently implemented in this repository.
This master guide remains the product-level target architecture.

Planned system documents that should be added next:

- `CommDesk-Team-System.md`
- `CommDesk-Submission-System.md`
- `CommDesk-Auth-System.md`
- `CommDesk-Notification-System.md`

Until these are added, their behavior should be treated as planned contracts and validated carefully during implementation.

---

## 17. Biggest Risks If Teams Ignore This Guide

- data duplication across member, event, and participant flows
- inconsistent leaderboard due to mismatched judging policy
- legal and compliance exposure from weak consent storage
- sponsor deal leakage due to poor negotiation and contract tracking
- feature drift between docs, backend, and frontend

---

## 18. Final Master Architecture

```text
CommDesk
-> Community Signup and Approval
-> Member Identity and Roles
-> Event Authoring and Publication
-> RSVP and Registration Governance
-> Participant Journey (teams, submission, profile)
-> Judging and Leaderboard Trust Engine
-> Sponsor and Partner Marketplace
-> Certificates, Reputation, Hiring Signals
-> Analytics and Continuous Improvement
```

One-line definition:

```text
CommDesk is a connected ecosystem OS for developer communities, where operations, trust, growth, and revenue run on one lifecycle.
```
