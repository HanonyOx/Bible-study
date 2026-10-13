import type { EditorialCurriculum } from './editorialService'

export type EditorialQueueState = {
  curricula: EditorialCurriculum[] | null
  loading: boolean
  error: string | null
  accessDenied: boolean
}

export type EditorialQueueAction =
  | { type: 'loading' }
  | { type: 'loaded'; curricula: EditorialCurriculum[] }
  | { type: 'failed'; error: string; accessDenied: boolean }

export const initialEditorialQueueState: EditorialQueueState = {
  curricula: null,
  loading: true,
  error: null,
  accessDenied: false,
}

export function editorialQueueReducer(
  state: EditorialQueueState,
  action: EditorialQueueAction,
): EditorialQueueState {
  switch (action.type) {
    case 'loading':
      return { ...state, loading: true, error: null, accessDenied: false }
    case 'loaded':
      return {
        curricula: action.curricula,
        loading: false,
        error: null,
        accessDenied: false,
      }
    case 'failed':
      return {
        curricula: null,
        loading: false,
        error: action.error,
        accessDenied: action.accessDenied,
      }
  }
}

export function hasEditorialAccessError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === '42501'
  )
}
