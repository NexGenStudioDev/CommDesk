# CommDesk Participant Platform System (React Website)

## Overview

This document defines the complete participant-side platform for CommDesk, built as a React web application.

It is not the organizer desktop workflow.

Primary objective:

- help participants discover events
- form teams
- build and submit projects
- get judged transparently
- earn reputation and opportunities

Core vision:

```text
Discover -> Apply -> Join Team -> Build -> Submit -> Get Judged -> Earn Reputation -> Get Hired
```

CommDesk target position:

```text
Devfolio + GitHub Portfolio + LinkedIn for Hackathons
```

---

# 1. Product Philosophy

Participants should feel they are building a long-term developer identity, not filling one-time forms.

The platform must optimize for:

- trust (transparent process)
- fairness (clear rules and anti-manipulation)
- growth (portfolio, skills, reputation)
- opportunities (sponsor tracks and hiring)

---

# 2. Scope (Participant Website Modules)

The participant platform includes these modules:

1. Developer Identity
2. Hackathon Discovery
3. Event Participation and RSVP
4. Team Discovery and Team Formation
5. Project Submission
6. Transparent Judging View
7. Public Project Showcase
8. Leaderboards
9. Reputation and Achievements
10. Sponsor Ecosystem
11. Hiring and Talent Discovery
12. Community Interaction
13. Learning and Resources
14. Notifications
15. Certificates
16. Security and Anti-Cheating
17. Participant Analytics

---

# 3. React Website Architecture

This website should be implemented as a React app (TypeScript recommended).

## 3.1 Frontend Stack

```text
React
React Router
TypeScript
TanStack Query
Zod
Tailwind CSS
React Hook Form
```

Optional:

```text
Zustand (UI/session state)
Sentry (error monitoring)
PostHog (product analytics)
```

## 3.2 App Layers

```text
src/
  app/
    router/
    providers/
  modules/
    builders/
    hackathons/
    rsvp/
    teams/
    submissions/
    judging/
    leaderboard/
    reputation/
    sponsors/
    talent/
    community/
    learning/
    notifications/
    certificates/
  shared/
    api/
    ui/
    hooks/
    utils/
    types/
```

## 3.3 Data Access Pattern

- all server data through TanStack Query
- strict DTO validation with Zod at API boundary
- optimistic updates only for safe actions (upvote, join request status changes)
- retry and error policy standardized across modules

---

# 4. Route Map (Participant Website)

```text
/                               -> Home
/hackathons                     -> Discovery listing
/hackathons/:slug               -> Event detail
/hackathons/:eventId/rsvp       -> RSVP / application
/hackathons/:eventId/teams      -> Team discovery
/hackathons/:eventId/find-teammates -> Teammate finder
/hackathons/:eventId/submission -> Submission workspace
/hackathons/:eventId/projects   -> Public project gallery
/hackathons/:eventId/judging    -> Public judging view
/hackathons/:eventId/leaderboard -> Leaderboard
/builders/:username             -> Public builder profile
/talent                         -> Talent discovery (recruiter-facing, access controlled)
/notifications                  -> Notification center
/certificates                   -> Certificates vault
/settings/profile               -> Account and profile settings
```

---

# 5. Developer Identity System

Route:

```text
/builders/:username
```

## 5.1 Profile Fields

Important fields:

- fullName
- username
- avatarUrl
- bio
- location
- university
- degree
- graduationYear
- experienceLevel

## 5.2 Developer Links

- githubUrl
- linkedinUrl
- portfolioUrl
- xTwitterUrl
- resumeUrl

## 5.3 Skills and Interests

- skills[]
- preferredTracks[]
- openToTeamInvite
- openToHiring

## 5.4 Builder Stats

- hackathonsJoined
- projectsSubmitted
- wins
- averageScore
- followers
- reputationPoints

## 5.5 Builder Portfolio

- project cards
- participation history
- achievements and certificates

---

# 6. Hackathon Discovery Engine

Route:

```text
/hackathons
```

## 6.1 Filters

- online/offline/hybrid
- beginner friendly
- domain tags (AI, Web3, FinTech, Climate, Health)
- student only / university only
- registration open only

