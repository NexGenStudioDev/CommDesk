# CommDesk Sponsor & Partner Management System

## Overview

This document defines the complete Sponsor and Partner Management System for CommDesk.

It is designed for CommDesk's multi-surface architecture:

- Organizer Desktop
- Sponsor Desktop
- Partner Desktop
- Judge Desktop
- Team Member Desktop
- Participant React Website

The goal is to solve a real ecosystem problem:

- communities struggle to find sponsors
- companies struggle to reach developer communities
- partnerships are managed manually and get lost after one event

CommDesk should become:

```text
Global Sponsor and Partner Marketplace for Developer Communities
```

This document is aligned with current CommDesk code and docs.

Current code alignment already exists in:

- the `Partners & Sponsors` panel inside the event creation UI
- sponsor and partner category constants in the Events feature
- community roles like `Partnerships Lead`, `Sponsorship Lead`, and `Industry Relations Lead`

Related documents:

- [CommDesk Event System](./CommDesk-Event-System.md)
- [CommDesk Participant Platform System](./CommDesk-Participant-Platform-System.md)
- [CommDesk Judging System](./CommDesk-Judging-System.md)
- [CommDesk RSVP System](./CommDesk-RSVP-System.md)
- [CommDesk Member Creation & Onboarding System](./CommDesk-Member-System.md)
- [Community Signup System](./Community-Signup-System.md)

---

# 1. System Vision

CommDesk should not treat sponsors as event-local logos only.

It should treat sponsors and partners as platform-level organizations with long-term relationships.

Core value for communities:

- easier sponsor discovery
- repeatable sponsorship workflows
- stronger event funding
- long-term partnership programs

Core value for sponsors and partners:

- direct access to developer communities
- developer tool adoption
- brand visibility
- hiring pipeline
- measurable ROI

---

# 2. Architecture Goals

The sponsor and partner system must:

- support global sponsor and partner profiles
- support event-level assignments without duplicating organization records
- power the existing event `Partners & Sponsors` UI
- allow verified communities to send sponsorship requests
- allow sponsors to negotiate, accept, reject, or build recurring programs
- support sponsor challenges, resources, workshops, and hiring use cases
- provide analytics and CRM-style relationship tracking

---

# 3. Current Frontend and Code Alignment

The current codebase already exposes sponsor and partner concepts.

## 3.1 Existing Event UI

Current event creation screen already has a `Partners & Sponsors` panel with:

- count badge
- add action
- compact/full state
- category-based visual styling

Current mock categories used in the UI include:

- `Official Partner`
- `Platinum Sponsor`
- `Gold Sponsor`
- `Silver Sponsor`

## 3.2 Existing Event Constants

Current sponsor and partner categories in code already include:

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

Normalized tier keywords already present in code:

```text
title
presenting
co-presenting
diamond
platinum
premier
elite
gold
silver
bronze
knowledge
education
learning
media
press
broadcast
support
associate
contributor
community
ecosystem
partner
official partner
```

Important rule:

- backend must preserve these existing category values so the current UI and badges remain valid

## 3.3 Existing Member Roles and Interests

CommDesk already defines organizer-side roles relevant to this system:

- `Partnerships Lead`
- `Sponsorship Lead`
- `Industry Relations Lead`

It also already defines interest:

- `PARTNERSHIPS & SPONSORSHIPS`

That means the sponsor system should integrate directly with current role governance.

---

# 4. Platform Architecture

Sponsors and partners must exist at platform level first, and event level second.

```text
Platform
  -> Sponsor and Partner Directory
  -> Communities
      -> Events
          -> Event Sponsor Assignments
          -> Sponsor Challenges
          -> Sponsor Resources
          -> Sponsor Workshops
  -> Sponsorship Requests
  -> Sponsor Community Relationships
```

Key architectural rule:

- one sponsor profile can support many communities and many events
- one partner profile can support many communities and many events
- event records should store assignment snapshots, not duplicate full sponsor identity

---

# 5. Sponsor vs Partner Model

CommDesk must support both a shared UI and a clear data distinction.

## Sponsor

