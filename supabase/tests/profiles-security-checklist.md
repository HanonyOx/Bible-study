# Profiles migration security checks

Run these checks only against a disposable local Supabase database after
reviewing and applying the migration locally. Do not run them against a
production or shared development database. Use two Auth test users, User A and
User B, and their authenticated sessions. Run database setup and inspection as
the local database administrator; perform each access check as the stated role.

## Row and column access

- As User A, select `public.profiles` and confirm only User A's row is visible.
- As User A, attempt to select and update User B's row; confirm no row is
  returned or changed.
- As User A, attempt direct `INSERT` and `DELETE`; confirm both are denied by
  database privileges.
- As User A, attempt to update `id`, `created_at`, or `updated_at`; confirm the
  operation is denied by column privileges.
- As User A, update only `display_name`; confirm the value changes on User A's
  row.
- Capture `updated_at`, wait briefly, update `display_name`, and confirm
  `updated_at` advances. Attempt to provide a custom timestamp and confirm the
  direct update is rejected.

## Trusted profile initialization

- Call `public.ensure_my_profile()` without an authenticated identity; confirm
  the call is rejected (an anonymous role may instead be denied function
  execution before reaching the function).
- As User A, call the function twice; confirm exactly one row exists for User A.
- Set User A's `display_name`, call the function again, and confirm the
  existing display name is unchanged.
- As User A, verify that the function has no argument through which another
  user's identity can be supplied; confirm User B's row is not created or
  modified.
- Confirm the function is executable by `authenticated` but not by `anon` or
  `PUBLIC`, and confirm clients have no table-level `INSERT` or `DELETE`.

## Auth-flow recovery and frontend reporting

- Register with email confirmation enabled and confirm no profile-init RPC is
  attempted until an authenticated session exists.
- Confirm a verified session initializes a profile; confirm callback/session
  restoration and a later sign-in both initialize a missing profile.
- Interrupt the browser flow after authentication, reload, and confirm session
  restoration retries initialization without creating a duplicate.
- Simulate an RPC failure and confirm the shared UI reports it, leaves the
  signed-in state intact, and offers a retry. Confirm a successful retry clears
  the error.

## Preconditions

- Verify the migration role can transfer ownership of
  `public.ensure_my_profile()` to the standard Supabase `postgres` role. The
  migration deliberately fails rather than leaving the definer function owned
  by an unverified role if that role or permission is unavailable.
- Verify that the standard `anon` and `authenticated` database roles exist.
- These checks do not grant permissions beyond the profile operation and do not
  test or modify Supabase-managed Auth policies or RLS.
