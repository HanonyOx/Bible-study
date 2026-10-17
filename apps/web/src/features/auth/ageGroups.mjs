/**
 * @typedef {'children' | 'teens' | 'adults'} AgeGroup
 */

/**
 * Returns the age band for a valid ISO date of birth, or null for invalid,
 * future, or under-one dates.
 *
 * @param {string} dateOfBirth
 * @param {Date} [today]
 * @returns {AgeGroup | null}
 */
export function getAgeGroupForDateOfBirth(dateOfBirth, today = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)) return null
  if (!(today instanceof Date) || Number.isNaN(today.getTime())) return null

  const [year, month, day] = dateOfBirth.split('-').map(Number)
  const birthDate = new Date(Date.UTC(year, month - 1, day))
  if (
    birthDate.getUTCFullYear() !== year ||
    birthDate.getUTCMonth() !== month - 1 ||
    birthDate.getUTCDate() !== day
  ) {
    return null
  }

  let age = today.getFullYear() - year
  const birthdayHasPassed =
    today.getMonth() > month - 1 ||
    (today.getMonth() === month - 1 && today.getDate() >= day)
  if (!birthdayHasPassed) age -= 1
  if (age < 1) return null
  if (age <= 12) return 'children'
  if (age <= 19) return 'teens'
  return 'adults'
}

/**
 * @param {Date} [date]
 */
export function getLocalDateInputValue(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
