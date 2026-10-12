export const sundaySchoolAgeGroups = [
  { id: 'adults', label: 'Adults' },
  { id: 'teenagers', label: 'Teenagers' },
  { id: 'children', label: 'Children' },
] as const

export type SundaySchoolAgeGroup =
  (typeof sundaySchoolAgeGroups)[number]['id']

export type SundaySchoolLesson = {
  id: string
  title: string
  date?: string
  biblePassages: string[]
  memoryVerse?: {
    reference: string
    text?: string
  }
  discussionQuestions: string[]
  activities: string[]
}

export type SundaySchoolAgeGroupCurriculum = {
  ageGroup: SundaySchoolAgeGroup
  lessons: SundaySchoolLesson[]
}

export type SundaySchoolCurriculum = {
  publisher: string
  workingYear: number
  edition: string | null
  editionVerified: boolean
  ageGroups: SundaySchoolAgeGroupCurriculum[]
}

export const sundaySchoolCurriculum: SundaySchoolCurriculum = {
  publisher: 'Assemblies of God Nigeria',
  workingYear: 2026,
  edition: null,
  editionVerified: false,
  ageGroups: sundaySchoolAgeGroups.map(({ id }) => ({
    ageGroup: id,
    lessons: [],
  })),
}
