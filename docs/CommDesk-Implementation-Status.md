# CommDesk Implementation Status Matrix (Android Branch)

## Purpose

This document separates target architecture from current implementation.

Many CommDesk docs describe the full target platform. This file tracks what is currently implemented in this repository branch so planning, estimates, and reviews stay grounded.

Reviewed on: 2026-03-18
Repository: NexGenStudioDev/CommDesk
Branch: Android

---

## How to Use This With Other Docs

- Use system docs as product and architecture contracts.
- Use this matrix as implementation reality for this repository.
- If there is a conflict, treat this file as the truth for what is currently shipped.

Related references:

- [CommDesk Overall System Master Guide](./CommDesk-Overall-System-Summary.md)
- [CommDesk Frontend Boundary System](./CommDesk-Frontend-Boundary-System.md)

---

## Status Legend

- Implemented: usable in current app build.
- Partial: present but mock/static/incomplete.
- Planned: documented only, not implemented in this repository yet.

---

## Current Application Surface (Observed)

Registered frontend routes in app shell:

- `/`
- `/dashboard`
- `/member`
- `/add-member`
- `/events`
- `/create-event`
- `/contact`

Desktop feature folders currently present:

- `src/features/AddMember`
- `src/features/Dashboard`
- `src/features/Events`
- `src/features/Member`
- `src/features/Contact_And_Support`

---

## Feature Status Matrix

| Area | Target Docs | Status | Current Reality in Repo | Next Documentation Action |
| --- | --- | --- | --- | --- |
| Desktop shell and navigation | Frontend Boundary, Overall Summary | Implemented | Routed desktop shell with sidebar and mobile nav exists | Keep route map in sync when routes are added |
| Dashboard | Overall Summary | Partial | Screen exists but still placeholder content | Add dashboard data contract and KPI definitions for MVP |
| Member list and member add UI | Member System | Partial | UI forms and tables exist, but API service file is empty | Add API contract mapping table (UI field -> backend field) |
| Event list page | Event System | Partial | Table and pagination work on static in-file data | Add list query contract and filter-state mapping |
| Event create page structure | Event System | Partial | Sectioned UI exists (basic info, date/schedule, capacity, settings, people panels) | Add "MVP fields required for publish" checklist |
| Speaker/Mentor/Judge compact/full panels | Event System | Implemented (UI) | Separate panels with search and compact/expanded toggle behavior exist | Document panel-level interaction acceptance criteria |
| Save Draft / Create Event actions | Event System | Partial | Buttons currently show alert handlers; no backend call wiring yet | Add API integration runbook and error-state UX spec |
| Partner/Sponsor panel in event create flow | Event System, Sponsor/Partner System | Partial | Display card grid exists with static partner data | Add member/organization linking contract |
| Contact and support module | Website System, Overall Summary | Partial | Desktop route and UI exist; backend workflow not verified in repo | Add lifecycle and ownership note for operations handoff |
| Auto update integration | README, updater docs | Implemented | Tauri updater check/install flow is wired in app startup | Add release troubleshooting section in docs |
| Backend API layer in this repo | Event, Member, RSVP, Judging docs | Planned | No production backend server module found in this repository | Keep backend blueprint docs marked as target-state |
| Website public platform routes | Website System | Planned | Public website route tree documented but not implemented in this desktop app repo | Keep website routes under phased roadmap and scope note |
| RSVP end-user flow | RSVP System | Planned | Contracts documented; no website implementation in this repo | Add explicit dependency on website codebase/workspace |
| Participant teams/submissions portal | Participant Platform System | Planned | Full lifecycle documented; not present in current desktop routes | Keep as roadmap with milestone-based acceptance criteria |
| Judging scoring portal | Judging System | Planned | Contracts and lifecycle documented; no active scoring UI found in current app routes | Add explicit owner timeline and integration checkpoints |
| Sponsor marketplace and deal lifecycle | Sponsor and Partner System | Planned | Rich contract doc exists; no end-to-end implementation in this repo | Add phase-gate checklist (marketplace -> deals -> contracts) |
| Community trust scoring | Trust Scoring System | Planned | Data model and logic documented; no runtime module in repo | Add data-source readiness checklist |
| Integration and webhooks | Integration and Webhook System | Planned | Event/webhook architecture documented; no active service in repo | Add "out of repo scope" note until service exists |
| Check-in and badge operations | Check-In and Badge System | Planned | Full spec exists; no check-in desk module in current app routes | Add rollout plan linked to RSVP approval lifecycle |
| Test coverage | All system docs | Planned | No test files found in frontend workspace for unit/integration/e2e | Add testing strategy doc for desktop frontend MVP |

---

## Documentation Gaps to Close Next

These system docs are referenced as planned dependencies and should be added soon:

- `CommDesk-Team-System.md`
- `CommDesk-Submission-System.md`
- `CommDesk-Auth-System.md`
- `CommDesk-Notification-System.md`

---

## Update Rule

Update this file whenever any of the below change:

- new route added to app shell
- API integration replaces mock/static data
- new backend service repository is linked for runtime features
- a planned module reaches MVP and becomes partially implemented

This file should be reviewed at least once per milestone release.
