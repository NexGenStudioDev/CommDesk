# CommDesk Event System - Backend Implementation

## Overview

This document defines the backend implementation blueprint for the CommDesk Events module.

It is aligned with the current frontend UI:

- `/events` (list + tabs)
- `/create-event` (event creation)
- separate role panels for `Speakers`, `Mentors`, `Judges`
- `Partners and Sponsors`
- `Save Draft` and `Create Event` actions

This version removes standalone Participant schema duplication and uses CommDesk Member System as source of truth for people data.

Related documents:

- [CommDesk Participant Platform System](./CommDesk-Participant-Platform-System.md)
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
- ticket type logic:
  - `Free` => `price = null`
  - `Paid` => `price > 0`

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

2. No idempotency for publish/archive:

- risk: double-click/retry creates inconsistent transitions.
- add: transition guard + idempotency key handling.

3. No scheduled status updater:

- risk: old events remain `Live`/`Upcoming` incorrectly.
- add: cron/queue job for status sync by `startAt/endAt`.

4. No soft delete strategy:

- risk: accidental hard deletion of event data.
- add: `isDeleted`, `deletedAt`, `deletedBy`.

5. Weak search indexing plan:

- risk: slow list queries at scale.
- add indexes on `(communityId, status, startAt)` and text index for `title/subtitle`.

6. No upload security hardening:

- risk: malicious files.
- add MIME allowlist, antivirus scan, max size, signed upload flow.

7. No transactional checks on role assignments:

- risk: assigning members from another community.
- add explicit member-community verification before write.

8. No observability baseline:

- risk: hard to debug production issues.
- add structured logs, trace IDs, metrics for endpoint latency/error rate.

9. No API contract version strategy:

- risk: frontend breakage during iterative changes.
- add explicit versioning and changelog discipline.

10. No policy for archived event edits:

- risk: business ambiguity.
- add clear rule: archived events read-only unless restored.

---

# 15. Final End-to-End Flow

```text
Create Event Page
      -> Save Draft
      -> Add Speaker/Mentor/Judge (from Members)
      -> Add Partners and Sponsors
      -> Upload Cover Image
      -> Publish Event
      -> Appears in Event List
```

---
