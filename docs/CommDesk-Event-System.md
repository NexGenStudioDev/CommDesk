# CommDesk Event System - Backend Implementation

## Overview

This document defines the backend implementation blueprint for the CommDesk Events module.

Implementation status note:

- this document is a backend target-state blueprint
- current desktop event screens in this repository may include static or mock wiring until API integration is completed
- check [CommDesk Implementation Status Matrix](./CommDesk-Implementation-Status.md) for the exact implemented scope

It is intended to align with the current frontend UI structure:

- `/events` (list + tabs)
- `/create-event` (event creation)
- separate role panels for `Speakers`, `Mentors`, `Judges`
- `Partners and Sponsors`
- pricing, prize pool, and track reward configuration
- `Save Draft` and `Create Event` actions

This version removes standalone Participant schema duplication and uses CommDesk Member System as source of truth for people data.

Related documents:

- [CommDesk Participant Platform System](./CommDesk-Participant-Platform-System.md)
- [CommDesk Sponsor & Partner Management System](./CommDesk-Sponsor-Partner-System.md)
- [CommDesk Judging System](./CommDesk-Judging-System.md)
- [CommDesk RSVP System](./CommDesk-RSVP-System.md)
- [CommDesk Member Creation & Onboarding System](./CommDesk-Member-System.md)

---

# 1. System Stack

CommDesk Events backend should use:

```
Node.js
Express
MongoDB
Mongoose
Zod
JWT
Multer
S3 / Cloudflare R2
```

---

# 2. Architecture Goals

The event system must:

- support draft-first authoring
- publish safely with validation
- keep event people linked to Members (no duplicate profile records)
- support role-wise UI panels (speaker/mentor/judge)
- support partner/sponsor management
- support list filtering and pagination
- preserve auditability and community-scoped access

---

---

# 3. Event Status Lifecycle

Statuses must support your tabs and flow:

```text
Draft
  -> Upcoming
  -> Live
  -> Completed
  -> Archived
```

Rules:

- create default status: `Draft`
- publish:
  - if `startAt > now` => `Upcoming`
  - else => `Live`
- auto/manual completion after `endAt`
- archive only by authorized roles

---

# 4. Event Schema (Mongoose)

