# CommDesk Integration and Webhook System

## Overview

This document defines the external integration and webhook architecture for CommDesk.

Purpose:

- allow communities and partners to integrate CommDesk with external systems
- deliver reliable lifecycle events to third-party endpoints
- keep integration behavior secure, auditable, and replayable
- prevent data drift between CommDesk and connected tools

This system supports both pull and push integrations:

- pull: API access using scoped API keys
- push: webhook subscriptions and event delivery

Related docs:

- [CommDesk Overall System Master Guide](./CommDesk-Overall-System-Summary.md)
- [CommDesk Event System](./CommDesk-Event-System.md)
- [CommDesk RSVP System](./CommDesk-RSVP-System.md)
- [CommDesk Check-In and Badge System](./CommDesk-CheckIn-and-Badge-System.md)
- [CommDesk Participant Platform System](./CommDesk-Participant-Platform-System.md)
- [CommDesk Judging System](./CommDesk-Judging-System.md)
- [CommDesk Sponsor and Partner System](./CommDesk-Sponsor-Partner-System.md)
- [CommDesk Community Trust, Review, and AI Scoring System](./CommDesk-Community-Trust-Scoring-System.md)
- [CommDesk Frontend Boundary System (Desktop + Website)](./CommDesk-Frontend-Boundary-System.md)

---

## 1. Goals

Integration system must:

- expose stable API contracts for external systems
- emit lifecycle events through webhooks with delivery guarantees
- provide idempotency and replay safety
- support fine-grained API key permissions
- isolate integrations by `communityId`
- provide complete audit logs for all integration actions

---

## 2. Integration Modes

## 2.1 API Pull Mode

External systems call CommDesk APIs using scoped API keys.

Examples:

- community website reading published events
- partner CRM syncing sponsor applications
- internal BI tool pulling RSVP analytics

## 2.2 Webhook Push Mode

CommDesk pushes event payloads to subscriber endpoints.

Examples:

- send `rsvp_submitted` to Discord bot backend
- send `leaderboard_published` to marketing automation
- send `certificate_issued` to credential verifier

## 2.3 Hybrid Mode

Best practice:

- webhook for trigger
- API pull for full object detail

This reduces payload size while preserving data freshness.

---

## 3. High-Level Architecture

```text
Domain Action (Event/RSVP/Judging/etc.)
-> Domain Event Recorded
-> Outbox Entry Created (same transaction)
-> Webhook Dispatcher picks pending entries
-> Signs + delivers payload
-> Success: mark delivered
-> Failure: retry with backoff
-> Max attempts reached: Dead Letter Queue
```

Core components:

- `IntegrationSubscriptionService`
- `OutboxEventStore`
- `WebhookDispatcher`
- `DeliveryAttemptLogger`
- `DeadLetterQueue`
- `ReplayService`

---

## 4. Event Taxonomy and Naming

## 4.1 Naming Convention

Use lowercase snake_case event names.

Pattern:

```text
<domain>_<action>
```

Examples:

- `community_signup_requested`
- `community_approved`
- `member_created`
- `event_published`
- `rsvp_submitted`
- `rsvp_promoted_from_waitlist`
- `submission_finalized`
- `score_submitted`
- `round_finalized`
- `leaderboard_published`
- `contract_signed`
- `payment_released`
- `certificate_issued`
- `community_trust_score_updated`

## 4.2 Versioning

Every event type must include version:

```text
eventType: rsvp_submitted
eventVersion: 1
```

Breaking payload changes require incrementing `eventVersion`.

---

## 5. Canonical Webhook Envelope

Every webhook must use one envelope format.

```json
{
  "id": "wh_evt_01JXYZ...",
  "eventType": "rsvp_submitted",
  "eventVersion": 1,
  "occurredAt": "2026-03-18T10:22:40.000Z",
  "communityId": "cmty_123",
  "resource": {
    "type": "registration",
    "id": "reg_456"
  },
  "actor": {
    "type": "user",
    "id": "usr_789"
  },
  "data": {},
  "meta": {
    "traceId": "trc_abc",
    "deliveryAttempt": 1,
    "source": "commdesk-api"
  }
}
```

Envelope rules:

- `id` globally unique
- `occurredAt` immutable
- `communityId` always present for scoped domains
- `data` schema depends on `eventType` + `eventVersion`

---

## 6. Webhook Subscription Model

## 6.1 Subscription Fields

