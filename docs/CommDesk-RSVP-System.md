# CommDesk RSVP System

## Overview

This document defines a production-ready RSVP and registration system for CommDesk events.

It is designed for:

- hackathons
- meetups
- workshops
- conferences
- competitions

The system supports:

- solo registration
- team registration
- identity and contact capture
- configurable form fields
- approval workflow
- secure handling of sensitive data

---

# 1. Goals

The RSVP system must:

- collect all required participant details without over-collecting
- support both quick meetup RSVPs and detailed hackathon registrations
- enforce event-specific team rules and capacity limits
- prevent duplicate or fraudulent registrations
- support admin review, approval, rejection, waitlist, and check-in
- provide export and analytics support for operations teams

---

# 2. Registration Modes

CommDesk should support two frontend entry modes.

## Mode A: Global RSVP Page

User selects event in form:

```text
Select Event
```

## Mode B: Event-Specific RSVP Page

Event comes from URL:

```text
/events/:eventId/rsvp
```

Recommendation:

- use event-specific page for public campaigns
- use global page for internal dashboards

---

# 3. Form Schema (Frontend)

## 3.1 Core Fields

Always required:

- `eventId`
- `registrationType` (`Solo` or `Team`)
- `leader.fullName`
- `leader.email`
- `leader.mobile`
- `consents.eventRulesAccepted`
- `consents.dataProcessingAccepted`

## 3.2 Team Fields

Required only when `registrationType = Team`:

- `teamName`
- `teamSize`
- `members[]`

## 3.3 Leader Profile Fields

Important identity and contact fields:

- `fullName`
- `email`
- `mobile`
- `collegeName` (optional by event type)
- `collegeId` (optional by event type)
- `aadhaarNumber` (optional, sensitive)
- `city`
- `state`
- `country`

Strongly recommended additional fields:

- `dateOfBirth`
- `gender` (optional enum)
- `githubUrl` (optional)
- `linkedinUrl` (optional)
- `portfolioUrl` (optional)
- `emergencyContactName`
- `emergencyContactMobile`

## 3.4 Team Member Fields

For each member:

- `fullName`
- `email`
- `mobile`
- `collegeName`
- `collegeId`
- `city` (optional)
- `state` (optional)
- `country` (optional)

## 3.5 Consent Fields

Must be explicit and versioned:

- `eventRulesAccepted`
- `dataProcessingAccepted`
- `privacyPolicyVersion`
- `termsVersion`
- `marketingOptIn` (optional)

## 3.6 Custom Questions

Event admins can define extra questions:

- short text
- long text
- single select
- multi select
- number
- file upload (optional)
- url

Each response should store:

- `questionId`
- `labelSnapshot`
- `answer`

---

# 4. Recommended Frontend Payloads

## 4.1 Solo Registration

```json
{
  "eventId": "evt_123",
  "registrationType": "Solo",
  "leader": {
    "fullName": "Abhishek Kumar",
    "email": "abhishek@example.com",
    "mobile": "9876543210",
    "collegeName": "CIITM Dhanbad",
    "collegeId": "CIITM123",
    "aadhaarNumber": "123412341234",
    "city": "Dhanbad",
    "state": "Jharkhand",
    "country": "India"
  },
  "members": [],
  "consents": {
    "eventRulesAccepted": true,
    "dataProcessingAccepted": true,
    "privacyPolicyVersion": "v1.0",
    "termsVersion": "v1.0",
    "marketingOptIn": false
  },
  "customResponses": []
}
```

## 4.2 Team Registration

```json
{
  "eventId": "evt_123",
  "registrationType": "Team",
  "teamName": "Code Ninjas",
  "teamSize": 4,
  "leader": {
    "fullName": "Abhishek Kumar",
    "email": "abhishek@example.com",
    "mobile": "9876543210",
    "collegeName": "CIITM Dhanbad",
    "collegeId": "CIITM123",
    "aadhaarNumber": "123412341234",
    "city": "Dhanbad",
    "state": "Jharkhand",
    "country": "India"
  },
  "members": [
    {
      "fullName": "Rahul Sharma",
      "email": "rahul@example.com",
      "mobile": "9876543211",
      "collegeName": "CIITM Dhanbad",
      "collegeId": "CIITM124"
    },
    {
      "fullName": "Aman Singh",
      "email": "aman@example.com",
      "mobile": "9876543212",
      "collegeName": "CIITM Dhanbad",
      "collegeId": "CIITM125"
    },
    {
      "fullName": "Neha Verma",
      "email": "neha@example.com",
      "mobile": "9876543213",
      "collegeName": "CIITM Dhanbad",
      "collegeId": "CIITM126"
    }
  ],
  "consents": {
    "eventRulesAccepted": true,
    "dataProcessingAccepted": true,
    "privacyPolicyVersion": "v1.0",
    "termsVersion": "v1.0",
    "marketingOptIn": false
  },
  "customResponses": []
}
```