Typical sponsor types:

- technology companies
- cloud providers
- AI companies
- startup ecosystems
- hiring partners with prize budgets

Primary sponsor value:

- money
- credits
- prizes
- technology adoption
- hiring pipeline

## Partner

Typical partner types:

- universities
- developer communities
- media platforms
- incubators
- outreach organizations
- venue and ecosystem collaborators

Primary partner value:

- distribution
- community reach
- workshops
- venue access
- mentors and volunteers

## Recommended Storage Model

Because the current UI combines both, use one global profile model with a type discriminator.

```text
entityType = Sponsor | Partner | SponsorAndPartner
```

This keeps the current combined event panel simple while preserving business meaning.

---

# 6. Multi-Surface Integration

## 6.1 Organizer Desktop

Organizer workflows:

- browse sponsor marketplace
- discover partners by region and event type
- send sponsorship requests
- negotiate terms
- assign sponsor categories to event
- configure sponsor benefits, challenges, and workshops

## 6.2 Sponsor Desktop

Sponsor workflows:

- review incoming requests
- manage company profile
- approve or reject sponsorships
- track developer reach and event performance
- run sponsor challenges
- shortlist talent

## 6.3 Partner Desktop

Partner workflows:

- collaborate with communities
- provide promotion, venue, workshops, mentors, or media coverage
- review partnership requests
- maintain recurring partner programs

## 6.4 Judge Desktop

Judge workflows connected to sponsor system:

- see sponsor challenge criteria when assigned to sponsor prizes
- evaluate submissions for sponsor tracks where enabled

Judge desktops should not get sponsor CRM access.

## 6.5 Team Member Desktop and Participant Website

Participants can see:

- sponsor challenges
- sponsor technologies
- sponsor documentation and SDKs
- sponsor workshops
- sponsor prizes
- sponsor hiring opportunities

---

# 7. Global Sponsor and Partner Directory

CommDesk should expose a marketplace-style directory.

Organizer discovery filters:

- industry
- technologies
- supported regions
- event type preference
- budget range
- verification status
- sponsor reputation

Example directory columns:

```text
Company
Industry
Technologies
Regions
Verification
Budget Range
```

Organizer actions:

- view full profile
- send sponsorship request
- save organization
- follow organization

---

# 8. Global Profile System

Every sponsor or partner must have a full platform profile.

## 8.1 Core Fields

- legalName
- displayName
- logoUrl
- website
- entityType
- industry
- description
- technologies[]
- developerTools[]

## 8.2 Opportunity Metadata

- preferredEventTypes[]
- supportedRegions[]
- supportedCommunityTypes[]
- budgetRange
- availableSponsorshipTypes[]
- preferredParticipantSegments[]

## 8.3 Contact and Operations

- contactName
- contactEmail
- contactRole
- businessDevelopmentEmail
- devRelEmail
- hiringEmail

## 8.4 Reputation and Trust

- verificationStatus
- reputationScore
- communitiesSupportedCount
- eventsSponsoredCount
- developersReachedCount

---

# 9. Sponsor and Partner Creation Workflow

To avoid duplicate profiles, CommDesk must support discovery-first creation.

Workflow:

```text
Search organization
  -> if existing profile found, reuse it
  -> if not found, create new global profile
  -> mark as Pending Verification or Community Added
```

Creation sources:

- platform admin
- organizer
- sponsor organization user
- partner organization user

---

# 10. Verification System

Verification statuses:

```text
Verified
Pending Verification
Community Added
Disabled
```

Purpose:

- reduce fake sponsor records
- improve trust for organizers
- improve confidence for communities and participants

Verification checks may include:

- domain ownership
- company website validation
- admin review
- verified contact email

---

# 11. Sponsorship Request Workflow

Organizers should not assign sponsors to events without a request/approval workflow.

## Request Fields

- communityId
- eventId
- eventName
- eventType
- expectedParticipants
- requestedCategory
- requestedBudget
- requestedCurrency
- message
- benefitProposal[]

## Status Flow

```text
Pending
Negotiation
Accepted
Rejected
Withdrawn
Expired
```

