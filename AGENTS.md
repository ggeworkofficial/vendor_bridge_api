# AGENTS.md

  

VendorBridge API: an Express 5 + TypeScript (CommonJS) e-commerce REST API. Buyers shop and order; sellers list inventory; a reseller program exists (applications, shares, clicks, payouts) with services/repositories/models in place but **no routes/controllers yet**. Admins manage users, categories, sellers, inventory, orders, receipts, complaints, logistics, payment accounts, and settings.

  

## Stack

  

- **Runtime/HTTP**: Node.js, Express 5 (`^5.2.1`), CommonJS (`"type": "commonjs"`, `module: nodenext`).

- **DB**: PostgreSQL via `sequelize` `^6.37` + `sequelize-typescript` `^2.1` (decorator models, NOT auto-loaded).

- **Cache/sessions**: `ioredis` (auth sessions + product listing cache).

- **Validation**: zod `^4` (v4 API — `z.email()`, not `z.string().email()`). `joi` is a dependency but only mis-imported as a type in `src/repositories/reseller.repository.ts`; do not use it for new validation.

- **Auth**: session-based (Redis), not JWT. Password hashing via `bcryptjs`.

- **Uploads**: `multer` (images only, 5MB cap) → `uploads/`.

  

## Commands (verified: `npm run build` passes)

  

- `npm run dev` — `ts-node-dev --respawn --transpile-only src/app.ts`. Requires Postgres AND Redis; `./connection/redis` is imported at module load in `src/app.ts`.

- `npm run build` — `tsc` typecheck + emit to `dist/`. **Use this to verify changes** (no tests exist).

- `npm start` — **broken** (`node/dist/app.js`, missing space). Use `node dist/app.js` or `npm run dev`.

- `npm run migrate` / `migrate:undo` / `migrate:undo:all` — sequelize-cli. Reads `config/config.js`; fails without it. No `.sequelizerc`.

- `npm run setup` — `node ./script/setup.js`; regenerates `.env` + `config/config.js` from templates.

- `npm test` — stub (`echo Error: no test specified`); `src/test/` is empty.

  

## Setup / environment gotchas

  

- `.env` and `config/` are gitignored but required. Run `npm run setup` first, then fill `DB_HOST/DB_PORT/DB_NAME/DB_USER/DB_PASSWORD`, `REDIS_URL`, `PORT`.

- CORS origin hardcoded to `http://localhost:5173` in `src/app.ts:47`.

- Sessions: Redis keyed by `session_id` cookie (httpOnly, 7-day TTL, refreshed when < 3 days left). `session_id` returned by login but never exposed in JSON responses (controllers strip it).

- `uploads/` files ARE committed to git (not gitignored) — don't add binary junk casually.

  

## Architecture & layer responsibilities

  

Layered, single-responsibility per directory. Route wiring order: `authenticate` → role/ownership checks → `validate(...)` → controller.

  

- **`routes/`** — thin `express.Router()` wiring. Filenames are `<resource>.routes.ts` (but note `user.route.ts`, singular — copy the file you edit).

- **`controllers/`** — HTTP glue only: parse `req.body`/`req.params`/`req.user`, call service, respond. Wrap in `try/catch` → `next(error)`; errors via `createError(message, status)` (`src/helpers/error.ts`), handled by `errorHandler` (`src/middleware/errorHandler.ts`). Response shapes are inconsistent: mutations often return `{ success, message, data }`, GETs often return the payload bare — match neighboring controllers.

- **`service/`** — business logic; imports repositories and validators. Export style is inconsistent: some export `new XService()` singletons (`auth`, `user`, `complaint-message`), others export the class and controllers call `new XService()` (`category`, `seller`, `settings`). Match the file you're editing. Reseller services live in `src/service/reseller/`.

- **`repositories/`** — the ONLY layer touching Sequelize models/Redis. Named function exports (`export const createUser = ...`). Pure data access + Redis cache.

- **`models/`** — `sequelize-typescript` decorator models, one per file.

- **`validators/`** — zod schemas + inferred payload types (`z.infer`), consumed by services/controllers for typing.

- **`middleware/`** — `authenticator`, `roleChecker`, `ownershipOrAdminChecker`, `validator`, `imageSaver`, `errorHandler`.

- **`helpers/`** — `createError`, `setSessionCookie`.

- **`utils/`** — `removeUndefined`, `imageMapper`, `cleanUpFile` (deletes uploads).

  

## Auth & authorization (in flux — preserve the model)

  

- `authenticate` (`src/middleware/authenticator.ts`) validates the Redis session and sets `req.user = { id, role }`. **`role` comes from the session captured at login; it is NOT re-read from the DB per request.**

