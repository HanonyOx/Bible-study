# Word & Way web application

The web client is a React, TypeScript, and Vite single-page application. It
uses Supabase Auth and the publishable browser key for user-facing operations.
The Bible Reader and comparison pages request available English translations
from the configured HelloAO Bible API; availability does not itself establish
redistribution rights. Scripture search across the whole Bible is not currently
available.

## Local development

From `apps/web` (copy the example only if you do not already have a local
environment file):

```powershell
if (-not (Test-Path .env.local)) { Copy-Item .env.example .env.local }
npm ci
npm run dev
```

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env.local` for
authentication. Vite variables are compiled into browser code: use only the
Supabase project URL and its publishable/anon key. Never set a service-role key,
database password, or other server secret in a `VITE_*` variable.

Useful checks, also run from `apps/web`:

```powershell
npm test
npm run lint
npm run build
```

## Sunday School content modes

The age groups are stored as `children`, `teens`, and `adults` (displayed as
Children, Teenagers, and Adults). The 36 original Word & Way studies include
12 complete lessons per group. They have no scheduled dates. They are not
Assemblies of God materials, and Word & Way does not claim Assemblies of God
affiliation or endorsement.

`VITE_SUNDAY_SCHOOL_DATABASE_READS=false` must remain set until a separately
reviewed student-read integration passes database security and end-to-end
verification. Draft and unpublished database rows must never be used as a
fallback.

For a **non-production demonstration only**, set
`VITE_SUNDAY_SCHOOL_DEMO_MODE=true` while database reads remain false. This
explicitly displays the 36 original lesson examples bundled in the frontend,
with a demo-preview warning. This does not modify their database review or
publication states and does not use the database as a student source. The
bundled examples are visible in the built client, so do not use this setting to
publish confidential or licensed content. Keep the setting false in production.
Without the demo flag, only content passing the existing published and
source/rights eligibility checks is displayed.

The existing local curriculum security workflow is documented in
`../../supabase/tests/LOCAL_TESTING.md`. It is intended only for the dedicated
local project; do not use it against production.

## Netlify static deployment preparation

The production build output is `apps/web/dist`. The Vite `public/_redirects`
file is copied into that directory and configures the SPA fallback so direct
loads and refreshes of routes such as `/bible` and `/editorial` serve
`index.html`.

For a Netlify Git-based site, configure:

- Base directory: `apps/web`
- Build command: `npm run build`
- Publish directory: `dist`
- Production environment variables:
  - `VITE_SUPABASE_URL` — URL of the separately selected production Supabase
    project.
  - `VITE_SUPABASE_PUBLISHABLE_KEY` — that project's publishable/anon key.
  - `VITE_SUNDAY_SCHOOL_DATABASE_READS=false`
  - `VITE_SUNDAY_SCHOOL_DEMO_MODE=false`

Create a separate preview configuration if a non-production preview needs the
demo mode. Do not copy local `.env.local` values to the host. No hosting
credentials or production project are configured by this repository, and no
deployment has been performed.

## Supabase production prerequisites

Before launch, the project owner must deliberately select or create the
production Supabase project and verify the deployment target. Keep local and
production projects separate. Review and apply migrations through an approved
production change process only after reviewing every migration and taking a
recoverable backup. Do not run the local test runner, local seed, or database
reset against production. Student database reads remain disabled until the
read path has a separate security review and successful end-to-end tests.

Configure the production Auth site URL to the final HTTPS origin and allow the
exact application redirects used by the code:

- `https://<production-host>/auth/callback`
- `https://<production-host>/auth/reset-password`

Also configure the local development and preview origins intentionally; do not
use an unrestricted wildcard in production. Configure the Auth email provider
and sender/domain requirements before enabling account registration or
password recovery. Test confirmation, sign-in, sign-out, recovery, and return
to protected routes on the deployed origin.

The first curriculum administrator must first have a normal, identity-verified
account. A trusted project operator then verifies its Auth user UUID and
provisions the database allowlist through the approved secure database
administration process. There is no public administrator registration. Never
grant that role through frontend code.

## Backup, recovery, and smoke checks

Before each production schema change, arrange an encrypted backup/export or
the recovery option supported by the chosen Supabase plan. Confirm retention
and access controls, and rehearse restoration in a separate non-production
project before relying on the backup. Keep migration files and deployment
artifacts versioned; do not store production dumps or credentials in this
repository.

After deployment, verify:

1. The home page and direct route refreshes for `/bible`, `/compare`, and
   `/sunday-school` return the app shell.
2. Bible translation/book/chapter loading reports errors clearly if the
   external API is unavailable; check translation attribution and rights
   separately.
3. Sign-up confirmation, login, logout, password recovery, and allowed redirects
   work on the final origin.
4. A signed-out user and an ordinary account cannot read or mutate editorial
   data; only a trusted allowlisted editor can use editorial RPCs.
5. Draft/unreviewed lessons remain unreadable to students. Do not enable
   student database reads or publish lessons as part of a smoke test.
6. No service-role key or database credential is present in downloaded assets,
   source maps, hosting variables exposed to the client, or repository history.
7. Review Supabase logs, host build/deploy logs, error states, responsive
   layouts, and browser keyboard accessibility.
