# Permission-Based UI Rendering

## Overview

CommDesk uses a permission-based UI rendering system to decide which pages, buttons, actions, and management controls should be visible to a user.

This implementation combines:

- `TanStack Query` for fetching and caching permissions
- `Redux Toolkit` for storing permission state globally
- custom permission hooks for clean access checks
- reusable boundary and gate components for page-level and inline authorization

The goal is simple:

- show only the UI a user is allowed to use
- keep permission logic centralized
- make feature code easy to read and easy to extend
- avoid duplicated permission-check code across screens

This document explains why we use this system, how it works, and how to use it correctly in production code.

---

## Why We Use Permission-Based UI Rendering

### 1. Better security posture at the UI layer

The UI should not invite users to click actions they cannot perform.

Examples:

- hide `Create Event` if the user cannot create events
- hide `Delete Member` if the user cannot delete members
- hide `Send Email` if the user does not have contact email access

Important:

UI authorization is not a replacement for backend authorization. The backend must still validate permissions for every protected API action.

### 2. Better user experience

Without permission-aware rendering:

- users see buttons that fail later
- users get confusing error messages after clicking
- layout becomes noisy and misleading

With permission-aware rendering:

- the interface feels focused
- users only see relevant actions
- restricted areas can provide clear guidance instead of dead ends

### 3. Better maintainability

If every component checks permissions differently, the codebase becomes fragile.

This system keeps permission logic in one place so we can:

- update permission behavior globally
- reuse hooks and boundary components
- keep feature components readable

---

## High-Level Architecture

The permission system lives in `src/permissions/`.

### Main files

- `src/permissions/constants.ts`
  Contains permission keys such as `event:create` and `member:view`.

- `src/permissions/permission.service.ts`
  Fetches permissions for the current user and defines query keys.

- `src/permissions/PermissionBootstrap.tsx`
  Runs once near app startup, loads permissions through React Query, and syncs them into Redux.

- `src/store/permissionsSlice.ts`
  Stores granted permissions plus loading, error, and sync metadata.

- `src/permissions/useAuthorization.tsx`
  Exposes reusable hooks for permission checks:
  `useAuthorization`, `usePermissionMap`, and `PermissionGate`.

- `src/permissions/PermissionBoundary.tsx`
  Handles page-level permission states:
  loading, allowed, unauthorized.

- `src/permissions/PermissionLoading.tsx`
  Provides a clean loading state while access is being validated.

- `src/permissions/AccessDenied.tsx`
  Provides a reusable unauthorized state.

- `src/permissions/selectors.ts`
  Central Redux selectors for permission state.

- `src/permissions/utils.ts`
  Shared helpers for normalizing permission input and evaluating access.

---

## Data Flow

### Step 1: App starts

`PermissionBootstrap` mounts near the app root in `src/main.tsx`.

### Step 2: Permissions are fetched

The bootstrap component uses `TanStack Query` to fetch permissions for the current user role.

### Step 3: Permissions are cached

React Query caches the result and prevents unnecessary refetching during the cache window.

### Step 4: Permissions are stored globally

Once fetched, permissions are written into Redux so any component can read them quickly without re-implementing fetch logic.

### Step 5: Components consume permissions

Components use:

- `PermissionBoundary` for full-page access control
- `PermissionGate` for showing or hiding small UI sections
- `usePermissionMap` for components with multiple action buttons
- `useAuthorization` for lower-level custom logic

---

## Permission Constants

The system uses named constants instead of hard-coded strings.

Example:

```ts
export const Event_Permissions = {
  CREATE_EVENT: "event:create",
  UPDATE_EVENT: "event:update",
  DELETE_EVENT: "event:delete",
  VIEW_EVENT: "event:view",
  PUBLISH_EVENT: "event:publish",
  JOIN_EVENT: "event:join",
  LEAVE_EVENT: "event:leave",
} as const;
```

Why this matters:

- avoids typos
- improves autocomplete
- makes refactoring safer
- keeps permission usage consistent across modules

---

## When to Use Each API

### `PermissionBoundary`

Use for page-level or section-level protection when you need:

- a loading state
- an unauthorized fallback
- a protected content area

Example:

```tsx
<PermissionBoundary
  permission={Event_Permissions.VIEW_EVENT}
  loadingFallback={<PermissionLoading />}
  unauthorizedFallback={
    <AccessDenied
      title="Event access is unavailable"
      description="This view is only shown to members who can view event schedules."
    />
  }
>
  <EventTable events={events} itemsPerPage={5} />
</PermissionBoundary>
```

Use this when an entire page or major content area depends on access.

### `PermissionGate`

Use for small inline UI blocks such as:

