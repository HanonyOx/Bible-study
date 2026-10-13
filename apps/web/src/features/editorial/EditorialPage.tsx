import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import {
  approveCurriculum,
  publishCurriculum,
  getEditorialQueue,
  publishLesson,
  reviewLesson,
  saveLessonDraft,
  submitCurriculumForReview,
  submitLessonForReview,
  unpublishLesson,
  type EditorialCurriculum,
  type EditorialLesson,
  type LessonDraftInput,
} from './editorialService'
import {
  editorialQueueReducer,
  hasEditorialAccessError,
  initialEditorialQueueState,
} from './editorialState'
import { EditorialQueueFeedback } from './EditorialQueueFeedback'

const pageClass =
  'mx-auto w-[min(1120px,calc(100%-64px))] py-[46px] pb-[52px] max-[720px]:w-[min(100%-36px,560px)] max-[720px]:py-[25px] max-[720px]:pb-[34px] max-[390px]:w-[calc(100%-28px)]'
const inputClass =
  'min-h-11 w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink outline-none focus:border-forest focus:ring-2 focus:ring-soft-green'
const labelClass = 'mb-1 block text-xs font-semibold text-ink'
const secondaryButtonClass =
  'min-h-10 rounded-md border border-border bg-white px-3 py-2 text-sm font-semibold text-forest hover:bg-[#fbfaf7] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-clay disabled:cursor-wait disabled:opacity-60'
const primaryButtonClass =
  'min-h-10 rounded-md bg-forest px-3 py-2 text-sm font-semibold text-white hover:bg-[#274a35] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-clay disabled:cursor-wait disabled:opacity-60'
const dangerButtonClass =
  'min-h-10 rounded-md border border-[#d8b6ab] bg-white px-3 py-2 text-sm font-semibold text-[#803d2e] hover:bg-[#fbf3f0] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-clay disabled:cursor-wait disabled:opacity-60'

type DraftForm = {
  title: string
  ageGroup: EditorialLesson['age_group']
  lessonDate: string
  sequenceNumber: string
  introduction: string
  practicalApplication: string
  memoryVerseReference: string
  closingPrayer: string
  ageAppropriateExplanation: string
  interactiveActivity: string
  simpleTakeaway: string
  scriptureReferences: string
  learningObjectives: string
  teachingPoints: { title: string; studentContent: string }[]
  discussionQuestions: string
}

function makeDraftForm(lesson: EditorialLesson): DraftForm {
  const teachingPoints = lesson.sections
    .flatMap((section) =>
      section.section_kind === 'teaching_point' &&
      section.title !== null &&
      section.student_content !== null
        ? [{ title: section.title, studentContent: section.student_content }]
        : [],
    )
  const discussionQuestions = lesson.sections
    .filter((section) => section.section_kind === 'discussion')
    .flatMap((section) => section.discussion_questions)

  return {
    title: lesson.title,
    ageGroup: lesson.age_group,
    lessonDate: lesson.lesson_date?.slice(0, 10) ?? '',
    sequenceNumber: String(lesson.sequence_number),
    introduction: lesson.introduction,
    practicalApplication: lesson.practical_application,
    memoryVerseReference: lesson.memory_verse_reference,
    closingPrayer: lesson.closing_prayer,
    ageAppropriateExplanation: lesson.age_appropriate_explanation ?? '',
    interactiveActivity: lesson.interactive_activity ?? '',
    simpleTakeaway: lesson.simple_takeaway ?? '',
    scriptureReferences: lesson.scripture_references.join('\n'),
    learningObjectives: lesson.learning_objectives.join('\n'),
    teachingPoints,
    discussionQuestions: discussionQuestions.join('\n'),
  }
}

function lines(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
}

function makeDraftInput(form: DraftForm): LessonDraftInput {
  return {
    title: form.title.trim(),
    age_group: form.ageGroup,
    lesson_date: form.lessonDate || null,
    sequence_number: Number(form.sequenceNumber),
    introduction: form.introduction,
    practical_application: form.practicalApplication,
    memory_verse_reference: form.memoryVerseReference,
    closing_prayer: form.closingPrayer,
    age_appropriate_explanation: form.ageAppropriateExplanation || null,
    interactive_activity: form.interactiveActivity || null,
    simple_takeaway: form.simpleTakeaway || null,
    scripture_references: lines(form.scriptureReferences),
    learning_objectives: lines(form.learningObjectives),
    teaching_points: form.teachingPoints.map(({ title, studentContent }) => ({
      title: title.trim(),
      student_content: studentContent.trim(),
    })),
    discussion_questions: lines(form.discussionQuestions),
  }
}

