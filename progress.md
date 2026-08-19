# progress.md

Concise development log. Update after substantial implementation work. Not a duplicate of AGENTS.md (stable conventions live there).

## Current state (2026-08-10)

- Branch: `better-role-based-system-opencode`.
- RBAC groundwork landed: `roles`, `permissions`, `user_roles`, `role_permissions` tables + models + seed data (migration `20260810000000-create-rbac-tables.js`, commit `36763bc`). System roles seeded: `admin`, `buyer`, `contributor`, `reseller`.
- **Not wired into runtime yet**: `checkRole` middleware still uses hardcoded roles; `req.user.role` still comes from the Redis session captured at login. Next planned step: make authorization read from the new RBAC tables.
- Permission lookup repository implemented: `hasPermission(userId, permission): Promise<boolean>` in `src/repositories/rbac.repository.ts`. Uses ORM associations `UserRole`→`Role` (`role`)→`RolePermission` (`rolePermissions`)→`Permission` (`permission`) with `required: true` inner joins and a `where { name }` filter; returns `rows.length > 0`. No raw SQL, no schema changes.
- `npm run build` (tsc) passes on HEAD.
- No tests exist (`npm test` is a stub, `src/test/` empty).

## Completed

- RBAC permission repository: `hasPermission(userId, permission)` in `src/repositories/rbac.repository.ts` (ORM-association lookup, returns real boolean).
- RBAC schema/models/seed migration (`36763bc`).
- Reseller domain (services/repositories/models/validators for applications, shares, clicks, payouts) — **no routes/controllers yet** (`adcdd53`).

## Known issues

- `npm start` is broken (`node/dist/app.js`, missing space in package.json).
- `uploads/` files are committed to git.
- Docs (`vendor-bridge-apis.md`, `docs/vendorbridge_api.yaml`) drift from code.
- `Role` type (`roleChecker.ts`) omits `seller`, `reseller`, `service_provider`, `bulk_buyer` that `user.model.ts` accepts.
- Mis-import `WhereOptions` as `WhenOptions` from `joi` in `src/repositories/reseller.repository.ts`; `src/types/pageination.ts` is a typo. Kept intentionally.

## Remaining / next

- Wire RBAC into runtime authorization (permission checks, role from `user_roles`, session refresh on role change).
- Add reseller routes/controllers.
- Add tests (none exist).

## Verification

- `npm run build` passes after changes; run it before declaring work complete.
- `hasPermission` runtime checks against dev DB (2026-08-10, all PASS, temp rows cleaned up):
  - buyer user with `product.get_all` → `true`
  - same user with `user.delete` (admin-only) → `false`
  - same user with unknown permission `does.not.exist` → `false`
  - user with no `user_roles` rows → `false`
  - Generated SQL confirmed the `user_roles → roles → role_permissions → permissions` INNER JOIN chain with the permission-name filter.
