import { getSupabaseClient } from '../../services/supabaseClient'

export type EditorialReviewStatus =
  | 'not_reviewed'
  | 'in_review'
  | 'approved'
  | 'rejected'

export type EditorialPublicationStatus = 'draft' | 'published' | 'withdrawn'

export type EditorialLessonSection = {
  id: string
  sequence_number: number
  section_kind: string
  title: string | null
  student_content: string | null
  discussion_questions: string[]
}

export type EditorialLesson = {
  id: string
  age_group: 'children' | 'teens' | 'adults'
  title: string
  lesson_date: string | null
  sequence_number: number
  review_status: EditorialReviewStatus
  reviewed_at: string | null
  reviewed_by: string | null
  publication_status: EditorialPublicationStatus
  published_at: string | null
  published_by: string | null
  introduction: string
  practical_application: string
  memory_verse_reference: string
  closing_prayer: string
  age_appropriate_explanation: string | null
  interactive_activity: string | null
  simple_takeaway: string | null
  scripture_references: string[]
  learning_objectives: string[]
  sections: EditorialLessonSection[]
}

export type EditorialCurriculum = {
  id: string
  publisher: string
  content_origin: 'original_word_and_way' | 'licensed_external'
  name: string
  year: number
  edition_label: string | null
  source_title: string | null
  source_url: string | null
  source_status: string
  source_verified_at: string | null
  source_verified_by: string | null
  usage_rights_status: string
  usage_rights_evidence_ref: string | null
  usage_rights_verified_at: string | null
  usage_rights_verified_by: string | null
  review_status: EditorialReviewStatus
  reviewed_at: string | null
  reviewed_by: string | null
  publication_status: EditorialPublicationStatus
  published_at: string | null
  published_by: string | null
  lessons: EditorialLesson[]
}

export class EditorialServiceError extends Error {
  readonly code: string | null

  constructor(message: string, code: string | null = null) {
    super(message)
    this.name = 'EditorialServiceError'
    this.code = code
  }
}

type JsonObject = Record<string, unknown>

function objectValue(value: unknown, label: string): JsonObject {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new EditorialServiceError(`Unexpected ${label} in editorial response.`)
  }
  return value as JsonObject
}

function stringValue(
  object: JsonObject,
  key: string,
  label: string,
): string {
  const value = object[key]
  if (typeof value !== 'string') {
    throw new EditorialServiceError(`Missing ${key} in ${label}.`)
  }
  return value
}

function nullableStringValue(
  object: JsonObject,
  key: string,
  label: string,
): string | null {
  const value = object[key]
  if (value === null || value === undefined) return null
  if (typeof value !== 'string') {
    throw new EditorialServiceError(`Unexpected ${key} in ${label}.`)
  }
  return value
}

function numberValue(object: JsonObject, key: string, label: string): number {
  const value = object[key]
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    throw new EditorialServiceError(`Invalid ${key} in ${label}.`)
  }
  return value
}

function textArray(value: unknown, label: string): string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
    throw new EditorialServiceError(`Invalid ${label} in editorial response.`)
  }
  return value
}

function reviewStatus(value: string, label: string): EditorialReviewStatus {
  if (
    value !== 'not_reviewed' &&
    value !== 'in_review' &&
    value !== 'approved' &&
    value !== 'rejected'
  ) {
    throw new EditorialServiceError(`Unexpected review status in ${label}.`)
  }
  return value
}

function publicationStatus(
  value: string,
  label: string,
): EditorialPublicationStatus {
  if (value !== 'draft' && value !== 'published' && value !== 'withdrawn') {
    throw new EditorialServiceError(`Unexpected publication status in ${label}.`)
  }
  return value
}

function parseLesson(value: unknown): EditorialLesson {
  const row = objectValue(value, 'lesson')
  const label = 'editorial lesson'
  const ageGroup = stringValue(row, 'age_group', label)
  if (ageGroup !== 'children' && ageGroup !== 'teens' && ageGroup !== 'adults') {
    throw new EditorialServiceError('Unexpected lesson age group.')
  }
  if (!Array.isArray(row.sections)) {
    throw new EditorialServiceError('Invalid lesson sections in editorial response.')
  }
  const sections = row.sections.map((value) => {
    const section = objectValue(value, 'lesson section')
    return {
      id: stringValue(section, 'id', 'lesson section'),
      sequence_number: numberValue(section, 'sequence_number', 'lesson section'),
      section_kind: stringValue(section, 'section_kind', 'lesson section'),
      title: nullableStringValue(section, 'title', 'lesson section'),
      student_content: nullableStringValue(
        section,
        'student_content',
        'lesson section',
      ),
      discussion_questions: textArray(
        section.discussion_questions,
        'discussion questions',
      ),
    }
  })

  return {
    id: stringValue(row, 'id', label),
    age_group: ageGroup,
    title: stringValue(row, 'title', label),
    lesson_date: nullableStringValue(row, 'lesson_date', label),
    sequence_number: numberValue(row, 'sequence_number', label),
    review_status: reviewStatus(stringValue(row, 'review_status', label), label),
    reviewed_at: nullableStringValue(row, 'reviewed_at', label),
    reviewed_by: nullableStringValue(row, 'reviewed_by', label),
    publication_status: publicationStatus(
      stringValue(row, 'publication_status', label),
      label,
    ),
    published_at: nullableStringValue(row, 'published_at', label),
    published_by: nullableStringValue(row, 'published_by', label),
    introduction: stringValue(row, 'introduction', label),
    practical_application: stringValue(row, 'practical_application', label),
    memory_verse_reference: stringValue(row, 'memory_verse_reference', label),
    closing_prayer: stringValue(row, 'closing_prayer', label),
    age_appropriate_explanation: nullableStringValue(
      row,
      'age_appropriate_explanation',
      label,
    ),
    interactive_activity: nullableStringValue(row, 'interactive_activity', label),
    simple_takeaway: nullableStringValue(row, 'simple_takeaway', label),
    scripture_references: textArray(
      row.scripture_references,
      'Scripture references',
    ),
    learning_objectives: textArray(
      row.learning_objectives,
      'learning objectives',
    ),
    sections,
  }
}

