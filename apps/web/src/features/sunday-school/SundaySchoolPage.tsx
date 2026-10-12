import { useState } from 'react'
import {
  sundaySchoolAgeGroups,
  sundaySchoolCurriculum,
  type SundaySchoolAgeGroup,
} from './sundaySchoolData'

function SundaySchoolPage() {
  const [selectedAgeGroup, setSelectedAgeGroup] =
    useState<SundaySchoolAgeGroup>('adults')
  const selectedCurriculum = sundaySchoolCurriculum.ageGroups.find(
    ({ ageGroup }) => ageGroup === selectedAgeGroup,
  )
  const selectedLabel = sundaySchoolAgeGroups.find(
    ({ id }) => id === selectedAgeGroup,
  )?.label

  return (
    <div className="mx-auto w-[min(1120px,calc(100%-64px))] py-[46px] pb-[52px] max-[720px]:w-[min(100%-36px,560px)] max-[720px]:py-[25px] max-[720px]:pb-[34px] max-[390px]:w-[calc(100%-28px)]">
      <section className="mb-7">
        <p className="mb-[15px] text-[11px] leading-[1.5] font-bold tracking-[1.65px] text-clay uppercase">
          Sunday School curriculum
        </p>
        <h1 className="mb-3 max-w-[720px] font-serif text-[clamp(34px,5vw,48px)] leading-[1.12] font-medium tracking-[-1.3px] text-ink">
          Lessons for every generation.
        </h1>
        <p className="mb-0 max-w-[680px] text-sm leading-6 text-muted">
          Browse the working curriculum catalog by class. Lesson details will
          appear when verified, authorized materials are available.
        </p>
      </section>

      <section
        className="mb-5 rounded-[10px] border border-border bg-surface p-5 shadow-[0_8px_24px_rgba(41,52,46,0.04)]"
        aria-label="Curriculum settings"
      >
        <p className="mb-3 text-[11px] font-bold tracking-[1.3px] text-clay uppercase">
          Curriculum configuration
        </p>
        <dl className="grid grid-cols-3 gap-4 max-[600px]:grid-cols-1">
          <div>
            <dt className="text-xs text-muted">Requested curriculum</dt>
            <dd className="mb-0 mt-1 text-sm font-semibold text-ink">
              {sundaySchoolCurriculum.publisher}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Working year</dt>
            <dd className="mb-0 mt-1 text-sm font-semibold text-ink">
              {sundaySchoolCurriculum.workingYear}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Edition</dt>
            <dd className="mb-0 mt-1 text-sm font-semibold text-ink">
              {sundaySchoolCurriculum.editionVerified &&
              sundaySchoolCurriculum.edition
                ? sundaySchoolCurriculum.edition
                : 'Not yet verified'}
            </dd>
          </div>
        </dl>
        <p
          className="mb-0 mt-4 rounded-md bg-[#fbfaf7] px-4 py-3 text-xs leading-5 text-muted"
          role="status"
        >
          The year is a working configuration, not confirmation of an official
          2026 edition. No lesson content is included until its source and
          permission to use it have been verified.
        </p>
      </section>

      <section aria-labelledby="age-groups-heading">
        <div className="mb-4">
          <p className="mb-2 text-[11px] font-bold tracking-[1.3px] text-clay uppercase">
            Class groups
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
            const isSelected = id === selectedAgeGroup
            const lessonCount =
              sundaySchoolCurriculum.ageGroups.find(
                ({ ageGroup }) => ageGroup === id,
              )?.lessons.length ?? 0

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
                  {lessonCount === 1
                    ? '1 lesson listed'
                    : `${lessonCount} lessons listed`}
                </span>
              </button>
            )
          })}
        </div>

        <section
          className="rounded-[10px] border border-border bg-surface p-6 shadow-[0_8px_24px_rgba(41,52,46,0.04)] max-[520px]:p-4"
          aria-live="polite"
          aria-labelledby="selected-age-group"
        >
          <div className="mb-4 border-b border-border pb-4">
            <p className="mb-1 text-xs font-semibold text-muted">
              {sundaySchoolCurriculum.workingYear} working year
            </p>
            <h3
              className="mb-0 font-serif text-2xl font-medium text-ink"
              id="selected-age-group"
            >
              {selectedLabel}
            </h3>
          </div>

          {selectedCurriculum && selectedCurriculum.lessons.length > 0 ? (
            <ul className="m-0 list-none space-y-4 p-0">
              {selectedCurriculum.lessons.map((lesson) => (
                <li
                  className="rounded-md border border-border bg-[#fbfaf7] p-4"
                  key={lesson.id}
                >
                  <article>
                    <h4 className="mb-2 font-serif text-xl font-medium text-ink">
                      {lesson.title}
                    </h4>
                    {lesson.date && (
                      <p className="mb-2 text-xs text-muted">{lesson.date}</p>
                    )}
                    {lesson.biblePassages.length > 0 && (
                      <p className="mb-2 text-sm text-ink">
                        <span className="font-semibold">Bible passages: </span>
                        {lesson.biblePassages.join(', ')}
                      </p>
                    )}
                    {lesson.memoryVerse && (
                      <p className="mb-2 text-sm text-ink">
                        <span className="font-semibold">Memory verse: </span>
                        {lesson.memoryVerse.reference}
                        {lesson.memoryVerse.text &&
                          ` — ${lesson.memoryVerse.text}`}
                      </p>
                    )}
                    {lesson.discussionQuestions.length > 0 && (
                      <LessonList
                        heading="Discussion questions"
                        items={lesson.discussionQuestions}
                      />
                    )}
                    {lesson.activities.length > 0 && (
                      <LessonList heading="Activities" items={lesson.activities} />
                    )}
                  </article>
                </li>
              ))}
            </ul>
          ) : (
            <div
              className="flex min-h-40 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-[#fbfaf7] px-5 py-8 text-center"
              role="status"
            >
              <h4 className="mb-2 font-serif text-xl font-medium text-ink">
                {selectedLabel} lessons are not listed yet.
              </h4>
              <p className="mb-0 max-w-xl text-sm leading-6 text-muted">
                No lesson titles or teaching content are shown until they can be
                checked against the correct Assemblies of God Nigeria
                curriculum edition and authorized for use.
              </p>
            </div>
          )}
        </section>
      </section>
    </div>
  )
}

function LessonList({ heading, items }: { heading: string; items: string[] }) {
  return (
    <div className="mt-3">
      <h5 className="mb-1 text-sm font-semibold text-ink">{heading}</h5>
      <ul className="m-0 list-disc space-y-1 pl-5 text-sm leading-6 text-muted">
        {items.map((item, index) => (
          <li key={`${index}-${item}`}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

export default SundaySchoolPage