```text
subscriptionId
communityId
endpointUrl
secretHash
status (Active | Paused | Disabled)
subscribedEvents[]
filterRules
createdBy
createdAt
updatedAt
```

## 6.2 Subscription Scoping

Rules:

- community-level subscribers receive only their `communityId` events
- platform-level integrations require elevated permissions
- sensitive event families require explicit allowlist

## 6.3 Endpoint Verification

At subscription creation:

- send verification challenge request
- require successful response before activation

---

## 7. Security Model

## 7.1 Request Signing

Use HMAC SHA-256 signatures.

Headers:

```text
X-CommDesk-Webhook-Id
X-CommDesk-Event-Type
X-CommDesk-Event-Version
X-CommDesk-Timestamp
X-CommDesk-Signature
```

Signature base:

```text
timestamp + "." + rawRequestBody
```

Receiver validates:

- HMAC match
- timestamp tolerance window (for replay protection)

## 7.2 Replay Protection

Receiver should reject duplicate `X-CommDesk-Webhook-Id` values.

CommDesk should include short timestamp window validation guidance (for example, +/- 5 minutes).

## 7.3 API Key Security

API keys must be:

- generated once and shown once
- stored as hash only
- scoped by permissions
- revocable and rotatable

---

## 8. Delivery Guarantees and Retry Policy

## 8.1 Delivery Semantics

Webhook delivery is at-least-once.

Consumers must implement idempotency.

## 8.2 Success Criteria

Treat HTTP `2xx` as delivered.

Any non-`2xx` or timeout triggers retry.

## 8.3 Retry Schedule

Recommended exponential backoff:

```text
attempt1: immediate
attempt2: +30s
attempt3: +2m
attempt4: +10m
attempt5: +30m
attempt6: +2h
attempt7: +8h
attempt8: +24h (final)
```

After final failure:

- move event to Dead Letter Queue
- notify integration owner/admin

## 8.4 Timeout and Payload Limits

Recommended defaults:

- connect timeout: 5s
- response timeout: 10s
- payload size cap: 256KB

Large data should be fetched via API using resource ID.

---

## 9. Ordering, Idempotency, and Consistency

## 9.1 Ordering

Strict global ordering is not guaranteed.

Best-effort ordering per `(subscriptionId, resource.id)` is recommended.

## 9.2 Idempotency

Receiver must de-duplicate by webhook envelope `id`.

CommDesk should provide idempotency key for sensitive write APIs:

```text
Idempotency-Key: <uuid>
```

## 9.3 Eventual Consistency

Webhook payload may arrive before all read models are fully materialized.

Consumer best practice:

- process trigger
- optionally fetch canonical data from API

---

## 10. Dead Letter Queue and Replay

## 10.1 Dead Letter Queue (DLQ)

When max retries fail, store:

```text
webhookId
subscriptionId
eventType
payloadSnapshot
lastError
attemptCount
failedAt
```

## 10.2 Replay APIs

```text
POST /api/v1/integrations/webhooks/dlq/:webhookId/replay
POST /api/v1/integrations/webhooks/replay
```

Replay must keep original `id` for traceability and include replay metadata.

---

## 11. Integration Events by Domain

## 11.1 Community and Member

- `community_signup_requested`
- `community_approved`
- `community_rejected`
- `member_created`
- `member_activated`

## 11.2 Event and RSVP

- `event_created`
- `event_published`
- `event_archived`
- `rsvp_submitted`
- `rsvp_approved`
- `rsvp_rejected`
- `rsvp_waitlisted`
- `rsvp_promoted_from_waitlist`
- `rsvp_checked_in`
- `check_in_window_opened`
- `check_in_successful`
- `check_in_revoked`

## 11.3 Check-In and Badge

- `badge_generated`
- `badge_printed`
- `badge_issued`
- `badge_reprinted`
- `badge_revoked`

## 11.4 Team, Submission, Judging

- `team_created`
- `team_join_request_submitted`
- `submission_finalized`
- `score_submitted`
- `round_finalized`
- `leaderboard_published`
- `winner_announced`

## 11.5 Sponsor and Revenue

- `sponsor_application_submitted`
- `request_negotiation_started`
- `deal_accepted`
- `contract_signed`
- `payment_released`

## 11.6 Trust and Certificates

- `event_review_submitted`
- `community_trust_score_updated`
- `certificate_issued`

---

## 12. API Contract