---

# 5. Backend Data Model

Use two collections:

- `EventRSVPConfig` (event-level rules and form config)
- `EventRegistration` (submitted registration records)

## 5.1 EventRSVPConfig Schema (Mongoose)

```ts
import mongoose from "mongoose";

const customQuestionSchema = new mongoose.Schema(
  {
    questionId: { type: String, required: true },
    label: { type: String, required: true },
    type: {
      type: String,
      enum: ["short_text", "long_text", "single_select", "multi_select", "number", "url", "file"],
      required: true,
    },
    required: { type: Boolean, default: false },
    options: { type: [String], default: [] },
    maxLength: { type: Number },
  },
  { _id: false },
);

const EventRSVPConfigSchema = new mongoose.Schema(
  {
    communityId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true, index: true },

    enabled: { type: Boolean, default: true },
    startsAt: { type: Date },
    endsAt: { type: Date },

    allowSolo: { type: Boolean, default: true },
    allowTeam: { type: Boolean, default: true },

    minTeamSize: { type: Number, default: 2 },
    maxTeamSize: { type: Number, default: 4 },

    capacityLimit: { type: Number, default: null },
    waitlistEnabled: { type: Boolean, default: true },

    requireCollegeFields: { type: Boolean, default: false },
    requireAadhaar: { type: Boolean, default: false },

    customQuestions: { type: [customQuestionSchema], default: [] },

    duplicatePolicy: {
      blockByEmail: { type: Boolean, default: true },
      blockByMobile: { type: Boolean, default: true },
      blockByCollegeId: { type: Boolean, default: false },
    },
  },
  { timestamps: true },
);

export const EventRSVPConfigModel = mongoose.model("EventRSVPConfig", EventRSVPConfigSchema);
```

## 5.2 EventRegistration Schema (Mongoose)

```ts
import mongoose from "mongoose";

const participantSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    mobile: { type: String, required: true, trim: true },

    collegeName: { type: String, default: "" },
    collegeId: { type: String, default: "" },

    city: { type: String, default: "" },
    state: { type: String, default: "" },
    country: { type: String, default: "" },
  },
  { _id: false },
);

const customResponseSchema = new mongoose.Schema(
  {
    questionId: { type: String, required: true },
    labelSnapshot: { type: String, required: true },
    answer: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { _id: false },
);

const EventRegistrationSchema = new mongoose.Schema(
  {
    communityId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true, ref: "Event" },

    registrationNumber: { type: String, required: true, unique: true, index: true },

    registrationType: {
      type: String,
      enum: ["Solo", "Team"],
      required: true,
      index: true,
    },

    teamName: { type: String, default: "" },
    teamSize: { type: Number, default: 1 },

    leader: {
      ...participantSchema.obj,
      aadhaarEncrypted: { type: String, default: "" },
      aadhaarLast4: { type: String, default: "" },
      emergencyContactName: { type: String, default: "" },
      emergencyContactMobile: { type: String, default: "" },
      githubUrl: { type: String, default: "" },
      linkedinUrl: { type: String, default: "" },
      portfolioUrl: { type: String, default: "" },
    },

    members: { type: [participantSchema], default: [] },

    consents: {
      eventRulesAccepted: { type: Boolean, required: true },
      dataProcessingAccepted: { type: Boolean, required: true },
      privacyPolicyVersion: { type: String, required: true },
      termsVersion: { type: String, required: true },
      marketingOptIn: { type: Boolean, default: false },
    },

    customResponses: { type: [customResponseSchema], default: [] },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Waitlisted", "Cancelled"],
      default: "Pending",
      index: true,
    },

    statusReason: { type: String, default: "" },

    checkedIn: { type: Boolean, default: false, index: true },
    checkedInAt: { type: Date, default: null },

    source: {
      channel: { type: String, default: "web" },
      ip: { type: String, default: "" },
      userAgent: { type: String, default: "" },
    },

    submittedByUserId: { type: mongoose.Schema.Types.ObjectId, default: null },
  },
  { timestamps: true },
);

EventRegistrationSchema.index({ eventId: 1, status: 1, createdAt: -1 });
EventRegistrationSchema.index({ eventId: 1, "leader.email": 1 });
EventRegistrationSchema.index({ eventId: 1, "leader.mobile": 1 });

export const EventRegistrationModel = mongoose.model("EventRegistration", EventRegistrationSchema);
```

