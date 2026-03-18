# CommDesk Community Trust, Review, and AI Scoring System

## Overview

This document defines the trust intelligence layer for CommDesk.

Purpose:

- help participants find the best communities and events
- help sponsors and partners choose reliable communities
- help mentors, judges, and members evaluate event quality
- create a transparent, evidence-based trust score for every community

This system uses verified feedback and operational data to produce:

- a Community Trust Score
- event-level quality scores
- AI-generated trust summaries and risk highlights

Related docs:

- [CommDesk Overall System Master Guide](./CommDesk-Overall-System-Summary.md)
- [CommDesk Website Public Platform System](./CommDesk-Website-System.md)
- [CommDesk Frontend Boundary System (Desktop + Website)](./CommDesk-Frontend-Boundary-System.md)
- [CommDesk Event System](./CommDesk-Event-System.md)
- [CommDesk RSVP System](./CommDesk-RSVP-System.md)
- [CommDesk Participant Platform System](./CommDesk-Participant-Platform-System.md)
- [CommDesk Judging System](./CommDesk-Judging-System.md)
- [CommDesk Sponsor and Partner System](./CommDesk-Sponsor-Partner-System.md)

---

## 1. Why This System Is Critical

Most event platforms track registrations but fail to track trust.

Trust grows when people can see:

- how a community performed in past events
- what participants, mentors, and sponsors experienced
- whether issues were repeated or fixed
- whether quality is improving over time

This system solves that gap.

---

## 2. Core Outcomes

The system must deliver:

1. Community Trust Score (`0-100`) with confidence indicator
2. Event Quality Score (`0-100`) for each completed event
3. AI narrative summary in simple language
4. role-specific insights for participants, sponsors, mentors, and partners
5. issue trend detection (repeated pain points)
6. fairness and anti-manipulation controls

---

## 3. Review System for All Stakeholders

## 3.1 Who Can Submit Reviews

Verified roles only:

- Participant (approved RSVPs, checked-in users, team members)
- Mentor
- Judge / Lead Judge
- Speaker
- Volunteer
- Sponsor / Partner representatives

## 3.2 What Can Be Reviewed

Targets:

- Event
- Community overall
- Mentor experience quality
- Sponsor experience quality
- Logistics and communication quality

## 3.3 Review Categories

Required dimensions:

- event organization quality
- communication and support responsiveness
- fairness and transparency of judging
- mentorship usefulness
- infrastructure and logistics quality
- inclusiveness and safety
- sponsor/partner collaboration quality
- overall recommendation likelihood

## 3.4 Review Form Shape

```text
rating: 1-5
categoryRatings: map of category -> 1-5
commentPositive: required short text
commentIssues: optional short text
wouldRecommend: yes/no
roleContext: participant/mentor/judge/sponsor/etc.
```

Review submission should be allowed only in a controlled post-event window.

---

## 4. Data Inputs for AI Trust Scoring

AI must read both structured and unstructured signals.

## 4.1 Structured Signals

- historical event completion quality
- RSVP to attendance conversion
- waitlist handling quality
- submission completion rates
- judging completion and publish latency
- sponsor deliverable fulfillment status
- payout and reward SLA adherence
- issue resolution turnaround time
- repeat participation and retention signals

## 4.2 Feedback Signals

- participant feedback text and ratings
- mentor feedback text and ratings
- judge feedback text and ratings
- sponsor/partner feedback text and ratings
- team-member experience feedback

## 4.3 Safety and Integrity Signals

- plagiarism incidents
- fraud and abuse signals
- unresolved disputes
- policy violations and code-of-conduct incidents

---

## 5. Scoring Model

## 5.1 Event Quality Score

Each completed event receives a score (`0-100`):

```text
EventQualityScore =
  0.30 * ParticipantExperience
  0.15 * MentorAndJudgeExperience
  0.20 * OperationalReliability
  0.15 * FairnessAndTransparency
  0.15 * SponsorPartnerExperience
  0.05 * SafetyAndInclusion
```

Each component is normalized to `0-100`.

## 5.2 Community Trust Score

Community score is a recency-weighted rollup of recent events.

```text
CommunityTrustScore = weighted_average(EventQualityScore by recency)
```

Recommended recency weights:

- last 3 months: `1.0`
- 3-6 months: `0.7`
- 6-12 months: `0.4`

## 5.3 Confidence Score

A confidence value is required so users understand score reliability.

Inputs:

- number of verified reviews
- reviewer diversity (participant + mentor + sponsor mix)
- event sample size

Example labels:

- `High confidence`
- `Medium confidence`
- `Low confidence`

## 5.4 Penalties

Severe unresolved issues apply temporary penalties:

- repeated payout delays
- repeated judge fairness complaints with evidence
- major logistics failures
- unresolved abuse/safety incidents

Penalty actions must be auditable and reversible after resolution.

---

## 6. AI Summary and Community Message

For each community, AI should generate one short, human-friendly summary.

Required summary structure:

1. what community does well
2. recurring issues from past events
3. recent improvement signal
4. recommendation guidance for users

Example summary format:

```text
This community hosted 12 events in the last year. Participants consistently praised mentor support and project guidance, but reported repeated delays in result announcements in 4 events. The most recent event received excellent reviews for communication and fairness. Recommended for participants looking for strong mentorship, while sponsors should confirm timeline commitments in advance.
```

This summary helps:

- participants decide where to apply
- sponsors/partners assess reliability
- mentors/judges understand operating quality

---