- buttons
- cards
- menu items
- action groups

Example:

```tsx
<PermissionGate permission={Member_Permissions.CREATE_MEMBER}>
  <Button text="Add Member" onClick={handleAddMember} />
</PermissionGate>
```

Use this when you only want to hide or reveal specific UI fragments.

### `usePermissionMap`

Use when a component needs several action checks at once.

Example:

```tsx
const { canEdit, canDelete, canPublish } = usePermissionMap({
  canEdit: Event_Permissions.UPDATE_EVENT,
  canDelete: Event_Permissions.DELETE_EVENT,
  canPublish: Event_Permissions.PUBLISH_EVENT,
});
```

Why this is preferred:

- one hook call instead of many
- one consistent place to define action access
- component code stays readable

### `useAuthorization`

Use when you need lower-level control over access state.

It returns:

- `hasPermission`
- `permissions`
- `requestedPermissions`
- `isLoading`
- `isReady`
- `isError`
- `status`
- `error`

Example:

```tsx
const access = useAuthorization(Event_Permissions.CREATE_EVENT);

if (access.isLoading) return null;
if (!access.hasPermission) return <DeniedView />;
```

Use this only when `PermissionBoundary` or `PermissionGate` is not enough.

---

## Recommended Usage Patterns

### Pattern 1: Protect a full page

Best for:

- Member pages
- Event pages
- Project management pages
- Admin-only sections

Example:

```tsx
return (
  <div className="cd-page">
    <PageHeader />
    <PermissionBoundary
      permission={Project_Permissions.VIEW_PROJECT}
      loadingFallback={<PermissionLoading />}
      unauthorizedFallback={<AccessDenied title="No access" description="..." />}
    >
      <ProjectContent />
    </PermissionBoundary>
  </div>
);
```

### Pattern 2: Protect a single action button

Best for:

- Create
- Edit
- Delete
- Publish

Example:

```tsx
<PermissionGate permission={Event_Permissions.PUBLISH_EVENT}>
  <Button text="Publish Event" onClick={handlePublish} />
</PermissionGate>
```

### Pattern 3: Handle multiple related actions

Best for:

- table action columns
- cards with action bars
- admin tool panels

Example:

```tsx
const { canEdit, canDelete } = usePermissionMap({
  canEdit: Member_Permissions.UPDATE_MEMBER,
  canDelete: Member_Permissions.DELETE_MEMBER,
});
```

Then:

```tsx
{canEdit && <button>Edit</button>}
{canDelete && <button>Delete</button>}
```

---

## Production Guidelines

### 1. Never hard-code permission strings inside feature components

Do this:

```tsx
permission={Event_Permissions.CREATE_EVENT}
```

Not this:

```tsx
permission="event:create"
```

### 2. Prefer boundaries for pages

If an entire page depends on permission, use `PermissionBoundary` instead of manual `if` chains.

This keeps page code cleaner and more consistent.

### 3. Prefer `usePermissionMap` for action-heavy components

This is more maintainable than calling `useAuthorization` many times in the same component.

### 4. Keep unauthorized UI honest

Avoid showing:

- fake action icons
- disabled-looking controls that still work
- menus with no valid action

If a user cannot perform an action, either:

- hide it
- or present a clear read-only state

### 5. Handle loading intentionally

Do not render unauthorized fallbacks before permission loading completes.

That creates a flash of wrong content.

Use:

- `PermissionBoundary` with `loadingFallback`
- or `PermissionGate` with `loadingFallback`
- or `useAuthorization` with `isLoading`

### 6. Keep backend and frontend authorization aligned

Frontend permissions improve UX.
Backend permissions enforce security.

Both are required.

---

## Why Redux and React Query Together

This is a common question.

### Why not only React Query?

React Query is excellent for:

- fetching
- caching
- server-state freshness

But UI code often wants lightweight global reads without repeating query usage everywhere.

### Why not only Redux?

Redux is excellent for:

- global synchronous access
- predictable state transitions
- selectors

But it is not the best tool alone for server data fetching and caching.

### Why combine them?

We use:

- React Query for the async fetch lifecycle and caching
- Redux for simple app-wide access to resolved permission state

This gives us:

- centralized fetching
- consistent cached results
- simple UI access anywhere in the app

---

## Current Role Mapping

At the moment, permissions are resolved from a role-to-permission map in `permission.service.ts`.

This works well for local development and UI scaffolding.

Example:

- `Admin` gets all permissions
- `Member` gets a limited set

In a production backend integration, this file should fetch permissions from a real API instead of using mock role mapping.

---

## How to Add a New Permission

### Step 1: Add the constant

Add it to the correct permission group in `src/permissions/constants.ts`.

