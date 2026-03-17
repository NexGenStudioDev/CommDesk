# CommDesk Sponsor & Partner Marketplace System

## Overview

This document defines the end-to-end Sponsor and Partner Marketplace for CommDesk.

It is aligned with current project docs and source code:

- `docs/CommDesk-Event-System.md`
- `docs/CommDesk-Member-System.md`
- `docs/CommDesk-Participant-Platform-System.md`
- `docs/CommDesk-Judging-System.md`
- `docs/CommDesk-RSVP-System.md`
- `docs/Community-Signup-System.md`
- `src/features/Events/v1/Constants/Event.constant.ts`
- `src/features/Events/v1/Components/Partners_And_Sponsors.tsx`
- `src/features/AddMember/v1/Constant/Role.constant.ts`
- `src/features/AddMember/v1/Constant/Interest.constant.ts`

This is a 0 -> MONSTER specification, but grounded in the current CommDesk baseline and practical implementation phases.

---

# 0. What You Are Building

```text
A global platform where sponsors and communities discover, connect, collaborate, and grow in one place.
```

This replaces fragmented workflows like forms, cold outreach, and manual deal tracking.

---

# 1. Core Goal

```text
Make CommDesk the default platform for sponsorships in developer communities.
```

---

# 2. Core Model

Three primary business entities:

1. Sponsors and Partners (organizations)
2. Communities (organizer workspaces)
3. Events (hackathons, workshops, meetups, etc.)

Platform rule:

- organizations are global records
- event sponsor entries are event-level assignments
- one organization can support many communities and many events

---

# 3. Key Concepts

Core identity model (aligned with Member and Signup docs):

```text
User -> login/auth account
Organization -> sponsor or partner company/profile
Member -> community-scoped role
Event -> actual program
```

Important relationship:

```text
One User can belong to multiple communities via Member records.
```

---

# 4. Current Codebase Baseline (Important)

This is what already exists in repository code today.

## 4.1 Event UI already has Partners and Sponsors panel

From `src/features/Events/v1/Components/Partners_And_Sponsors.tsx`:

- panel with count badge
- `Add` action button
- expand/collapse via `Hide` and `View`
- cards rendered with category-based styling

## 4.2 Category and tier constants already exist

From `src/features/Events/v1/Constants/Event.constant.ts`:

- `SPONSOR_CATEGORY`
- `PARTNER_CATEGORY`
- `PARTNERS_AND_SPONSORS_TIER`
- `PARTNERS_AND_SPONSORS_CATEGORY`

These values are currently the source-of-truth labels for event UI and should be preserved by backend validation.

## 4.3 Existing community role and interest alignment

From `src/features/AddMember/v1/Constant/Role.constant.ts`:

- `Partnerships Lead`
- `Sponsorship Lead`
- `Industry Relations Lead`

From `src/features/AddMember/v1/Constant/Interest.constant.ts`:

- `PARTNERSHIPS & SPONSORSHIPS`

## 4.4 Practical implementation reality

Today, sponsor and partner records in the event panel are frontend mock data.

This doc defines the production architecture to move from UI-only data to a global marketplace with requests, deals, contracts, payments, and analytics.

---

# 5. Platform Architecture

```text
Global Marketplace
  -> Organization Directory
  -> Opportunities
  -> Requests
  -> Negotiations
  -> Deals
  -> Contracts
  -> Payments
  -> Analytics
  -> Hiring

Connected to:
  -> Event System
  -> Member System
  -> Participant Platform
  -> Judging System
  -> RSVP System
```

Design principles:

- global profile first, event assignment second
- no duplicate organization records per event
- full auditability for requests, negotiation, and payment state changes
- role-gated access per community and organization

---

# 6. Sponsor and Partner Onboarding

## 6.1 Apply

Route:

```text
/become-sponsor
```

Required input:

- company name
- logo
- website
- official email
- industry
- budget range
- sponsorship type

## 6.2 Verification checks

System checks:

- organization legitimacy
- domain and email consistency
- duplicate domain/profile detection
- trust and spam signals

Verification states:

```text
Pending Verification
Verified
Community Added
Disabled
```

## 6.3 Account creation

Create:

- User account(s)
- Organization profile
- default organization role assignment

## 6.4 Email and first login

Security alignment with Member/Signup docs:

- do not send plain temporary passwords
- send secure activation/reset link
- enforce password setup during first login

Activation outcome:

