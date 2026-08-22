# progress.md

Concise development log. Update after substantial implementation work. Not a duplicate of AGENTS.md (stable conventions live there).

## Current state (2026-08-21)

- Branch: `NewFeatures` (HEAD `db3cb45`). This branch merges another developer's "unified marketplace" work (referral system, bulk pricing, follows, withdrawals, cron jobs) on top of the RBAC groundwork.
- RBAC groundwork landed: `roles`, `permissions`, `user_roles`, `role_permissions` tables + models + seed data (migration `20260810000000-create-rbac-tables.js`, commit `36763bc`). System roles seeded: `admin`, `buyer`, `contributor`, `reseller`.
- **Still not wired into runtime**: `checkRole` middleware still uses hardcoded roles (`admin | buyer | contributor`); `req.user.role` still comes from the Redis session captured at login. Next planned step: make authorization read from the new RBAC tables.
- Permission lookup repository implemented: `hasPermission(userId, permission): Promise<boolean>` in `src/repositories/rbac.repository.ts`. Uses ORM associations `UserRole`→`Role` (`role`)→`RolePermission` (`rolePermissions`)→`Permission` (`permission`) with `required: true` inner joins and a `where { name }` filter; returns `rows.length > 0`. No raw SQL, no schema changes.
- **Architectural problem (merged code)**: the new marketplace controllers (`listing.controller.ts`, `follow.controller.ts`, `referral.controller.ts`, `withdrawal.controller.ts`) and `src/service/cron.service.ts` query Sequelize models directly — no service/repository layers and no zod validators for their routes. This violates the project's layered architecture and is flagged as legacy debt to refactor (see Known issues).
- `npm run build` (tsc) passes on HEAD (re-verified 2026-08-21).
- No tests exist (`npm test` is a stub, `src/test/` empty).

## Completed

- RBAC permission repository: `hasPermission(userId, permission)` in `src/repositories/rbac.repository.ts` (ORM-association lookup, returns real boolean).
- RBAC schema/models/seed migration (`36763bc`).
- Reseller domain (services/repositories/models/validators for applications, shares, clicks, payouts) — **no routes/controllers yet** (`adcdd53`).
- Fixed the `WhenOptions` mis-import from `joi` in `reseller.repository.ts` → proper `WhereOptions` from `sequelize` (`98cc94f`). `joi` is no longer imported anywhere in `src/`.
- Unified marketplace feature set (merged from another developer, migration `20260812000001-add-unified-marketplace-tables.js`):
  - `users.ref_code` (unique, generated at signup in `auth.repository.ts`) and `orders.referral_code`.
  - `listings` + `listing_media` + `listing_price_tiers`: unified marketplace listings of kind `product | service | skill`, price models (`fixed | hourly | daily | project`), moderation status (`under_review | published | flagged | banned`), bulk flags (`bulk_enabled`, `bulk_only`, `moq`) and per-listing commission settings.
  - Listing CRUD + admin moderation endpoints (`/api/listings`, moderation via `PUT /:id/moderate` with `checkRole('admin')`); public browsing uses the new `optionalAuthenticate` soft-auth middleware.
  - Bulk pricing: order creation resolves quantity-based tier prices from `listing_price_tiers` and enforces MOQ for `bulk_only` listings; `order_items` now store `unit_price` and optional `listing_id`.
  - Referral commissions: checkout with a valid `referral_code` on commission-enabled listings creates pending `referrals` rows (self-referral blocked) in `order.service.ts`.
  - Wallet/referral endpoints mounted at `/api` (`GET /api/wallet`, `GET /api/referrals/my`, public `POST /api/referrals/track` — click tracking is currently a stub that only logs).
  - Withdrawals: request (balance-checked, one pending at a time), own history, admin list + process (`approved | rejected | paid`) under `/api/withdrawals`.
  - Seller follows: follow/unfollow, follow state (public with optional auth), followers/following lists under `/api/follows`.
- Daily cron job via `node-cron` (`initCronJobs()` in `src/app.ts` → `src/service/cron.service.ts`): clears pending referrals to `cleared` once the order has been delivered for 7+ days (return window).
- CORS updated to allow multiple origins (`localhost:5173`, `localhost:8080`, `127.0.0.1:8080`) (`2c26c38`).

## Known issues

- `npm start` is broken (`node/dist/app.js`, missing space in package.json).
- `uploads/` files are committed to git.
- Docs (`vendor-bridge-apis.md`, `docs/vendorbridge_api.yaml`) drift from code.
- `Role` type (`roleChecker.ts`) omits `seller`, `reseller`, `service_provider`, `bulk_buyer` that `user.model.ts` accepts.
- **Architectural problem**: marketplace controllers (`listing`, `follow`, `referral`, `withdrawal`) and `cron.service.ts` bypass the service/repository layers and query Sequelize models directly; their routes have no zod validators. Needs refactoring into the layered pattern (routes → validators → controllers → services → repositories).
- Referral click tracking (`POST /api/referrals/track`) is a stub — it only logs and persists nothing (the `reseller_clicks` table/model from the reseller domain is unused by it).
- `src/types/pageination.ts` is a typo. Kept intentionally. (The former `WhenOptions` mis-import from `joi` was fixed in `98cc94f`.)

## Remaining / next

- Wire RBAC into runtime authorization (permission checks, role from `user_roles`, session refresh on role change).
- Add reseller routes/controllers.
- Refactor the unified-marketplace endpoints (listings, follows, referrals, withdrawals) into the layered architecture: zod validators + services + repositories, moving DB access out of the controllers and `cron.service.ts`.
- Implement real referral click tracking (persist clicks instead of logging).
- Add tests (none exist).

## Verification

- `npm run build` passes after changes; run it before declaring work complete.
- `npm run build` re-verified on `NewFeatures` HEAD (`db3cb45`, 2026-08-21) after the marketplace merge — tsc clean.
- `hasPermission` runtime checks against dev DB (2026-08-10, all PASS, temp rows cleaned up):
  - buyer user with `product.get_all` → `true`
  - same user with `user.delete` (admin-only) → `false`
  - same user with unknown permission `does.not.exist` → `false`
  - user with no `user_roles` rows → `false`
  - Generated SQL confirmed the `user_roles → roles → role_permissions → permissions` INNER JOIN chain with the permission-name filter.
