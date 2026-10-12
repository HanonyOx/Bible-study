import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  filterStudentLessons,
  sundaySchoolAgeGroups,
  sundaySchoolCurricula,
  type SundaySchoolAgeGroup,
} from './sundaySchoolData'
import { useLessonProgress } from './useLessonProgress'
import { useStudentLessons } from './useStudentLessons'

const pageClass =
  'mx-auto w-[min(1120px,calc(100%-64px))] py-[46px] pb-[52px] max-[720px]:w-[min(100%-36px,560px)] max-[720px]:py-[25px] max-[720px]:pb-[34px] max-[390px]:w-[calc(100%-28px)]'
const inputClass =
  'min-h-11 w-full rounded-md border border-border bg-white px-3 text-sm text-ink outline-none focus:border-forest focus:ring-2 focus:ring-soft-green'

function SundaySchoolPage() {
  const [selectedAgeGroup, setSelectedAgeGroup] =
    useState<SundaySchoolAgeGroup>('adults')
  const [searchQuery, setSearchQuery] = useState('')
  const { lessons, loading, source, warning, retry } = useStudentLessons()
  const {
    progress,
    warning: progressWarning,
    startLesson,
    completeLesson,
    retry: retryProgress,
  } = useLessonProgress(lessons, source === 'database')
  const officialCurriculum = sundaySchoolCurricula.find(
    ({ source }) => source.kind === 'official',
  )
  const ageGroupLessons = lessons.filter(
    (lesson) => lesson.ageGroup === selectedAgeGroup,
  )
  const completedCount = ageGroupLessons.filter(
    (lesson) => progress[lesson.id]?.status === 'completed',
  ).length
  const remainingCount = ageGroupLessons.length - completedCount
  const startedLessons = ageGroupLessons
    .filter((lesson) => progress[lesson.id]?.status === 'started')
    .sort((left, right) =>
      (progress[right.id]?.updatedAt ?? '').localeCompare(
        progress[left.id]?.updatedAt ?? '',
      ),
    )
  const resumeLesson = startedLessons[0]

  const filteredLessons = useMemo(
    () =>
      filterStudentLessons(lessons, selectedAgeGroup, searchQuery)
        .sort((left, right) => {
          if (left.lessonDate && right.lessonDate) {
            const dateOrder = left.lessonDate.localeCompare(right.lessonDate)
            if (dateOrder !== 0) return dateOrder
          } else if (left.lessonDate) {
            return -1
          } else if (right.lessonDate) {
            return 1
          }
          return left.sequenceNumber - right.sequenceNumber
        }),
    [lessons, searchQuery, selectedAgeGroup],
  )

  return (
    <div className={pageClass}>
      <section className="mb-7">
        <p className="mb-[15px] text-[11px] leading-[1.5] font-bold tracking-[1.65px] text-clay uppercase">
          Sunday School Bible studies
        </p>
        <h1 className="mb-3 max-w-[720px] font-serif text-[clamp(34px,5vw,48px)] leading-[1.12] font-medium tracking-[-1.3px] text-ink">
          Original Bible studies for every generation.
        </h1>
        <p className="mb-0 max-w-[680px] text-sm leading-6 text-muted">
          Browse original Word &amp; Way lessons by age group, Scripture
          reference, and sequence. These are not official Assemblies of God
          curriculum materials.
        </p>
      </section>

      <section
        className="mb-7 rounded-[10px] border border-border bg-surface p-5 shadow-[0_8px_24px_rgba(41,52,46,0.04)]"
        aria-labelledby="curriculum-heading"
      >
        <p className="mb-2 text-[11px] font-bold tracking-[1.3px] text-clay uppercase">
          Original lesson collection
        </p>
        <h2
          className="mb-3 font-serif text-xl font-medium text-ink"
          id="curriculum-heading"
        >
          Original Word &amp; Way Bible Studies · 2026
        </h2>
        <p
          className="mb-0 rounded-md bg-[#fbfaf7] px-4 py-3 text-sm leading-6 text-muted"
          role="status"
        >
          The Assemblies of God Nigeria 2026 curriculum is not included. Its
          source and usage permissions have not been verified.
        </p>
        <p className="mt-3 mb-0 text-sm leading-6 text-muted">
          The 36 original studies are retained as draft content while awaiting
          editorial review. They will appear in the student library only after
          review and publication are completed.
        </p>
        {officialCurriculum && (
          <p className="mt-3 mb-0 text-xs text-muted">
            Separate catalog record: {officialCurriculum.name} (
            {officialCurriculum.year}) — source and rights unverified.
          </p>
        )}
        {warning && (
          <div className="mt-3 rounded-md border border-border bg-white px-4 py-3 text-sm leading-6 text-muted" role="status">
            <p className="mb-2">{warning}</p>
            <button
              className="font-semibold text-forest underline"
              onClick={retry}
              type="button"
            >
              Retry database connection
            </button>
          </div>
        )}
        {progressWarning && (
          <div
            className="mt-3 rounded-md border border-border bg-white px-4 py-3 text-sm leading-6 text-muted"
            role="status"
          >
            <p className="mb-2">{progressWarning}</p>
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

      <section aria-labelledby="age-groups-heading">
        <div className="mb-4">
          <p className="mb-2 text-[11px] font-bold tracking-[1.3px] text-clay uppercase">
            Lesson library
          </p>
          <h2
            className="mb-0 font-serif text-2xl font-medium text-ink"
            id="age-groups-heading"
          >
            Choose an age group
          </h2>
        </div>

        <div
          className="mb-5 grid grid-cols-3 gap-3 max-[520px]:grid-cols-1"
          role="group"
          aria-label="Sunday School age groups"
        >
          {sundaySchoolAgeGroups.map(({ id, label }) => {
            const count = lessons.filter(
              (lesson) => lesson.ageGroup === id,
            ).length
            const isSelected = id === selectedAgeGroup

            return (
              <button
                aria-pressed={isSelected}
                className={`min-h-16 rounded-[8px] border px-4 py-3 text-left transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-clay ${
                  isSelected
                    ? 'border-forest bg-soft-green text-forest'
                    : 'border-border bg-surface text-ink hover:bg-[#fbfaf7]'
                }`}
                key={id}
                onClick={() => setSelectedAgeGroup(id)}
                type="button"
              >
                <span className="block text-sm font-semibold">{label}</span>
                <span className="mt-1 block text-xs text-muted">
                  {count === 1 ? '1 lesson' : `${count} lessons`}
                </span>
              </button>
            )
          })}
        </div>

        {ageGroupLessons.length > 0 && (
          <section
            className="mb-5 rounded-[10px] border border-border bg-surface px-4 py-3 text-sm text-muted"
            aria-label={`${selectedAgeGroup} learning progress`}
          >
            <p className="mb-0">
              {completedCount} completed · {remainingCount} remaining ·{' '}
              {startedLessons.length} in progress
            </p>
            {resumeLesson && (
              <Link
                className="mt-2 inline-block font-semibold text-forest underline"
                to={`/sunday-school/lessons/${encodeURIComponent(resumeLesson.id)}`}
              >
                Resume {resumeLesson.title}
              </Link>
            )}
            {source === 'local' && (
              <p className="mt-2 mb-0 text-xs">
                Progress is saved on this device. Database synchronization is
                inactive for this lesson data.
              </p>
            )}
          </section>
        )}

        <div className="mb-5 max-w-xl">
          <label
            className="mb-2 block text-sm font-semibold text-ink"
            htmlFor="lesson-search"
          >
            Search lesson titles and Scripture references
          </label>
          <input
            autoComplete="off"
            className={inputClass}
            id="lesson-search"
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search titles or references"
            type="search"
            value={searchQuery}
          />
        </div>

        <section
          className="rounded-[10px] border border-border bg-surface p-6 shadow-[0_8px_24px_rgba(41,52,46,0.04)] max-[520px]:p-4"
          aria-live="polite"
          aria-labelledby="selected-age-group"
        >
          <div className="mb-4 border-b border-border pb-4">
            <h3
              className="mb-1 font-serif text-2xl font-medium text-ink"
              id="selected-age-group"
            >
              {
                sundaySchoolAgeGroups.find(
                  ({ id }) => id === selectedAgeGroup,
                )?.label
              }
            </h3>
            <p className="mb-0 text-xs text-muted">
              Ordered by lesson date and sequence number
            </p>
          </div>

          {loading ? (
            <p className="py-8 text-center text-sm text-muted" role="status">
              Loading student-visible lessons…
            </p>
          ) : filteredLessons.length ? (
            <ul className="m-0 list-none space-y-3 p-0">
              {filteredLessons.map((lesson) => (
                <li key={lesson.id}>
                  <Link
                    className="block rounded-md border border-border bg-[#fbfaf7] p-4 text-ink no-underline transition-colors hover:border-forest focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-clay"
                    to={`/sunday-school/lessons/${encodeURIComponent(lesson.id)}`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h4 className="mb-1 font-serif text-xl font-medium">
                        {lesson.title}
                      </h4>
                      <span className="rounded-full bg-soft-green px-3 py-1 text-xs font-semibold text-forest">
                        Lesson {lesson.sequenceNumber}
                      </span>
                    </div>
                    <p className="mb-2 text-xs font-semibold text-clay">
                      {lesson.contentOrigin === 'original_word_and_way'
                        ? 'Original Word & Way Bible study · not official Assemblies of God curriculum'
                        : 'Licensed external curriculum'}
                    </p>
                    <p className="mb-2 text-xs text-muted">
                      {lesson.lessonDate
                        ? new Intl.DateTimeFormat(undefined, {
                            dateStyle: 'long',
                            timeZone: 'UTC',
                          }).format(
                            new Date(`${lesson.lessonDate}T00:00:00Z`),
                          )
                        : 'Date not listed'}
                    </p>
                    {lesson.scriptureReferences.length > 0 && (
                      <p className="mb-0 text-sm text-ink">
                        <span className="font-semibold">Scripture: </span>
                        {lesson.scriptureReferences.join(', ')}
                      </p>
                    )}
                  </Link>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2 px-1">
                    <span className="text-xs text-muted">
                      {progress[lesson.id]?.status === 'completed'
                        ? 'Completed'
                        : progress[lesson.id]?.status === 'started'
                          ? 'In progress'
                          : 'Not started'}
                    </span>
                    {progress[lesson.id]?.status !== 'completed' && (
                      <button
                        className="min-h-9 rounded-md border border-forest px-3 text-xs font-semibold text-forest hover:bg-soft-green focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-clay"
                        onClick={() =>
                          void (progress[lesson.id]?.status === 'started'
                            ? completeLesson(lesson.id)
                            : startLesson(lesson.id))
                        }
                        type="button"
                      >
                        {progress[lesson.id]?.status === 'started'
                          ? 'Mark complete'
                          : 'Start lesson'}
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div
              className="flex min-h-40 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-[#fbfaf7] px-5 py-8 text-center"
              role="status"
            >
              <h4 className="mb-2 font-serif text-xl font-medium text-ink">
                {searchQuery.trim()
                  ? 'No matching lessons'
                  : 'No published lessons available yet'}
              </h4>
              <p className="mb-0 max-w-xl text-sm leading-6 text-muted">
                {searchQuery.trim()
                  ? 'Try another lesson title or Scripture reference.'
                  : 'The local original studies are awaiting editorial review. Approved and published lessons will appear here.'}
              </p>
            </div>
          )}
        </section>
      </section>
    </div>
  )
}

export default SundaySchoolPage