Negotiation fields should support:

- counterBudget
- conditions
- notes
- proposedBenefits

---

# 12. Event Sponsor Assignment Layer

This is the layer that powers the current Event UI panel.

Important distinction:

- global organization profile lives in sponsor directory
- event assignment stores the event-specific category, benefit, and visibility snapshot

That means the current event endpoint family can remain:

```text
GET    /api/v1/events/:eventId/partners
POST   /api/v1/events/:eventId/partners
PATCH  /api/v1/events/:eventId/partners/:linkId
DELETE /api/v1/events/:eventId/partners/:linkId
```

But these endpoints should operate on event assignment records backed by global sponsor profiles.

---

# 13. Category and Tier System (Aligned with Code)

Current CommDesk UI already expects sponsor and partner category strings.

Use:

- `displayCategory` for UI labels
- `tierKeyword` for normalized filtering, ordering, and styling

Examples:

```text
displayCategory = Platinum Sponsor
tierKeyword = platinum

displayCategory = Official Partner
tierKeyword = official partner
```

Benefits of this split:

- frontend keeps current labels untouched
- backend gets consistent grouping and search behavior

---

# 14. Sponsor Benefit Manager

Organizers need event-level benefit definitions.

Example benefits:

```text
Logo on homepage
Logo on event page
Keynote slot
Workshop slot
Sponsor challenge
Hiring access
Office hours
Booth visibility
Newsletter mention
Social media mention
```

Benefits should be:

- tier-driven by default
- editable per event assignment

---

# 15. Sponsor Challenge System

Sponsors can attach challenge tracks to an event.

Example:

```text
Best AI Project using OpenAI API
Prize: $2000
```

Challenge fields:

- title
- description
- eligibility
- requirements
- requiredTechnologies[]
- prizeDescription
- judgingCriteria[]
- sponsorId
- eventId
- visibility

Integration rule:

- sponsor challenge judging must integrate with Judging System criteria and public transparency rules

---

# 16. Sponsor Resource Hub

Sponsors can publish event-specific resources.

Resource types:

- documentation links
- SDK links
- tutorial links
- sample projects
- API credits instructions
- coupon codes and onboarding forms

These resources must be visible inside:

- participant website event page
- participant/team workspaces
- sponsor challenge detail pages

---

# 17. Sponsor Workshop System

Sponsors can host learning sessions.

Workshop fields:

- title
- description
- speakerName
- speakerRole
- speakerCompany
- scheduledAt
- meetingUrl
- capacityLimit
- recordingUrl
- sponsorId
- eventId

Participant surfaces:

- event page workshop section
- sponsor challenge detail page
- notification reminders

---

# 18. Sponsor Analytics Dashboard

Sponsors need measurable ROI.

Metrics:

- participants reached
- projects using sponsor technology
- workshop attendance
- sponsor challenge submissions
- profile clicks
- documentation clicks
- resume views or shortlist counts

Example:

```text
Participants Reached: 850
Projects Using OpenAI API: 42
Workshop Attendees: 210
Developers Shortlisted: 18
```

---

# 19. Sponsor Hiring Pipeline

Sponsors may use events as talent discovery channels.

Filters:

- skill
- tech stack
- project score
- leaderboard rank
- sponsor challenge participation
- opt-in to hiring

Important privacy rule:

- participant hiring visibility must always honor explicit participant opt-in from the participant platform

---

# 20. Sponsor CRM and Relationship Tracking

Sponsors and partners need longitudinal relationship tracking.

Example metrics:

```text
Communities Supported
Events Sponsored
Developers Reached
Projects Built with Technology
Workshops Hosted
```

This acts as a developer relations CRM for sponsors and an ecosystem memory for communities.

---

# 21. Partner Ecosystem Model

Partner contributions differ from sponsor contributions.

Partner contribution types:

- promotion
- mentors
- workshops
- venue
- media coverage
- community support

Example partner organizations:

- universities
- media communities
- incubators
- developer chapters

Partners may not always have budget, but can still create major event value.

---

# 22. Recommendation Engine