```ts
import mongoose from "mongoose";

const eventMemberRefSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Member",
    },
    eventRoleLabel: {
      type: String,
      default: "",
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  { _id: false },
);

const EventSchema = new mongoose.Schema(
  {
    communityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      minlength: 3,
      trim: true,
    },

    subtitle: {
      type: String,
      default: "",
    },

    descriptionMarkdown: {
      type: String,
      required: true,
    },

    registrationLink: {
      type: String,
      default: "",
    },

    eventType: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    startAt: {
      type: Date,
      required: true,
      index: true,
    },

    endAt: {
      type: Date,
      required: true,
      index: true,
    },

    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },

    venueName: {
      type: String,
      default: "",
    },

    venueAddress: {
      type: String,
      default: "",
    },

    venueGeo: {
      lat: { type: Number },
      lng: { type: Number },
    },

    capacity: {
      maxAttendees: {
        type: Number,
        default: null,
      },
    },

    ticketing: {
      type: {
        type: String,
        enum: ["Free", "Paid"],
        required: true,
      },
      price: {
        type: Number,
        default: null,
      },
      currency: {
        type: String,
        default: "INR",
      },
    },

    pricing: {
      budgetTier: {
        type: String,
        enum: ["Small", "Medium", "Large"],
        default: "Small",
      },

      totalBudget: {
        type: Number,
        default: 0,
      },

      totalPrizePool: {
        type: Number,
        default: 0,
      },

      mainPrizes: {
        type: [
          {
            title: { type: String, required: true },
            amount: { type: Number, required: true },
            currency: { type: String, default: "INR" },
          },
        ],
        default: [],
      },

      trackPrizes: {
        type: [
          {
            trackName: { type: String, required: true },
            winnerAmount: { type: Number, required: true },
            runnerUpAmount: { type: Number, default: 0 },
            sponsorPartnerId: { type: mongoose.Schema.Types.ObjectId, default: null },
            criteriaNote: { type: String, default: "" },
          },
        ],
        default: [],
      },

      specialPrizes: {
        type: [
          {
            title: { type: String, required: true },
            amount: { type: Number, required: true },
            currency: { type: String, default: "INR" },
          },
        ],
        default: [],
      },

      sponsorRewards: {
        type: [
          {
            sponsorPartnerId: { type: mongoose.Schema.Types.ObjectId, default: null },
            rewardType: {
              type: String,
              enum: ["Cash", "Credit", "Swag", "Hiring"],
              required: true,
            },
            cashAmount: { type: Number, default: 0 },
            creditNote: { type: String, default: "" },
            swagNote: { type: String, default: "" },
            hiringNote: { type: String, default: "" },
          },
        ],
        default: [],
      },

      workshopPricing: {
        mode: {
          type: String,
          enum: ["Free", "Paid", "Premium", "SponsorFunded"],
          default: "Free",
        },
        minPrice: { type: Number, default: 0 },
        maxPrice: { type: Number, default: 0 },
        sponsorFundedAmount: { type: Number, default: 0 },
      },

      bootcampPricing: {
        shortBootcampRange: {
          min: { type: Number, default: 0 },
          max: { type: Number, default: 0 },
        },
        longBootcampRange: {
          min: { type: Number, default: 0 },
          max: { type: Number, default: 0 },
        },
      },

      meetupPricing: {
        mode: {
          type: String,
          enum: ["Free", "Paid"],
          default: "Free",
        },
        minPrice: { type: Number, default: 0 },
        maxPrice: { type: Number, default: 0 },
      },

      expenseAllocation: {
        prizePoolPercent: { type: Number, default: 0 },
        marketingPercent: { type: Number, default: 0 },
        operationsPercent: { type: Number, default: 0 },
        platformToolsPercent: { type: Number, default: 0 },
        swagPercent: { type: Number, default: 0 },
      },

      payoutPolicy: {
        payoutWindowDaysMin: { type: Number, default: 7 },
        payoutWindowDaysMax: { type: Number, default: 14 },
        requireWinnerVerification: { type: Boolean, default: true },
      },
    },

    settings: {
      publicVisible: {
        type: Boolean,
        default: true,
      },
      requiredRSVP: {
        type: Boolean,
        default: false,
      },
      allowWaitlist: {
        type: Boolean,
        default: true,
      },
    },

    people: {
      speakers: { type: [eventMemberRefSchema], default: [] },
      mentors: { type: [eventMemberRefSchema], default: [] },
      judges: { type: [eventMemberRefSchema], default: [] },
    },

    coverImageUrl: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Draft", "Upcoming", "Live", "Completed", "Archived"],
      default: "Draft",
      index: true,
    },

    teamsCount: {
      type: Number,
      default: 0,
    },

    submissionsCount: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  },
);

EventSchema.index({ communityId: 1, status: 1, startAt: -1 });

export const EventModel = mongoose.model("Event", EventSchema);
```

---

# 5. Event Pricing, Budget, and Prize Structure

This section defines event-level pricing and reward design for hackathons, workshops, bootcamps, meetups, and competitions.

## 5.1 Supported Event Types

```text
Hackathon
Workshop
Bootcamp
Meetup
Competition
```

## 5.2 Hackathon Main Prize Distribution

Small hackathon (`INR 50K - 1L`):

```text
1st: INR 25,000
2nd: INR 15,000
3rd: INR 10,000
Special: INR 5,000
```

Medium hackathon (`INR 1L - 5L`):

```text
1st: INR 1,00,000
2nd: INR 60,000
3rd: INR 40,000
Track prizes: INR 20K - 50K each
Community prizes: INR 10K - 20K
```

Large hackathon (`INR 5L - 20L`):

```text
1st: INR 3,00,000
2nd: INR 2,00,000
3rd: INR 1,00,000
Track prizes: INR 50K - 2L
Sponsor prizes: INR 1L+
```

## 5.3 Track Prize Structure

Tracks are sponsor-driven or organizer-defined, for example:

