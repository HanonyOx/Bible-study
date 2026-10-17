export type AgeGroup = 'children' | 'teens' | 'adults'

export function getAgeGroupForDateOfBirth(
  dateOfBirth: string,
  today?: Date,
): AgeGroup | null

export function getLocalDateInputValue(date?: Date): string