## 6.2 Sorting

- trending
- most participants
- highest prize pool
- ending soon
- newest

## 6.3 Card Data Contract

Each card should include:

- coverImageUrl
- title
- hostCommunityName
- prizePool
- participantCount
- registrationDeadline
- tags[]
- status
- applyButtonState

---

# 7. Hackathon Event Page

Route:

```text
/hackathons/:slug
```

Sections:

- overview
- problem statements and tracks
- timeline
- prizes and sponsor challenges
- judges and mentors
- participants count
- project gallery preview

Important timeline fields:

- registrationOpenAt
- teamFormationDeadline
- submissionDeadline
- judgingStartAt
- judgingEndAt
- winnersAnnouncedAt

---

# 8. RSVP and Application Module

Route:

```text
/hackathons/:eventId/rsvp
```

This module must reuse the RSVP contracts already defined in:

- [CommDesk RSVP System](./CommDesk-RSVP-System.md)

Key statuses:

```text
Pending
Approved
Rejected
Waitlisted
Cancelled
```

Important fields:

- registrationType (Solo/Team)
- leader identity and contact
- team details (if team)
- consent flags with policy versions
- custom question responses

Anti-spam recommendations:

- profile completeness score
- CAPTCHA + rate limits
- duplicate email/mobile checks

---

# 9. Team Discovery and Formation

## 9.1 Team Discovery

Route:

```text
/hackathons/:eventId/teams
```

Team card fields:

- teamName
- memberCount and maxTeamSize
- leader
- techStack
- projectIdea
- openRoles
- requestToJoin CTA

## 9.2 Team Formation Actions

Participants can:

- create team
- send join request
- accept/reject incoming request (team leader)
- invite members
- leave team (with restrictions near deadlines)

## 9.3 Join Request Payload

```json
{
  "eventId": "evt_123",
  "teamId": "team_456",
  "message": "I can help with backend and deployment.",
  "skills": ["Node.js", "MongoDB", "DevOps"],
  "githubUrl": "https://github.com/user",
  "portfolioUrl": "https://user.dev"
}
```

---

# 10. Teammate Finder

Route:

```text
/hackathons/:eventId/find-teammates
```

Listing fields:

- builder profile summary
- skills
- experience level
- preferred role
- availability
- timezone
- lookingForTeam flag

Teams can send invites directly from this page.

---

# 11. Project Submission Module

Route:

```text
/hackathons/:eventId/submission
```

## 11.1 Required Fields

- projectName
- shortDescription
- problemStatement
- solution
- techStack[]
- repositoryUrl
- demoUrl
- videoUrl

## 11.2 Recommended Fields

- presentationUrl
- screenshots[]
- architectureDiagramUrl
- installationSteps
- sponsorTrackSelections[]

## 11.3 Advanced UX

- import README from GitHub
- auto-detect tech stack from repo
- draft auto-save
- pre-submit validation checklist

---

# 12. Public Project Showcase

Route:

```text
/hackathons/:eventId/projects
```

Project card fields:

- projectName
- teamName
- track
- techStack
- github
- demo
- upvotes
- awardsBadges

Important product rule:

- projects remain publicly visible after event completion (unless policy violation)

---

# 13. Transparent Judging View

Route:

```text
/hackathons/:eventId/judging
```

This module must consume judging visibility policies from:

- [CommDesk Judging System](./CommDesk-Judging-System.md)

Public content (when enabled):

- judges
- criteria and weights
- per-judge score breakdown
- public feedback
- final averages

Respect event judging settings:

- mode: private/transparent
- showJudgeNames
- showFeedback
- publishTiming

---

# 14. Leaderboard Module

Route:

```text
/hackathons/:eventId/leaderboard
```

Columns:

- rank
- team
- project
- weightedAverageScore
- judgeCount

Ranking and tie-break logic must match Judging System rules.

Optional behavior:

- real-time updates during active judging rounds

---

# 15. Reputation and Achievement System

Participants gain points for verified actions.

## 15.1 Suggested Point Events

- event joined
- project submitted
- project finalized
- judged score above threshold
- finalist and winner placements
- community contribution actions

