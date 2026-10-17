import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSupabaseClient } from "../../services/supabaseClient";
import type { AgeGroup } from "./ageGroups.mjs";
import { useAuth } from "./useAuth";

function isAgeGroup(value: unknown): value is AgeGroup {
  return value === "children" || value === "teens" || value === "adults";
}

function getAgeGroupLabel(ageGroup: AgeGroup | null): string {
  if (ageGroup === "children") return "Children (1–12)";
  if (ageGroup === "teens") return "Teenagers (13–19)";
  if (ageGroup === "adults") return "Adults (20+)";
  return "Not provided";
}

const buttonClass =
  "inline-flex min-h-11 items-center justify-center rounded-md bg-forest px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#274a35] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-clay";

const secondaryButtonClass =
  "inline-flex min-h-11 items-center justify-center rounded-md border border-border px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-[#f5f3ed] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-clay";

function ProfilePage() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false
async function loadProfile() {
  if (!user) {
    setLoading(false)
    return
  }

  setLoading(true)
  setError(null)

  try {
    const client = getSupabaseClient()

    const { error: ensureError } =
      await client.rpc('ensure_my_profile')

    if (ensureError) throw ensureError

    const { data, error: profileError } = await client
      .from('profiles')
      .select('display_name')
      .eq('id', user.id)
      .single()

    if (profileError) throw profileError

    if (
      data.display_name !== null &&
      typeof data.display_name !== 'string'
    ) {
      throw new Error('Your profile contains an invalid display name.')
    }

    if (!cancelled) {
      setDisplayName(data.display_name)
    }
  } catch (loadError) {
    if (!cancelled) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Your profile could not be loaded. Please try again.',
      )
    }
  } finally {
    if (!cancelled) {
      setLoading(false)
    }
  }
}

void loadProfile()

return () => {
  cancelled = true
};
  }, [user?.id]);

  const ageGroup = isAgeGroup(user?.user_metadata.age_group)
    ? user.user_metadata.age_group
    : null;

  const accountType =
    typeof user?.user_metadata.account_type_requested === "string"
      ? user.user_metadata.account_type_requested
      : "student";

  const accountTypeLabel =
    accountType === "teacher_applicant" ? "Teacher applicant" : "Student";

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Not available";

  return (
    <section className="mx-auto w-[min(100%-40px,760px)] py-10 max-[520px]:py-7">
      {" "}
      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-[0_8px_24px_rgba(41,52,46,0.05)]">
        {" "}
        <div className="border-b border-border px-8 py-7 max-[520px]:px-5">
          {" "}
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[1.3px] text-clay">
            Account{" "}
          </p>
          <h1 className="mb-2 font-serif text-3xl font-medium text-ink">
            Your profile
          </h1>
          <p className="text-sm leading-6 text-muted">
            View your account information and manage your personal details.
          </p>
        </div>
        <div className="p-8 max-[520px]:p-5">
          {loading ? (
            <p className="text-sm text-muted" role="status">
              Loading your profile…
            </p>
          ) : error ? (
            <div className="space-y-4">
              <p className="text-sm leading-6 text-[#803d2e]" role="alert">
                {error}
              </p>

              <button
                className={secondaryButtonClass}
                onClick={() => window.location.reload()}
                type="button"
              >
                Try again
              </button>
            </div>
          ) : (
            <>
              <div className="mb-7 flex items-center gap-4">
                <div
                  aria-hidden="true"
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#e9eee7] font-serif text-xl font-semibold text-forest"
                >
                  {(displayName?.trim() || user?.email || "U")
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="min-w-0">
                  <h2 className="truncate font-serif text-xl font-medium text-ink">
                    {displayName?.trim() || "Add your display name"}
                  </h2>

                  <p className="break-all text-sm text-muted">
                    {user?.email ?? "Email not available"}
                  </p>
                </div>
              </div>

              <div className="divide-y divide-border rounded-lg border border-border">
                <ProfileDetail
                  label="Display name"
                  value={displayName?.trim() || "Not provided"}
                />

                <ProfileDetail
                  label="Account email"
                  value={user?.email ?? "Not available"}
                />

                <ProfileDetail
                  label="Age group"
                  value={getAgeGroupLabel(ageGroup)}
                />

                <ProfileDetail
                  label="Account type requested"
                  value={accountTypeLabel}
                />

                <ProfileDetail label="Member since" value={memberSince} />
              </div>

              <p className="mt-5 rounded-md bg-[#f5f3ed] px-4 py-3 text-xs leading-5 text-muted">
                Your account type is a registration preference, not proof of an
                approved role. Teacher access must be granted through a trusted
                approval process. Your date of birth is not currently stored in
                your profile.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link className={buttonClass} to="/profile/edit">
                  Edit profile
                </Link>

                <Link className={secondaryButtonClass} to="/">
                  Back to home
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function ProfileDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-1 gap-1 px-4 py-4 sm:grid-cols-[180px_1fr] sm:gap-4">
      {" "}
      <dt className="text-sm text-muted">{label}</dt>{" "}
      <dd className="break-words text-sm font-medium text-ink">{value}</dd>{" "}
    </div>
  );
}

export default ProfilePage;
