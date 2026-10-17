import { useState, type FormEvent } from 'react'

type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused'
type Learner = { id: string; progress: string }
type DemoClass = {
  id: string
  name: string
  ageGroup: 'children' | 'teens' | 'adults'
  term: string
  learners: Learner[]
}
type CoverageEntry = {
  id: number
  classId: string
  date: string
  lesson: string
}
type AttendanceByDate = Record<string, Record<string, AttendanceStatus>>

const demoClasses: DemoClass[] = [
  {
    id: 'children-sample',
    name: 'Children — Sample Class',
    ageGroup: 'children',
    term: 'Autumn 2026 (sample term)',
    learners: [
      { id: 'Learner 01', progress: '2 of 4 sample lessons' },
      { id: 'Learner 02', progress: '3 of 4 sample lessons' },
      { id: 'Learner 03', progress: '1 of 4 sample lessons' },
      { id: 'Learner 04', progress: '4 of 4 sample lessons' },
    ],
  },
  {
    id: 'teens-sample',
    name: 'Teenagers — Sample Class',
    ageGroup: 'teens',
    term: 'Autumn 2026 (sample term)',
    learners: [
      { id: 'Learner 01', progress: '2 of 4 sample lessons' },
      { id: 'Learner 02', progress: '1 of 4 sample lessons' },
      { id: 'Learner 03', progress: '3 of 4 sample lessons' },
    ],
  },
  {
    id: 'adults-sample',
    name: 'Adults — Sample Class',
    ageGroup: 'adults',
    term: 'Autumn 2026 (sample term)',
    learners: [
      { id: 'Learner 01', progress: '3 of 4 sample lessons' },
      { id: 'Learner 02', progress: '2 of 4 sample lessons' },
      { id: 'Learner 03', progress: '4 of 4 sample lessons' },
    ],
  },
]

const attendanceStatuses: AttendanceStatus[] = [
  'present',
  'absent',
  'late',
  'excused',
]
const placeholderLessons = [
  'Sample lesson 1 — placeholder only',
  'Sample lesson 2 — placeholder only',
  'Sample lesson 3 — placeholder only',
]
const emptyAttendance: AttendanceByDate = {}

