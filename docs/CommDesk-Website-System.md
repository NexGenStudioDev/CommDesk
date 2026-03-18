# CommDesk Website Public Platform System

## Overview

This document defines the complete website-facing platform for CommDesk.

Implementation status note:

- this document is a target-state website specification
- current code in this repository is primarily desktop-focused and may not include these website routes yet
- check [CommDesk Implementation Status Matrix](./CommDesk-Implementation-Status.md) for current build reality

It covers public discovery, application, onboarding, participation, transparency, trust, and growth journeys.

This is the website side of CommDesk and should stay aligned with these system docs:

- [Community Signup System](./Community-Signup-System.md)
- [CommDesk Member Creation and Onboarding System](./CommDesk-Member-System.md)
- [CommDesk Event System](./CommDesk-Event-System.md)
- [CommDesk RSVP System](./CommDesk-RSVP-System.md)
- [CommDesk Participant Platform System](./CommDesk-Participant-Platform-System.md)
- [CommDesk Judging System](./CommDesk-Judging-System.md)
- [CommDesk Sponsor and Partner System](./CommDesk-Sponsor-Partner-System.md)
- [CommDesk Frontend Boundary System (Desktop + Website)](./CommDesk-Frontend-Boundary-System.md)
- [CommDesk Community Trust, Review, and AI Scoring System](./CommDesk-Community-Trust-Scoring-System.md)
- [CommDesk Check-In and Badge System](./CommDesk-CheckIn-and-Badge-System.md)

Frontend ownership guardrail:

- Website is not allowed to duplicate desktop-owned operational write workflows.
- Desktop is not allowed to duplicate website-owned participant/public write workflows.
- Ownership details are defined in the Frontend Boundary System doc.

Primary website objectives:

- list all communities
- let users join communities
- let users discover and join events and hackathons
- support full participant journey after joining hackathon
- help users find and apply for jobs
- allow sponsor and partner self-registration
- provide transparent, trusted, and policy-safe public workflows

Core journey:

```text
Discover -> Apply -> Verify -> Join -> Build -> Submit -> Get Judged -> Earn Reputation -> Get Opportunities
```

---

## 1. Scope and Roles

## 1.1 In Scope

- public landing and discovery pages
- community listing and community join applications
- event and hackathon listing and registration
- RSVP forms with solo and team support
- waitlist and status tracking pages
- participant journey pages (team, submission, projects, judging, leaderboard)
- jobs directory and job applications
- sponsor and partner self-registration and onboarding
- account activation, login, and password reset flows
- legal, support, and trust pages
- notification and certificate surfaces

## 1.2 Primary Roles

- Visitor
- Community Join Applicant
- Event/Hackathon Applicant
- Participant (approved user)
- Sponsor Applicant
- Partner Applicant
- Recruiter/Hiring User
- Community Reviewer (Owner/Admin/Organizer)
- Judge/Lead Judge
- Super Admin

## 1.3 Website Access Layers

- Public: discovery, listing, detail pages, public policies
- Authenticated Participant: applications, team/submission, profile, certificates
- Restricted Role Access: recruiter talent pages, judge pages, admin review pages

---

## 2. Public Website Information Architecture

## 2.1 Route Map

```text
/                                      -> Landing page
/communities                           -> List all communities
/communities/:slug                     -> Community detail page
/communities/:communityId/join         -> Community join form

/events                                -> Public events listing
/events/:slug                          -> Event detail page
/events/:eventId/rsvp                  -> Event join / RSVP form

/hackathons                            -> Hackathon listing
/hackathons/:slug                      -> Hackathon detail page
/hackathons/:eventId/rsvp              -> Hackathon apply form
/hackathons/:eventId/teams             -> Team discovery and join
/hackathons/:eventId/find-teammates    -> Teammate finder
/hackathons/:eventId/submission        -> Submission workspace
/hackathons/:eventId/projects          -> Public project gallery
/hackathons/:eventId/judging           -> Public judging view (if enabled)
/hackathons/:eventId/leaderboard       -> Public leaderboard

/jobs                                  -> Jobs listing
/jobs/:jobId                           -> Job detail
/jobs/:jobId/apply                     -> Job application

/register-community                    -> Community signup form
/become-sponsor-partner                -> Sponsor/Partner registration

/applications/:applicationId           -> Application status page
/notifications                         -> Notification center
/certificates                          -> Certificates vault
/builders/:username                    -> Builder public profile
/talent                                -> Talent discovery (restricted)

/auth/login                            -> Login
/auth/activate                         -> Activation via token
/auth/forgot-password                  -> Forgot password
/auth/reset-password                   -> Reset password
/verify-email                          -> Email verification

/contact-support                       -> Contact and support
/faq                                   -> FAQ
/privacy-policy                        -> Privacy policy
/terms-and-conditions                  -> Terms and conditions
/code-of-conduct                       -> Code of conduct
```