```text
Best AI Project
Best Web App
Best Blockchain Project
Best Beginner Project
Best Female-led Team
```

Recommended range per track:

```text
Winner: INR 20K - 1L
Runner-up: INR 10K - 50K
```

Sponsor track example:

```text
Track: Build using OpenAI API
Winner: INR 1L
Runner-up: INR 50K
```

## 5.4 Special Prize Categories

```text
Best UI/UX
Best Innovation
Best Social Impact
Best College Team
Best Solo Developer
```

## 5.5 Sponsor-Based Rewards

Sponsors can contribute:

- cash rewards (`INR 50K - 5L` per sponsor)
- cloud/API credits (`AWS`, `OpenAI`, etc.)
- swag (t-shirts, goodies, stickers)
- hiring opportunities (internships, interviews, full-time roles)

All sponsor rewards must include explicit fulfillment owner and delivery SLA.

## 5.6 Total Prize Pool Formula

```text
totalPrizePool = mainPrizes + trackPrizes + specialPrizes + sponsorCashPrizes
```

Example (medium hackathon):

```text
Main Prizes: INR 2L
Track Prizes: INR 2L
Sponsor Prizes: INR 1L
Total Prize Pool: INR 5L
```

## 5.7 Workshop, Bootcamp, Meetup Pricing

Workshop pricing:

- free workshop: `INR 0`
- paid workshop: `INR 99 - 999`
- premium workshop: `INR 999 - 4,999` (may include certificate, recordings, mentorship)
- sponsor-funded workshop: participant cost `INR 0`, sponsor contribution `INR 10K - 1L`

Bootcamp pricing:

- short (1-3 days): `INR 499 - 1,999`
- long (1-4 weeks): `INR 1,999 - 9,999`

Meetup pricing:

- free meetup: `INR 0`
- paid meetup: `INR 49 - 299`

## 5.8 Event Budget Tiers

```text
Small: INR 10K - 50K
Medium: INR 50K - 5L
Large: INR 5L - 50L
```

Recommended expense allocation:

```text
Prize pool: 40% - 60%
Marketing: 10% - 20%
Operations: 10% - 20%
Platform/tools: 5% - 10%
Swag: 5% - 15%
```

## 5.9 Revenue Sources

```text
Sponsors
Ticket sales
Workshops
Partnerships
```

## 5.10 Prize Governance Rules

Always enforce:

- public prize breakdown before event starts
- explicit judging criteria per prize type
- sponsor track criteria published with the track
- sponsor prizes awarded strictly against sponsor-defined criteria and eligibility
- winner verification before payout
- payout SLA (`7-14 days`) after result finalization
- optional anti-overlap rule: one project cannot win multiple mutually-exclusive categories

Avoid:

- vague reward promises
- delayed payout without communication
- criteria changes after judging starts

## 5.11 Judging Criteria Template (Prize Decisions)

```text
Innovation: 30%
Technical Complexity: 25%
UI/UX: 15%
Impact: 20%
Presentation: 10%
```

## 5.12 Prize Distribution Flow

```text
Event ends
  -> Judging complete
  -> Winners announced
  -> Winner verification
  -> Prize distribution (within 7-14 days)
```

Optional advanced patterns:

- milestone rewards
- participation rewards
- early submission bonus

---

# 6. Member System Link (Replaces Participant Schema)

Instead of an `EventParticipant` collection, use existing Member records.

Reference document:

- [CommDesk Member Creation & Onboarding System](./CommDesk-Member-System.md)

Integration rule:

- `Speakers`, `Mentors`, `Judges` are event role assignments of community members
- each role entry stores `memberId` + optional event-specific label
- profile details (`name`, `email`, `photo`) are fetched from Member System

Benefits:

- no duplicate user/person storage
- consistent identity and role governance
- easier onboarding/invite reuse

---

# 7. Partner/Sponsor Schema

This schema describes the event-facing assignment layer.

Global sponsor and partner identities, verification, marketplace discovery, and sponsorship request workflows should be implemented through:

- [CommDesk Sponsor & Partner Management System](./CommDesk-Sponsor-Partner-System.md)

