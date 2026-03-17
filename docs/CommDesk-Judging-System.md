# CommDesk Judging System

## Overview

This document defines the judge-first judging system for CommDesk.

Primary scope:

- judge invitation and onboarding
- judge login and session management
- judge scoring workflow
- score locking and auditability
- optional transparent public publishing

This is designed for events where judges log in, evaluate projects, and submit scores in a controlled, fair, and traceable way.

---

# 1. Core Goals

The judging system must:

- allow only authorized judges to score submissions
- enforce consistent criteria-based scoring
- prevent score tampering after submission
- provide a full audit trail for every judging action
- support transparency mode for public trust
- generate leaderboard automatically from submitted scores

---

# 2. Judge-Centric Product Flow

```text
Judge invited
  -> Invite accepted
  -> Judge logs in
  -> Sees assigned submissions
  -> Scores criteria and adds feedback
  -> Submits final score
  -> Score becomes locked
  -> Leaderboard recalculates
  -> Public view updates (if transparency enabled)
```

---

# 3. Roles and Permissions

## Judge Roles

- `Judge`: can score assigned submissions
- `LeadJudge`: can review, unlock with reason, and finalize rounds
- `Organizer/Admin`: can configure criteria, assign judges, and publish visibility

## Permission Matrix

```text
Action                                 Judge   LeadJudge   Organizer/Admin
View assigned submissions               Yes      Yes         Yes
Save draft score                        Yes      Yes         No
Submit final score                      Yes      Yes         No
Edit score after submit                 No       Conditional No
Unlock score                            No       Yes         Conditional
Create/Update criteria                  No       No          Yes
Assign judges                           No       Yes         Yes
Toggle transparency settings            No       No          Yes
Finalize judging round                  No       Yes         Yes
```

---

# 4. Judge Authentication and Onboarding

## 4.1 Invitation Flow

```text
Organizer invites judge
  -> Invite token generated
  -> Email sent
  -> Judge accepts invite
  -> Judge account linked
  -> Judge can login
```

## 4.2 Login Methods

Recommended support:

- email + password login
- magic link login (optional)
- SSO (optional, enterprise)

## 4.3 Security Controls

- short-lived access token + refresh token
- optional MFA for judges
- login rate limiting
- device/session tracking
- forced logout if role revoked

---

# 5. Data Model

This section includes production-ready schema shapes for judge login and scoring.

## 5.1 EventJudgeAssignment

```ts
EventJudgeAssignment;
{
  _id: ObjectId;

  eventId: ObjectId;
  communityId: ObjectId;

  userId: ObjectId;
  memberId: ObjectId;

  displayProfile: {
    name: String;
    title: String;
    company: String;
    bio: String;
    avatarUrl: String;
  }

  expertiseTags: [String];

  status: "Invited" | "Active" | "Disabled";

  access: {
    role: "Judge" | "LeadJudge";
    canScore: Boolean;
    canFinalize: Boolean;
    canUnlockScore: Boolean;
  }

  transparency: {
    judgingVisible: Boolean;
    showNamePublic: Boolean;
  }

  invitedBy: ObjectId;
  invitedAt: Date;
  acceptedAt: Date;
  lastLoginAt: Date;

  createdAt: Date;
  updatedAt: Date;
}
```

Required indexes:

- unique: `(eventId, userId)`
- index: `(eventId, status)`

## 5.2 EventJudgingCriteria

```ts
EventJudgingCriteria;
{
  _id: ObjectId;

  eventId: ObjectId;
  communityId: ObjectId;

  name: String;
  description: String;

  maxScore: Number;
  weight: Number;

  required: Boolean;
  visibleToPublic: Boolean;

  order: Number;

  createdBy: ObjectId;
  updatedBy: ObjectId;

  createdAt: Date;
  updatedAt: Date;
}
```

Validation:

- `maxScore > 0`
- `weight > 0`
- total criteria weight should equal `100` (recommended)

## 5.3 EventSubmission

```ts
EventSubmission
{
 _id: ObjectId

 eventId: ObjectId
 communityId: ObjectId

 teamId: ObjectId

 projectName: String
 slug: String

 shortDescription: String
 fullDescription: String

 category: String
 track: String
 techStack: [String]

 repositoryUrl: String
 demoUrl: String
 presentationUrl: String
 videoUrl: String
 screenshots: [String]

 status:
   "Draft"
   | "Submitted"
   | "UnderReview"
   | "Finalist"
   | "Winner"

 judgingVisible: Boolean

 scoreSummary:
 {
  totalScore: Number
  averageScore: Number
  weightedAverageScore: Number
  judgeCount: Number
 }

 publicScoreBreakdown:
 [
  {
   judgeId: ObjectId
   judgeName: String
   totalScore: Number
   weightedScore: Number
  }
 ]

 submittedAt: Date
 createdAt: Date
 updatedAt: Date
}
```

