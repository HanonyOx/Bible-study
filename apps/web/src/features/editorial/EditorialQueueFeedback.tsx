import type { EditorialQueueState } from './editorialState'

export function EditorialQueueFeedback({
  empty,
  onRetry,
  state,
}: {
  empty: boolean
  onRetry: () => void
  state: EditorialQueueState
}) {
  return (
    <>
      {state.loading && (
        <p className="mb-4 text-sm text-muted" role="status">
          {state.curricula
            ? 'Refreshing editorial queue…'
            : 'Loading editorial queue…'}
        </p>
      )}
      {state.error && (
        <div
          className="mb-5 rounded-md border border-[#d8b6ab] bg-[#fbf3f0] px-4 py-3 text-sm leading-6 text-[#803d2e]"
          role="alert"
        >
          <p className="mb-2 font-semibold">
            {state.accessDenied
              ? 'Editorial access is not available for this account.'
              : 'The editorial queue could not be loaded.'}
          </p>
          <p className="mb-3">{state.error}</p>
          <button
            className="font-semibold underline"
            onClick={onRetry}
            type="button"
          >
            Try again
          </button>
        </div>
      )}
      {!state.loading && !state.error && empty && (
        <div
          className="rounded-[10px] border border-border bg-surface p-6 text-sm leading-6 text-muted"
          role="status"
        >
          The editorial queue is empty. No curriculum records are available for
          review.
        </div>
      )}
    </>
  )
}