## 12.1 Subscription Management

```text
POST   /api/v1/integrations/webhooks/subscriptions
GET    /api/v1/integrations/webhooks/subscriptions
GET    /api/v1/integrations/webhooks/subscriptions/:subscriptionId
PATCH  /api/v1/integrations/webhooks/subscriptions/:subscriptionId
DELETE /api/v1/integrations/webhooks/subscriptions/:subscriptionId
POST   /api/v1/integrations/webhooks/subscriptions/:subscriptionId/pause
POST   /api/v1/integrations/webhooks/subscriptions/:subscriptionId/resume
```

## 12.2 Delivery Monitoring

```text
GET /api/v1/integrations/webhooks/deliveries
GET /api/v1/integrations/webhooks/deliveries/:deliveryId
GET /api/v1/integrations/webhooks/dlq
```

## 12.3 Secret Rotation

```text
POST /api/v1/integrations/webhooks/subscriptions/:subscriptionId/rotate-secret
```

## 12.4 Test Webhook

```text
POST /api/v1/integrations/webhooks/subscriptions/:subscriptionId/test
```

---

## 13. Error Codes

Standard integration error codes:

- `INTEGRATION_UNAUTHORIZED`
- `WEBHOOK_SIGNATURE_INVALID`
- `WEBHOOK_TIMESTAMP_EXPIRED`
- `WEBHOOK_ENDPOINT_UNREACHABLE`
- `WEBHOOK_RETRY_EXHAUSTED`
- `WEBHOOK_SUBSCRIPTION_DISABLED`
- `EVENT_VERSION_UNSUPPORTED`
- `IDEMPOTENCY_KEY_REUSED`
- `RATE_LIMIT_EXCEEDED`

---

## 14. Observability and SLOs

Track per subscription and global metrics:

- delivery success rate
- p50/p95 delivery latency
- retry rate
- DLQ volume
- replay success rate
- signature validation failure rate

Suggested SLO baseline:

- 99% of webhook deliveries succeed within 5 minutes (including retries)

Operational dashboards should include:

- top failing endpoints
- top failing event types
- sustained retry storms

---

## 15. Frontend Ownership and UX Surface

Aligned with frontend boundary rules.

## 15.1 Desktop Ownership

Desktop should own integration operations UI:

- create and manage webhook subscriptions
- pause/resume/revoke endpoints
- rotate secrets
- view failures and replay DLQ events

## 15.2 Website Ownership

Website may expose read-only integration status badges for transparency use-cases but should not own integration administration.

## 15.3 No-Duplication Rule

Do not create two integration admin panels across desktop and website.

---

## 16. Data Model Outline

Recommended collections:

- `IntegrationSubscription`
- `IntegrationApiKey`
- `OutboxEvent`
- `WebhookDeliveryAttempt`
- `WebhookDeadLetter`
- `WebhookReplayAudit`
- `IntegrationAuditLog`

Indexes to prioritize:

- `(communityId, status)` on subscriptions
- `(status, nextAttemptAt)` on outbox deliveries
- `(subscriptionId, createdAt)` on delivery attempts
- unique `(idempotencyKey, route, communityId)` for protected writes

---

## 17. Compliance and Governance

Required controls:

- audit every subscription change and secret rotation
- redact secrets and sensitive payload fields in logs
- enforce per-community rate limits
- allow emergency kill switch for abusive endpoints

Retention guidance:

- delivery attempts: 30-90 days
- DLQ records: 90-180 days
- audit logs: per compliance policy

---

## 18. Test Strategy

Must-have tests:

- signature generation and validation tests
- retry and backoff schedule tests
- timeout and non-2xx handling tests
- idempotency behavior tests
- DLQ and replay workflow tests
- event version compatibility tests

Chaos testing recommendations:

- endpoint flapping (intermittent failure)
- high-latency targets
- burst event volumes

---

## 19. Rollout Plan

Phase 1:

- subscription management
- signed webhook delivery
- retry + DLQ baseline

Phase 2:

- replay operations
- delivery observability dashboards
- secret rotation UX

Phase 3:

- advanced filters and per-event payload templates
- provider adapters and integration catalog

Phase 4:

- event schema registry and self-serve integration testing sandbox

---

## 20. Final Definition

One-line definition:

```text
CommDesk Integration and Webhook System is the secure event bridge that keeps external tools in sync with community lifecycle actions through signed, reliable, and replayable delivery.
```
