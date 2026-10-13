import { Link, useParams } from 'react-router-dom'
import { useLessonProgress } from './useLessonProgress'
import { useStudentLessons } from './useStudentLessons'

const pageClass =
  'mx-auto w-[min(1120px,calc(100%-64px))] py-[46px] pb-[52px] max-[720px]:w-[min(100%-36px,560px)] max-[720px]:py-[25px] max-[720px]:pb-[34px] max-[390px]:w-[calc(100%-28px)]'

function SundaySchoolLessonPage() {
  const { lessonId } = useParams()
  const { lessons, loading, source, warning, retry } = useStudentLessons()
  const {
    progress,
    warning: progressWarning,
    startLesson,
    completeLesson,
    retry: retryProgress,
  } = useLessonProgress(lessons, source === 'database')
  const lesson = lessons.find(
    ({ id }) => id === lessonId,
  )

  if (loading) {
    return (
      <p className={`${pageClass} text-center text-muted`} role="status">
        Loading lesson…
      </p>
    )
  }

  if (!lesson) {
    return (
      <div className={pageClass}>
        <section
          className="rounded-[10px] border border-border bg-surface p-6 text-center shadow-[0_8px_24px_rgba(41,52,46,0.04)]"
          role="status"
        >
          <p className="mb-2 text-[11px] font-bold tracking-[1.3px] text-clay uppercase">
            Sunday School lesson
          </p>
          <h1 className="mb-3 font-serif text-2xl font-medium text-ink">
            Lesson not available
          </h1>
          <p className="mb-5 text-sm leading-6 text-muted">
            This lesson may not exist or may not be published for students.
          </p>
          {warning && (
            <div className="mb-5 text-sm leading-6 text-muted" role="status">
              <p>{warning}</p>
              <button
                className="font-semibold text-forest underline"
                onClick={retry}
                type="button"
              >
                Retry database connection
              </button>
            </div>
          )}
          <Link className="font-semibold text-forest underline" to="/sunday-school">
            Back to the lesson library
          </Link>
        </section>
      </div>
    )
  }

  return (
    <div className={pageClass}>
      <p className="mb-5 text-sm">
        <Link className="font-semibold text-forest underline" to="/sunday-school">
          ← Lesson library
        </Link>
      </p>
      <article className="rounded-[10px] border border-border bg-surface p-6 shadow-[0_8px_24px_rgba(41,52,46,0.04)] max-[520px]:p-4">
        <p className="mb-2 text-[11px] font-bold tracking-[1.3px] text-clay uppercase">
          {lesson.contentOrigin === 'original_word_and_way'
            ? 'Original Word & Way Bible study'
            : 'Licensed curriculum'}{' '}
          · Lesson {lesson.sequenceNumber}
        </p>
        <h1 className="mb-3 font-serif text-[clamp(30px,5vw,44px)] leading-tight font-medium text-ink">
          {lesson.title}
        </h1>
        {lesson.contentOrigin === 'original_word_and_way' && (
          <p className="mb-5 rounded-md bg-soft-green px-4 py-3 text-sm leading-6 text-forest">
            This is an original Word &amp; Way study, not an official Assemblies
            of God lesson. Word &amp; Way does not claim Assemblies of God
            affiliation or endorsement.
          </p>
        )}
        {source === 'demo' && (
          <p className="mb-5 rounded-md border border-border bg-[#fbfaf7] px-4 py-3 text-sm leading-6 text-muted">
            Demonstration preview only. This locally bundled sample is not read
            from the curriculum database, and its database review/publication
            status has not changed.
          </p>
        )}
        <p className="mb-5 text-sm text-muted">
          {lesson.lessonDate
            ? new Intl.DateTimeFormat(undefined, {
                dateStyle: 'long',
                timeZone: 'UTC',
              }).format(new Date(`${lesson.lessonDate}T00:00:00Z`))
            : 'Date not listed'}
        </p>
        <section className="mb-6 rounded-md border border-border bg-[#fbfaf7] p-4">
          <p className="mb-2 text-sm text-muted">
            {progress[lesson.id]?.status === 'completed'
              ? 'You completed this lesson.'
              : progress[lesson.id]?.status === 'started'
                ? 'You have started this lesson.'
                : 'Track your progress as you study.'}
          </p>
          {progress[lesson.id]?.status !== 'completed' && (
            <button
              className="min-h-10 rounded-md bg-forest px-4 text-sm font-semibold text-white hover:bg-[#194b37] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-clay"
              onClick={() =>
                void (progress[lesson.id]?.status === 'started'
                  ? completeLesson(lesson.id)
                  : startLesson(lesson.id))
              }
              type="button"
            >
              {progress[lesson.id]?.status === 'started'
                ? 'Mark lesson complete'
                : 'Start lesson'}
            </button>
          )}
          <p className="mt-2 mb-0 text-xs text-muted">
            Completion records personal progress only; it is not proof of
            attendance or learning.
          </p>
          {progressWarning && (
            <div className="mt-2 text-sm text-muted" role="status">
              <p className="mb-1">{progressWarning}</p>
              <button
                className="font-semibold text-forest underline"
                onClick={retryProgress}
                type="button"
              >
                Retry progress sync
              </button>
            </div>
          )}
        </section>

        <section className="mb-6 border-b border-border pb-5">
          <h2 className="mb-2 font-serif text-xl font-medium text-ink">
            Main Scripture
          </h2>
          <p className="mb-0 text-sm leading-6 text-muted">
            {lesson.mainScriptureReference}
          </p>
        </section>

        {lesson.introduction && (
          <section className="mt-6">
            <h2 className="mb-2 font-serif text-xl font-medium text-ink">
              Introduction
            </h2>
            <p className="mb-0 whitespace-pre-line text-sm leading-7 text-muted">
              {lesson.introduction}
            </p>
          </section>
        )}

        {lesson.scriptureReferences.length > 1 && (
          <section className="mb-6 border-b border-border pb-5">
            <h2 className="mb-2 font-serif text-xl font-medium text-ink">Additional Scripture references</h2>
            <p className="mb-0 text-sm leading-6 text-muted">
              {lesson.scriptureReferences
                .filter((reference) => reference !== lesson.mainScriptureReference)
                .join(', ')}
            </p>
          </section>
        )}

        {lesson.learningObjectives.length > 0 && (
          <LessonList
            heading="Learning objectives"
            items={lesson.learningObjectives}
          />
        )}

        {lesson.ageAppropriateExplanation && (
          <section className="mt-6">
            <h2 className="mb-2 font-serif text-xl font-medium text-ink">
              For younger learners
            </h2>
            <p className="mb-0 whitespace-pre-line text-sm leading-7 text-muted">
              {lesson.ageAppropriateExplanation}
            </p>
          </section>
        )}

        {lesson.teachingPoints.length > 0 && (
          <section className="mt-6">
            <h2 className="mb-3 font-serif text-xl font-medium text-ink">
              Teaching points
            </h2>
            <ol className="m-0 list-decimal space-y-4 pl-5">
              {lesson.teachingPoints.map((point, index) => (
                <li
                  className="pl-1 text-sm leading-7 text-muted"
                  key={`${index}-${point.title}`}
                >
                  <h3 className="mb-1 inline font-semibold text-ink">
                    {point.title}:{' '}
                  </h3>
                  {point.studentContent}
                </li>
              ))}
            </ol>
          </section>
        )}

        <section className="mt-6">
          <h2 className="mb-2 font-serif text-xl font-medium text-ink">
            Practical application
          </h2>
          <p className="mb-0 whitespace-pre-line text-sm leading-7 text-muted">
            {lesson.practicalApplication}
          </p>
        </section>

        {lesson.interactiveActivity && (
          <section className="mt-6">
            <h2 className="mb-2 font-serif text-xl font-medium text-ink">
              Interactive activity
            </h2>
            <p className="mb-0 text-sm leading-7 text-muted">
              {lesson.interactiveActivity}
            </p>
          </section>
        )}

        {lesson.simpleTakeaway && (
          <section className="mt-6 rounded-md bg-soft-green p-4">
            <h2 className="mb-2 font-serif text-xl font-medium text-ink">
              Takeaway
            </h2>
            <p className="mb-0 text-sm leading-7 text-ink">
              {lesson.simpleTakeaway}
            </p>
          </section>
        )}

        <LessonList
          heading="Discussion questions"
          items={lesson.discussionQuestions}
        />

        <section className="mt-6">
          <h2 className="mb-2 font-serif text-xl font-medium text-ink">
            Memory verse reference
          </h2>
          <p className="mb-0 text-sm leading-7 text-muted">
            {lesson.memoryVerseReference}
          </p>
        </section>

        <section className="mt-6 border-t border-border pt-5">
          <h2 className="mb-2 font-serif text-xl font-medium text-ink">
            Closing prayer
          </h2>
          <p className="mb-0 text-sm leading-7 text-muted">
            {lesson.closingPrayer}
          </p>
        </section>
      </article>
    </div>
  )
}

function LessonList({ heading, items }: { heading: string; items: string[] }) {
  return (
    <section className="mt-6">
      <h2 className="mb-2 font-serif text-xl font-medium text-ink">{heading}</h2>
      <ul className="m-0 list-disc space-y-2 pl-5 text-sm leading-6 text-muted">
        {items.map((item, index) => (
          <li key={`${index}-${item}`}>{item}</li>
        ))}
      </ul>
    </section>
  )
}

export default SundaySchoolLessonPage