function localDateValue(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function TeacherDemoPage() {
  const [selectedClassId, setSelectedClassId] = useState(demoClasses[0].id)
  const [selectedDate, setSelectedDate] = useState(() =>
    localDateValue(new Date()),
  )
  const [attendance, setAttendance] = useState<
    Record<string, AttendanceByDate>
  >({})
  const [savedAttendance, setSavedAttendance] = useState<string[]>([])
  const [coverage, setCoverage] = useState<CoverageEntry[]>([])
  const [coverageDate, setCoverageDate] = useState(() =>
    localDateValue(new Date()),
  )
  const [selectedLesson, setSelectedLesson] = useState(placeholderLessons[0])
  const [notesByClass, setNotesByClass] = useState<Record<string, string>>({})
  const [notesSaved, setNotesSaved] = useState<Record<string, string>>({})
  const [announcement, setAnnouncement] = useState('')
  const [nextCoverageId, setNextCoverageId] = useState(1)

  const selectedClass =
    demoClasses.find(({ id }) => id === selectedClassId) ?? demoClasses[0]
  const classAttendance =
    attendance[selectedClass.id]?.[selectedDate] ?? emptyAttendance
  const counts = attendanceStatuses.reduce(
      (summary, status) => {
        summary[status] = selectedClass.learners.filter(
          ({ id }) => classAttendance[id] === status,
        ).length
        return summary
      },
      { present: 0, absent: 0, late: 0, excused: 0 },
    )
  const classCoverage = coverage.filter(
    (entry) => entry.classId === selectedClass.id,
  )

  function updateAttendance(
    learnerId: string,
    status: AttendanceStatus | null,
  ) {
    const currentDateAttendance =
      attendance[selectedClass.id]?.[selectedDate] ?? {}
    const updatedDateAttendance = { ...currentDateAttendance }
    if (status) {
      updatedDateAttendance[learnerId] = status
    } else {
      delete updatedDateAttendance[learnerId]
    }
    setAttendance((current) => ({
      ...current,
      [selectedClass.id]: {
        ...current[selectedClass.id],
        [selectedDate]: updatedDateAttendance,
      },
    }))
    setAnnouncement(
      status
        ? `${learnerId} marked ${status} for ${selectedDate}.`
        : `${learnerId}'s sample attendance cleared for ${selectedDate}.`,
    )
    setSavedAttendance((current) =>
      current.filter(
        (entry) => entry !== `${selectedClass.id}:${selectedDate}`,
      ),
    )
  }

  function saveAttendance() {
    const key = `${selectedClass.id}:${selectedDate}`
    setSavedAttendance((current) =>
      current.includes(key) ? current : [...current, key],
    )
    setAnnouncement(`Sample attendance saved for ${selectedDate}.`)
  }

  function addCoverage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const entry = {
      id: nextCoverageId,
      classId: selectedClass.id,
      date: coverageDate,
      lesson: selectedLesson,
    }
    setCoverage((current) => [entry, ...current])
    setNextCoverageId((current) => current + 1)
    setAnnouncement('Sample lesson coverage was added.')
  }

  function saveNotes(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setNotesSaved((current) => ({
      ...current,
      [selectedClass.id]: notesByClass[selectedClass.id] ?? '',
    }))
    setAnnouncement('Sample teacher-only notes saved in this browser session.')
  }

  return (
    <section className="mx-auto w-[min(100%-40px,1120px)] py-10 max-[520px]:py-7">
      <div className="mb-6 rounded-xl border border-[#d9b786] bg-[#fff7e8] p-5">
        <p className="mb-1 text-[11px] font-bold uppercase tracking-[1.2px] text-clay">
          Demonstration only
        </p>
        <h1 className="mb-2 font-serif text-3xl font-medium text-ink">
          Teacher dashboard preview
        </h1>
        <p className="mb-0 text-sm leading-6 text-muted">
          Fictional classes, learner aliases, attendance, progress, and notes.
          Any signed-in user can view this mock interface; it does not verify
          teacher status or connect to class records. Changes stay in memory
          and disappear when this page reloads. No real learner data is shown.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-end gap-4 rounded-xl border border-border bg-surface p-5">
        <label className="min-w-64 flex-1 text-sm font-semibold text-ink" htmlFor="teacher-class">
          Sample class
          <select
            className="mt-2 block min-h-11 w-full rounded-md border border-border bg-white px-3 py-2 text-sm"
            id="teacher-class"
            onChange={(event) => {
              setSelectedClassId(event.target.value)
              setAnnouncement('')
            }}
            value={selectedClass.id}
          >
            {demoClasses.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <div className="text-sm text-muted">
          <p className="mb-1">
            Age group:{' '}
            {selectedClass.ageGroup === 'teens'
              ? 'Teenagers'
              : selectedClass.ageGroup === 'children'
                ? 'Children'
                : 'Adults'}
          </p>
          <p className="mb-0">{selectedClass.term}</p>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {attendanceStatuses.map((status) => (
          <div
            className="rounded-xl border border-border bg-surface p-4"
            key={status}
          >
            <p className="mb-1 text-xs capitalize text-muted">{status}</p>
            <p className="mb-0 font-serif text-2xl text-ink">{counts[status]}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-surface p-5">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="mb-1 font-serif text-xl text-ink">
                Attendance record
              </h2>
              <p className="mb-0 text-xs text-muted">
                Select a past date to correct a sample record.
              </p>
            </div>
            <label className="text-sm font-semibold text-ink" htmlFor="attendance-date">
              Date
              <input
                className="mt-1 block min-h-10 rounded-md border border-border px-2 text-sm"
                id="attendance-date"
                onChange={(event) => setSelectedDate(event.target.value)}
                required
                type="date"
                value={selectedDate}
              />
            </label>
          </div>
          <div className="space-y-3">
            {selectedClass.learners.map((learner) => (
              <label
                className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3 text-sm"
                key={learner.id}
              >
                <span className="font-medium text-ink">{learner.id}</span>
                <select
                  aria-label={`${learner.id} attendance`}
                  className="min-h-10 rounded-md border border-border bg-white px-2"
                  onChange={(event) => {
                    const value = event.target.value
                    updateAttendance(
                      learner.id,
                      attendanceStatuses.find((status) => status === value) ??
                        null,
                    )
                  }}
                  value={classAttendance[learner.id] ?? ''}
                >
                  <option value="">Not recorded</option>
                  {attendanceStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status[0].toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          <button
            className="mt-4 min-h-11 rounded-md bg-forest px-4 py-2 text-sm font-semibold text-white hover:bg-[#274a35] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-clay"
            onClick={saveAttendance}
            type="button"
          >
            Save sample attendance
          </button>
          {savedAttendance.includes(`${selectedClass.id}:${selectedDate}`) && (
            <p className="mt-3 text-xs text-forest" role="status">
              Attendance saved for {selectedDate}.
            </p>
          )}
        </section>

        <section className="rounded-xl border border-border bg-surface p-5">
          <h2 className="mb-1 font-serif text-xl text-ink">Lesson coverage</h2>
          <p className="mb-4 text-xs leading-5 text-muted">
            Placeholder lesson labels only; not official curriculum content.
          </p>
          <form
            className="flex flex-wrap items-end gap-3"
            onSubmit={addCoverage}
          >
            <label className="min-w-48 flex-1 text-sm font-semibold text-ink" htmlFor="coverage-lesson">
              Lesson taught
              <select
                className="mt-1 block min-h-11 w-full rounded-md border border-border bg-white px-2"
                id="coverage-lesson"
                onChange={(event) => setSelectedLesson(event.target.value)}
                value={selectedLesson}
              >
                {placeholderLessons.map((lesson) => (
                  <option key={lesson}>{lesson}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-semibold text-ink" htmlFor="coverage-date">
              Date
              <input
                className="mt-1 block min-h-11 rounded-md border border-border px-2"
                id="coverage-date"
                onChange={(event) => setCoverageDate(event.target.value)}
                required
                type="date"
                value={coverageDate}
              />
            </label>
            <button
              className="min-h-11 rounded-md bg-forest px-4 py-2 text-sm font-semibold text-white hover:bg-[#274a35] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-clay"
              type="submit"
            >
              Add coverage
            </button>
          </form>
          <h3 className="mb-2 mt-5 text-sm font-semibold text-ink">
            Coverage summary ({classCoverage.length})
          </h3>
          {classCoverage.length ? (
            <ul className="space-y-2 pl-5 text-sm text-muted">
              {classCoverage.map((entry) => (
                <li key={entry.id}>
                  {entry.date}: {entry.lesson}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mb-0 text-sm text-muted">
              No sample coverage has been entered for this class.
            </p>
          )}
        </section>

        <section className="rounded-xl border border-border bg-surface p-5">
          <h2 className="mb-4 font-serif text-xl text-ink">
            Learner progress (sample)
          </h2>
          <ul className="mb-0 space-y-3">
            {selectedClass.learners.map((learner) => (
              <li
                className="flex justify-between gap-3 border-b border-border pb-3 text-sm"
                key={learner.id}
              >
                <span className="font-medium text-ink">{learner.id}</span>
                <span className="text-right text-muted">{learner.progress}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-surface p-5">
          <h2 className="mb-1 font-serif text-xl text-ink">
            Teacher-only class notes (demo)
          </h2>
          <p className="mb-4 text-xs leading-5 text-muted">
            These notes are local to this page session only; no database is
            connected.
          </p>
          <form className="space-y-3" onSubmit={saveNotes}>
            <label className="block text-sm font-semibold text-ink" htmlFor="teacher-notes">
              Private sample notes
              <textarea
                className="mt-2 block min-h-28 w-full rounded-md border border-border bg-white p-3 text-sm"
                id="teacher-notes"
                maxLength={1000}
                onChange={(event) => {
                  setNotesByClass((current) => ({
                    ...current,
                    [selectedClass.id]: event.target.value,
                  }))
                }}
                value={notesByClass[selectedClass.id] ?? ''}
              />
            </label>
            <button
              className="min-h-11 rounded-md border border-forest px-4 py-2 text-sm font-semibold text-forest hover:bg-soft-green focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-clay"
              type="submit"
            >
              Save notes for this session
            </button>
            {notesSaved[selectedClass.id] !== undefined && (
              <p className="mb-0 text-xs text-forest" role="status">
                Sample notes saved for this session.
              </p>
            )}
          </form>
        </section>
      </div>

      {announcement && (
        <p className="sr-only" role="status" aria-live="polite">
          {announcement}
        </p>
      )}
    </section>
  )
}

export default TeacherDemoPage
