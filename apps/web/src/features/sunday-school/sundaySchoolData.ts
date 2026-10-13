export const sundaySchoolAgeGroups = [
  { id: 'children', label: 'Children' },
  { id: 'teens', label: 'Teenagers' },
  { id: 'adults', label: 'Adults' },
] as const

export type SundaySchoolAgeGroup =
  (typeof sundaySchoolAgeGroups)[number]['id']

export type CurriculumPublicationStatus =
  | 'source_unverified'
  | 'under_review'
  | 'verified'
  | 'published'
  | 'withdrawn'

export type LessonPublicationStatus = 'draft' | 'published' | 'withdrawn'

export type LessonReviewStatus =
  | 'not_reviewed'
  | 'in_review'
  | 'approved'
  | 'rejected'

export type SundaySchoolCurriculum = {
  id: string
  name: string
  year: number
  source: {
    kind: 'official' | 'original'
    title: string | null
    url: string | null
  }
  usageRightsStatus:
    | 'unverified'
    | 'approved'
    | 'not_permitted'
    | 'not_applicable'
  publicationStatus: CurriculumPublicationStatus
}

export type SundaySchoolLessonSection = {
  title: string
  studentContent: string
}

export type SundaySchoolLesson = {
  id: string
  title: string
  ageGroup: SundaySchoolAgeGroup
  curriculumId: string
  contentOrigin: 'original_word_and_way' | 'licensed_external'
  lessonDate: string | null
  sequenceNumber: number
  mainScriptureReference: string
  scriptureReferences: string[]
  learningObjectives: string[]
  introduction: string
  teachingPoints: SundaySchoolLessonSection[]
  practicalApplication: string
  discussionQuestions: string[]
  memoryVerseReference: string
  closingPrayer: string
  ageAppropriateExplanation?: string
  interactiveActivity?: string
  simpleTakeaway?: string
  studentFacingContent: string
  sections: SundaySchoolLessonSection[]
  publicationStatus: LessonPublicationStatus
  reviewStatus: LessonReviewStatus
}

export type TeacherOnlyLessonContent = {
  lessonId: string
  notes: string[]
}

export const sundaySchoolCurricula: SundaySchoolCurriculum[] = [
  {
    id: 'word-and-way-original-studies-2026',
    name: 'Word & Way Demonstration Curriculum — 2026',
    year: 2026,
    source: {
      kind: 'original',
      title: 'Original Word & Way study collection',
      url: null,
    },
    usageRightsStatus: 'not_applicable',
    publicationStatus: 'under_review',
  },
]

export function isStudentVisibleLesson(
  lesson: SundaySchoolLesson,
  curriculum: SundaySchoolCurriculum | undefined,
): boolean {
  if (
    !curriculum ||
    lesson.publicationStatus !== 'published' ||
    lesson.reviewStatus !== 'approved' ||
    curriculum.publicationStatus !== 'published' ||
    !curriculum.source.title
  ) {
    return false
  }

  return curriculum.source.kind === 'original'
    ? lesson.contentOrigin === 'original_word_and_way' &&
        curriculum.usageRightsStatus === 'not_applicable'
    : lesson.contentOrigin === 'licensed_external' &&
        curriculum.usageRightsStatus === 'approved' &&
        Boolean(curriculum.source.url)
}

export function filterStudentLessons(
  lessons: SundaySchoolLesson[],
  ageGroup: SundaySchoolAgeGroup,
  searchQuery: string,
): SundaySchoolLesson[] {
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase()
  return lessons
    .filter((lesson) => lesson.ageGroup === ageGroup)
    .filter((lesson) => {
      if (!normalizedQuery) return true
      return [lesson.title, ...lesson.scriptureReferences]
        .join(' ')
        .toLocaleLowerCase()
        .includes(normalizedQuery)
    })
}

export function getStudentVisibleLessons(
  lessons: SundaySchoolLesson[] = [],
): SundaySchoolLesson[] {
  return lessons.filter((lesson) => {
    const curriculum = sundaySchoolCurricula.find(
      ({ id }) => id === lesson.curriculumId,
    )

    return isStudentVisibleLesson(lesson, curriculum)
  })
}