## 2.2 Navigation Priorities

Top-level website navigation should include:

- Communities
- Events
- Hackathons
- Jobs
- Become Sponsor/Partner
- Register Community
- Support

## 2.3 Global UX Rules

- mobile-first and desktop-safe layouts
- clear status feedback after every submission
- filter and sort controls on all listing pages
- empty states with next-step CTA
- visible deadline and timezone labels on event pages

---

## 3. Community Directory (List All Communities)

## 3.1 User Experience Requirements

Users must be able to:

- browse all active communities
- search by community name
- filter by location, category, and size
- sort by newest, most active, and highest member count
- open community details and submit join request

## 3.2 API Contracts

```text
GET /api/v1/public/communities
GET /api/v1/public/communities/:communityId
POST /api/v1/public/communities/:communityId/join-requests
GET /api/v1/public/community-join-requests/:requestId
```

## 3.3 Community List Card Essentials

- communityId
- slug
- name
- logoUrl
- shortDescription
- city
- country
- memberCount
- activeEventCount
- tags
- trustScore
- trustConfidence
- trustSummarySnippet

## 3.4 Trust Discovery Requirement

Community directory and detail pages should include trust intelligence from the Community Trust Scoring System:

- trust score (`0-100`)
- confidence label
- AI summary message
- top strengths and top recurring issues

This helps participants, sponsors, and mentors compare communities based on real historical outcomes.

## 3.5 Community Detail Essentials

- about section
- social links
- upcoming events
- active hackathons
- open community opportunities
- join CTA with policy notice

---

## 4. Community Join Application

## 4.1 Flow

```text
Visitor opens community page
-> clicks Join Community
-> fills form and consent
-> submits
-> gets confirmation email
-> status = PendingReview
-> reviewer action (Approve/Reject/Waitlist)
-> status notification sent
```

## 4.2 Required Form Fields

- fullName
- email
- phone
- city
- skills[]
- motivation
- dataProcessingAccepted
- termsVersion
- privacyPolicyVersion

Optional fields:

- githubUrl
- linkedinUrl
- portfolioUrl
- resumeUrl

## 4.3 Lifecycle

```text
Draft -> Submitted -> PendingReview -> Approved | Rejected | Waitlisted
```

## 4.4 Reviewer Controls

- approve
- reject with reason
- waitlist
- move waitlist to approved

All status changes must be audit-logged.

---

## 5. Events and Hackathons Discovery

## 5.1 Product Rule

Website must support all event types from Event System:

- Hackathon
- Workshop
- Bootcamp
- Meetup
- Competition

## 5.2 Listing Requirements

Users must be able to filter by:

- event type
- online/offline/hybrid
- free/paid
- registration open
- beginner friendly
- domain tags

## 5.3 Event Card Essentials

- coverImageUrl
- title
- subtitle
- eventType
- startAt/endAt
- venue or online label
- registration status
- price label (free/paid)
- prizePool (for hackathons)

## 5.4 API Contracts

```text
GET /api/v1/events
GET /api/v1/events/:eventId
```

---

## 6. Join Event and Join Hackathon (RSVP)

Website RSVP must use RSVP System contracts.

## 6.1 Flow