CommDesk should suggest sponsor and partner matches automatically.

Matching inputs:

- event type
- event category
- participant count
- region
- community reputation
- past sponsor success
- technologies relevant to event tracks

Examples:

```text
AI Hackathon -> OpenAI, Hugging Face, Google AI
Web3 Hackathon -> Polygon, Solana, Chainlink
Cloud Workshop -> AWS, Azure, Google Cloud
```

---

# 23. Communication and Engagement Tools

Sponsors and partners should be able to interact with communities and participants.

Tools:

- announcements
- AMA sessions
- office hours
- sponsor updates
- structured direct messaging where allowed

These should be governed by platform moderation and spam rules.

---

# 24. Long-Term Programs

CommDesk must support recurring programs, not only one-off deals.

Example:

```text
OpenAI AI Innovation Program
```

Long-term program support:

- multiple communities
- multiple events
- recurring sponsor benefits
- annual or quarterly reporting

---

# 25. Database Design (Recommended)

## 25.1 SponsorPartnerOrganization

```ts
SponsorPartnerOrganization
{
 _id: ObjectId

 legalName: String
 displayName: String

 entityType:
   "Sponsor"
   | "Partner"
   | "SponsorAndPartner"

 logoUrl: String
 website: String

 industry: String
 description: String

 technologies: [String]
 developerTools: [String]

 preferredEventTypes: [String]
 supportedRegions: [String]
 supportedCommunityTypes: [String]

 budgetRange:
 {
  min: Number
  max: Number
  currency: String
 }

 availableSponsorshipTypes: [String]

 verificationStatus:
   "Verified"
   | "Pending Verification"
   | "Community Added"
   | "Disabled"

 reputationScore: Number

 contact:
 {
  primaryName: String
  primaryEmail: String
  primaryRole: String
  devRelEmail: String
  hiringEmail: String
 }

 createdBy: ObjectId
 createdAt: Date
 updatedAt: Date
}
```

Recommended indexes:

- unique on normalized website domain
- text index on `displayName`, `industry`, `technologies`
- index on `entityType`, `verificationStatus`

## 25.2 SponsorshipRequest

```ts
SponsorshipRequest
{
 _id: ObjectId

 communityId: ObjectId
 eventId: ObjectId
 organizationId: ObjectId

 requestedByUserId: ObjectId

 eventName: String
 eventType: String
 expectedParticipants: Number

 requestedCategory: String
 requestedBudget: Number
 requestedCurrency: String

 message: String
 benefitProposal: [String]

 status:
   "Pending"
   | "Negotiation"
   | "Accepted"
   | "Rejected"
   | "Withdrawn"
   | "Expired"

 negotiation:
 {
  counterBudget: Number
  counterCurrency: String
  terms: [String]
  notes: String
 }

 createdAt: Date
 updatedAt: Date
}
```

## 25.3 EventSponsorAssignment

```ts
EventSponsorAssignment
{
 _id: ObjectId

 communityId: ObjectId
 eventId: ObjectId
 organizationId: ObjectId

 entityType:
   "Sponsor"
   | "Partner"
   | "SponsorAndPartner"

 displayNameSnapshot: String
 logoUrlSnapshot: String
 websiteSnapshot: String

 displayCategory: String
 tierKeyword: String

 benefits: [String]

 visibility:
 {
  showOnEventPage: Boolean
  showOnParticipantWebsite: Boolean
  showOnCertificates: Boolean
 }

 hiringEnabled: Boolean

 createdFromRequestId: ObjectId
 createdBy: ObjectId
 createdAt: Date
 updatedAt: Date
}
```

Important rule:

- `displayCategory` must be one of the existing event sponsor or partner category values already used by the current frontend

## 25.4 SponsorChallenge

```ts
SponsorChallenge
{
 _id: ObjectId

 eventId: ObjectId
 communityId: ObjectId
 organizationId: ObjectId

 title: String
 description: String
 eligibility: String

 requirements: [String]
 requiredTechnologies: [String]

 prizeDescription: String
 judgingCriteria: [String]

 isPublished: Boolean

 createdAt: Date
 updatedAt: Date
}
```