## 15.2 Levels

```text
Beginner
Builder
Advanced Builder
Elite Hacker
Legend
```

## 15.3 Achievement Examples

- first_hackathon
- first_submission
- top_10_finish
- best_ai_project
- community_helper

---

# 16. Sponsor Ecosystem (Participant Side)

Features:

- sponsor challenges and track prizes
- sponsor resource hub (APIs, SDKs, docs)
- sponsor office hours/mentorship slots
- sponsor hiring intent flags

Participant-visible fields:

- challenge title
- eligibility
- submission tags required
- judging criteria for sponsor track
- prize details

---

# 17. Hiring and Talent Discovery

Route:

```text
/talent
```

Access control:

- recruiter/employer roles only
- participant opt-in required

Talent search filters:

- skills
- projects and tech stack
- hackathon results
- reputation level
- location and availability

Builder profile should function as a technical resume.

---

# 18. Community Interaction Module

Features:

- event discussion threads
- team chat
- mentor Q&A
- announcements feed

Moderation essentials:

- report abuse
- anti-spam filters
- role-based moderation actions

---

# 19. Learning and Resources

Provide learning content tied to active events:

- preparation guides
- project idea banks
- workshop sessions
- starter kits and templates

Resource taxonomy:

- beginner
- intermediate
- advanced
- track-specific

---

# 20. Notifications Module

Route:

```text
/notifications
```

## 20.1 Trigger Events

- RSVP submitted / status changed
- team invite received / request accepted
- submission deadline reminders
- judging result published
- winner announcement

## 20.2 Channels

- in-app
- email
- push (optional)

## 20.3 Delivery Controls

- per-user preferences
- digest modes
- quiet hours

---

# 21. Certificates Module

Route:

```text
/certificates
```

Certificate types:

- participation
- finalist
- winner
- mentor/judge contribution (if participant profile also has those roles)

Certificate metadata:

- certificateId
- eventId
- issueDate
- verificationUrl
- hash/signature

---

# 22. Security and Anti-Cheating

Mandatory controls:

- GitHub commit verification window checks
- duplicate project detection
- plagiarism detection for descriptions/repos
- immutable submission timestamps after deadline
- full audit logs for critical actions

Recommended controls:

- suspicious activity scoring
- multi-account abuse detection
- IP velocity checks
- hidden plagiarism review queue

---

# 23. Participant Analytics

Track platform health and participant outcomes:

- registration funnel
- team formation success rate
- submission completion rate
- judging publish latency
- retention across events
- skill trend heatmaps

Important analytics dimensions:

- event
- track
- community
- participant cohort

---

# 24. API Surface for Participant Website

This website should reuse existing APIs and add participant APIs where needed.

## 24.1 Existing API Families (Already Defined in Docs)

```text
Event APIs:
GET /api/v1/events
GET /api/v1/events/:eventId

RSVP APIs:
POST /api/v1/events/:eventId/rsvp
GET  /api/v1/events/:eventId/rsvp/:registrationId
PATCH /api/v1/events/:eventId/rsvp/:registrationId

Judging Public APIs:
GET /api/v1/events/:eventId/judging
GET /api/v1/events/:eventId/leaderboard
GET /api/v1/events/:eventId/projects
GET /api/v1/events/:eventId/projects/:slug
```

## 24.2 Participant API Additions (Recommended)

```text
Builder Profile
GET    /api/v1/builders/:username
PATCH  /api/v1/builders/me

Teams
POST   /api/v1/events/:eventId/teams
GET    /api/v1/events/:eventId/teams
POST   /api/v1/events/:eventId/teams/:teamId/join-requests
PATCH  /api/v1/events/:eventId/teams/:teamId/join-requests/:requestId/accept
PATCH  /api/v1/events/:eventId/teams/:teamId/join-requests/:requestId/reject

Submissions
POST   /api/v1/events/:eventId/submissions
PATCH  /api/v1/events/:eventId/submissions/:submissionId
POST   /api/v1/events/:eventId/submissions/:submissionId/finalize

Reputation
GET    /api/v1/builders/:username/reputation
GET    /api/v1/events/:eventId/achievements

Notifications
GET    /api/v1/notifications
PATCH  /api/v1/notifications/:id/read

Certificates
GET    /api/v1/certificates/me
GET    /api/v1/certificates/:certificateId/verify
```