Example:

```ts
export const Project_Permissions = {
  VIEW_PROJECT: "project:view",
  CREATE_PROJECT: "project:create",
  ARCHIVE_PROJECT: "project:archive",
} as const;
```

### Step 2: Add it to the permission source

Update the role mapping or backend response logic in `permission.service.ts`.

### Step 3: Use it in the UI

Example:

```tsx
<PermissionGate permission={Project_Permissions.ARCHIVE_PROJECT}>
  <Button text="Archive Project" onClick={handleArchive} />
</PermissionGate>
```

### Step 4: Enforce it on the backend

Do not stop at the frontend. Make sure the server also validates it.

---

## How to Protect a New Page

Example:

```tsx
import {
  AccessDenied,
  PermissionBoundary,
  PermissionLoading,
  Project_Permissions,
} from "@/permissions";

const ProjectAdminPage = () => {
  return (
    <PermissionBoundary
      permission={Project_Permissions.UPDATE_PROJECT}
      loadingFallback={<PermissionLoading />}
      unauthorizedFallback={
        <AccessDenied
          title="Project admin access is unavailable"
          description="You need project management permission to open this page."
        />
      }
    >
      <ProjectAdminContent />
    </PermissionBoundary>
  );
};
```

---

## How to Protect Multiple Permissions at Once

If a UI area requires all permissions:

```tsx
<PermissionBoundary
  permission={[
    Event_Permissions.CREATE_EVENT,
    Event_Permissions.PUBLISH_EVENT,
  ]}
  requireAll
  loadingFallback={<PermissionLoading />}
  unauthorizedFallback={<AccessDenied title="No access" description="..." />}
>
  <PublishPanel />
</PermissionBoundary>
```

If a UI area can render when the user has any one of several permissions:

```tsx
<PermissionGate
  permission={[
    Event_Permissions.UPDATE_EVENT,
    Event_Permissions.DELETE_EVENT,
  ]}
>
  <EventActions />
</PermissionGate>
```

By default, permission arrays use `any` behavior unless `requireAll` is passed.

---

## Error Handling

The permission slice stores:

- `status`
- `error`
- `lastUpdatedAt`

This gives us better production readiness because we can:

- debug permission fetch issues
- surface fallback UI later if needed
- inspect when permission state was last synced

Today, most screens use loading and unauthorized states.
If needed, we can later add a dedicated permission-error UI using the stored `error`.

---

## Common Mistakes to Avoid

### Mistake 1: Manual page checks everywhere

Bad:

```tsx
const { hasPermission, isLoading } = useAuthorization(...);
if (isLoading) return null;
if (!hasPermission) return <Denied />;
```

This is okay in rare cases, but for most pages `PermissionBoundary` is cleaner.

### Mistake 2: Showing fake disabled actions

Avoid UI that looks interactive but does nothing.

### Mistake 3: Mixing permission rules across files

Keep permission definitions centralized in `constants.ts`.

### Mistake 4: Forgetting backend validation

UI gating is not enough.

### Mistake 5: Repeating the same check many times in one component

Use `usePermissionMap`.

---

## FAQ

### Does this system secure the backend?

No.
It only controls what the user sees in the UI.
Backend APIs must still validate authorization.

### Why is there a loading state?

Permissions are fetched asynchronously.
Until they are loaded, the UI does not yet know what the user can access.

### Why not just hide everything by default?

We do hide protected UI by default during loading, but page-level areas should show a proper loading state rather than a flash of unauthorized content.

### Why store permissions in Redux after fetching them with React Query?

Because many components need easy global access, while React Query remains responsible for fetching and caching.

### Can we replace the mock permission source later?

Yes.
That is one of the main reasons this system is centralized.
You can swap the fetch logic in `permission.service.ts` without rewriting the feature components.

### Can we add route-level guards later?

Yes.
The current UI boundaries are already structured in a way that can evolve into route guards if needed.

---

## Future Improvements

Good next steps if the system grows:

- fetch permissions from a real backend endpoint
- add route metadata for permissions
- create a route guard wrapper for router-level protection
- add analytics/logging for denied access states
- add automated tests for permission helpers and boundary components
- add permission-aware navigation filtering in sidebars and menus

---

## Summary

This permission-based UI rendering system exists to make CommDesk:

- safer at the UI layer
- clearer for end users
- easier to maintain for developers

Use these rules as the default:

- `PermissionBoundary` for pages
- `PermissionGate` for inline UI
- `usePermissionMap` for multi-action components
- `constants.ts` for all permission keys
- backend validation for every protected operation

If we follow these conventions consistently, the code stays clean, modern, and predictable as the app grows.