## 5.4 SubmissionScore

```ts
SubmissionScore
{
 _id: ObjectId

 eventId: ObjectId
 communityId: ObjectId
 submissionId: ObjectId

 judgeId: ObjectId

 judgeInfo:
 {
  name: String
  title: String
  company: String
 }

 criteriaScores:
 [
  {
   criteriaId: ObjectId
   criteriaName: String
   criteriaDescription: String
   score: Number
   maxScore: Number
   weight: Number
   weightedScore: Number
  }
 ]

 totalScore: Number
 weightedScore: Number

 feedback:
 {
  privateNote: String
  publicNote: String
 }

 visibility:
   "Private"
   | "Public"

 status:
   "Draft"
   | "Submitted"
   | "Finalized"

 isLocked: Boolean

 submittedAt: Date
 finalizedAt: Date

 scoreVersion: Number

 createdAt: Date
 updatedAt: Date
}
```

Required indexes:

- unique: `(eventId, submissionId, judgeId)`
- index: `(eventId, judgeId, status)`
- index: `(eventId, submissionId)`

## 5.5 EventLeaderboardCache (Optional)

```ts
EventLeaderboardCache;
{
  _id: ObjectId;

  eventId: ObjectId;
  submissionId: ObjectId;
  teamId: ObjectId;

  rank: Number;
  averageScore: Number;
  weightedAverageScore: Number;
  judgeCount: Number;

  tieBreakerMeta: {
    highestSingleJudgeScore: Number;
    scoreStdDeviation: Number;
    earliestSubmittedAt: Date;
  }

  updatedAt: Date;
}
```

## 5.6 JudgingAudit

```ts
JudgingAudit;
{
  _id: ObjectId;

  eventId: ObjectId;
  communityId: ObjectId;
  submissionId: ObjectId;
  judgeId: ObjectId;
  actorUserId: ObjectId;

  action: "InviteSent" |
    "InviteAccepted" |
    "JudgeLogin" |
    "ScoreDraftSaved" |
    "ScoreSubmitted" |
    "ScoreUnlockRequested" |
    "ScoreUnlocked" |
    "ScoreFinalized" |
    "JudgingRoundFinalized";

  metadata: Mixed;

  ipAddress: String;
  userAgent: String;

  createdAt: Date;
}
```

## 5.7 JudgingRound

```ts
JudgingRound;
{
  _id: ObjectId;

  eventId: ObjectId;
  communityId: ObjectId;

  roundNumber: Number;
  name: String;

  status: "Upcoming" | "Active" | "Completed" | "Cancelled";

  scoringDeadline: Date;
  startedAt: Date;
  completedAt: Date;

  assignedSubmissionIds: [ObjectId];

  finalizedBy: ObjectId;
  finalizedAt: Date;

  createdBy: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
```

Required indexes:

- unique: `(eventId, roundNumber)`
- index: `(eventId, status)`

## 5.8 JudgeSubmissionAssignment

Links individual judges to specific submissions within a round. Supports round-robin, manual, and category-based strategies.

```ts
JudgeSubmissionAssignment;
{
  _id: ObjectId;

  eventId: ObjectId;
  communityId: ObjectId;
  roundId: ObjectId;

  judgeId: ObjectId;
  submissionId: ObjectId;

  assignmentStrategy: "Manual" | "RoundRobin" | "CategoryBased";

  status: "Pending" | "InProgress" | "Completed";

  assignedBy: ObjectId;
  assignedAt: Date;

  createdAt: Date;
  updatedAt: Date;
}
```

Required indexes:

- unique: `(roundId, judgeId, submissionId)`
- index: `(eventId, judgeId, status)`
- index: `(eventId, submissionId)`

## 5.9 JudgeConflictOfInterest

```ts
JudgeConflictOfInterest;
{
  _id: ObjectId;

  eventId: ObjectId;
  communityId: ObjectId;

  judgeId: ObjectId;
  submissionId: ObjectId;

  declaredAt: Date;
  reason: String;

  resolvedBy: ObjectId;
  resolvedAt: Date;
  resolution: "Excluded" | "WaivedByOrganizer";

  createdAt: Date;
}
```

Required indexes:

- unique: `(eventId, judgeId, submissionId)`
- index: `(eventId, judgeId)`

---

