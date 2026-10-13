# Local Supabase curriculum security testing

The procedure below targets only the unlinked, dedicated local project
`word-and-way-curriculum-test`. It does not connect to hosted Supabase, run
`supabase link`, run `db push`, or reset the database.

## Verified local setup

The Windows development setup was checked with:

- Docker Desktop CLI: `29.8.2`; the daemon responded to `docker info`.
- Supabase CLI: `2.120.0`, installed in `apps/web/node_modules`.
- Project ID: `word-and-way-curriculum-test`.
- No `supabase/.temp/project-ref` linked-project marker.
- Configured ports: API `54321`, database `54322`, shadow database `54320`,
  Studio `54323`, local mail `54324`, pooler `54329`, and analytics `54327`.
  These ports were free during the check; the runner checks the project ID,
  Docker daemon, and active local service health before applying SQL.
- PostgreSQL major version: `17`. The installed CLI successfully parsed the
  config and applied the four local migrations.

Docker was not on the PowerShell PATH during initial setup. The runner first
looks for `docker` on PATH, then checks the standard Docker Desktop executable
at `%LOCALAPPDATA%\Programs\DockerDesktop\resources\bin\docker.exe`. It adds
that directory to PATH only for the runner process so the Supabase CLI can
locate Docker; it does not change the system or user PATH.

## Diagnosis and configuration

The initial failure named Studio, not the database. Studio's Next.js log said
it was ready, but Docker recorded the first Studio health probe (a request to
`/api/platform/profile`) exceeding its two-second timeout. Subsequent probes
returned successfully; with the CLI health-check bypass used only to keep the
stack available for inspection, Studio became healthy and that endpoint
returned HTTP 200. The evidence points to a cold-start/readiness timing issue,
not a PostgreSQL failure or port conflict.

Inspection also found the optional analytics Vector container repeatedly
restarting because it tried to reach Docker's host log API at
`192.168.65.254:2375`, which refused the connection. Do not expose Docker's
unauthenticated TCP daemon to fix this. Analytics is now disabled in this
local test config because the curriculum tests do not require log collection.
This does not change database, API, authentication, or RLS behavior.

The config's seed path previously pointed to nonexistent `supabase/seed.sql`.
It now points to `supabase/seeds/original_word_and_way_studies.sql`. Supabase
automatically loads that path only on a database reset; the test runner does
not reset the database and loads this seed explicitly through `psql` in the
dedicated local database container. The seed uses stable IDs and `ON CONFLICT
DO NOTHING`, and imported lessons remain draft/not reviewed.

## Run the repeatable checks

From the repository root, run:

```powershell
.\supabase\tests\run-local-curriculum-security.ps1
```

The runner:

1. Requires Docker Desktop to be running, the local CLI to exist, the exact
   dedicated project ID, and no linked project reference.
2. Runs `supabase start --ignore-health-check` to prevent the CLI's startup
   failure cleanup from stopping the local stack before diagnostics can be
   collected. It does **not** treat that flag as proof of health: it polls
   every project's containers and requires every running container to report
   healthy (when a health check exists) or running, plus all required core
   services, before proceeding.
3. Applies pending migrations only with `supabase migration up --local`.
4. Loads the Word & Way seed and executes the rollback-only security test with
   `psql` inside the exact running `supabase_db_word-and-way-curriculum-test`
   container. The SQL is piped through Docker's standard input and
   `ON_ERROR_STOP=1` makes the runner fail on the first SQL error. This is
   required because `supabase db query --local --file` prepares a single SQL
   statement and rejects these multi-statement files.
5. On service/start/SQL failure, prints project container status and, for
   unhealthy/stopped services, health-check output and recent logs with common
   key/password fields redacted. The runner does not explicitly stop/remove
   containers or volumes; the CLI may stop services disabled by the local
   config. It never runs `db reset`, `db push`, `link`, `docker volume rm`, or
   container cleanup commands.

The second step deliberately owns health verification instead of accepting a
successful CLI exit alone. A startup problem therefore leaves services
available for logs/health inspection rather than invoking the CLI's automatic
failure cleanup. Do not enable
`VITE_SUNDAY_SCHOOL_DATABASE_READS` until the runner completes successfully.

The SQL test checks:

- RLS enablement and student read grants; no browser-role writes to curriculum
  or class-access records, no service-role writes to those protected tables,
  and only narrow authenticated profile/progress permissions. The standard
  Supabase `service_role` remains privileged for trusted backend profile
  operations and must never be exposed in browser code.