In production, prefer linking event assignments to a global organization record and storing display snapshots for event pages.

```ts
import mongoose from "mongoose";

const EventPartnerSchema = new mongoose.Schema(
  {
    communityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: "Event",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: "Official Partner",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

EventPartnerSchema.index({ eventId: 1, category: 1, name: 1 });

export const EventPartnerModel = mongoose.model("EventPartner", EventPartnerSchema);
```

---

# 8. Zod Validation

Use Zod for request validation.

```ts
import { z } from "zod";

export const createEventSchema = z
  .object({
    title: z.string().min(3),
    subtitle: z.string().optional(),
    descriptionMarkdown: z.string().min(1),
    registrationLink: z.string().url().optional().or(z.literal("")),
    eventType: z.string().min(1),
    category: z.string().min(1),
    startAt: z.string().datetime(),
    endAt: z.string().datetime(),
    timezone: z.string().min(1),
    venueName: z.string().optional(),
    venueAddress: z.string().optional(),
    capacity: z.object({
      maxAttendees: z.number().int().positive().nullable(),
    }),
    ticketing: z.object({
      type: z.enum(["Free", "Paid"]),
      price: z.number().nonnegative().nullable(),
      currency: z.enum(["INR", "USD", "EUR", "GBP"]),
    }),
    settings: z.object({
      publicVisible: z.boolean(),
      requiredRSVP: z.boolean(),
      allowWaitlist: z.boolean(),
    }),
    pricing: z
      .object({
        budgetTier: z.enum(["Small", "Medium", "Large"]),
        totalBudget: z.number().nonnegative(),
        totalPrizePool: z.number().nonnegative(),
        mainPrizes: z.array(
          z.object({
            title: z.string().min(1),
            amount: z.number().positive(),
            currency: z.enum(["INR", "USD", "EUR", "GBP"]),
          }),
        ),
        trackPrizes: z.array(
          z.object({
            trackName: z.string().min(1),
            winnerAmount: z.number().positive(),
            runnerUpAmount: z.number().nonnegative(),
            sponsorPartnerId: z.string().optional().nullable(),
            criteriaNote: z.string().optional(),
          }),
        ),
        specialPrizes: z.array(
          z.object({
            title: z.string().min(1),
            amount: z.number().positive(),
            currency: z.enum(["INR", "USD", "EUR", "GBP"]),
          }),
        ),
        workshopPricing: z.object({
          mode: z.enum(["Free", "Paid", "Premium", "SponsorFunded"]),
          minPrice: z.number().nonnegative(),
          maxPrice: z.number().nonnegative(),
          sponsorFundedAmount: z.number().nonnegative(),
        }),
      })
      .optional(),
  })
  .superRefine((payload, ctx) => {
    const start = new Date(payload.startAt).getTime();
    const end = new Date(payload.endAt).getTime();

    if (start >= end) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endAt"],
        message: "endAt must be after startAt",
      });
    }

    if (payload.ticketing.type === "Paid" && (payload.ticketing.price ?? 0) <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["ticketing", "price"],
        message: "price is required and must be > 0 for paid events",
      });
    }

    if (payload.ticketing.type === "Free" && payload.ticketing.price !== null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["ticketing", "price"],
        message: "price must be null for free events",
      });
    }

    if (payload.pricing) {
      const mainTotal = payload.pricing.mainPrizes.reduce((sum, p) => sum + p.amount, 0);
      const trackTotal = payload.pricing.trackPrizes.reduce(
        (sum, p) => sum + p.winnerAmount + p.runnerUpAmount,
        0,
      );
      const specialTotal = payload.pricing.specialPrizes.reduce((sum, p) => sum + p.amount, 0);
      const computedTotal = mainTotal + trackTotal + specialTotal;

      if (computedTotal > payload.pricing.totalPrizePool) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["pricing", "totalPrizePool"],
          message: "totalPrizePool must be >= sum of configured prize buckets",
        });
      }

      if (
        payload.pricing.workshopPricing.maxPrice > 0 &&
        payload.pricing.workshopPricing.maxPrice < payload.pricing.workshopPricing.minPrice
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["pricing", "workshopPricing", "maxPrice"],
          message: "maxPrice must be >= minPrice",
        });
      }
    }
  });
```