```text
Organization status -> Active
```

---

# 7. Organization Profile (Complete)

## 7.1 Identity

- legalName
- displayName
- logoUrl
- website
- industry
- shortDescription
- longDescription

## 7.2 Capability and fit

- technologies[]
- developerTools[]
- supportedRegions[]
- preferredEventTypes[]
- supportedCommunityTypes[]
- budgetRange
- availableSponsorshipTypes[]

## 7.3 Contacts

- primaryEmail
- businessEmail
- devRelEmail
- hiringEmail
- billingEmail

## 7.4 Trust and performance

- verificationStatus
- reputationScore
- communitiesSupportedCount
- eventsSponsoredCount
- developersReachedCount

---

# 8. Community Use Cases and Workflow

Communities can:

- create events
- create sponsorship opportunities
- send outbound sponsor requests
- receive inbound sponsor applications
- negotiate and finalize deals
- track fulfillment and outcomes

Core use cases:

1. Community outbound request:

```text
Community creates event -> sends request to sponsor -> negotiates -> closes deal
```

1. Sponsor inbound application:

```text
Sponsor browses opportunities -> applies -> community accepts -> sponsor assigned to event
```

1. Recurring partner program:

```text
Organization creates long-term program -> supports multiple communities/events over time
```

---

# 9. Sponsorship Opportunity (Critical)

Each opportunity is linked to an event.

Example:

```text
HackFest 2026
500 participants
Looking for Platinum Sponsor
Budget: INR 5L
Benefits: logo, workshop, hiring access
```

Opportunity includes:

- event snapshot
- desired sponsor category
- requested budget range
- offered benefits
- timeline and decision deadline

---

# 10. Two-Way Marketplace

Two symmetric paths must be supported.

## 10.1 Community -> Sponsor

- discover organizations
- send request
- sponsor responds

## 10.2 Sponsor -> Community

- browse opportunities
- apply
- community accepts/rejects

---

# 11. Sponsor Inbox

Sponsor workspace inbox should include:

- incoming requests
- submitted applications
- active negotiations
- accepted deals
- historical contracts

Inbox filters:

- status
- event type
- region
- budget band
- community reputation

---

# 12. Negotiation System

Negotiation must support:

- budget counter offers
- benefit edits
- term edits
- threaded messages
- multi-step revision history

Suggested status flow:

```text
Pending -> Negotiation -> Accepted | Rejected | Withdrawn | Expired
```

---

# 13. Deal and Contract System

After negotiation acceptance:

```text
Deal accepted -> Contract generated -> Both sides sign
```

Contract snapshot should include:

- final amount and currency
- deliverables and benefits
- SLA and timelines
- cancellation and dispute terms
- signatures and signed timestamps

Suggested contract statuses:

```text
Draft -> PendingSignature -> Signed -> Completed | Cancelled | Disputed
```

---

# 14. Payment System and Escrow

Recommended flow:

```text
Sponsor -> CommDesk escrow -> Community
```

Payment features:

- invoice generation
- platform fee calculation
- escrow hold
- payout release on milestone or event completion
- refund/dispute handling

Suggested statuses:

```text
Initiated -> InEscrow -> Released | Refunded | Failed | Disputed
```

Note:

- payment gateway integration is a backend roadmap item
- no production payment module exists in current source yet

---

# 15. Reputation and Trust System

Reputation should be computed for both organizations and communities.

Inputs:

- deal success rate
- response speed
- completion quality
- review rating
- dispute frequency

Used for:

- ranking
- trust scoring
- marketplace filtering
- spam/fraud control

---

# 16. Smart Matching

Matching signals:

- event type and category
- participant scale
- region
- tech stack relevance
- historical sponsorship outcomes

Examples:

```text
AI event -> AI companies
Web event -> frontend and devtools companies
Cloud event -> AWS, Azure, GCP aligned sponsors
```

---

# 17. Event Integration (Must Stay Code-Compatible)

Sponsors and partners must appear in events with:

- logo
- category label
- website

Event assignment layer uses existing event APIs from Event System docs:

```text
GET    /api/v1/events/:eventId/partners
POST   /api/v1/events/:eventId/partners
PATCH  /api/v1/events/:eventId/partners/:linkId
DELETE /api/v1/events/:eventId/partners/:linkId
```

Category compatibility rule:

- backend must accept current category labels from `SPONSOR_CATEGORY` and `PARTNER_CATEGORY`
- backend must map to normalized tier keywords from `PARTNERS_AND_SPONSORS_TIER`