## 25.5 SponsorResource

```ts
SponsorResource
{
 _id: ObjectId

 eventId: ObjectId
 organizationId: ObjectId

 title: String
 resourceType: String
 url: String
 description: String

 createdAt: Date
 updatedAt: Date
}
```

## 25.6 SponsorWorkshop

```ts
SponsorWorkshop
{
 _id: ObjectId

 eventId: ObjectId
 organizationId: ObjectId

 title: String
 description: String
 speakerName: String
 speakerRole: String
 speakerCompany: String

 scheduledAt: Date
 meetingUrl: String
 recordingUrl: String

 createdAt: Date
 updatedAt: Date
}
```

## 25.7 SponsorRelationshipSummary (Optional Cached CRM View)

```ts
SponsorRelationshipSummary
{
 _id: ObjectId

 organizationId: ObjectId
 communityId: ObjectId

 eventsSupported: Number
 developersReached: Number
 projectsBuilt: Number
 workshopsHosted: Number

 lastEngagementAt: Date
 updatedAt: Date
}
```

---

# 26. Zod Validation Rules

Backend should validate:

- `entityType` must be allowed enum value
- `website` must be valid URL when present
- `displayCategory` must match existing supported category list
- `tierKeyword` must match normalized tier values
- no accepted sponsorship without organization profile
- no event sponsor assignment without accepted request unless admin override is used
- only approved or active communities can send sponsorship requests

---

# 27. API Contract

## 27.1 Global Directory APIs

```text
GET    /api/v1/sponsor-directory
GET    /api/v1/sponsor-directory/:organizationId
POST   /api/v1/sponsor-directory
PATCH  /api/v1/sponsor-directory/:organizationId
POST   /api/v1/sponsor-directory/:organizationId/verify
```

Recommended query filters:

```text
entityType
industry
technology
region
eventType
verificationStatus
budgetMin
budgetMax
search
page
limit
```

## 27.2 Sponsorship Request APIs

```text
POST   /api/v1/sponsorship-requests
GET    /api/v1/sponsorship-requests
GET    /api/v1/sponsorship-requests/:requestId
PATCH  /api/v1/sponsorship-requests/:requestId/accept
PATCH  /api/v1/sponsorship-requests/:requestId/reject
PATCH  /api/v1/sponsorship-requests/:requestId/negotiate
PATCH  /api/v1/sponsorship-requests/:requestId/withdraw
```

## 27.3 Event Sponsor Assignment APIs

These should back the current event `Partners & Sponsors` panel.

```text
GET    /api/v1/events/:eventId/partners
POST   /api/v1/events/:eventId/partners
PATCH  /api/v1/events/:eventId/partners/:linkId
DELETE /api/v1/events/:eventId/partners/:linkId
```

## 27.4 Sponsor Challenge APIs

```text
GET    /api/v1/events/:eventId/sponsor-challenges
POST   /api/v1/events/:eventId/sponsor-challenges
PATCH  /api/v1/events/:eventId/sponsor-challenges/:challengeId
DELETE /api/v1/events/:eventId/sponsor-challenges/:challengeId
```

## 27.5 Sponsor Resource APIs

```text
GET    /api/v1/events/:eventId/sponsor-resources
POST   /api/v1/events/:eventId/sponsor-resources
PATCH  /api/v1/events/:eventId/sponsor-resources/:resourceId
DELETE /api/v1/events/:eventId/sponsor-resources/:resourceId
```

## 27.6 Sponsor Workshop APIs

```text
GET    /api/v1/events/:eventId/sponsor-workshops
POST   /api/v1/events/:eventId/sponsor-workshops
PATCH  /api/v1/events/:eventId/sponsor-workshops/:workshopId
DELETE /api/v1/events/:eventId/sponsor-workshops/:workshopId
```

## 27.7 Sponsor Analytics and Hiring APIs

```text
GET /api/v1/sponsors/:organizationId/analytics
GET /api/v1/sponsors/:organizationId/communities
GET /api/v1/sponsors/:organizationId/talent
```