---

# 25. Data Model Outline (Participant Domain)

Recommended core collections:

- BuilderProfile
- BuilderStats
- BuilderAchievement
- EventTeam
- TeamJoinRequest
- EventSubmission
- SubmissionAsset
- SubmissionScore (from Judging system)
- EventLeaderboardCache
- EventRSVPConfig (from RSVP)
- EventRegistration (from RSVP)
- ParticipantNotification
- BuilderCertificate
- SponsorChallenge
- PlagiarismReport
- ParticipationAudit

---

# 26. Integration with Existing CommDesk Docs

This participant website must stay aligned with:

- [CommDesk Event System](./CommDesk-Event-System.md)
- [CommDesk RSVP System](./CommDesk-RSVP-System.md)
- [CommDesk Judging System](./CommDesk-Judging-System.md)
- [CommDesk Member Creation & Onboarding System](./CommDesk-Member-System.md)
- [Community Signup System](./Community-Signup-System.md)

Integration rules:

- event status, schedule, and visibility come from Event System
- registration and consent model come from RSVP System
- judging and leaderboard visibility come from Judging System
- identity onboarding and role governance come from Member System
- community-level access and ownership originate from Signup System

---

# 27. Important Fields Checklist

Do not ship participant platform without these critical fields.

1. Identity:

- `userId`
- `username`
- `fullName`
- `email`
- `skills[]`

2. Participation:

- `eventId`
- `registrationType`
- `rsvpStatus`
- `teamId`

3. Submission:

- `submissionId`
- `projectName`
- `repositoryUrl`
- `demoUrl`
- `status`
- `submittedAt`

4. Judging transparency:

- `criteriaName`
- `score`
- `judgeVisibilityRules`
- `publishTiming`

5. Trust and compliance:

- consent flags and policy versions
- audit metadata (actor, timestamp, IP)
- anti-plagiarism and anti-duplicate signals

---

# 28. Weak Points If Missed

1. No unified builder profile:

- participants lose long-term portfolio value.

2. No team workflow:

- serious hackathon participation becomes impossible.

3. No transparent judging controls:

- trust and fairness concerns increase.

4. No anti-cheating checks:

- duplicate and plagiarized projects can win.

5. No notification reliability:

- participants miss critical deadlines.

6. No certificate verification:

- credentials become easy to fake.

7. No hiring opt-in/privacy controls:

- user trust and legal risk increase.

8. No API/contract alignment with existing docs:

- frontend and backend drift quickly.

9. No observability:

- production incident triage becomes slow.

10. No phased rollout:

- platform complexity can delay launch unnecessarily.

---

# 29. Suggested Rollout Plan

## Phase 1 (MVP)

- discovery
- event detail
- RSVP
- team formation basics
- submission
- basic leaderboard

## Phase 2 (Trust and Quality)

- transparent judging view
- anti-cheating checks
- notifications hardening
- certificates

## Phase 3 (Ecosystem)

- reputation and achievements
- sponsor challenges
- talent discovery
- learning and community features

---

# 30. Final Architecture (Participant Website)

```text
React Website (Participants)
  -> Discovery
  -> RSVP
  -> Teams
  -> Submission
  -> Judging View
  -> Leaderboard
  -> Builder Profile
  -> Reputation
  -> Certificates
        |
        v
CommDesk API Layer
  -> Event System
  -> RSVP System
  -> Judging System
  -> Member System
  -> Community System
        |
        v
Organizer Desktop App (existing)
```

---

# 31. Final Result

This document defines a complete React participant platform blueprint aligned with all existing CommDesk system docs.

Delivered outcome:

- end-to-end participant lifecycle
- production-ready module breakdown
- route and API contracts
- integration with event, RSVP, judging, member, and community systems
- fairness, trust, and anti-cheating architecture
- growth path from MVP to full ecosystem