---

# 6. Validation Rules (Critical)

Backend must enforce these rules.

## 6.1 Basic

- `eventId` required
- `registrationType` required
- `leader.fullName`, `leader.email`, `leader.mobile` required
- both mandatory consents must be `true`

## 6.2 Team Logic

If `registrationType = Team`:

- `teamName` required
- `teamSize >= 2`
- `teamSize <= config.maxTeamSize`
- `members.length = teamSize - 1`

If `registrationType = Solo`:

- `teamName` empty
- `teamSize = 1`
- `members.length = 0`

## 6.3 Identity and Contact

- email format valid
- mobile format valid (E.164 recommended)
- Aadhaar optional unless required by event config
- if Aadhaar provided: exactly 12 digits before encryption

## 6.4 Duplicate Prevention

Within same event, block duplicates based on config:

- leader/member email duplicates
- leader/member mobile duplicates
- collegeId duplicates (optional)

Also block duplicates inside same payload:

- no repeated email/mobile among leader + members

## 6.5 RSVP Window and Capacity

- reject submissions if RSVP disabled
- reject submissions before `startsAt` or after `endsAt`
- if capacity reached:
  - set `Waitlisted` when waitlist enabled
  - else return registration closed error

## 6.6 Custom Questions

- required questions must have answers
- response type must match question type
- options must be valid for select-based questions

---

# 7. Zod Validation Example

```ts
import { z } from "zod";

const participantSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  mobile: z.string().min(8).max(20),
  collegeName: z.string().optional(),
  collegeId: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
});

export const createRSVPSchema = z
  .object({
    eventId: z.string().min(1),
    registrationType: z.enum(["Solo", "Team"]),
    teamName: z.string().optional(),
    teamSize: z.number().int().min(1),

    leader: participantSchema.extend({
      aadhaarNumber: z.string().regex(/^\d{12}$/).optional(),
    }),

    members: z.array(participantSchema).default([]),

    consents: z.object({
      eventRulesAccepted: z.literal(true),
      dataProcessingAccepted: z.literal(true),
      privacyPolicyVersion: z.string().min(1),
      termsVersion: z.string().min(1),
      marketingOptIn: z.boolean().optional(),
    }),

    customResponses: z
      .array(
        z.object({
          questionId: z.string().min(1),
          answer: z.any(),
        }),
      )
      .default([]),
  })
  .superRefine((payload, ctx) => {
    if (payload.registrationType === "Team") {
      if (!payload.teamName || payload.teamName.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["teamName"],
          message: "teamName is required for team registration",
        });
      }

      if (payload.teamSize < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["teamSize"],
          message: "teamSize must be at least 2 for team registration",
        });
      }

      if (payload.members.length !== payload.teamSize - 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["members"],
          message: "members length must be teamSize - 1",
        });
      }
    }

    if (payload.registrationType === "Solo") {
      if (payload.teamSize !== 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["teamSize"],
          message: "teamSize must be 1 for solo registration",
        });
      }

      if (payload.members.length !== 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["members"],
          message: "members must be empty for solo registration",
        });
      }
    }
  });
```

---

# 8. API Endpoints

## 8.1 Public RSVP Endpoints

```text
POST /api/v1/events/:eventId/rsvp
GET  /api/v1/events/:eventId/rsvp/:registrationId
PATCH /api/v1/events/:eventId/rsvp/:registrationId
POST /api/v1/events/:eventId/rsvp/:registrationId/cancel
```

## 8.2 Admin Registration Endpoints

```text
GET   /api/v1/events/:eventId/registrations
GET   /api/v1/events/:eventId/registrations/:registrationId
PATCH /api/v1/events/:eventId/registrations/:registrationId/approve
PATCH /api/v1/events/:eventId/registrations/:registrationId/reject
PATCH /api/v1/events/:eventId/registrations/:registrationId/waitlist
PATCH /api/v1/events/:eventId/registrations/:registrationId/check-in
GET   /api/v1/events/:eventId/registrations/export?format=csv
```

## 8.3 RSVP Config Endpoints

```text
GET   /api/v1/events/:eventId/rsvp-config
PATCH /api/v1/events/:eventId/rsvp-config
```

Admin list query support:

```text
search
status
registrationType
checkedIn
page
limit
sort
```

---

# 9. Controller and Service Responsibilities

Controller layer:

- parse request
- validate request body and params
- call service layer
- return standardized API response

Service layer:

- load event and RSVP config
- enforce business rules and duplicate policy
- encrypt sensitive fields before save
- assign registration number
- write audit logs
- trigger notifications

---

# 10. Status Lifecycle

```text
Pending -> Approved -> CheckedIn
Pending -> Rejected
Pending -> Waitlisted -> Approved
Approved -> Cancelled
```

Rules:

- check-in allowed only when status is `Approved`
- rejected registrations cannot be checked-in
- waitlisted registration can be promoted to approved

---

# 11. Security and Compliance

Because this system may collect Aadhaar and personal data, apply strict controls.

## 11.1 Sensitive Data Handling

- never store raw Aadhaar in plaintext
- encrypt at rest (`aadhaarEncrypted`)
- store only `aadhaarLast4` for display
- mask Aadhaar in all API responses and exports

## 11.2 Access Controls

- public endpoint only for create and self-view/update (tokenized or authenticated)
- admin endpoints limited to `Owner`, `Admin`, `Organizer`
- enforce community-level authorization on every query

## 11.3 Operational Security

- rate limit RSVP submission endpoint
- CAPTCHA for public forms
- IP and userAgent tracking for abuse detection
- audit logs for status changes and data export

## 11.4 Data Retention

- define retention period per data category
- allow deletion/anonymization workflows when legally required

---

# 12. Duplicate and Fraud Protection

Recommended checks before save:

- duplicate email/mobile in same event
- duplicate person in same team payload
- team member cannot also be leader in same submission
- block disposable email domains (optional)
- optional OTP verification for mobile/email

---

# 13. Admin Panel Requirements

Admin should see:

- registration number
- team name
- leader details
- member count and member list
- college and city
- current status
- check-in status
- submission timestamp

Admin actions:

- approve
- reject (with reason)
- waitlist
- check-in
- export CSV

---

# 14. Integration with Existing CommDesk Docs

Related system documents:

- [CommDesk Participant Platform System](./CommDesk-Participant-Platform-System.md)
- [CommDesk Event System](./CommDesk-Event-System.md)
- [CommDesk Judging System](./CommDesk-Judging-System.md)
- [CommDesk Member Creation and Onboarding System](./CommDesk-Member-System.md)
- [Community Signup System](./Community-Signup-System.md)

Integration notes:

- `eventId` and `communityId` derive from Event System
- approved RSVP leader can be promoted to Member through Member System onboarding
- community-level auth policies align with Community Signup and role model

---

# 15. Important Fields Checklist

Do not ship RSVP without these fields and controls.

1. Event context:

- `eventId`
- `communityId`
- registration window controls

2. Registration mode:

- `registrationType`
- team rules (`teamName`, `teamSize`, `members`)

3. Leader identity and contact:

- `fullName`
- `email`
- `mobile`
- city/state/country

4. Compliance and consent:

- event rules acceptance
- data processing acceptance
- policy version snapshots

5. Workflow and operations:

- `status`
- `statusReason`
- `checkedIn`
- `registrationNumber`

6. Security:

- encryption for sensitive identity fields
- rate limiting and abuse checks
- audit logs for admin actions

---

# 16. Weak Points If Missed

1. Missing consent version capture:

- legal disputes become hard to defend.

2. Missing duplicate checks across team and event:

- fake or repeated registrations increase drastically.

3. Storing Aadhaar plaintext:

- critical data breach and compliance risk.

4. No registration window enforcement:

- users can register after deadline.

5. No status reason on reject:

- poor admin traceability and user experience.

6. No export audit logs:

- sensitive data can be extracted without trace.

7. No index strategy:

- admin list becomes slow for large events.

8. No check-in gate:

- unapproved participants can be checked-in.

9. No configurable team size:

- hackathon rules become hardcoded and fragile.

10. No custom questions support:

- product cannot support diverse event types.

---

# 17. Final User Flow

```text
Open RSVP page
 -> Event context selected
 -> Choose Solo or Team
 -> Fill leader details
 -> Fill members (if team)
 -> Accept terms and data consent
 -> Submit RSVP
 -> Registration saved (Pending or Waitlisted)
 -> Admin reviews and updates status
 -> Approved participant checks in on event day
```

---

# 18. Final Result

This design gives CommDesk a flexible, secure, and scalable RSVP system with full support for solo and team events.

Delivered capabilities:

- complete identity and contact capture
- team registration logic and validation
- configurable custom questions
- admin workflow and exports
- strict security for sensitive data
- production-ready API and schema design