---

# 28. Access Control

Organizer-side roles allowed to manage sponsor workflows:

- `Organizer`
- `Community Lead`
- `Partnerships Lead`
- `Sponsorship Lead`
- `Industry Relations Lead`

Sponsor-side roles:

- `Sponsor Admin`
- `Sponsor Manager`
- `Developer Relations Manager`
- `Hiring Manager`

Partner-side roles:

- `Partner Admin`
- `Partnership Manager`

---

# 29. Anti-Spam and Trust Controls

Important protections:

- only verified or approved communities can send sponsorship requests
- request rate limits per community
- duplicate request suppression for same event and same organization
- reputation-weighted request quality scoring
- sponsor inbox filtering by community credibility and past event success

Recommended examples:

```text
Max 10 open sponsorship requests per community
Max 3 repeated requests to same organization in 30 days
Only approved or active communities can message verified sponsors
```

---

# 30. Integration with Existing CommDesk Docs

## Event System Integration

- current `Partners & Sponsors` event panel becomes the event assignment layer
- event-level partner APIs should manage `EventSponsorAssignment` records backed by global profiles
- current category values from event constants must stay unchanged

## Participant Platform Integration

- sponsor challenges, resources, workshops, and hiring visibility power the participant website sponsor ecosystem module
- participant profile hiring opt-in controls must gate sponsor talent access

## Judging System Integration

- sponsor challenge judging criteria may extend event judging workflows
- sponsor prize visibility must obey judging transparency settings

## Member System Integration

- organizer-side sponsor managers use existing community roles
- sponsor and partner representatives use the shared user/auth system

## Community Signup Integration

- only approved or active communities should unlock full sponsor marketplace access

---

# 31. Important Fields Checklist

Do not ship without these sponsor system fields.

1. Organization identity:

- `organizationId`
- `entityType`
- `displayName`
- `website`
- `verificationStatus`

2. Event assignment:

- `eventId`
- `displayCategory`
- `tierKeyword`
- `benefits[]`
- visibility flags

3. Request workflow:

- `communityId`
- `requestedBudget`
- `status`
- negotiation notes

4. Sponsor activation value:

- `technologies[]`
- `developerTools[]`
- sponsor challenges
- workshops
- resources

5. Trust and operations:

- audit metadata
- request rate limiting
- duplicate suppression
- analytics snapshots

---

# 32. Weak Points If Missed

1. No global organization directory:

- duplicate sponsor records will spread across events.

2. No separation between global profile and event assignment:

- every event will re-enter the same sponsor data manually.

3. No verification flow:

- fake company profiles reduce trust.

4. No request throttling:

- sponsors get spammed and abandon the platform.

5. No category compatibility with current code:

- existing event UI badges and labels will drift from backend data.

6. No sponsor analytics:

- companies cannot measure ROI and will not renew.

7. No hiring privacy controls:

- participant trust and compliance risk increase.

8. No CRM layer:

- long-term partnerships become impossible to manage.

9. No sponsor challenge integration:

- sponsor tech adoption value remains weak.

10. No approved-community gate:

- marketplace quality degrades fast.

---

# 33. Final Architecture

```text
Global Sponsor and Partner Directory
  -> SponsorPartnerOrganization
  -> SponsorshipRequest
  -> EventSponsorAssignment
      -> SponsorChallenge
      -> SponsorResource
      -> SponsorWorkshop
  -> SponsorRelationshipSummary
  -> Sponsor Analytics
  -> Hiring Pipeline

Consumed by:
  -> Organizer Desktop
  -> Sponsor Desktop
  -> Partner Desktop
  -> Participant Website
  -> Team Member Desktop
```

---

# 34. Final Result

This system turns CommDesk from an event tool into a sponsorship ecosystem.

Delivered value:

- communities can discover and request sponsors inside the platform
- sponsors can manage ROI, outreach, and hiring in one place
- partners can collaborate across communities and events
- participants can access sponsor challenges, resources, workshops, and hiring opportunities
- current CommDesk event UI can scale from mock event sponsors to a real global marketplace
