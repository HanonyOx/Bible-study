import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './useAuth'

function ProtectedRoute() {
  const { user, loading, error } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <p className="mx-auto max-w-3xl px-6 py-16 text-center text-muted" role="status">
        Checking your sign-in status…
      </p>
    )
  }

  if (error) {
    return (
      <p className="mx-auto max-w-3xl px-6 py-16 text-center text-clay" role="alert">
        We could not verify your sign-in status. {error}
      </p>
    )
  }

  if (!user) {
    return <Navigate replace state={{ from: location }} to="/auth/login" />
  }

  return <Outlet />
}

export default ProtectedRoute