## 7. Stakeholder-Specific Trust Views

## 7.1 Participant View

Show:

- trust score + trend
- best-reviewed recent events
- top strengths
- common issues before applying

## 7.2 Sponsor/Partner View

Show:

- sponsor experience score
- fulfillment reliability
- communication reliability
- risk flags and dispute history summaries

## 7.3 Mentor/Judge View

Show:

- role support quality
- judging process quality history
- operational readiness signals

## 7.4 Community Internal View (Desktop)

Show:

- root-cause themes
- issue recurrence charts
- recommended action plan from AI
- before/after improvement tracking

---

## 8. Frontend Ownership (No Duplication)

This module must follow Desktop/Website boundary rules.

## 8.1 Website Ownership

Website should own:

- review submission experience for verified users
- public trust score visibility on community and event pages
- AI summary cards for participants/sponsors
- trust-based filters in discovery pages

## 8.2 Desktop Ownership

Desktop should own:

- review moderation queue
- dispute handling and appeals
- scoring rule configuration and weight governance
- manual override approvals (with strict audit)
- operational improvement dashboards

## 8.3 Shared Rule

No parallel review moderation tools on website.
No duplicate review submission UX on desktop.

---

## 9. API Contract

## 9.1 Review Collection APIs

```text
POST /api/v1/events/:eventId/reviews
GET  /api/v1/events/:eventId/reviews/summary
GET  /api/v1/communities/:communityId/reviews/summary
```

## 9.2 Trust Score APIs

```text
GET  /api/v1/communities/:communityId/trust-score
GET  /api/v1/communities/:communityId/trust-report
GET  /api/v1/events/:eventId/quality-score
```

## 9.3 AI Summary APIs

```text
GET  /api/v1/communities/:communityId/ai-trust-summary
GET  /api/v1/communities/:communityId/ai-trust-summary?audience=participant
GET  /api/v1/communities/:communityId/ai-trust-summary?audience=sponsor
```

## 9.4 Admin/Moderation APIs (Desktop)

```text
GET   /api/v1/admin/trust/reviews/moderation-queue
PATCH /api/v1/admin/trust/reviews/:reviewId/moderate
POST  /api/v1/admin/trust/recompute/:communityId
PATCH /api/v1/admin/trust/score-overrides/:communityId
```

---

## 10. Data Model Outline

Recommended collections:

- `EventReview`
- `CommunityTrustSnapshot`
- `CommunityTrustDimensionScore`
- `CommunityTrustIssue`
- `ReviewModerationAction`
- `TrustScoreAudit`
- `TrustAISummary`

## 10.1 EventReview (Core)

```text
reviewId
eventId
communityId
reviewerUserId
reviewerRole
ratingsByCategory
overallRating
commentPositive
commentIssues
wouldRecommend
verifiedParticipation
createdAt
moderationStatus
```

## 10.2 Trust Snapshot

```text
communityId
trustScore
confidenceScore
dimensionScores
topStrengths[]
topIssues[]
trendDirection
generatedAt
```

---

## 11. Anti-Manipulation Controls

Required controls:

- only verified participants/stakeholders can review
- one review per reviewer per event target
- anti-brigading detection for unusual review spikes
- NLP toxicity and spam filtering
- weighted trust in verified role diversity
- immutable audit logs for moderation and score overrides

Recommended controls:

- anomaly detection on sentiment vs rating mismatch
- confidence penalty for low sample sizes
- temporary quarantine for suspected coordinated abuse

---

## 12. Moderation and Appeals

## 12.1 Moderation Flow

```text
Review submitted
-> automated checks
-> moderation queue (if flagged)
-> approve/reject/redact
-> trust score recompute
```

## 12.2 Appeals Flow

```text
Community raises appeal
-> evidence submitted
-> admin review
-> decision logged
-> score recalculated if needed
```

Every moderation and appeal action must write an audit record.

---

## 13. Transparency and Display Rules

Public display should show:

- trust score + confidence label
- last updated date
- strengths and issue highlights
- AI summary message

Public display should never expose:

- personal identity of reviewers
- sensitive moderation notes
- private dispute evidence

---

## 14. AI Insight Outputs

AI should generate:

1. Community summary message
2. Top recurring issue list
3. Improvement recommendations for organizers
4. Audience-specific advisory lines:

- for participants
- for sponsors/partners
- for mentors/judges

Example participant advisory:

```text
Strong mentorship quality and project support; expect strict deadlines and review event timeline notes before applying.
```

Example sponsor advisory:

```text
Reliable participant engagement and high challenge completion rates; request milestone-based delivery tracking for smoother collaboration.
```

---

## 15. KPIs for Community Trust Growth

Track weekly:

- verified review submission rate
- trust score trend by community
- issue recurrence rate
- mean resolution time for trust issues
- confidence coverage (how many communities have high-confidence scores)
- participant apply conversion vs trust score
- sponsor request conversion vs trust score

---

## 16. Rollout Plan

Phase 1:

- review collection forms
- basic trust score and public badge

Phase 2:

- AI summary generation
- confidence scoring
- moderation queue

Phase 3:

- trend analytics and recurring issue detection
- role-specific advisory summaries

Phase 4:

- trust-based recommendation ranking in community/event discovery
- advanced anti-manipulation detection

---

## 17. Final Definition

One-line system definition:

```text
CommDesk Trust System turns feedback and event history into transparent, AI-assisted trust intelligence so participants, sponsors, mentors, and members can choose better communities and events.
```