# 6. Judging Settings (Transparency and Control)

Store in event-level settings.

```ts
judgingSettings;
{
  mode: "Private" | "Transparent";

  showJudgeNames: Boolean;
  showCriteria: Boolean;
  showFeedback: Boolean;

  publishTiming: "Live" | "AfterRoundComplete" | "AfterEventComplete";

  lockEditsAfterSubmit: Boolean;
  allowLeadJudgeUnlock: Boolean;

  minJudgeCountForLeaderboard: Number;

  blindedJudging: Boolean;

  scoringDeadline: Date;

  assignmentStrategy: "Manual" | "RoundRobin" | "CategoryBased";
}
```

Recommended defaults:

- `mode = Private`
- `showJudgeNames = false`
- `showFeedback = false`
- `publishTiming = AfterRoundComplete`
- `lockEditsAfterSubmit = true`
- `blindedJudging = false`
- `assignmentStrategy = Manual`

---

# 7. Score Lifecycle and Locking Rules

## 7.1 Lifecycle

```text
Draft -> Submitted -> Finalized
```

Rules:

- `Draft`: judge can edit anytime before submission deadline
- `Submitted`: locked for judge edits
- `Finalized`: immutable, included in final ranking

## 7.2 Locking Policy

- judge cannot edit once status is `Submitted`
- unlock allowed only for `LeadJudge` or `Organizer/Admin` with reason
- each unlock increments `scoreVersion`
- all unlocks logged in `JudgingAudit`

## 7.3 Submission Constraints

Before score submission:

- all required criteria must be scored
- each criterion score must be within `0..maxScore`
- judge must be assigned to event and active
- judge must not have conflict of interest for that submission

---

# 8. Score Calculation and Ranking

## 8.1 Per-Judge Weighted Score

For each criterion:

```text
criterionNormalized = (score / maxScore) * weight
```

Judge weighted total:

```text
judgeWeightedScore = sum(criterionNormalized)
```

## 8.2 Submission Final Score

```text
averageScore = average(totalScore across submitted judges)
weightedAverageScore = average(weightedScore across submitted judges)
judgeCount = total submitted judges for submission
```

## 8.3 Leaderboard Order

Primary sorting:

1. `weightedAverageScore` desc
2. `averageScore` desc
3. `highestSingleJudgeScore` desc
4. `earliestSubmittedAt` asc

Tie-break policy must be documented in event rules.

---

# 9. Judge Portal Pages

## 9.1 Judge Login

Route:

```text
/judge/login
```

## 9.2 Judge Dashboard

Route:

```text
/judge/events/:eventId
```

Displays:

- assigned submissions
- score status (`NotStarted`, `Draft`, `Submitted`)
- deadline countdown
- filters by track/category

## 9.3 Score Submission Page

Route:

```text
/judge/events/:eventId/submissions/:submissionId/score
```

Sections:

- project details
- team details
- criteria scoring form
- private/public feedback blocks
- draft save and final submit actions

---

# 10. Public Transparency Pages (Optional)

Only active when transparency mode allows publishing.

## 10.1 Public Judging Overview

```text
/events/:eventId/judging
```

Show:

- judge list (if allowed)
- criteria and weights (if allowed)
- project list
- score overview

## 10.2 Public Project Judging Detail

```text
/events/:eventId/projects/:slug
```

Show:

- per-judge score cards
- criteria-level breakdown
- public feedback

## 10.3 Public Leaderboard

```text
/events/:eventId/leaderboard
```

Show:

- rank
- project/team
- final average
- judge count

---

# 11. API Endpoints

## 11.1 Judge Auth

```text
POST /api/v1/judge/auth/accept-invite
POST /api/v1/judge/auth/login
POST /api/v1/judge/auth/refresh
POST /api/v1/judge/auth/logout
```

## 11.2 Judge Workspace APIs

```text
GET  /api/v1/judge/events/:eventId/dashboard
GET  /api/v1/judge/events/:eventId/submissions
GET  /api/v1/judge/events/:eventId/submissions/:submissionId
POST /api/v1/judge/events/:eventId/submissions/:submissionId/scores/draft
POST /api/v1/judge/events/:eventId/submissions/:submissionId/scores/submit
GET  /api/v1/judge/events/:eventId/my-scores
```

## 11.3 Admin Judging APIs