- Student visibility of published eligible external and original content, and
  hiding of draft, unreviewed, or ineligible content.
- Teacher-only material visibility for an active, assigned teacher in a
  verified church, including denial for students and revoked assignments.
- SECURITY DEFINER ownership, empty search paths, and function execution
  grants.
- Audit-table access and protection against self-granted administrator or
  teacher privileges.
- Profile and progress privacy between users, restricted profile updates,
  progress ownership, server-maintained timestamps, and inability to track
  unpublished lessons.
- Editorial RPC ownership, empty search paths, execution grants, authorization
  against the database administrator allowlist, and denial of direct writes.
- Curriculum and lesson submission, review approval/rejection, required
  rejection feedback, draft editing/resubmission, publication validation,
  student visibility before and after publication, and server-recorded
  reviewer/publisher audit metadata.
- The editorial queue is denied to ordinary authenticated users and returns
  editorial content only to an allowlisted administrator.

The test fixtures are enclosed in a transaction and rolled back. The separate
original-studies seed persists in the local database as draft content.

## Known application boundary

The curriculum administration, church verification, class provisioning,
teacher assignment, and student enrollment tables intentionally have no
browser write grants. The editorial lifecycle is implemented through
database-owned SECURITY DEFINER RPCs which derive the caller identity from
`auth.uid()` and authorize against `curriculum_admins`; callers cannot supply
their own role. Review/publishing identities and timestamps are recorded by
the database. The admin allowlist itself has no client write grants, so adding
an administrator requires a trusted operator with direct database
administrative access; no application-side provisioning interface is
configured.

The `get_editorial_queue()` RPC exposes draft/editorial content only to an
allowlisted authenticated administrator. It does not make that content
student-readable. The protected `/editorial` dashboard uses that RPC and the
existing editorial mutation RPCs; the database allowlist remains the actual
authorization boundary. Student-facing database reads remain disabled. Keep
`VITE_SUNDAY_SCHOOL_DATABASE_READS` disabled until a separate integration
change is deliberately reviewed and tested. Progress has authenticated
self-service RLS; until database lesson reads are enabled, progress remains
browser-local.

### Provisioning the first administrator

There is no public administrator registration or browser-based role grant.
First, create the intended person’s ordinary account through the existing
authentication flow and verify their identity using the deployment’s normal
account-verification process. A trusted project owner/database operator must
then verify that account’s `auth.users.id` and insert that UUID into
`public.curriculum_admins` through a controlled database-administration
session. For the bootstrap administrator, `granted_by` may be `NULL`; record
subsequent grants with the granting administrator’s user UUID where available.
For example, after replacing the placeholders with verified UUIDs:

```sql
insert into public.curriculum_admins (user_id, granted_by)
values ('<verified-auth-user-uuid>', null)
on conflict (user_id) do nothing;
```

Do not run this from browser code, expose database/service-role credentials,
or provide self-service registration for this allowlist. For hosted
environments, a designated operator must use the organization’s approved
secure database-administration process after the production migrations and
account verification process have been deliberately deployed. The editorial
page does not make the project production-ready by itself.

## Troubleshooting

- **Docker CLI missing:** add Docker Desktop's `resources\bin` directory to
  PATH for the current PowerShell session, or rely on the runner's standard
  install-path detection. Do not change system settings without authorization.
- **Docker daemon unavailable:** open Docker Desktop and wait for it to report
  running; verify `docker info`.
- **Studio unhealthy:** inspect `docker inspect` health-check history and
  `docker logs` for `supabase_studio_word-and-way-curriculum-test`. A Next.js
  “Ready” message alone does not prove the health endpoint passed.
- **Vector/analytics tries `192.168.65.254:2375`:** local analytics is disabled
  because it is not needed here. Do not enable Docker's unauthenticated TCP
  endpoint as a workaround.
- **Port conflict:** identify the process listening on the specific configured
  port before changing configuration or stopping anything.
- **Migration or security SQL failure:** preserve the local database. The
  runner prints the database container's recent logs as well as container and
  health status. Fix the migration/test; do not use `db reset` as a workaround.

No remote migration has been applied. A successful static check or successful
service startup is not database security verification; only a successful run
of the rollback-only SQL security test establishes that this test procedure
executed against the local database.
