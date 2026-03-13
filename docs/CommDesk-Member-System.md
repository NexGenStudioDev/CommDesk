# CommDesk Member Creation & Onboarding System

This system powers **how communities add, invite, and onboard members**.

It supports:

- manual member creation
- automated onboarding
- website integrations
- hackathon registrations
- volunteer management
- sponsor/judge onboarding

Everything flows through **one secure onboarding pipeline**.

---

# 1. System Stack

CommDesk uses a modern stack.

Desktop application built with
Tauri

Frontend UI built with
React

Backend API built with
Node.js
and
Express

Database:

```
MongoDB
```

Email system:

```
Resend / SendGrid / AWS SES
```

---

# 2. Main Goal of Member System

The member system allows communities to:

```
add members
invite volunteers
onboard hackathon participants
register mentors
add judges
add sponsors
manage roles
integrate onboarding with websites
```

CommDesk becomes the **central identity system for communities**.

---

# 3. Core System Concepts

The most important concept is **User vs Member**.

```
User → authentication account
Member → role inside community
```

Example:

```
User
  email: john@example.com

Member
  community: Apex Circle
  role: Mentor
```

This allows:

```
one user → multiple communities
```

Example:

```
User: Alice

Member:
  GDG Ranchi → Volunteer
  Apex Circle → Mentor
```

---

# 4. Member Status Lifecycle

Members move through different states.

```
On Boarding
      ↓
Active
      ↓
Inactive
      ↓
Suspended
      ↓
Banned
```

Default when created:

```
On Boarding
```

Meaning:

```
invited but not activated
```

---

# 5. Onboarding Methods

CommDesk supports **three onboarding methods**.

---

## Method 1 — Dashboard Add Member

Community owner adds member manually.

Used for:

```
mentors
organizers
team members
```

Endpoint:

```
POST /api/v1/members
```

Authentication:

```
JWT
```

Used by:

```
owner
organizer
admin
```

---

## Method 2 — API Onboarding

Used by external systems.

Examples:

```
community website
hackathon website
event registration form
```

Endpoint:

```
POST /api/v1/members
```

Authentication:

```
API KEY
```

Example header:

```
Authorization: Bearer cd_live_92hfh3hf
```

---

## Method 3 — Bulk Import

Import hundreds of members at once.

Examples:

```
volunteers
students
hackathon participants
```

Endpoint:

```
POST /api/v1/members/import
```

Upload format:

```
CSV
```

Example CSV:

```
firstName,lastName,email,role
John,Doe,john@email.com,Volunteer
Alice,Lee,alice@email.com,Mentor
```

---

# 6. Unified Member Creation API

Instead of separate APIs, use **one clean API**.

```
POST /api/v1/members
```

The backend detects authentication type:

```
JWT → dashboard request
API KEY → external onboarding
```

---

# 7. Request Payload

Example request:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "primaryRole": "Mentor",
  "location": "Berlin",
  "skills": ["React", "Node"],
  "areaOfInterest": ["MENTORSHIP"],
  "internalNotes": "Speaker for React workshops",
  "accessLevel": {
    "internalDashboard": true,
    "comunityForum": true,
    "adminControls": false,
    "superAdmin": false
  }
}
```

---

# 8. Backend Member Creation Flow

Backend executes these steps:

```
validate request
identify community
check duplicate email
create user account if needed
create member record
set status = On Boarding
generate activation token
send onboarding email
log audit event
```

---

# 9. Activation System

Members must activate account.

Activation email includes:

```
secure activation token
activation link
```

Example link:

```
https://commdesk.app/activate?token=abc123
```

---

# 10. Activation API

```
POST /api/v1/auth/activate-member
```

Request:

```json
{
  "token": "abc123",
  "password": "NewSecurePassword"
}
```

Backend flow:

```
verify token
hash password
activate account
membershipStatus → Active
```

---

# 11. Password Security

Never send passwords in email.

Instead use:

```
activation link
```

Benefits:

```
secure
modern onboarding
no password leaks
```

---

# 12. Member Database Schema

Example MongoDB document.

```
Member
{
  _id
  communityId
  userId

  firstName
  lastName
  email

  primaryRole
  location

  skills
  areaOfInterest

  internalNotes

  membershipStatus

  accessLevel

  profilePhotoUrl

  onboardingSource

  createdBy
  createdAt
}
```

---

# 13. User Schema

```
User
{
  _id
  email
  passwordHash
  emailVerified
  createdAt
}
```

---

# 14. API Key System

Communities generate API keys.

Example key:

```
cd_live_9f83hf93
```

Database schema:

```
ApiKey
{
  keyHash
  communityId
  permissions
  createdBy
  active
}
```

Permissions example:

```
member:create
member:read
event:create
hackathon:register
```

---

# 15. Plug-and-Play Integrations

CommDesk APIs allow communities to connect with:

```
community websites
hackathon portals
event landing pages
discord bots
mobile apps
```

Examples:

Show members on website:

```
GET /api/v1/members
```

Register participant:

```
POST /api/v1/members
```

---

# 16. Role System

Roles control what members can do.

Examples:

```
Founder
System Admin
Organizer
Mentor
Volunteer
Member
Judge
Sponsor
```

Permissions control:

```
event creation
member management
admin dashboard
API management
```

---

# 17. Access Level System

Your UI already includes:

```
internalDashboard
comunityForum
adminControls
superAdmin
```

These determine internal permissions.

---

# 18. Audit Logging

Every important action is logged.

Examples:

```
member_created
member_invited
member_activated
member_role_changed
member_removed
```

Schema:

```
AuditLog
{
 actorId
 action
 communityId
 metadata
 createdAt
}
```

---

# 19. Security Improvements

Important protections.

### Rate Limiting

```
100 onboarding requests/hour per API key
```

---

### Input Validation

Use:

```
Zod
```

---

### Duplicate Protection

Prevent:

```
duplicate email
duplicate domain
```

---

### API Abuse Protection

```
IP tracking
API key throttling
```

---

# 20. Email System

Email templates required:

```
member_invitation
account_activation
password_reset
member_role_update
```

Recommended email services:

```
Resend
SendGrid
AWS SES
```

---

# 21. Analytics

Track onboarding performance.

Example metrics:

```
members added
members activated
API onboarding
bulk imports
```

Endpoint:

```
GET /analytics/members
```

---

# 22. Desktop Integration

In the CommDesk desktop app:

```
Add Member page
Member List
Invitation Tracking
Role Management
```

Desktop benefits:

```
fast UI
native notifications
offline support
secure runtime
```

---

# 23. Final End-to-End Flow

Dashboard onboarding:

```
owner logs in
      ↓
adds member
      ↓
status = On Boarding
      ↓
activation email sent
      ↓
member activates account
      ↓
status = Active
```

External onboarding:

```
community website form
      ↓
CommDesk API
      ↓
member created
      ↓
activation email sent
```

---
