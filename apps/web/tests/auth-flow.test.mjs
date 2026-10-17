import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const read = (relativePath) =>
  readFileSync(path.join(webRoot, relativePath), 'utf8')

test('existing Supabase auth flow covers registration, recovery, and session restoration', () => {
  const pages = read('src/features/auth/AuthPages.tsx')
  const context = read('src/features/auth/AuthContext.tsx')

  assert.match(pages, /auth\.signUp\(/)
  assert.match(pages, /auth\.signInWithPassword\(/)
  assert.match(pages, /resetPasswordForEmail\(/)
  assert.match(pages, /auth\.updateUser\(\{ password \}\)/)
  assert.match(context, /auth\.onAuthStateChange\(/)
  assert.match(context, /auth\.getSession\(\)/)
  assert.match(context, /auth\.signOut\(\)/)
})

test('profile and teacher preview routes remain behind the signed-in route guard', () => {
  const router = read('src/app/router.tsx')
  const protectedRouteStart = router.indexOf('element: <ProtectedRoute />')
  const profileRoute = router.indexOf("path: 'profile'")
  const teacherRoute = router.indexOf("path: 'teacher'")
  const publicBibleRoute = router.indexOf("path: 'bible'")
  const publicCompareRoute = router.indexOf("path: 'compare'")

  assert.ok(protectedRouteStart >= 0)
  assert.ok(profileRoute > protectedRouteStart)
  assert.ok(teacherRoute > protectedRouteStart)
  assert.ok(publicBibleRoute >= 0 && publicBibleRoute < protectedRouteStart)
  assert.ok(publicCompareRoute >= 0 && publicCompareRoute < protectedRouteStart)

  const protectedRoute = read('src/features/auth/ProtectedRoute.tsx')
  assert.match(protectedRoute, /if \(!user\)/)
  assert.match(protectedRoute, /to="\/auth\/login"/)
})

test('registration collects a date, stores only the age band, and grants no role', () => {
  const pages = read('src/features/auth/AuthPages.tsx')

  assert.match(pages, /ageGroup === 'children'/)
  assert.match(pages, /guardian-managed account process/)
  assert.match(pages, /data: \{ age_group: ageGroup \}/)
  assert.match(pages, /the date itself is not saved/)
  assert.doesNotMatch(pages, /data:\s*\{[^}]*\b(role|teacher|admin)\s*:/s)
})

test('teacher controls are explicitly a volatile fixture and make no database calls', () => {
  const teacherPage = read('src/features/teacher/TeacherDemoPage.tsx')

  assert.match(teacherPage, /Fictional classes, learner aliases/)
  assert.match(teacherPage, /changes stay in memory/i)
  assert.match(teacherPage, /present.*absent.*late.*excused/s)
  assert.match(teacherPage, /placeholder only/)
  assert.doesNotMatch(teacherPage, /getSupabaseClient|\.from\(['"]|\.rpc\(/)
})