---

# 9. API Contract

## 9.1 Event APIs

```text
POST   /api/v1/events
PATCH  /api/v1/events/:eventId
GET    /api/v1/events
GET    /api/v1/events/:eventId
POST   /api/v1/events/:eventId/publish
POST   /api/v1/events/:eventId/archive
```

`GET /api/v1/events` query params:

```text
status
page
limit
search
startDate
endDate
```

## 9.2 Event Role Assignment APIs (Speaker/Mentor/Judge)

```text
GET    /api/v1/events/:eventId/roles?roleType=Speaker&search=priya&page=1&limit=20
POST   /api/v1/events/:eventId/roles
PATCH  /api/v1/events/:eventId/roles/:memberId
DELETE /api/v1/events/:eventId/roles/:memberId?roleType=Judge
```

Create role request:

```json
{
  "roleType": "Mentor",
  "memberId": "67d3f3f2c9de4f7c1b2a44a9",
  "eventRoleLabel": "Startup Mentor",
  "displayOrder": 2
}
```

## 9.3 Partner APIs

These APIs should remain the event-facing management layer for the current `Partners & Sponsors` UI.

They should be backed by global sponsor and partner directory records plus event assignment records from:

- [CommDesk Sponsor & Partner Management System](./CommDesk-Sponsor-Partner-System.md)

```text
GET    /api/v1/events/:eventId/partners?search=google&page=1&limit=20
POST   /api/v1/events/:eventId/partners
PATCH  /api/v1/events/:eventId/partners/:partnerId
DELETE /api/v1/events/:eventId/partners/:partnerId
```

## 9.4 Cover Upload API

```text
POST /api/v1/uploads/events/cover
```

Multipart field:

```text
file
```

Response:

```json
{
  "success": true,
  "data": {
    "url": "https://cdn.commdesk.app/events/covers/evt_123.png"
  }
}
```

## 9.5 Pricing and Prize APIs

```text
GET    /api/v1/events/:eventId/pricing
PATCH  /api/v1/events/:eventId/pricing

POST   /api/v1/events/:eventId/prizes/main
PATCH  /api/v1/events/:eventId/prizes/main/:prizeId
DELETE /api/v1/events/:eventId/prizes/main/:prizeId

POST   /api/v1/events/:eventId/prizes/tracks
PATCH  /api/v1/events/:eventId/prizes/tracks/:trackPrizeId
DELETE /api/v1/events/:eventId/prizes/tracks/:trackPrizeId

POST   /api/v1/events/:eventId/prizes/special
PATCH  /api/v1/events/:eventId/prizes/special/:specialPrizeId
DELETE /api/v1/events/:eventId/prizes/special/:specialPrizeId

POST   /api/v1/events/:eventId/sponsor-rewards
PATCH  /api/v1/events/:eventId/sponsor-rewards/:rewardId
DELETE /api/v1/events/:eventId/sponsor-rewards/:rewardId

POST   /api/v1/events/:eventId/prizes/publish
POST   /api/v1/events/:eventId/prizes/mark-distributed
```

---

# 10. Controller and Service Responsibilities

Controller layer should:

- parse params/query/body
- validate via Zod
- call service functions
- return standardized response

Service layer should:

- enforce business rules
- manage status transitions
- verify member belongs to same community before role assignment
- execute DB updates
- write audit logs

---

# 11. Frontend Integration (Exact UI Mapping)

## Create page (`/create-event`)

- `Save Draft` -> `POST /api/v1/events` or `PATCH /api/v1/events/:eventId`
- `Create Event` -> `POST /api/v1/events/:eventId/publish`
- cover block -> upload first, then set `coverImageUrl`
- settings toggles -> map to `settings.*`
- pricing and prizes panel -> map to `pricing.*`
- ticket type logic:
  - `Free` => `price = null`
  - `Paid` => `price > 0`

Pricing page behavior:

- show budget tier (`Small`/`Medium`/`Large`) with suggested ranges
- allow adding main, track, and special prizes
- allow adding sponsor rewards (`Cash`, `Credit`, `Swag`, `Hiring`)
- show computed total and mismatch warning if bucket sum exceeds `totalPrizePool`
- allow publishing prize structure only when required fields are complete

## Role panels

- Search box uses `GET /api/v1/events/:eventId/roles` with `roleType` + `search`
- `Add` button opens member picker from Member System and assigns selected `memberId`
- keep panels separate for `Speakers`, `Mentors`, and `Judges`

## Event list (`/events`)

- replace local mock array with `GET /api/v1/events`
- map backend to table:
  - `title` -> `name`
  - `subtitle` -> `subtitle`
  - `coverImageUrl` -> `logoUrl`
  - `startAt/endAt` -> `dateLabel`
  - `status` -> badge
  - `teamsCount/submissionsCount` -> count columns

---

# 12. Access Control and Security

Required middleware:

```text
authMiddleware
communityAccessMiddleware
roleMiddleware
```

Allowed roles:

```text
Owner
Admin
Organizer
```

Additional protections:

- request rate limiting
- file type and size checks for upload
- signed URL or private bucket strategy
- audit logs for create/update/publish/archive and role assignments

---

# 13. Standard API Error Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "ticketing.price required for paid event",
    "fieldErrors": {
      "ticketing.price": "Required"
    }
  }
}
```

---

# 14. Weak Points and Missing Items To Add

These are critical gaps often missed in first implementation.

1. No optimistic locking/versioning:

- risk: concurrent edits can overwrite data.
- add: `version` field or Mongoose version key checks.

1. No idempotency for publish/archive:

- risk: double-click/retry creates inconsistent transitions.
- add: transition guard + idempotency key handling.

1. No scheduled status updater:

- risk: old events remain `Live`/`Upcoming` incorrectly.
- add: cron/queue job for status sync by `startAt/endAt`.

1. No soft delete strategy:

- risk: accidental hard deletion of event data.
- add: `isDeleted`, `deletedAt`, `deletedBy`.

1. Weak search indexing plan:

- risk: slow list queries at scale.
- add indexes on `(communityId, status, startAt)` and text index for `title/subtitle`.

1. No upload security hardening:

- risk: malicious files.
- add MIME allowlist, antivirus scan, max size, signed upload flow.

1. No transactional checks on role assignments:

- risk: assigning members from another community.
- add explicit member-community verification before write.

1. No observability baseline:

- risk: hard to debug production issues.
- add structured logs, trace IDs, metrics for endpoint latency/error rate.

1. No API contract version strategy:

- risk: frontend breakage during iterative changes.
- add explicit versioning and changelog discipline.

1. No policy for archived event edits:

- risk: business ambiguity.
- add clear rule: archived events read-only unless restored.

1. No payout ownership mapping per prize:

- risk: sponsor and organizer each assume the other party will pay.
- add per-prize `fulfillmentOwner` and SLA.

1. No prize pool reconciliation checks:

- risk: announced total prize pool does not match configured prize buckets.
- add server-side reconciliation check before publishing prizes.

1. No sponsor track criteria snapshot:

- risk: sponsor track criteria changes after submissions, causing disputes.
- store immutable criteria snapshot when judging starts.

1. No tax/compliance capture fields:

- risk: payout delays due to missing KYC/tax details.
- add winner verification checklist before payout release.

1. No payout status tracking:

- risk: cannot answer "paid/not paid" per winner.
- add payout states (`Pending`, `Processing`, `Paid`, `Failed`) and audit timeline.

---

# 15. Final End-to-End Flow

```text
Create Event Page
      -> Save Draft
      -> Configure Budget, Prize Pool, and Track Rewards
      -> Add Speaker/Mentor/Judge (from Members)
      -> Add Partners and Sponsors
      -> Upload Cover Image
      -> Publish Event
      -> Publish Prize Structure
      -> Complete Judging and Winner Verification
      -> Distribute Prizes (7-14 day SLA)
      -> Appears in Event List
```

---