function parseCurriculum(value: unknown): EditorialCurriculum {
  const row = objectValue(value, 'curriculum')
  const label = 'editorial curriculum'
  const origin = stringValue(row, 'content_origin', label)
  if (origin !== 'original_word_and_way' && origin !== 'licensed_external') {
    throw new EditorialServiceError('Unexpected curriculum content origin.')
  }
  if (!Array.isArray(row.lessons)) {
    throw new EditorialServiceError('Invalid lessons in editorial response.')
  }

  return {
    id: stringValue(row, 'id', label),
    publisher: stringValue(row, 'publisher', label),
    content_origin: origin,
    name: stringValue(row, 'name', label),
    year: numberValue(row, 'year', label),
    edition_label: nullableStringValue(row, 'edition_label', label),
    source_title: nullableStringValue(row, 'source_title', label),
    source_url: nullableStringValue(row, 'source_url', label),
    source_status: stringValue(row, 'source_status', label),
    source_verified_at: nullableStringValue(row, 'source_verified_at', label),
    source_verified_by: nullableStringValue(row, 'source_verified_by', label),
    usage_rights_status: stringValue(row, 'usage_rights_status', label),
    usage_rights_evidence_ref: nullableStringValue(
      row,
      'usage_rights_evidence_ref',
      label,
    ),
    usage_rights_verified_at: nullableStringValue(
      row,
      'usage_rights_verified_at',
      label,
    ),
    usage_rights_verified_by: nullableStringValue(
      row,
      'usage_rights_verified_by',
      label,
    ),
    review_status: reviewStatus(stringValue(row, 'review_status', label), label),
    reviewed_at: nullableStringValue(row, 'reviewed_at', label),
    reviewed_by: nullableStringValue(row, 'reviewed_by', label),
    publication_status: publicationStatus(
      stringValue(row, 'publication_status', label),
      label,
    ),
    published_at: nullableStringValue(row, 'published_at', label),
    published_by: nullableStringValue(row, 'published_by', label),
    lessons: row.lessons.map(parseLesson),
  }
}

async function invoke(
  name: string,
  args: Record<string, unknown>,
): Promise<void> {
  const { error } = await getSupabaseClient().rpc(name, args)
  if (error) {
    throw new EditorialServiceError(error.message, error.code ?? null)
  }
}

export async function getEditorialQueue(): Promise<EditorialCurriculum[]> {
  const { data, error } = await getSupabaseClient().rpc('get_editorial_queue')
  if (error) {
    throw new EditorialServiceError(error.message, error.code ?? null)
  }
  if (!Array.isArray(data)) {
    throw new EditorialServiceError('Unexpected editorial queue response.')
  }
  return data.map(parseCurriculum)
}

export async function submitLessonForReview(lessonId: string): Promise<void> {
  await invoke('submit_lesson_for_review', { p_lesson_id: lessonId })
}

export async function submitCurriculumForReview(
  curriculumId: string,
): Promise<void> {
  await invoke('submit_curriculum_for_review', {
    p_curriculum_id: curriculumId,
  })
}

export async function reviewLesson(
  lessonId: string,
  decision: 'approved' | 'rejected',
  feedback: string,
): Promise<void> {
  if (decision === 'rejected' && !feedback.trim()) {
    throw new EditorialServiceError('Enter feedback before returning a lesson.')
  }
  await invoke('review_lesson', {
    p_lesson_id: lessonId,
    p_decision: decision,
    p_feedback: feedback.trim() || null,
  })
}

export async function approveCurriculum(curriculumId: string): Promise<void> {
  await invoke('review_curriculum', {
    p_curriculum_id: curriculumId,
    p_decision: 'approved',
    p_feedback: null,
  })
}

export type LessonDraftInput = {
  title: string
  age_group: EditorialLesson['age_group']
  lesson_date: string | null
  sequence_number: number
  introduction: string
  practical_application: string
  memory_verse_reference: string
  closing_prayer: string
  age_appropriate_explanation: string | null
  interactive_activity: string | null
  simple_takeaway: string | null
  scripture_references: string[]
  learning_objectives: string[]
  teaching_points: { title: string; student_content: string }[]
  discussion_questions: string[]
}

export async function saveLessonDraft(
  lessonId: string,
  content: LessonDraftInput,
): Promise<void> {
  await invoke('save_lesson_draft', {
    p_lesson_id: lessonId,
    p_content: content,
  })
}

export async function publishLesson(lessonId: string): Promise<void> {
  await invoke('publish_lesson', { p_lesson_id: lessonId })
}

export async function publishCurriculum(curriculumId: string): Promise<void> {
  await invoke('publish_curriculum', { p_curriculum_id: curriculumId })
}

export async function unpublishLesson(
  lessonId: string,
  reason: string,
): Promise<void> {
  if (!reason.trim()) {
    throw new EditorialServiceError('Enter a reason before withdrawing a lesson.')
  }
  await invoke('unpublish_lesson', {
    p_lesson_id: lessonId,
    p_reason: reason.trim(),
  })
}