Current category labels in code:

```text
Title Sponsor
Presenting Sponsor
Co-Presenting Sponsor
Diamond Sponsor
Platinum Sponsor
Premier Sponsor
Elite Sponsor
Gold Sponsor
Silver Sponsor
Bronze Sponsor
Knowledge Sponsor
Education Sponsor
Learning Sponsor
Media Sponsor
Press Sponsor
Broadcast Sponsor
Support Sponsor
Associate Sponsor
Contributor Sponsor
Community Sponsor
Ecosystem Sponsor
Official Partner
Community Partner
Ecosystem Partner
Knowledge Partner
Media Partner
Support Partner
Associate Partner
Strategic Partner
Innovation Partner
Technology Partner
Outreach Partner
Venue Partner
```

---

# 18. Sponsor Benefit Manager

Event-level benefits should be configurable per sponsor assignment.

Benefit examples:

- logo placement
- keynote/workshop slot
- booth
- social promotion
- newsletter mention
- hiring access

Behavior:

- default by tier
- editable per deal
- tracked for fulfillment status

---

# 19. Sponsor Event Features

## 19.1 Sponsor Challenges

```text
Build using sponsor technology and win sponsor prize.
```

Integrated with Judging System criteria and transparency settings.

## 19.2 Sponsor Workshops

- live sessions
- speaker metadata
- attendance tracking
- recording links

## 19.3 Sponsor Resources

- docs
- SDK links
- sample repos
- onboarding credits and coupons

## 19.4 Sponsor Hiring

- talent search against participant opt-in
- filters by skill, project score, track, and challenge participation

---

# 20. Participant Experience

Participants should see:

- sponsor logos and categories
- sponsor challenges and prizes
- workshops and resources
- sponsor job opportunities

Privacy rule:

- hiring visibility requires explicit participant opt-in from Participant Platform settings

---

# 21. Analytics

Sponsor analytics should include:

- participants reached
- projects built with sponsor technology
- workshop registrations and attendance
- challenge submissions and winners
- profile and resource clicks
- hiring funnel metrics

Community analytics should include:

- sponsor response rates
- deal conversion rates
- sponsor retention by quarter
- fulfilled vs missed benefit ratio

---

# 22. Long-Term Programs

Support recurring programs across many communities/events.

Example:

```text
AI Program -> 10 communities -> 50 events
```

Program capabilities:

- reusable templates for benefits/contracts
- annual/quarterly budget allocation
- multi-event reporting

---

# 23. Data Model and Collections

Core collections:

```text
Users
Organizations
Members
Events
Opportunities
Requests
Negotiations
Deals
Contracts
Payments
Challenges
Workshops
Resources
Analytics
Reputation
Programs
```

Recommended additional collections:

```text
OrganizationMembers
SponsorInboxThread
ContractSignature
PaymentLedger
AuditLog
```

## 23.1 Key schema notes

1. `Organizations`:

- unique normalized domain index
- index on `entityType`, `verificationStatus`
- text index on `displayName`, `industry`, `technologies`

1. `EventSponsorAssignment`:

- stores event snapshot fields (`displayNameSnapshot`, `logoUrlSnapshot`, `websiteSnapshot`)
- stores `displayCategory` and `tierKeyword`
- stores `benefits[]` and visibility flags

1. `Requests/Negotiations/Deals`:

- immutable audit timeline
- actor identity on each state change

1. `Contracts`:

- references final deal
- stores signed document hash and signature metadata

1. `Payments`:

- stores invoice, fee, escrow, payout, and dispute metadata

---

# 24. Security and Governance

Required controls:

- verified sponsors for trusted routes
- rate limiting on requests/messages
- duplicate request suppression
- spam and abuse detection
- role-based access control
- audit logging on all state transitions
- signed URL policy for private assets
- encrypted sensitive fields

Community gate (from Signup docs):

- only approved/active communities can fully use marketplace outreach

---

# 25. Roles and Access

## 25.1 Community side

- Organizer
- Partnerships Lead
- Sponsorship Lead
- Industry Relations Lead

## 25.2 Sponsor side

- Sponsor Admin
- Sponsor Manager
- DevRel Manager
- Hiring Manager

## 25.3 Partner side

- Partner Admin
- Partnership Manager

## 25.4 Judge and participant constraints