```text
Visitor opens event page
-> clicks Join / RSVP
-> selects Solo or Team
-> fills identity, team, and consent fields
-> submits
-> receives registration number + status
-> gets email + in-app status updates
```

## 6.2 Core APIs

```text
GET  /api/v1/events/:eventId/rsvp-config
POST /api/v1/events/:eventId/rsvp
GET  /api/v1/events/:eventId/rsvp/:registrationId
PATCH /api/v1/events/:eventId/rsvp/:registrationId
POST /api/v1/events/:eventId/rsvp/:registrationId/cancel
```

## 6.3 Required RSVP Fields

- eventId
- registrationType (Solo/Team)
- leader.fullName
- leader.email
- leader.mobile
- consents.eventRulesAccepted
- consents.dataProcessingAccepted
- consents.privacyPolicyVersion
- consents.termsVersion

Team-specific required fields:

- teamName
- teamSize
- members[]

## 6.4 Validation Rules

If Team:

- teamName required
- teamSize >= 2
- members.length = teamSize - 1

If Solo:

- teamSize = 1
- members.length = 0

Always enforce:

- duplicate checks by email/mobile based on event config
- registration window checks
- required custom question answers

## 6.5 RSVP Lifecycle

```text
Pending -> Approved -> CheckedIn
Pending -> Rejected
Pending -> Waitlisted -> Approved
Approved -> Cancelled
```

## 6.6 Waitlist Behavior

When capacity is full and waitlist is enabled:

- create waitlist entry
- assign waitlist position
- send waitlist confirmation
- auto-promote when seat opens

---

## 7. Hackathon Participant Journey (After Approval)

This section is mandatory for website completeness and must align with Participant Platform and Judging docs.

## 7.1 Team Discovery and Formation

Routes:

```text
/hackathons/:eventId/teams
/hackathons/:eventId/find-teammates
```

Must support:

- team creation
- join requests
- invite members
- leader/co-leader/member role controls
- team lock at deadlines

## 7.2 Submission Workspace

Route:

```text
/hackathons/:eventId/submission
```

Required fields:

- projectName
- shortDescription
- problemStatement
- solution
- techStack[]
- repositoryUrl
- demoUrl
- videoUrl

Status lifecycle:

```text
Draft -> Submitted -> UnderReview -> Finalist -> Winner
Draft/Submitted -> Disqualified
```

Rules:

- submittedAt must be immutable after finalize
- post-deadline edits blocked except authorized overrides
- submission edit log required for all mutable fields

## 7.3 Public Project Showcase

Route:

```text
/hackathons/:eventId/projects
```

Must show project cards with track, stack, links, and awards badges.

## 7.4 Transparent Judging View

Route:

```text
/hackathons/:eventId/judging
```

Must respect event judging settings:

- mode: Private or Transparent
- showJudgeNames
- showFeedback
- publishTiming

## 7.5 Leaderboard

Route:

```text
/hackathons/:eventId/leaderboard
```

Ranking must match Judging System tie-break order.

## 7.6 Notifications and Certificates

Routes:

```text
/notifications
/certificates
```

Must include:

- deadline reminders
- status change alerts
- winner announcements
- verifiable certificate links

---

## 8. Jobs and Talent Discovery

## 8.1 Jobs Module (Find Job)

Users must be able to:

- browse open roles from sponsor/partner organizations
- filter by skills, location, workType, and jobType
- search by role and company
- apply from website

APIs:

```text
GET /api/v1/public/jobs
GET /api/v1/public/jobs/:jobId
POST /api/v1/public/jobs/:jobId/apply
```

Required fields:

- jobId
- title
- companyName
- location
- workType
- jobType
- requiredSkills[]
- applicationDeadline
- status

## 8.2 Talent Discovery Privacy Rule

Talent access route:

```text
/talent
```

Rules:

- recruiter/employer-only access
- participant opt-in required
- profile visibility settings must be enforced

---

## 9. Sponsor and Partner Self-Registration

## 9.1 Product Rule

Sponsors and partners must be able to self-register from public website.

Supported organization types:

- Sponsor
- Partner

## 9.2 Flow