function formatDate(value: string | null): string {
  if (!value) return 'Not recorded'
  const date = new Date(value)
  return Number.isNaN(date.valueOf()) ? value : date.toLocaleString()
}

function displayValue(value: string | null): string {
  return value || 'Not recorded'
}

function errorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : 'An unexpected error occurred. Please try again.'
}

function canEdit(lesson: EditorialLesson): boolean {
  return (
    lesson.publication_status !== 'published' &&
    (lesson.review_status === 'not_reviewed' ||
      lesson.review_status === 'rejected')
  )
}

function curriculumForLesson(
  curricula: EditorialCurriculum[],
  lessonId: string,
): EditorialCurriculum | undefined {
  return curricula.find((curriculum) =>
    curriculum.lessons.some((lesson) => lesson.id === lessonId),
  )
}

function nextSelectedLessonId(
  curricula: EditorialCurriculum[],
  currentId: string | null,
): string | null {
  if (
    currentId &&
    curricula.some((curriculum) =>
      curriculum.lessons.some((lesson) => lesson.id === currentId),
    )
  ) {
    return currentId
  }
  return curricula[0]?.lessons[0]?.id ?? null
}

function EditorialPage() {
  const [queueState, dispatch] = useReducer(
    editorialQueueReducer,
    initialEditorialQueueState,
  )
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null)
  const [form, setForm] = useState<DraftForm | null>(null)
  const [editing, setEditing] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [withdrawalReason, setWithdrawalReason] = useState('')
  const [working, setWorking] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const refreshQueue = useCallback(async () => {
    dispatch({ type: 'loading' })
    try {
      const curricula = await getEditorialQueue()
      dispatch({ type: 'loaded', curricula })
      setSelectedLessonId((currentId) =>
        nextSelectedLessonId(curricula, currentId),
      )
    } catch (error) {
      dispatch({
        type: 'failed',
        error: errorMessage(error),
        accessDenied: hasEditorialAccessError(error),
      })
    }
  }, [])

  useEffect(() => {
    let active = true
    void getEditorialQueue()
      .then((curricula) => {
        if (!active) return
        dispatch({ type: 'loaded', curricula })
        setSelectedLessonId((currentId) =>
          nextSelectedLessonId(curricula, currentId),
        )
      })
      .catch((error: unknown) => {
        if (!active) return
        dispatch({
          type: 'failed',
          error: errorMessage(error),
          accessDenied: hasEditorialAccessError(error),
        })
      })

    return () => {
      active = false
    }
  }, [])

  const curricula = useMemo(
    () => queueState.curricula ?? [],
    [queueState.curricula],
  )
  const selectedLesson = useMemo(
    () =>
      curricula.flatMap((curriculum) => curriculum.lessons).find(
        (lesson) => lesson.id === selectedLessonId,
      ),
    [curricula, selectedLessonId],
  )
  const selectedCurriculum = selectedLesson
    ? curriculumForLesson(curricula, selectedLesson.id)
    : undefined

  function selectLesson(lesson: EditorialLesson) {
    setSelectedLessonId(lesson.id)
    setForm(makeDraftForm(lesson))
    setEditing(false)
    setFeedback('')
    setWithdrawalReason('')
    setActionError(null)
    setNotice(null)
  }

  async function performAction(
    action: () => Promise<void>,
    successMessage: string,
  ) {
    setWorking(true)
    setActionError(null)
    setNotice(null)
    try {
      await action()
      setNotice(successMessage)
      setEditing(false)
      await refreshQueue()
    } catch (error) {
      const denied = hasEditorialAccessError(error)
      if (denied) {
        dispatch({
          type: 'failed',
          error: errorMessage(error),
          accessDenied: true,
        })
      }
      setActionError(errorMessage(error))
    } finally {
      setWorking(false)
    }
  }

  function updateForm<Key extends keyof DraftForm>(
    key: Key,
    value: DraftForm[Key],
  ) {
    setForm((current) => (current ? { ...current, [key]: value } : current))
  }

  return (
    <div className={pageClass}>
      <section className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-[15px] text-[11px] font-bold tracking-[1.65px] text-clay uppercase">
            Editorial workspace
          </p>
          <h1 className="mb-3 font-serif text-[clamp(34px,5vw,48px)] leading-[1.12] font-medium tracking-[-1.3px] text-ink">
            Curriculum review
          </h1>
          <p className="mb-0 max-w-[680px] text-sm leading-6 text-muted">
            Review draft lessons and manage publication. Database permissions
            are checked for every operation; this page does not grant editorial
            access by itself.
          </p>
        </div>
        <button
          className={secondaryButtonClass}
          disabled={queueState.loading || working}
          onClick={() => void refreshQueue()}
          type="button"
        >
          Refresh queue
        </button>
      </section>

      <EditorialQueueFeedback
        empty={!queueState.loading && curricula.length === 0}
        onRetry={() => void refreshQueue()}
        state={queueState}
      />

      {actionError && (
        <p
          className="mb-4 rounded-md border border-[#d8b6ab] bg-[#fbf3f0] px-4 py-3 text-sm text-[#803d2e]"
          role="alert"
        >
          The operation was not completed: {actionError}
        </p>
      )}
      {notice && (
        <p
          className="mb-4 rounded-md border border-[#bfd0c2] bg-soft-green px-4 py-3 text-sm text-forest"
          role="status"
        >
          {notice}
        </p>
      )}

      {curricula.length > 0 && (
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(280px,0.85fr)_minmax(0,1.5fr)]">
          <section
            className="rounded-[10px] border border-border bg-surface p-4"
            aria-labelledby="queue-heading"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="mb-0 font-serif text-xl font-medium text-ink" id="queue-heading">
                Queue
              </h2>
              <span className="text-xs text-muted">
                {curricula.reduce((count, curriculum) => count + curriculum.lessons.length, 0)} lessons
              </span>
            </div>
            <div className="space-y-5">
              {curricula.map((curriculum) => (
                <CurriculumQueue
                  curriculum={curriculum}
                  key={curriculum.id}
                  onApprove={() =>
                    void performAction(
                      () => approveCurriculum(curriculum.id),
                      'Curriculum edition approved.',
                    )
                  }
                  onPublish={() =>
                    void performAction(
                      () => publishCurriculum(curriculum.id),
                      'Curriculum edition published.',
                    )
                  }
                  onSelect={selectLesson}
                  onSubmit={() =>
                    void performAction(
                      () => submitCurriculumForReview(curriculum.id),
                      'Curriculum edition submitted for review.',
                    )
                  }
                  selectedLessonId={selectedLessonId}
                  working={working}
                />
              ))}
            </div>
          </section>

          {selectedLesson && selectedCurriculum ? (
            <LessonDetails
              curriculum={selectedCurriculum}
              editing={editing}
              feedback={feedback}
              form={form ?? makeDraftForm(selectedLesson)}
              lesson={selectedLesson}
              onCancelEdit={() => {
                setEditing(false)
                setForm(makeDraftForm(selectedLesson))
              }}
              onEdit={() => {
                setForm(makeDraftForm(selectedLesson))
                setEditing(true)
              }}
              onFeedbackChange={setFeedback}
              onFormChange={updateForm}
              onPublish={() =>
                void performAction(
                  () => publishLesson(selectedLesson.id),
                  'Lesson published.',
                )
              }
              onReject={() =>
                void performAction(
                  () => reviewLesson(selectedLesson.id, 'rejected', feedback),
                  'Lesson returned for editing.',
                )
              }
              onApprove={() =>
                void performAction(
                  () => reviewLesson(selectedLesson.id, 'approved', ''),
                  'Lesson approved.',
                )
              }
              onSave={() =>
                form &&
                void performAction(
                  () => saveLessonDraft(selectedLesson.id, makeDraftInput(form)),
                  'Draft saved. Submit it for review when it is ready.',
                )
              }
              onSubmit={() =>
                void performAction(
                  () => submitLessonForReview(selectedLesson.id),
                  'Lesson submitted for review.',
                )
              }
              onWithdrawalReasonChange={setWithdrawalReason}
              onWithdraw={() =>
                void performAction(
                  () => unpublishLesson(selectedLesson.id, withdrawalReason),
                  'Lesson withdrawn from publication.',
                )
              }
              withdrawalReason={withdrawalReason}
              working={working}
            />
          ) : (
            <div className="rounded-[10px] border border-border bg-surface p-6 text-sm text-muted">
              Select a lesson to inspect its content and editorial metadata.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function CurriculumQueue({
  curriculum,
  onApprove,
  onPublish,
  onSelect,
  onSubmit,
  selectedLessonId,
  working,
}: {
  curriculum: EditorialCurriculum
  onApprove: () => void
  onPublish: () => void
  onSelect: (lesson: EditorialLesson) => void
  onSubmit: () => void
  selectedLessonId: string | null
  working: boolean
}) {
  return (
    <section aria-label={`${curriculum.name} lessons`}>
      <div className="mb-2 border-b border-border pb-2">
        <h3 className="mb-1 text-sm font-semibold text-ink">{curriculum.name}</h3>
        <p className="mb-0 text-xs leading-5 text-muted">
          {curriculum.year} · {curriculum.content_origin.replaceAll('_', ' ')} ·{' '}
          {curriculum.review_status} · {curriculum.publication_status}
        </p>
        <div className="mt-1 mb-2 space-y-1 text-xs leading-5 text-muted">
          <p className="mb-0">
            Reviewed: {formatDate(curriculum.reviewed_at)} · Published:{' '}
            {formatDate(curriculum.published_at)}
          </p>
          <p className="mb-0 break-all">
            Reviewer: {displayValue(curriculum.reviewed_by)} · Publisher:{' '}
            {displayValue(curriculum.published_by)}
          </p>
          <p className="mb-0">
            Source verified: {formatDate(curriculum.source_verified_at)} ·
            Rights verified: {formatDate(curriculum.usage_rights_verified_at)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(curriculum.review_status === 'not_reviewed' ||
            curriculum.review_status === 'rejected') &&
            curriculum.publication_status !== 'published' && (
              <button
                className={secondaryButtonClass}
                disabled={working}
                onClick={onSubmit}
                type="button"
              >
                Submit edition
              </button>
            )}
          {curriculum.review_status === 'in_review' &&
            curriculum.publication_status !== 'published' && (
              <button
                className={secondaryButtonClass}
                disabled={working}
                onClick={onApprove}
                type="button"
              >
                Approve edition
              </button>
            )}
          {curriculum.review_status === 'approved' &&
            curriculum.publication_status !== 'published' && (
              <button
                className={secondaryButtonClass}
                disabled={working}
                onClick={onPublish}
                type="button"
              >
                Publish edition
              </button>
            )}
        </div>
      </div>
      {curriculum.lessons.length === 0 ? (
        <p className="mb-0 text-xs text-muted">No lessons in this curriculum.</p>
      ) : (
        <ul className="m-0 space-y-1 p-0">
          {curriculum.lessons.map((lesson) => (
            <li key={lesson.id}>
              <button
                aria-current={selectedLessonId === lesson.id ? 'true' : undefined}
                className={`w-full rounded-md border px-3 py-2 text-left focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-clay ${
                  selectedLessonId === lesson.id
                    ? 'border-forest bg-soft-green'
                    : 'border-transparent hover:border-border hover:bg-white'
                }`}
                onClick={() => onSelect(lesson)}
                type="button"
              >
                <span className="block text-sm font-medium text-ink">
                  {lesson.sequence_number}. {lesson.title}
                </span>
                <span className="mt-1 block text-xs text-muted">
                  {lesson.age_group} · {lesson.review_status} · {lesson.publication_status}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

type LessonDetailsProps = {
  curriculum: EditorialCurriculum
  editing: boolean
  feedback: string
  form: DraftForm
  lesson: EditorialLesson
  onApprove: () => void
  onCancelEdit: () => void
  onEdit: () => void
  onFeedbackChange: (value: string) => void
  onFormChange: <Key extends keyof DraftForm>(
    key: Key,
    value: DraftForm[Key],
  ) => void
  onPublish: () => void
  onReject: () => void
  onSave: () => void
  onSubmit: () => void
  onWithdrawalReasonChange: (value: string) => void
  onWithdraw: () => void
  withdrawalReason: string
  working: boolean
}

function LessonDetails({
  curriculum,
  editing,
  feedback,
  form,
  lesson,
  onApprove,
  onCancelEdit,
  onEdit,
  onFeedbackChange,
  onFormChange,
  onPublish,
  onReject,
  onSave,
  onSubmit,
  onWithdrawalReasonChange,
  onWithdraw,
  withdrawalReason,
  working,
}: LessonDetailsProps) {
  const editable = canEdit(lesson)
  const textareaClass = `${inputClass} min-h-24`

  return (
    <article className="min-w-0 rounded-[10px] border border-border bg-surface p-5 shadow-[0_8px_24px_rgba(41,52,46,0.04)]">
      <header className="mb-5 border-b border-border pb-4">
        <p className="mb-2 text-[11px] font-bold tracking-[1.3px] text-clay uppercase">
          {curriculum.publisher} · {curriculum.year}
        </p>
        <h2 className="mb-3 font-serif text-2xl font-medium text-ink">
          {lesson.title}
        </h2>
        <div className="flex flex-wrap gap-2 text-xs">
          <StatusBadge label={`Review: ${lesson.review_status}`} />
          <StatusBadge label={`Publication: ${lesson.publication_status}`} />
          <StatusBadge label={lesson.age_group} />
        </div>
      </header>

      <Metadata curriculum={curriculum} lesson={lesson} />

      {editing && editable ? (
        <LessonEditor
          form={form}
          onCancel={onCancelEdit}
          onChange={onFormChange}
          onSave={onSave}
          working={working}
        />
      ) : (
        <LessonContent lesson={lesson} />
      )}

      <section
        className="mt-6 border-t border-border pt-5"
        aria-labelledby="lesson-actions-heading"
      >
        <h3 className="mb-3 font-serif text-lg font-medium text-ink" id="lesson-actions-heading">
          Editorial actions
        </h3>
        <div className="flex flex-wrap gap-2">
          {editable && !editing && (
            <button className={secondaryButtonClass} disabled={working} onClick={onEdit} type="button">
              Edit draft
            </button>
          )}
          {editable && !editing && (
            <button className={primaryButtonClass} disabled={working} onClick={onSubmit} type="button">
              Submit for review
            </button>
          )}
          {lesson.review_status === 'in_review' &&
            lesson.publication_status !== 'published' && (
              <>
                <button className={primaryButtonClass} disabled={working} onClick={onApprove} type="button">
                  Approve
                </button>
              </>
            )}
          {lesson.review_status === 'approved' &&
            lesson.publication_status !== 'published' && (
              <button className={primaryButtonClass} disabled={working} onClick={onPublish} type="button">
                Publish lesson
              </button>
            )}
        </div>

        {lesson.review_status === 'in_review' &&
          lesson.publication_status !== 'published' && (
            <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
              <label>
                <span className={labelClass}>Feedback required to return this lesson</span>
                <textarea
                  className={textareaClass}
                  onChange={(event) => onFeedbackChange(event.target.value)}
                  value={feedback}
                />
              </label>
              <button
                className={dangerButtonClass}
                disabled={working || !feedback.trim()}
                onClick={onReject}
                type="button"
              >
                Return for edits
              </button>
            </div>
          )}

        {lesson.publication_status === 'published' && (
          <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <label>
              <span className={labelClass}>Reason for withdrawal</span>
              <input
                className={inputClass}
                onChange={(event) => onWithdrawalReasonChange(event.target.value)}
                value={withdrawalReason}
              />
            </label>
            <button
              className={dangerButtonClass}
              disabled={working || !withdrawalReason.trim()}
              onClick={onWithdraw}
              type="button"
            >
              Withdraw publication
            </button>
          </div>
        )}
      </section>
    </article>
  )
}

function StatusBadge({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-border bg-white px-2.5 py-1 text-xs text-muted">
      {label}
    </span>
  )
}

function Metadata({
  curriculum,
  lesson,
}: {
  curriculum: EditorialCurriculum
  lesson: EditorialLesson
}) {
  return (
    <section className="mb-5 grid gap-4 rounded-md bg-[#fbfaf7] p-4 text-xs leading-5 text-muted sm:grid-cols-2">
      <div>
        <h3 className="mb-2 text-sm font-semibold text-ink">Lesson metadata</h3>
        <p className="mb-1">Age group: {lesson.age_group}</p>
        <p className="mb-1">Lesson date: {lesson.lesson_date ?? 'Not set'}</p>
        <p className="mb-1">Scripture: {lesson.scripture_references.join(', ') || 'Not recorded'}</p>
        <p className="mb-1">Reviewed: {formatDate(lesson.reviewed_at)}</p>
        <p className="mb-0 break-all">Reviewer ID: {displayValue(lesson.reviewed_by)}</p>
        <p className="mt-1 mb-1">Published: {formatDate(lesson.published_at)}</p>
        <p className="mb-0 break-all">Publisher ID: {displayValue(lesson.published_by)}</p>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-semibold text-ink">Source and rights</h3>
        <p className="mb-1">Source: {displayValue(curriculum.source_title)}</p>
        <p className="mb-1">Source status: {curriculum.source_status}</p>
        <p className="mb-1">Usage rights: {curriculum.usage_rights_status}</p>
        <p className="mb-1">
          Rights evidence: {displayValue(curriculum.usage_rights_evidence_ref)}
        </p>
        {curriculum.source_url && (
          <p className="mb-0 break-all">
            Source URL:{' '}
            <a
              className="text-forest underline"
              href={curriculum.source_url}
              rel="noreferrer"
              target="_blank"
            >
              {curriculum.source_url}
            </a>
          </p>
        )}
      </div>
    </section>
  )
}

function LessonContent({ lesson }: { lesson: EditorialLesson }) {
  return (
    <div className="space-y-4 text-sm leading-6 text-ink">
      <ContentBlock title="Introduction">{lesson.introduction}</ContentBlock>
      <ContentBlock title="Learning objectives">
        <ul className="mb-0 list-disc space-y-1 pl-5">
          {lesson.learning_objectives.map((objective, index) => (
            <li key={`${index}-${objective}`}>{objective}</li>
          ))}
        </ul>
      </ContentBlock>
      <ContentBlock title="Teaching sections">
        <div className="space-y-3">
          {lesson.sections
            .filter((section) => section.section_kind === 'teaching_point')
            .map((section) => (
              <div key={section.id}>
                <h4 className="mb-1 font-semibold">{section.title ?? 'Untitled section'}</h4>
                <p className="mb-0 whitespace-pre-wrap">
                  {section.student_content ?? 'No teaching content recorded.'}
                </p>
              </div>
            ))}
        </div>
      </ContentBlock>
      <ContentBlock title="Practical application">
        {lesson.practical_application}
      </ContentBlock>
      <ContentBlock title="Discussion questions">
        <ol className="mb-0 list-decimal space-y-1 pl-5">
          {lesson.sections
            .filter((section) => section.section_kind === 'discussion')
            .flatMap((section) => section.discussion_questions)
            .map((question, index) => (
              <li key={`${index}-${question}`}>{question}</li>
            ))}
        </ol>
      </ContentBlock>
      <ContentBlock title="Memory verse reference">
        {lesson.memory_verse_reference}
      </ContentBlock>
      <ContentBlock title="Closing prayer">{lesson.closing_prayer}</ContentBlock>
      {lesson.age_appropriate_explanation && (
        <ContentBlock title="Age-appropriate explanation">
          {lesson.age_appropriate_explanation}
        </ContentBlock>
      )}
      {lesson.interactive_activity && (
        <ContentBlock title="Interactive activity">
          {lesson.interactive_activity}
        </ContentBlock>
      )}
      {lesson.simple_takeaway && (
        <ContentBlock title="Simple takeaway">{lesson.simple_takeaway}</ContentBlock>
      )}
    </div>
  )
}

function ContentBlock({
  children,
  title,
}: {
  children: React.ReactNode
  title: string
}) {
  return (
    <section>
      <h3 className="mb-1 text-sm font-semibold text-ink">{title}</h3>
      <div className="whitespace-pre-wrap">{children}</div>
    </section>
  )
}

function LessonEditor({
  form,
  onCancel,
  onChange,
  onSave,
  working,
}: {
  form: DraftForm
  onCancel: () => void
  onChange: LessonDetailsProps['onFormChange']
  onSave: () => void
  working: boolean
}) {
  return (
    <form
      className="space-y-4 border-t border-border pt-5"
      onSubmit={(event) => {
        event.preventDefault()
        onSave()
      }}
    >
      <h3 className="mb-0 font-serif text-lg font-medium text-ink">Edit lesson draft</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <label>
          <span className={labelClass}>Title</span>
          <input
            className={inputClass}
            onChange={(event) => onChange('title', event.target.value)}
            required
            value={form.title}
          />
        </label>
        <label>
          <span className={labelClass}>Age group</span>
          <select
            className={inputClass}
            onChange={(event) =>
              onChange('ageGroup', event.target.value as DraftForm['ageGroup'])
            }
            value={form.ageGroup}
          >
            <option value="children">Children</option>
            <option value="teens">Teenagers</option>
            <option value="adults">Adults</option>
          </select>
        </label>
        <label>
          <span className={labelClass}>Lesson date (optional)</span>
          <input
            className={inputClass}
            onChange={(event) => onChange('lessonDate', event.target.value)}
            type="date"
            value={form.lessonDate}
          />
        </label>
        <label>
          <span className={labelClass}>Sequence number</span>
          <input
            className={inputClass}
            min="1"
            onChange={(event) => onChange('sequenceNumber', event.target.value)}
            required
            type="number"
            value={form.sequenceNumber}
          />
        </label>
      </div>
      <TextField label="Introduction" name="introduction" onChange={onChange} value={form.introduction} />
      <TextField label="Practical application" name="practicalApplication" onChange={onChange} value={form.practicalApplication} />
      <TextField label="Memory verse reference" name="memoryVerseReference" onChange={onChange} value={form.memoryVerseReference} />
      <TextField label="Closing prayer" name="closingPrayer" onChange={onChange} value={form.closingPrayer} />
      <TextField
        help="Enter one Scripture reference per line."
        label="Scripture references"
        name="scriptureReferences"
        onChange={onChange}
        value={form.scriptureReferences}
      />
      <TextField
        help="Enter one learning objective per line."
        label="Learning objectives"
        name="learningObjectives"
        onChange={onChange}
        value={form.learningObjectives}
      />
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="mb-0 text-sm font-semibold text-ink">Teaching points</h4>
          <button
            className={secondaryButtonClass}
            onClick={() =>
              onChange('teachingPoints', [
                ...form.teachingPoints,
                { title: '', studentContent: '' },
              ])
            }
            type="button"
          >
            Add teaching point
          </button>
        </div>
        {form.teachingPoints.map((point, index) => (
          <div className="grid gap-2 rounded-md border border-border bg-white p-3" key={index}>
            <label>
              <span className={labelClass}>Point {index + 1} title</span>
              <input
                className={inputClass}
                onChange={(event) =>
                  onChange(
                    'teachingPoints',
                    form.teachingPoints.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, title: event.target.value } : item,
                    ),
                  )
                }
                value={point.title}
              />
            </label>
            <label>
              <span className={labelClass}>Teaching content</span>
              <textarea
                className={`${inputClass} min-h-20`}
                onChange={(event) =>
                  onChange(
                    'teachingPoints',
                    form.teachingPoints.map((item, itemIndex) =>
                      itemIndex === index
                        ? { ...item, studentContent: event.target.value }
                        : item,
                    ),
                  )
                }
                value={point.studentContent}
              />
            </label>
            <button
              className="justify-self-start text-xs font-semibold text-[#803d2e] underline"
              onClick={() =>
                onChange(
                  'teachingPoints',
                  form.teachingPoints.filter((_, itemIndex) => itemIndex !== index),
                )
              }
              type="button"
            >
              Remove teaching point
            </button>
          </div>
        ))}
      </section>
      <TextField
        help="Enter one discussion question per line."
        label="Discussion questions"
        name="discussionQuestions"
        onChange={onChange}
        value={form.discussionQuestions}
      />
      <TextField label="Age-appropriate explanation (optional)" name="ageAppropriateExplanation" onChange={onChange} value={form.ageAppropriateExplanation} />
      <TextField label="Interactive activity (optional)" name="interactiveActivity" onChange={onChange} value={form.interactiveActivity} />
      <TextField label="Simple takeaway (optional)" name="simpleTakeaway" onChange={onChange} value={form.simpleTakeaway} />
      <div className="flex flex-wrap gap-2">
        <button className={primaryButtonClass} disabled={working} type="submit">
          Save draft
        </button>
        <button className={secondaryButtonClass} disabled={working} onClick={onCancel} type="button">
          Cancel
        </button>
      </div>
    </form>
  )
}

function TextField<Key extends keyof DraftForm>({
  help,
  label,
  name,
  onChange,
  value,
}: {
  help?: string
  label: string
  name: Key
  onChange: LessonDetailsProps['onFormChange']
  value: string
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {help && <span className="mb-1 block text-xs text-muted">{help}</span>}
      <textarea
        className={`${inputClass} min-h-24`}
        onChange={(event) => onChange(name, event.target.value as DraftForm[Key])}
        value={value}
      />
    </label>
  )
}

export default EditorialPage