- judges can access sponsor challenge judging context only
- participants can access public sponsor content and opted-in hiring surfaces

---

# 26. API Contract (Codebase-Aligned)

Use `/api/v1` prefix to align with other CommDesk system docs.

## 26.1 Sponsor onboarding and directory

```text
POST   /api/v1/sponsors/apply
GET    /api/v1/sponsors
GET    /api/v1/sponsors/:organizationId
GET    /api/v1/sponsors/dashboard
PATCH  /api/v1/sponsors/:organizationId
POST   /api/v1/sponsors/:organizationId/verify
```

## 26.2 Opportunities

```text
POST   /api/v1/opportunities
GET    /api/v1/opportunities
GET    /api/v1/opportunities/:opportunityId
POST   /api/v1/opportunities/:opportunityId/apply
```

## 26.3 Requests and negotiations

```text
POST   /api/v1/requests
GET    /api/v1/requests
GET    /api/v1/requests/:requestId
PATCH  /api/v1/requests/:requestId/accept
PATCH  /api/v1/requests/:requestId/reject
PATCH  /api/v1/requests/:requestId/negotiate
PATCH  /api/v1/requests/:requestId/withdraw
POST   /api/v1/negotiations/message
```

## 26.4 Deals and contracts

```text
POST   /api/v1/deals
GET    /api/v1/deals/:dealId
POST   /api/v1/contracts
GET    /api/v1/contracts/:contractId
POST   /api/v1/contracts/:contractId/sign
```

## 26.5 Event sponsor assignment (existing event integration)

```text
POST   /api/v1/events/:eventId/sponsors
GET    /api/v1/events/:eventId/sponsors
GET    /api/v1/events/:eventId/partners
POST   /api/v1/events/:eventId/partners
PATCH  /api/v1/events/:eventId/partners/:linkId
DELETE /api/v1/events/:eventId/partners/:linkId
```

## 26.6 Event sponsor modules

```text
GET    /api/v1/events/:eventId/sponsor-challenges
POST   /api/v1/events/:eventId/sponsor-challenges
GET    /api/v1/events/:eventId/sponsor-workshops
POST   /api/v1/events/:eventId/sponsor-workshops
GET    /api/v1/events/:eventId/sponsor-resources
POST   /api/v1/events/:eventId/sponsor-resources
```

## 26.7 Payments and analytics

```text
POST   /api/v1/payments
GET    /api/v1/payments/:paymentId
GET    /api/v1/analytics/sponsors
GET    /api/v1/sponsors/:organizationId/analytics
GET    /api/v1/sponsors/:organizationId/talent
```

---

# 27. End-to-End Flow

## 27.1 Sponsor flow

```text
Apply -> Verified -> Dashboard
-> Browse opportunities / receive requests
-> Negotiate -> Accept -> Deal -> Contract -> Pay
-> Run event modules (challenge/workshop/resources)
-> Track analytics -> Hire -> Renew
```

## 27.2 Community flow

```text
Create event -> Create opportunity
-> Send requests / receive sponsor applications
-> Negotiate and finalize deal
-> Assign sponsor category to event
-> Deliver benefits -> Close report -> Build long-term relationship
```

---

# 28. Growth Loop

```text
More sponsors -> more opportunities
More opportunities -> more communities
More communities -> more data
More data -> better matching
Better matching -> more successful deals
```

---

# 29. Implementation Plan (0 -> MONSTER)

## Phase 0: Stabilize current event panel

- persist event sponsor assignments using existing event partner APIs
- enforce category compatibility with source constants
- replace mock card data with API-backed data

## Phase 1: Marketplace core

- organization onboarding and verification
- global directory and opportunity listing
- two-way request and inbox workflows
- negotiation states and messaging

## Phase 2: Deal closure

- deal objects
- contract generation and e-sign
- sponsor benefit fulfillment tracking

## Phase 3: Money and trust

- escrow and payout workflow
- invoices and platform fees
- reputation scoring and anti-spam ranking

## Phase 4: Ecosystem scale

- AI matching
- long-term sponsor programs
- advanced analytics and hiring pipelines

---

# 30. Final Result

CommDesk becomes global infrastructure for sponsorships, partnerships, and developer ecosystem growth.

Final truth:

```text
You are not building one feature.
You are building a marketplace, an ecosystem, and a revenue engine.
```

One line:

```text
CommDesk = the place where sponsors and developer communities connect, collaborate, and grow.
```