- RBAC tables/models (`roles`, `permissions`, `user_roles`, `role_permissions`, migration `20260810000000-create-rbac-tables.js`) exist but are **not wired into runtime authorization**. `checkRole` (`src/middleware/roleChecker.ts`) still uses hardcoded roles `admin | buyer | contributor`, and the `Role` type omits `seller`, `reseller`, `service_provider`, `bulk_buyer` even though `user.model.ts` accepts them. Changing this is a deliberate migration, not a quick edit.

- Ownership: `checkOwnershipOrAdmin(paramKey="id", isAdminAllowed=true)` compares `req.user.id` to the route param, bypassing for admins.

- Suspending a user or changing their role clears all their Redis sessions (`src/service/user.service.ts`).

  

## Database / ORM / migrations

  

- **New tables require BOTH** a sequelize-cli migration in `migrations/` AND registration in the explicit `models: [...]` array in `src/connection/postgres.ts` (models are not auto-loaded). Some models (`SellerApplication`, `Reseller*`, ...) are imported directly by `postgres.ts` and not re-exported from `src/models/index.ts` — `index.ts` is not the source of truth.

- Migrations are hand-written JS using `queryInterface`; `seeders/` is empty and seed data lives inside migrations (see RBAC migration `20260810000000` for the pattern).

- Model conventions: `@Table({ tableName, underscored: true, timestamps })`, snake_case columns, `@PrimaryKey` UUID `id`, `UserAttributes`/`UserCreationAttributes` interfaces with `Optional<...>`, enum-ish fields as string unions + `validate: { isIn: [...] }` (see `order.model.ts` for the pattern).

- UUID PKs are generated manually with `randomUUID()` in services, not by the DB.

- Transactions: pass a `Transaction` from `sequelize` into repository methods (see `src/service/reseller/` and `src/repositories/reseller.repository.ts`).

- tsconfig enables `exactOptionalPropertyTypes` + `noUncheckedIndexedAccess`; satisfy them with spread-omit patterns like `...(payload.role && { role: payload.role })`, and `removeUndefined` before updates.

  

## Caching

  

- Product listings are cached in Redis in `src/repositories/inventory.repository.ts` (version-keyed invalidation, `products:version`). After product/category writes, call `invalidateCachedProducts()` (category service does). Don't bypass the cache silently.

  

## Naming & style

  

- Files: `<resource>.model.ts`, `.repository.ts`, `.service.ts`, `.controller.ts`, `.validator.ts`, `.routes.ts`. Note typos that are deliberate-to-keep for now: `src/types/pageination.ts` (the `PaginationResponse` type, NOT "pagination") and the mis-import `WhereOptions` from `joi` (as `WhenOptions`) in `reseller.repository.ts` — don't "fix" either without a broader cleanup.

- Controllers read `req.params.id` / `req.body` raw. Validated data lives on `(req as any).validated` and is NOT merged back into `req.body`/`req.params`.

- `dist/` is build output (gitignored).

  

## Architecture decisions to preserve

  

- Strict layering: DB access lives only in `repositories/`; controllers stay thin; business logic in `service/`.

- Session-based auth with role captured at login; ownership checks via `checkOwnershipOrAdmin`.

- New tables = migration + model + explicit registration in `postgres.ts`.

- Hand-maintained API docs (`vendor-bridge-apis.md` at root, `docs/vendorbridge_api.yaml`) drift from code — trust the code, not the docs.

- CORS origin hardcoded in `app.ts` (flag the change if you must alter it).

  

## Agent workflow rules

  

1. Before starting a substantial task, inspect the relevant existing implementation instead of making assumptions.

2. Read `progress.md` if it exists before beginning substantial work.

3. Do not modify unrelated files.

4. Do not introduce a new architectural pattern when an established project pattern already exists.

5. Do not invent APIs, database fields, permissions, roles, dependencies, or business rules when the existing codebase or task specification does not support them.

6. Before declaring a task complete, verify that the claimed files and changes actually exist in the current workspace.

7. Run the relevant build, tests, migrations, or other verification commands when appropriate (`npm run build` is the typecheck gate here).

8. Inspect `git status` and the relevant `git diff` before declaring an implementation complete.

9. Clearly distinguish between work that was actually performed and work that is merely recommended.

10. If an ambiguity could materially affect the implementation, stop and report the ambiguity rather than silently making a potentially destructive assumption.

**Note:** `AGENTS.md` and `progress.md` are documentation, not authoritative evidence of the current filesystem or database state. Verify claims against the actual repository and database when relevant. 