```text
POST   /api/v1/events/:eventId/judges/invite
GET    /api/v1/events/:eventId/judges
PATCH  /api/v1/events/:eventId/judges/:judgeId
POST   /api/v1/events/:eventId/judges/:judgeId/disable

POST   /api/v1/events/:eventId/criteria
GET    /api/v1/events/:eventId/criteria
PATCH  /api/v1/events/:eventId/criteria/:criteriaId
DELETE /api/v1/events/:eventId/criteria/:criteriaId

PATCH  /api/v1/events/:eventId/judging-settings
POST   /api/v1/events/:eventId/scores/:scoreId/unlock
POST   /api/v1/events/:eventId/judging/finalize-round
```

## 11.4 Public Judging APIs

```text
GET /api/v1/events/:eventId/judging
GET /api/v1/events/:eventId/leaderboard
GET /api/v1/events/:eventId/projects
GET /api/v1/events/:eventId/projects/:slug
```

## 11.5 Judging Round APIs

```text
POST  /api/v1/events/:eventId/judging/rounds
GET   /api/v1/events/:eventId/judging/rounds
GET   /api/v1/events/:eventId/judging/rounds/:roundId
PATCH /api/v1/events/:eventId/judging/rounds/:roundId
POST  /api/v1/events/:eventId/judging/rounds/:roundId/finalize
```

## 11.6 Judge-Submission Assignment APIs

```text
POST /api/v1/events/:eventId/judging/rounds/:roundId/assignments
GET  /api/v1/events/:eventId/judging/rounds/:roundId/assignments
DELETE /api/v1/events/:eventId/judging/rounds/:roundId/assignments/:assignmentId
POST /api/v1/events/:eventId/judging/rounds/:roundId/assignments/auto-assign
```

## 11.7 Conflict of Interest APIs

```text
POST  /api/v1/judge/events/:eventId/conflicts
GET   /api/v1/events/:eventId/judging/conflicts
PATCH /api/v1/events/:eventId/judging/conflicts/:conflictId/resolve
```

---

# 12. Validation Rules

Backend must enforce:

- judge must be `Active` and assigned to event
- submission must be in scoreable state (`Submitted` or `UnderReview`)
- no score above criterion `maxScore`
- score submission requires all required criteria
- one final score per judge per submission version
- cannot score own team/project
- cannot score after round finalization

---

# 13. Anti-Manipulation and Fairness Controls

Required controls:

- immutable score after submit
- unlock only through privileged action with reason
- conflict-of-interest declaration
- all write actions captured in `JudgingAudit`
- timestamped submissions
- IP and user-agent recording

Recommended controls:

- blinded judging mode (hide team identity)
- anomaly detection for outlier scores
- score normalization policy for judge bias
- cryptographic hash for finalized score payload

---

# 14. Transparency Policy Rules

If `mode = Transparent`:

- public pages can show criteria and score breakdown
- judge names shown only when `showJudgeNames = true`
- public feedback shown only when `showFeedback = true`
- publishing obeys `publishTiming`

If `mode = Private`:

- no judge score breakdown exposed publicly
- leaderboard can still be internal for organizers

---

# 15. Important Fields Checklist

Do not ship without these judge system fields.

1. Judge identity and access:

- `userId`
- `eventId`
- `role`
- `status`

1. Criteria integrity:

- `criteriaId`
- `criteriaName`
- `maxScore`
- `weight`
- `order`

1. Score traceability:

- `judgeId`
- `submissionId`
- `criteriaScores[]`
- `totalScore`
- `weightedScore`
- `status`
- `isLocked`
- `scoreVersion`

1. Security and audits:

- `createdAt`, `submittedAt`, `finalizedAt`
- `ipAddress`, `userAgent`
- audit `action`
- unlock reason metadata

1. Transparency controls:

- `mode`
- `showJudgeNames`
- `showFeedback`
- `publishTiming`
- `blindedJudging`

1. Round management:

- `roundNumber`
- `scoringDeadline`
- `status`
- `finalizedAt`

1. Assignment tracking:

- `JudgeSubmissionAssignment` records
- `assignmentStrategy`

1. Conflict of interest:

- `JudgeConflictOfInterest` records
- `declaredAt`
- `reason`
- `resolution`

---

# 16. Weak Points If Missed

1. No score locking:

- judges can alter historical results.

1. No audit trail:

- disputes cannot be resolved with evidence.

1. Missing criteria snapshots in score records:

- criteria renames break historical transparency.

1. No conflict-of-interest enforcement:

- trust in judging collapses.

1. No round finalization:

- leaderboard can keep changing after winners announced.

1. No tie-break policy:

- ranking disputes increase.

1. No transparency timing controls:

- sensitive feedback may leak too early.

1. Missing unique score constraint:

- duplicate scoring by same judge corrupts averages.

1. No role revocation handling:

- disabled judges may still access scoring APIs.