```text
Visitor opens Become Sponsor/Partner
-> selects type and fills organization profile
-> submits registration
-> verifies email
-> admin review
-> approved organization gets active account
```

## 9.3 APIs

Primary marketplace onboarding API:

```text
POST /api/v1/sponsors/apply
```

Optional public wrapper APIs:

```text
POST /api/v1/public/organizations/register
POST /api/v1/public/organizations/verify-email
GET  /api/v1/public/organizations/registrations/:registrationId
```

## 9.4 Required Fields

- organizationType
- legalName
- displayName
- officialEmail
- website
- industry
- country
- city
- primaryContactName
- primaryContactRole
- primaryContactPhone
- budgetRange (sponsor)
- collaborationType[]

## 9.5 Lifecycle

```text
Submitted -> PendingVerification -> UnderReview -> Approved -> Active
Submitted -> Rejected
```

## 9.6 Post-Approval Website Surfaces

After approval, sponsor/partner should access:

- opportunities listing
- request inbox
- negotiation status
- contract and analytics views (role-gated)

---

## 10. Community Signup and Member Activation (Website)

## 10.1 Community Signup Flow

```text
Organizer opens Register Community
-> submits community + owner details
-> email verification
-> status pending
-> admin review
-> approved
-> workspace activation
```

Core APIs:

```text
POST  /api/v1/auth/signup-community
POST  /api/v1/auth/verify-email
PATCH /api/v1/admin/communities/:id/status
```

## 10.2 Member Activation Flow

When users are onboarded through website forms or invites:

```text
POST /api/v1/members
POST /api/v1/auth/activate-member
```

## 10.3 Critical Identity Rule

No generic anonymous account signup should bypass community-first model.

Allowed account creation paths:

- community owner signup flow
- member onboarding flow
- approved sponsor/partner onboarding flow

---

## 11. Must-Have Website Foundations

Every production website module must include the following.

## 11.1 Auth and Account

- login
- activation via token
- forgot password
- reset password
- session invalidation on role revoke

## 11.2 Legal and Trust Pages

- privacy policy
- terms and conditions
- code of conduct
- data consent disclosure on all forms

## 11.3 Support and Help

- contact and support page
- FAQ
- clear escalation path for rejected applications and disputes

## 11.4 Reliability and Error UX

- 404 and fallback pages
- standardized error response display
- retry-safe form submissions

## 11.5 Accessibility, SEO, and Performance

- semantic HTML and keyboard navigation
- color contrast and focus visibility
- metadata and OG tags on public pages
- responsive performance on low-end mobile networks

---

## 12. Shared Validation, Security, and Compliance Rules

All public forms and status-changing actions must enforce:

- email verification or OTP where required
- CAPTCHA and anti-bot checks
- duplicate detection by email, mobile, and domain (configurable)
- rate limiting by IP, email, API key, and endpoint
- strict Zod validation at API boundary
- audit logs for all critical transitions

Sensitive data protections:

- encrypt sensitive fields at rest (for example Aadhaar in RSVP)
- never store plaintext passwords
- mask sensitive values in API responses and exports
- retain consent snapshots with policy versions

Operational protections:

- abuse scoring (IP velocity, repeated attempts)
- signed URL strategy for private assets
- community-scoped and role-scoped authorization on all restricted APIs

---

## 13. Notification Events and Delivery

Required website notification triggers:

- community join request submitted and status changed
- RSVP submitted, approved, rejected, waitlisted, promoted, cancelled
- check-in confirmation
- team invite and join-request decisions
- submission deadline reminders
- score publication and leaderboard updates (when configured)
- winner announcements and certificate issuance
- sponsor/partner registration approved or rejected

Channels:

- email (required)
- in-app (required for authenticated users)
- push (optional)

Delivery controls:

- per-user notification preferences
- digest mode and quiet hours
- notification send audit logs

---

## 14. Consolidated Website API Surface

This is the minimum website API coverage expected after aligning all docs.

## 14.1 Discovery

