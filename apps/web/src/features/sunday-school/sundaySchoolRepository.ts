import { getSupabaseClient } from '../../services/supabaseClient'
import type {
  SundaySchoolLesson,
  SundaySchoolLessonSection,
} from './sundaySchoolData'

type DatabaseRow = Record<string, unknown>

type CurriculumRow = {
  id: string
  content_origin: 'original_word_and_way' | 'licensed_external'
}

function asRows(value: unknown, table: string): DatabaseRow[] {
  if (!Array.isArray(value)) {
    throw new Error(`Unexpected response while reading ${table}.`)
  }
  return value.map((row: unknown) => {
    if (row === null || typeof row !== 'object' || Array.isArray(row)) {
      throw new Error(`Unexpected row shape while reading ${table}.`)
    }
    return row as DatabaseRow
  })
}

function requiredString(row: DatabaseRow, key: string, table: string): string {
  const value = row[key]
  if (typeof value !== 'string') {
    throw new Error(`Missing ${key} in ${table} response.`)
  }
  return value
}

function nullableString(row: DatabaseRow, key: string): string | null {
  const value = row[key]
  if (value === null || value === undefined) return null
  if (typeof value !== 'string') {
    throw new Error(`Unexpected value for ${key} in database response.`)
  }
  return value
}

function sequence(row: DatabaseRow): number {
  const value = row.sequence_number
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    throw new Error('Unexpected sequence number in database response.')
  }
  return value
}

function sortedTextValues(
  rows: DatabaseRow[],
  key: string,
  table: string,
): string[] {
  return [...rows]
    .sort((left, right) => sequence(left) - sequence(right))
    .map((row) => requiredString(row, key, table))
}

export async function readStudentVisibleLessons(): Promise<SundaySchoolLesson[]> {
  const client = getSupabaseClient()
  const [
    curriculumResult,
    lessonResult,
    sectionResult,
    questionResult,
    referenceResult,
    objectiveResult,
  ] = await Promise.all([
    client
      .from('curriculum_editions')
      .select('id, content_origin'),
    client
      .from('lessons')
      .select(
        'id, curriculum_id, age_group, title, lesson_date, sequence_number, introduction, practical_application, memory_verse_reference, closing_prayer, age_appropriate_explanation, interactive_activity, simple_takeaway',
      ),
    client
      .from('lesson_sections')
      .select('id, lesson_id, sequence_number, section_kind, title, student_content'),
    client
      .from('lesson_discussion_questions')
      .select('id, section_id, sequence_number, question'),
    client
      .from('lesson_scripture_references')
      .select('id, lesson_id, sequence_number, reference'),
    client
      .from('lesson_learning_objectives')
      .select('id, lesson_id, sequence_number, objective'),
  ])

  const failedQuery = [
    curriculumResult,
    lessonResult,
    sectionResult,
    questionResult,
    referenceResult,
    objectiveResult,
  ].find((result) => result.error)
  if (failedQuery?.error) {
    throw new Error(`Unable to load published lessons: ${failedQuery.error.message}`)
  }

  const curricula = new Map<string, CurriculumRow>()
  for (const row of asRows(curriculumResult.data, 'curriculum_editions')) {
    const origin = requiredString(row, 'content_origin', 'curriculum_editions')
    if (origin !== 'original_word_and_way' && origin !== 'licensed_external') {
      throw new Error('Unexpected curriculum origin in database response.')
    }
    const id = requiredString(row, 'id', 'curriculum_editions')
    curricula.set(id, { id, content_origin: origin })
  }

  const sections = asRows(sectionResult.data, 'lesson_sections')
  const questions = asRows(
    questionResult.data,
    'lesson_discussion_questions',
  )
  const references = asRows(
    referenceResult.data,
    'lesson_scripture_references',
  )
  const objectives = asRows(
    objectiveResult.data,
    'lesson_learning_objectives',
  )

  return asRows(lessonResult.data, 'lessons').map((row) => {
    const id = requiredString(row, 'id', 'lessons')
    const curriculumId = requiredString(row, 'curriculum_id', 'lessons')
    const curriculum = curricula.get(curriculumId)
    if (!curriculum) {
      throw new Error(`Published lesson ${id} has no visible curriculum.`)
    }

    const ageGroup = requiredString(row, 'age_group', 'lessons')
    if (
      ageGroup !== 'children' &&
      ageGroup !== 'teens' &&
      ageGroup !== 'adults'
    ) {
      throw new Error(`Unexpected age group for lesson ${id}.`)
    }

    const lessonSections = sections
      .filter((section) => section.lesson_id === id)
      .sort((left, right) => sequence(left) - sequence(right))
    const teachingPoints: SundaySchoolLessonSection[] = lessonSections
      .filter((section) => section.section_kind === 'teaching_point')
      .map((section) => ({
        title: requiredString(section, 'title', 'lesson_sections'),
        studentContent: requiredString(
          section,
          'student_content',
          'lesson_sections',
        ),
      }))
    const discussionSectionIds = new Set(
      lessonSections
        .filter((section) => section.section_kind === 'discussion')
        .map((section) => section.id),
    )
    const discussionQuestions = sortedTextValues(
      questions.filter((question) =>
        discussionSectionIds.has(question.section_id),
      ),
      'question',
      'lesson_discussion_questions',
    )
    const scriptureReferences = sortedTextValues(
      references.filter((reference) => reference.lesson_id === id),
      'reference',
      'lesson_scripture_references',
    )
    const learningObjectives = sortedTextValues(
      objectives.filter((objective) => objective.lesson_id === id),
      'objective',
      'lesson_learning_objectives',
    )

    return {
      id,
      title: requiredString(row, 'title', 'lessons'),
      ageGroup,
      curriculumId,
      contentOrigin: curriculum.content_origin,
      lessonDate: nullableString(row, 'lesson_date'),
      sequenceNumber: sequence(row),
      mainScriptureReference: scriptureReferences[0] ?? '',
      scriptureReferences,
      learningObjectives,
      introduction: requiredString(row, 'introduction', 'lessons'),
      teachingPoints,
      practicalApplication: requiredString(
        row,
        'practical_application',
        'lessons',
      ),
      discussionQuestions,
      memoryVerseReference: requiredString(
        row,
        'memory_verse_reference',
        'lessons',
      ),
      closingPrayer: requiredString(row, 'closing_prayer', 'lessons'),
      ageAppropriateExplanation:
        nullableString(row, 'age_appropriate_explanation') ?? undefined,
      interactiveActivity:
        nullableString(row, 'interactive_activity') ?? undefined,
      simpleTakeaway: nullableString(row, 'simple_takeaway') ?? undefined,
      studentFacingContent: '',
      sections: teachingPoints,
      publicationStatus: 'published',
      reviewStatus: 'approved',
    }
  })
}
