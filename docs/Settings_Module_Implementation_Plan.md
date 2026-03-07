# CommDesk Backend — Settings System Implementation Plan

This document explains how to build the **backend for the Settings section** of the CommDesk desktop application.

The backend will manage:

- Profile settings
- Integrations
- API documentation access
- Security settings
- Appearance settings
- API keys
- Request & response logs
- API analytics (charts & graphs)

The desktop application will communicate with this backend through **REST APIs**.

---

# 1. Technology Stack

Use the following backend technologies.

Backend framework
**Node.js + Express**

Language
**TypeScript**

Database
**MongoDB**

Database ODM
**Mongoose**

Authentication
**JWT**

Password Security
**bcrypt**

Validation
**Zod**

Logging
**Winston**

Environment Variables
**dotenv**

---

# 2. Install Required Packages

Install the required packages.

### Core Backend

```bash
pnpm add express cors dotenv mongoose
```

### Authentication

```bash
pnpm add jsonwebtoken bcrypt
```

### Validation

```bash
pnpm add zod
```

### Security

```bash
pnpm add helmet express-rate-limit
```

### Logging

```bash
pnpm add winston express-winston
```

### Utilities

```bash
pnpm add uuid crypto dayjs lodash
```

### Two Factor Authentication

```bash
pnpm add speakeasy qrcode
```

### Development Packages

```bash
pnpm add -D typescript ts-node nodemon
pnpm add -D @types/node @types/express
```

---

# 3. Backend Folder Structure

Use a **modular folder structure**.

```
backend
│
├── src
│
│   ├── config
│   │   ├── database.ts
│   │   └── env.ts
│
│   ├── middlewares
│   │   ├── auth.middleware.ts
│   │   ├── apiKey.middleware.ts
│   │   ├── requestLogger.middleware.ts
│   │   └── errorHandler.middleware.ts
│
│   ├── modules
│   │
│   │   ├── profile
│   │   ├── integrations
│   │   ├── security
│   │   ├── appearance
│   │   ├── apiKeys
│   │   ├── logs
│   │   └── analytics
│
│   ├── utils
│   │   ├── generateApiKey.ts
│   │   └── helpers.ts
│
│   ├── routes
│   │   └── index.ts
│
│   ├── app.ts
│   └── server.ts
```

Each module should contain:

- routes
- controller
- service
- validation

---

# 4. Authentication System

Before accessing settings, the user must log in.

Authentication should use **JWT tokens**.

Features required:

- login
- verify token
- refresh token
- logout

Middleware responsibilities:

- check if token is valid
- attach user data to request
- protect private routes

---

# 5. Profile Module

This module manages user account information.

Features:

- get profile
- update profile
- upload profile image
- change password

Security rules:

- passwords must be hashed with bcrypt
- email should be unique
- password updates require current password

---

# 6. Integrations Module

This module connects CommDesk with external services.

Possible integrations:

- GitHub
- Discord
- Slack
- Google Calendar
- Zoom

Backend responsibilities:

- store integration tokens
- track connection status
- allow connecting services
- allow disconnecting services

Integration endpoints should support:

- connect integration
- disconnect integration
- get integration status

---

# 7. API Documentation Module

This module provides developer information.

Responsibilities:

- return API base URL
- return documentation link
- return API version

Example documentation link:

```
https://commdesk.notion.site/api-docs
```

The desktop application should open this link when the user clicks **Open API Documentation**.

---

# 8. Security Module

This module manages account security.

Features:

### Change Password

User must enter:

- current password
- new password

Password must be hashed using bcrypt.

---

### Two Factor Authentication (2FA)

Use:

- **speakeasy** to generate OTP
- **qrcode** to generate QR code

Features:

- enable 2FA
- disable 2FA
- verify OTP code

---

### Session Management

Track active sessions.

Information stored:

- device
- IP address
- last activity

Users must be able to:

- view active sessions
- revoke sessions

---

# 9. Appearance Module

This module stores UI preferences.

Features:

- theme preference
- layout preference
- font size preference
- desktop behavior options

Backend responsibilities:

- store user preferences
- return preferences when app loads

---

# 10. API Key Management Module

This module allows developers to generate API keys.

API keys allow external apps to access CommDesk APIs.

Features:

- create API key
- list API keys
- disable API key
- regenerate API key
- delete API key

API keys should be generated using **cryptographically secure randomness**.

Example key format:

```
cd_live_xxxxxxxxxxxxxxxxx
```

Security rules:

- keys must be hashed before storing
- key should only be shown once during creation

---

# 11. Request & Response Logging Module

This module records all API activity.

Logging middleware should capture:

- API endpoint
- HTTP method
- response status
- response time
- IP address
- API key used

Use **Winston** to store logs.

Logs help with:

- debugging
- analytics
- security monitoring

---

# 12. API Analytics Module

This module powers charts in the desktop app.

Analytics should calculate:

### Total API Requests

Number of requests made.

---

### Requests Over Time

Requests grouped by time (minutes or hours).

---

### Response Status Distribution

Count responses by status:

- success
- client errors
- server errors

---

### Top API Endpoints

Most frequently used endpoints.

---

### Average Response Time

Average time taken to respond to requests.

These analytics endpoints will be used to generate charts.

---

# 13. Request Logging Middleware

Create middleware to capture request logs.

Responsibilities:

- start timer when request begins
- record response when request finishes
- save request metadata

This middleware should run on **every API request**.

---

# 14. Rate Limiting

Protect API from abuse.

Install:

```
express-rate-limit
```

Features:

- limit requests per minute
- limit requests per API key
- block suspicious traffic

---

# 15. Security Hardening

Install security middleware:

```
helmet
cors
```

Security protections include:

- secure HTTP headers
- CORS protection
- rate limiting
- API key validation
- JWT authentication

---

# 16. Error Handling

Implement centralized error handling.

Responsibilities:

- catch application errors
- return standardized responses
- log errors

Error response should include:

- status code
- message
- request ID

---

# 17. Environment Variables

Store configuration using dotenv.

Example variables:

```
PORT=
MONGO_URI=
JWT_SECRET=
API_PREFIX=
LOG_LEVEL=
```

---

# 18. Deployment

Recommended infrastructure:

Backend hosting:

- Render
- Railway
- AWS
- DigitalOcean

Database:

- MongoDB Atlas

Monitoring tools:

- Sentry
- Logtail

---

# 19. Development Order (Important)

Build the system in this order.

1. Authentication system
2. Profile module
3. API key system
4. Request logging middleware
5. Logs storage system
6. Analytics endpoints
7. Integrations module
8. Security module
9. Appearance settings
10. API documentation metadata

---
