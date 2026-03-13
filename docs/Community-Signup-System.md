# CommDesk – Community Signup System

## Overview

This document defines the **complete Community Signup System** for CommDesk.

The goal is to allow **real communities and organizations to register on the platform**, create their workspace, and start managing their members, events, and operations.

Only **community owners / organizers** can register a new community.

Individual users **cannot create accounts without a community**.

---

# Goals

The community signup system must:

- allow legitimate communities to join CommDesk
- create the first **Community Owner account**
- create the **community workspace**
- verify identity using email and optional website
- prevent spam and fake registrations
- send the community for **admin approval**
- activate the workspace after approval

---

# Community-First Model

CommDesk uses a **community-first architecture**.

Instead of users registering first, the system works like this:

```
Community registers
        ↓
Community Owner account created
        ↓
Community verification
        ↓
Admin approval
        ↓
Community workspace activated
```

This ensures the platform is used only by **real communities**.

---

# Community Signup Flow

Complete signup process:

```
Organizer opens CommDesk
        ↓
Clicks "Register Community"
        ↓
Fills community information
        ↓
Creates owner account
        ↓
Submits signup request
        ↓
Email verification
        ↓
Community status = Pending
        ↓
Super Admin reviews
        ↓
Community approved
        ↓
Community workspace activated
```

---

# Signup API

Endpoint:

```
POST /api/v1/auth/signup-community
```

Purpose:

- create community
- create community owner account
- send verification email
- start admin approval process

---

# Signup Form Fields

## Community Information

Required fields:

- communityName
- communityBio
- communityLogo (optional)
- communityWebsite (recommended)
- country
- city

Example:

```
Community Name: Apex Circle
Bio: Developer community focused on open source and hackathons
Website: https://apexcircle.dev
Country: India
City: Ranchi
```

---

## Official Contact Information

Required:

- officialEmail
- contactPhone

Example:

```
officialEmail: team@apexcircle.dev
contactPhone: +91XXXXXXXXXX
```

This email becomes the **primary administrative contact**.

---

## Social Media Links (Recommended)

These help verify real communities.

Possible fields:

- github
- discord
- twitter
- linkedin
- youtube
- instagram

Example:

```
github: https://github.com/apexcircle
discord: https://discord.gg/apexcircle
twitter: https://twitter.com/apexcircle
```

---

## Organizer Account

The organizer creating the community must create an account.

Fields:

- fullName
- email
- password

Example:

```
Name: Abhishek Gupta
Email: abhishek@example.com
Password: securePassword
```

The first account automatically becomes:

```
Community Owner
```

---

# Backend Signup Workflow

When the signup API is called, the backend performs these steps:

```
validate request data
        ↓
check if community name already exists
        ↓
check if organizer email already exists
        ↓
create community record
        ↓
create organizer user account
        ↓
assign Community Owner role
        ↓
generate email verification token
        ↓
send verification email
        ↓
set community status = pending
        ↓
create audit log entry
```

---

# Community Status Lifecycle

Communities move through these states.

```
pending
        ↓
under_review
        ↓
approved
        ↓
active
```

Possible states:

- pending
- under_review
- approved
- rejected
- suspended

Only **approved communities can access the platform**.

---

# Email Verification

After signup, the organizer must verify their email.

Verification link example:

```
https://commdesk.app/verify-email?token=abc123
```

Verification endpoint:

```
POST /api/v1/auth/verify-email
```

Request:

```
token
```

Once verified:

```
emailVerified = true
```

---

# Community Database Schema

Example MongoDB structure:

```
Community
{
  _id
  name
  slug
  bio
  logo
  website

  officialEmail
  contactPhone

  country
  city

  socialLinks

  status

  createdBy
  createdAt
}
```

---

# User Schema

```
User
{
  _id
  fullName
  email
  passwordHash
  emailVerified
  role
  communityId
  createdAt
}
```

Role for first user:

```
CommunityOwner
```

---

# Slug Generation

Each community should have a unique slug.

Example:

```
apex-circle
gdg-ranchi
open-source-club
```

Used for:

```
commdesk.app/community/apex-circle
```

---

# Security Requirements

The signup system must include several protections.

### Password Security

Passwords must be hashed using:

```
bcrypt
```

---

### Input Validation

All fields must be validated using:

```
Zod
```

Example checks:

- valid email
- minimum password length
- valid URL for website

---

### Rate Limiting

Prevent signup spam.

Example rule:

```
5 signup attempts per IP per hour
```

---

### Duplicate Detection

Prevent duplicate communities.

Checks:

- community name
- official email
- domain

---

# Admin Approval System

After signup, communities appear in the **Admin Review Panel**.

Admins can:

- approve community
- reject community
- request additional verification
- suspend community

Admin endpoint:

```
PATCH /api/v1/admin/communities/:id/status
```

---

# Audit Logging

Every signup action must be logged.

Examples:

```
community_signup
organizer_account_created
email_verified
community_approved
community_rejected
```

Audit log schema:

```
AuditLog
{
  actorId
  action
  metadata
  createdAt
}
```

---

# Email Templates

Required templates:

- community_signup_confirmation
- email_verification
- community_approved
- community_rejected

Example email:

```
Subject: Welcome to CommDesk

Hello Abhishek,

Your community Apex Circle has been registered.

Please verify your email to continue.

Verification link:
https://commdesk.app/verify-email?token=abc123
```

---

# Desktop Application Integration

After approval, the organizer can log in using the **CommDesk desktop application**.

Once logged in, the workspace will include:

- community dashboard
- member management
- role management
- event creation
- hackathon management
- API integrations
- analytics

---

# Final Workflow

Complete lifecycle:

```
Organizer registers community
        ↓
Email verification
        ↓
Community status = pending
        ↓
Admin reviews community
        ↓
Community approved
        ↓
Organizer logs into desktop app
        ↓
Community workspace created
```