1. No visibility toggles:

- private events may expose judge details unintentionally.

1. No judging round model:

- no deadline enforcement, round sequencing, or controlled finalization per round.

1. No judge-to-submission assignment records:

- impossible to trace which judge was responsible for which submission or enforce assignment limits.

1. Criteria description not snapshotted:

- editing criteria description after scoring creates silent inconsistencies in historical records.

1. No blinded judging toggle:

- team identity can bias scores even when blinded mode is desired.

---

# 17. Integration with Existing CommDesk Docs

Related documents:

- [CommDesk Participant Platform System](./CommDesk-Participant-Platform-System.md)
- [CommDesk Sponsor & Partner Management System](./CommDesk-Sponsor-Partner-System.md)
- [CommDesk Event System](./CommDesk-Event-System.md)
- [CommDesk RSVP System](./CommDesk-RSVP-System.md)
- [CommDesk Member Creation & Onboarding System](./CommDesk-Member-System.md)

Integration notes:

- event metadata, status, and settings come from Event System
- sponsor challenge judging and sponsor prize visibility can be extended through the Sponsor and Partner System
- judge identity and account linkage come from Member/User model
- team and submission sources integrate with event participation flows

---

# 18. Final Architecture

```text
Event
  -> EventJudgingCriteria
  -> EventJudgeAssignment
  -> JudgingRound
      -> JudgeSubmissionAssignment
  -> EventSubmission
      -> SubmissionScore
          -> JudgingAudit
  -> JudgeConflictOfInterest
  -> LeaderboardCache (optional)
  -> Public Judging Pages (when enabled)
```

---

# 19. Final Result

This design gives CommDesk a robust judge login and scoring system with optional transparency.

Delivered capabilities:

- secure judge onboarding and authentication
- structured criteria scoring
- immutable submission workflow
- leaderboard computation and caching
- transparency controls per event
- audit-ready anti-manipulation model

---

# 20. Notification Triggers

Defines when the system must dispatch notifications (email, in-app, or push).

| Event | Recipients | Trigger | Channel |
|---|---|---|---|
| Judge invited | Judge | Organizer sends invite | Email |
| Invite about to expire | Judge | 24h before invite token expiry | Email |
| Invite accepted | Organizer | Judge accepts invite | In-app |
| Scoring round opened | All assigned judges | Round status → Active | Email + In-app |
| Scoring deadline reminder | Judges with pending scores | 48h and 24h before `scoringDeadline` | Email |
| Score submitted | Lead Judge | Judge submits final score | In-app |
| Score unlocked | Judge | Lead Judge/Admin unlocks their score | Email + In-app |
| Round finalized | All judges, Organizer | Round status → Completed | Email + In-app |
| Conflict of interest raised | Organizer, Lead Judge | Judge declares conflict | In-app |
| Conflict resolved | Judge | Organizer resolves conflict | In-app |
| Leaderboard published | Participants (if public) | Transparency publish trigger | Email + In-app |

All notification sends must be logged for audit purposes.

---

# 21. Standard API Error Responses

All judging API endpoints must return consistent error shapes.

## 21.1 Error Response Shape

```ts
ErrorResponse;
{
  status: Number;       // HTTP status code
  code: String;         // machine-readable error code
  message: String;      // human-readable description
  field?: String;       // present on validation errors
  meta?: Mixed;         // optional debug context (dev only)
}
```

## 21.2 Common Error Codes

| HTTP | Code | Meaning |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Missing or invalid field |
| 400 | `CRITERIA_SCORE_OUT_OF_RANGE` | Score exceeds `maxScore` |
| 400 | `REQUIRED_CRITERIA_MISSING` | Not all required criteria scored |
| 401 | `UNAUTHORIZED` | Not authenticated |
| 403 | `FORBIDDEN` | Authenticated but lacks permission |
| 403 | `JUDGE_NOT_ASSIGNED` | Judge not assigned to this submission |
| 403 | `CONFLICT_OF_INTEREST` | Judge declared a conflict for this submission |
| 403 | `SCORE_LOCKED` | Score is locked and cannot be edited |
| 403 | `ROUND_FINALIZED` | Round is closed, no further scoring allowed |
| 404 | `NOT_FOUND` | Resource does not exist |
| 409 | `DUPLICATE_SCORE` | Submitted score already exists for this judge+submission |
| 409 | `INVITE_ALREADY_ACCEPTED` | Invite token already consumed |
| 410 | `INVITE_EXPIRED` | Invite token has expired |
| 422 | `SCORING_DEADLINE_PASSED` | Submission attempted after round deadline |