```text
GET /api/v1/public/communities
GET /api/v1/public/communities/:communityId
GET /api/v1/events
GET /api/v1/events/:eventId
GET /api/v1/public/jobs
GET /api/v1/public/jobs/:jobId
```

## 14.2 Applications and RSVP

```text
POST /api/v1/public/communities/:communityId/join-requests
GET  /api/v1/public/community-join-requests/:requestId

GET  /api/v1/events/:eventId/rsvp-config
POST /api/v1/events/:eventId/rsvp
GET  /api/v1/events/:eventId/rsvp/:registrationId
PATCH /api/v1/events/:eventId/rsvp/:registrationId
POST /api/v1/events/:eventId/rsvp/:registrationId/cancel
```

## 14.3 Participant Journey

```text
POST  /api/v1/events/:eventId/teams
GET   /api/v1/events/:eventId/teams
POST  /api/v1/events/:eventId/teams/:teamId/join-requests
PATCH /api/v1/events/:eventId/teams/:teamId/join-requests/:requestId/accept
PATCH /api/v1/events/:eventId/teams/:teamId/join-requests/:requestId/reject

POST  /api/v1/events/:eventId/submissions
PATCH /api/v1/events/:eventId/submissions/:submissionId
POST  /api/v1/events/:eventId/submissions/:submissionId/finalize

GET   /api/v1/events/:eventId/projects
GET   /api/v1/events/:eventId/projects/:slug
GET   /api/v1/events/:eventId/judging
GET   /api/v1/events/:eventId/leaderboard

GET   /api/v1/notifications
PATCH /api/v1/notifications/:id/read
GET   /api/v1/certificates/me
GET   /api/v1/certificates/:certificateId/verify
```

## 14.4 Jobs, Sponsorship, and Onboarding

```text
POST /api/v1/public/jobs/:jobId/apply
POST /api/v1/sponsors/apply
POST /api/v1/auth/signup-community
POST /api/v1/auth/verify-email
POST /api/v1/auth/activate-member
```

---

## 15. Important Fields Checklist (Website Readiness)

Do not ship website without these fields and constraints.

1. Identity and ownership

- communityId
- userId
- memberId
- organizationId
- eventId

1. Application and RSVP

- registrationType
- teamName/teamSize/members
- consents + policy versions
- status + statusReason
- registrationNumber

1. Submission and judging

- submissionId
- submittedAt (immutable)
- criteria scores and weight snapshots
- leaderboard rank and tie-break metadata

1. Trust and compliance

- audit actor + timestamp + IP + userAgent
- sensitive field encryption flags
- abuse and duplicate detection metadata

1. Growth outcomes

- certificateId + verificationUrl
- openToHiring opt-in and profile visibility

---

## 16. Updated Website Delivery Plan

Phase 1: Public Foundation

- landing, communities, events, hackathons
- community join and RSVP forms
- status tracking pages
- legal/support pages

Phase 2: Participant Core

- team discovery and teammate finder
- submission workspace
- projects gallery and basic leaderboard
- notifications and certificates baseline

Phase 3: Trust and Transparency

- judging transparency controls
- anti-fraud and anti-cheating hardening
- audit and observability improvements

Phase 4: Growth and Revenue

- jobs module and job applications
- sponsor/partner self-registration
- opportunity and sponsor engagement surfaces

Phase 5: Scale and Intelligence

- advanced analytics and conversion optimization
- quality ranking and matching enhancements
- retention and cohort intelligence

---

## 17. Success Metrics

Track these KPIs weekly.

Acquisition and discovery:

- community list CTR to detail page
- event list CTR to RSVP page
- source-wise traffic conversion

Application conversion:

- community join submission rate
- RSVP completion rate
- waitlist promotion rate
- sponsor/partner registration completion rate
- job apply conversion rate

Operations quality:

- median review turnaround by application type
- rejection reason distribution
- RSVP duplicate/fraud block rate
- notification delivery success rate

Outcome metrics:

- submission completion rate for approved hackathon users
- judging publish latency
- certificate issuance success rate
- hiring opt-in adoption and talent profile engagement

These metrics ensure the website module is complete, measurable, and aligned with CommDesk product goals.
