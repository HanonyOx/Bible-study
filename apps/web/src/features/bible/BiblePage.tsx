import { useEffect, useMemo, useRef, useState } from 'react'
import {
  fetchBooks,
  fetchChapter,
  fetchEnglishTranslations,
  getAdjacentBook,
  groupBooks,
} from './bibleApi'
import type {
  BibleBook,
  BibleChapter,
  BibleHighlightColor,
  BibleNote,
  BiblePassageReference,
  BibleTranslation,
  Testament,
} from './bibleData'
import {
  formatVerseReference,
  getBiblePersonalDataKey,
  hasCompletedChapter,
  makeVerseReference,
  useBiblePersonalData,
} from './bibleStorage'

type LoadState<T> = {
  key: string
  status: 'loading' | 'success' | 'error'
  data: T
  error: string | null
}

const initialSelection: BiblePassageReference = {
  bookId: '',
  chapter: 1,
  translationId: 'BSB',
}
const initialTranslationsKey = '0'

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : 'An unexpected error occurred while contacting the Bible API.'
}

function getLicenseHref(translation: BibleTranslation): string | undefined {
  if (!translation.licenseUrl) {
    return undefined
  }
  try {
    const url = new URL(translation.licenseUrl)
    return url.protocol === 'https:' || url.protocol === 'http:'
      ? url.href
      : undefined
  } catch {
    return undefined
  }
}

function LoadingMessage({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-8 text-sm text-muted" role="status" aria-live="polite">
      <span
        className="size-5 animate-spin rounded-full border-2 border-soft-green border-t-forest"
        aria-hidden="true"
      />
      {label}
    </div>
  )
}

function BiblePage() {
  const {
    data: personalData,
    commit: commitPersonalData,
    storageWarning,
  } = useBiblePersonalData()
  const [selection, setSelection] =
    useState<BiblePassageReference>(
      () => personalData.progress.lastRead ?? initialSelection,
    )
  const [bookSearch, setBookSearch] = useState('')
  const [textSize, setTextSize] = useState(18)
  const [noteEditor, setNoteEditor] = useState<{
    reference: ReturnType<typeof makeVerseReference>
    note?: BibleNote
  } | null>(null)
  const [noteDraft, setNoteDraft] = useState('')
  const pendingVerse = useRef<number | null>(null)
  const [retryTranslations, setRetryTranslations] = useState(0)
  const [retryBooks, setRetryBooks] = useState(0)
  const [retryChapter, setRetryChapter] = useState(0)
  const [translationsState, setTranslationsState] = useState<
    LoadState<BibleTranslation[]>
  >({
    key: initialTranslationsKey,
    status: 'loading',
    data: [],
    error: null,
  })
  const [booksState, setBooksState] = useState<LoadState<BibleBook[]>>({
    key: '',
    status: 'loading',
    data: [],
    error: null,
  })
  const [chapterState, setChapterState] = useState<
    LoadState<BibleChapter | null> | null
  >(null)

  useEffect(() => {
    const controller = new AbortController()
    let isActive = true
    const requestKey = String(retryTranslations)

    fetchEnglishTranslations(controller.signal)
      .then((translations) => {
        if (!isActive) {
          return
        }
        if (translations.length === 0) {
          throw new Error('The API did not return any English translations.')
        }
        setTranslationsState({
          key: requestKey,
          status: 'success',
          data: translations,
          error: null,
        })
        setSelection((current) => {
          const existing = translations.find(
            (translation) => translation.id === current.translationId,
          )
          const defaultTranslation =
            existing ??
            translations.find((translation) => translation.id === 'BSB') ??
            translations[0]
          return {
            ...current,
            translationId: defaultTranslation.id,
          }
        })
      })
      .catch((error: unknown) => {
        if (isActive && !isAbortError(error)) {
          setTranslationsState({
            key: requestKey,
            status: 'error',
            data: [],
            error: getErrorMessage(error),
          })
        }
      })

    return () => {
      isActive = false
      controller.abort()
    }
  }, [retryTranslations])

  const selectedTranslation = translationsState.data.find(
    (translation) => translation.id === selection.translationId,
  )
  const translationsLoading =
    translationsState.key !== String(retryTranslations) ||
    translationsState.status === 'loading'

  useEffect(() => {
    if (
      translationsLoading ||
      translationsState.status !== 'success' ||
      !selectedTranslation
    ) {
      return
    }

    const controller = new AbortController()
    let isActive = true
    const translationId = selectedTranslation.id
    const requestKey = `${translationId}:${retryBooks}`

    fetchBooks(translationId, controller.signal)
      .then((books) => {
        if (!isActive) {
          return
        }
        if (books.length === 0) {
          throw new Error(
            `The API did not return books for ${selectedTranslation.name}.`,
          )
        }
        setBooksState({
          key: requestKey,
          status: 'success',
          data: books,
          error: null,
        })
        setSelection((current) =>
          current.bookId
            ? current
            : {
                ...current,
                bookId: books[0].id,
                chapter: books[0].firstChapter,
              },
        )
      })
      .catch((error: unknown) => {
        if (isActive && !isAbortError(error)) {
          setBooksState({
            key: requestKey,
            status: 'error',
            data: [],
            error: getErrorMessage(error),
          })
        }
      })

    return () => {
      isActive = false
      controller.abort()
    }
  }, [
    retryBooks,
    selectedTranslation,
    translationsLoading,
    translationsState.status,
  ])

  const booksRequestKey = `${selection.translationId}:${retryBooks}`
  const booksLoading =
    booksState.key !== booksRequestKey || booksState.status === 'loading'
  const availableBooks = useMemo(
    () =>
      booksState.key === booksRequestKey &&
    booksState.status === 'success'
      ? booksState.data
      : [],
    [booksRequestKey, booksState.data, booksState.key, booksState.status],
  )
  const selectedBook = availableBooks.find(
    (book) => book.id === selection.bookId,
  )
  const chapterKey = `${selection.translationId}/${selection.bookId}/${selection.chapter}:${retryChapter}`
  const selectedChapterIsAvailable =
    selectedBook !== undefined &&
    selection.chapter >= selectedBook.firstChapter &&
    selection.chapter <
      selectedBook.firstChapter + selectedBook.chapterCount

  useEffect(() => {
    if (
      !selectedBook ||
      !selectedTranslation ||
      booksState.status !== 'success' ||
      booksState.key !== booksRequestKey
    ) {
      return
    }
    const lastRead = personalData.progress.lastRead
    if (
      lastRead?.bookId === selection.bookId &&
      lastRead.chapter === selection.chapter &&
      lastRead.translationId === selection.translationId
    ) {
      return
    }
    commitPersonalData({
      ...personalData,
      progress: {
        ...personalData.progress,
        lastRead: selection,
      },
    })
  }, [
    booksRequestKey,
    booksState.key,
    booksState.status,
    commitPersonalData,
    personalData,
    selectedBook,
    selectedTranslation,
    selection,
  ])

  useEffect(() => {
    if (
      !selectedBook ||
      !selectedChapterIsAvailable ||
      booksState.key !== booksRequestKey ||
      booksState.status !== 'success'
    ) {
      return
    }

    const controller = new AbortController()
    let isActive = true
    const requestKey = chapterKey
    fetchChapter(
      selection.translationId,
      selectedBook.id,
      selection.chapter,
      controller.signal,
    )
      .then((chapter) => {
        if (!isActive) {
          return
        }
        setChapterState({
          key: requestKey,
          status: 'success',
          data: chapter,
          error: null,
        })
      })
      .catch((error: unknown) => {
        if (isActive && !isAbortError(error)) {
          setChapterState({
            key: requestKey,
            status: 'error',
            data: null,
            error: getErrorMessage(error),
          })
        }
      })

    return () => {
      isActive = false
      controller.abort()
    }
  }, [
    booksState.key,
    booksState.status,
    booksRequestKey,
    chapterKey,
    selectedBook,
    selectedChapterIsAvailable,
    selection.bookId,
    selection.chapter,
    selection.translationId,
  ])

  const normalizedSearch = bookSearch.trim().toLocaleLowerCase()
  const filteredBooks = useMemo(
    () =>
      availableBooks.filter(
        (book) =>
          book.id === selection.bookId ||
          book.name.toLocaleLowerCase().includes(normalizedSearch),
      ),
    [availableBooks, normalizedSearch, selection.bookId],
  )
  const groupedBooks = groupBooks(filteredBooks)
  const currentChapter = selectedBook
    ? selection.chapter - selectedBook.firstChapter + 1
    : 1
  const previousBook =
    selectedBook && currentChapter === 1
      ? getAdjacentBook(availableBooks, selectedBook, -1)
      : undefined
  const nextBook =
    selectedBook && currentChapter === selectedBook.chapterCount
      ? getAdjacentBook(availableBooks, selectedBook, 1)
      : undefined
  const canGoPrevious =
    Boolean(selectedBook) &&
    (currentChapter > 1 || Boolean(previousBook))
  const canGoNext =
    Boolean(selectedBook) &&
    (currentChapter < (selectedBook?.chapterCount ?? 0) || Boolean(nextBook))
  const chapterLoadState =
    chapterState?.key === chapterKey ? chapterState : null

  useEffect(() => {
    const verseNumber = pendingVerse.current
    if (chapterLoadState?.status !== 'success' || verseNumber === null) {
      return
    }
    const verseElement = document.getElementById(`bible-verse-${verseNumber}`)
    if (verseElement) {
      verseElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      verseElement.focus({ preventScroll: true })
      pendingVerse.current = null
    }
  }, [chapterLoadState, selection])

  function selectBook(bookId: string) {
    const book = availableBooks.find((item) => item.id === bookId)
    if (book) {
      setSelection((current) => ({
        ...current,
        bookId: book.id,
        chapter: book.firstChapter,
      }))
      setBookSearch('')
    }
  }

  function navigateChapter(direction: -1 | 1) {
    if (!selectedBook) {
      return
    }

    if (direction === -1) {
      if (currentChapter > 1) {
        setSelection((current) => ({
          ...current,
          chapter: current.chapter - 1,
        }))
      } else if (previousBook) {
        setSelection((current) => ({
          ...current,
          bookId: previousBook.id,
          chapter:
            previousBook.firstChapter + previousBook.chapterCount - 1,
        }))
      }
    } else if (currentChapter < selectedBook.chapterCount) {
      setSelection((current) => ({
        ...current,
        chapter: current.chapter + 1,
      }))
    } else if (nextBook) {
      setSelection((current) => ({
        ...current,
        bookId: nextBook.id,
        chapter: nextBook.firstChapter,
      }))
    }
    setBookSearch('')
  }

  function selectTranslation(translationId: string) {
    const translation = translationsState.data.find(
      (item) => item.id === translationId,
    )
    if (translation) {
      setSelection((current) => ({
        ...current,
        translationId: translation.id,
      }))
    }
  }

  function getVerseReference(verse: number) {
    if (!selectedBook || !selectedTranslation) {
      return null
    }
    return makeVerseReference(
      selection,
      selectedBook.name,
      selectedTranslation.name,
      verse,
    )
  }

  function toggleBookmark(verse: number) {
    const reference = getVerseReference(verse)
    if (!reference) {
      return
    }
    const id = getBiblePersonalDataKey(reference)
    const exists = personalData.bookmarks.some((item) => item.id === id)
    commitPersonalData({
      ...personalData,
      bookmarks: exists
        ? personalData.bookmarks.filter((item) => item.id !== id)
        : [
            ...personalData.bookmarks,
            { ...reference, id, createdAt: new Date().toISOString() },
          ],
    })
  }

  function setVerseHighlight(
    verse: number,
    color: BibleHighlightColor | '',
  ) {
    const reference = getVerseReference(verse)
    if (!reference) {
      return
    }
    const id = getBiblePersonalDataKey(reference)
    const highlights = personalData.highlights.filter(
      (item) => item.id !== id,
    )
    commitPersonalData({
      ...personalData,
      highlights: color
        ? [...highlights, { ...reference, id, color, updatedAt: new Date().toISOString() }]
        : highlights,
    })
  }

  function openNoteEditor(verse: number) {
    const reference = getVerseReference(verse)
    if (!reference) {
      return
    }
    const id = getBiblePersonalDataKey(reference)
    const note = personalData.notes.find((item) => item.id === id)
    setNoteEditor({ reference, note })
    setNoteDraft(note?.text ?? '')
  }

  function saveNote() {
    if (!noteEditor || !noteDraft.trim()) {
      return
    }
    const now = new Date().toISOString()
    const id = getBiblePersonalDataKey(noteEditor.reference)
    const existing = personalData.notes.find((item) => item.id === id)
    const note: BibleNote = {
      ...noteEditor.reference,
      id,
      text: noteDraft.trim(),
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    }
    commitPersonalData({
      ...personalData,
      notes: [...personalData.notes.filter((item) => item.id !== id), note],
    })
    setNoteEditor(null)
    setNoteDraft('')
  }

  function removeNote(noteId: string) {
    commitPersonalData({
      ...personalData,
      notes: personalData.notes.filter((item) => item.id !== noteId),
    })
  }

  function navigateToVerse(reference: ReturnType<typeof makeVerseReference>) {
    pendingVerse.current = reference.verse
    setSelection({
      bookId: reference.bookId,
      chapter: reference.chapter,
      translationId: reference.translationId,
    })
    setBookSearch('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function toggleChapterCompletion() {
    if (!selectedBook || !chapterLoadState?.data) {
      return
    }
    const isComplete = hasCompletedChapter(
      personalData.progress.completedChapters,
      selectedBook.id,
      selection.chapter,
    )
    const completedChapters = isComplete
      ? personalData.progress.completedChapters.filter(
          (item) =>
            item.bookId !== selectedBook.id ||
            item.chapter !== selection.chapter,
        )
      : [
          ...personalData.progress.completedChapters,
          { bookId: selectedBook.id, chapter: selection.chapter },
        ]
    commitPersonalData({
      ...personalData,
      progress: { ...personalData.progress, completedChapters },
    })
  }

  const currentChapterIsComplete =
    selectedBook !== undefined &&
    hasCompletedChapter(
      personalData.progress.completedChapters,
      selectedBook.id,
      selection.chapter,
    )
  const availableChapterCount = availableBooks.reduce(
    (total, book) => total + book.chapterCount,
    0,
  )
  const completedAvailableChapterCount = new Set(
    personalData.progress.completedChapters
      .filter((completed) =>
        availableBooks.some(
          (book) =>
            book.id === completed.bookId &&
            completed.chapter >= book.firstChapter &&
            completed.chapter < book.firstChapter + book.chapterCount,
        ),
      )
      .map((completed) => `${completed.bookId}/${completed.chapter}`),
  ).size
  const progressPercent =
    availableChapterCount > 0
      ? Math.round(
          (completedAvailableChapterCount / availableChapterCount) * 100,
        )
      : 0
  const bookmarkedVerseIds = new Set(
    personalData.bookmarks.map((item) => item.id),
  )
  const highlightById = new Map(
    personalData.highlights.map((item) => [item.id, item]),
  )
  const noteById = new Map(personalData.notes.map((item) => [item.id, item]))
  const highlightClasses: Record<BibleHighlightColor, string> = {
    yellow: 'bg-[#fff2b2]',
    green: 'bg-[#dcfce7]',
    blue: 'bg-[#dbeafe]',
    pink: 'bg-[#fce7f3]',
  }

  const licenseHref = selectedTranslation
    ? getLicenseHref(selectedTranslation)
    : undefined

  return (
    <div className="mx-auto w-[min(1120px,calc(100%-64px))] py-[46px] pb-[52px] max-[720px]:w-[min(100%-36px,560px)] max-[720px]:py-[25px] max-[720px]:pb-[34px] max-[390px]:w-[calc(100%-28px)]">
      <section className="mb-7">
        <p className="mb-[15px] text-[11px] leading-[1.5] font-bold tracking-[1.65px] text-clay uppercase">
          Bible reader
        </p>
        <h1 className="mb-3 max-w-[720px] font-serif text-[clamp(34px,5vw,48px)] leading-[1.12] font-medium tracking-[-1.3px] text-ink">
          Read at your own pace.
        </h1>
        <p className="mb-0 max-w-[680px] text-sm leading-6 text-muted">
          Choose a book, chapter, and translation. Scripture text is loaded
          directly from the HelloAO Bible API when available.
        </p>
      </section>

      <section
        className="mb-5 rounded-[10px] border border-border bg-surface p-5 shadow-[0_8px_24px_rgba(41,52,46,0.04)]"
        aria-label="Reading progress"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-[220px] flex-1">
            <div className="mb-2 flex items-center justify-between gap-3">
              <h2 className="mb-0 font-serif text-xl font-medium text-ink">
                Reading progress
              </h2>
              <span className="text-xs text-muted">
                {completedAvailableChapterCount} / {availableChapterCount} chapters
              </span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full bg-[#e9ece7]"
              role="progressbar"
              aria-label="Bible reading progress in this translation"
              aria-valuemin={0}
              aria-valuemax={availableChapterCount}
              aria-valuenow={completedAvailableChapterCount}
            >
              <div
                className="h-full rounded-full bg-forest transition-[width]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="mb-0 mt-2 text-xs text-muted">
              Progress is calculated from the books and chapters available in
              the selected translation.
            </p>
          </div>
          {personalData.progress.lastRead && (
            <button
              className="min-h-11 rounded-md border border-border bg-white px-4 text-sm font-semibold text-forest hover:bg-soft-green"
              type="button"
              onClick={() =>
                setSelection(personalData.progress.lastRead ?? initialSelection)
              }
            >
              Continue reading{' '}
              {personalData.progress.lastRead.bookId}{' '}
              {personalData.progress.lastRead.chapter}
            </button>
          )}
        </div>
        {storageWarning && (
          <p className="mb-0 mt-3 rounded-md bg-[#fff8f5] p-3 text-sm text-[#8b382b]" role="status">
            {storageWarning}
          </p>
        )}
      </section>

      <section
        className="rounded-[10px] border border-border bg-surface p-6 shadow-[0_8px_24px_rgba(41,52,46,0.04)] max-[720px]:p-4"
        aria-label="Bible reader controls and passage"
      >
        <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(110px,0.55fr)_minmax(170px,0.8fr)] gap-4 max-[720px]:grid-cols-2 max-[460px]:grid-cols-1">
          <div className="flex flex-col gap-2">
            <label
              className="text-xs font-semibold text-ink"
              htmlFor="book-search"
            >
              Search Bible books
            </label>
            <input
              className="min-h-11 rounded-md border border-border bg-white px-3 text-sm text-ink outline-none placeholder:text-muted focus:border-forest focus:ring-2 focus:ring-soft-green"
              id="book-search"
              type="search"
              value={bookSearch}
              onChange={(event) => setBookSearch(event.target.value)}
              placeholder="Type a book name"
              autoComplete="off"
              disabled={availableBooks.length === 0}
            />
            <label className="sr-only" htmlFor="book-select">
              Select a Bible book
            </label>
            <select
              className="min-h-11 rounded-md border border-border bg-white px-3 text-sm text-ink outline-none focus:border-forest focus:ring-2 focus:ring-soft-green disabled:opacity-60"
              id="book-select"
              value={selectedBook?.id ?? ''}
              onChange={(event) => selectBook(event.target.value)}
              disabled={availableBooks.length === 0}
            >
              {!selectedBook && (
                <option value="" disabled>
                  {selection.bookId
                    ? `${selection.bookId} is unavailable`
                    : 'Select a book'}
                </option>
              )}
              {groupedBooks.size > 0 &&
                (
                  [
                    'Old Testament',
                    'New Testament',
                    'Other books',
                  ] as Testament[]
                ).map((testament) => {
                  const books = groupedBooks.get(testament) ?? []
                  return books.length > 0 ? (
                    <optgroup label={testament} key={testament}>
                      {books.map((book) => (
                        <option value={book.id} key={book.id}>
                          {book.name}
                          {normalizedSearch &&
                          book.id === selection.bookId &&
                          !book.name.toLocaleLowerCase().includes(normalizedSearch)
                            ? ' (current selection)'
                            : ''}
                        </option>
                      ))}
                    </optgroup>
                  ) : null
                })}
            </select>
            {selectedTranslation && booksLoading && (
              <p className="m-0 text-xs text-muted" role="status">
                Loading books…
              </p>
            )}
            {normalizedSearch && filteredBooks.length === 1 && (
              <p className="m-0 text-xs text-muted" role="status">
                No matching books. The current book remains selected.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label
              className="text-xs font-semibold text-ink"
              htmlFor="chapter-select"
            >
              Chapter
            </label>
            <select
              className="min-h-11 rounded-md border border-border bg-white px-3 text-sm text-ink outline-none focus:border-forest focus:ring-2 focus:ring-soft-green disabled:opacity-60"
              id="chapter-select"
              value={selectedBook ? selection.chapter : ''}
              onChange={(event) =>
                setSelection((current) => ({
                  ...current,
                  chapter: Number(event.target.value),
                }))
              }
              disabled={!selectedBook}
            >
              {selectedBook && !selectedChapterIsAvailable && (
                <option value={selection.chapter}>
                  Chapter {selection.chapter} unavailable in this translation
                </option>
              )}
              {selectedBook &&
                Array.from(
                  { length: selectedBook.chapterCount },
                  (_, index) => selectedBook.firstChapter + index,
                ).map((chapter) => (
                  <option value={chapter} key={chapter}>
                    Chapter {chapter}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label
              className="text-xs font-semibold text-ink"
              htmlFor="translation-select"
            >
              Available English translations
            </label>
            <select
              className="min-h-11 rounded-md border border-border bg-white px-3 text-sm text-ink outline-none focus:border-forest focus:ring-2 focus:ring-soft-green disabled:opacity-60"
              id="translation-select"
              value={selectedTranslation?.id ?? ''}
              onChange={(event) => selectTranslation(event.target.value)}
              disabled={translationsState.status !== 'success'}
            >
              {translationsState.data.map((translation) => (
                <option value={translation.id} key={translation.id}>
                  {translation.shortName} — {translation.name}
                </option>
              ))}
            </select>
            {translationsLoading && (
              <p className="m-0 text-[11px] text-muted" role="status">
                Loading translations…
              </p>
            )}
            {translationsState.status === 'error' &&
              translationsState.key === String(retryTranslations) && (
              <div className="text-xs text-[#8b382b]" role="alert">
                <p className="mb-2">{translationsState.error}</p>
                <button
                  className="font-semibold underline"
                  type="button"
                  onClick={() => setRetryTranslations((count) => count + 1)}
                >
                  Retry loading translations
                </button>
              </div>
            )}
          </div>
        </div>

        {selectedTranslation && (
          <div className="mt-4 rounded-md bg-[#fbfaf7] px-4 py-3 text-xs leading-5 text-muted">
            <p className="mb-1">
              API metadata identifies this translation as{' '}
              <strong className="font-semibold text-ink">
                {selectedTranslation.name}
              </strong>
              {licenseHref && (
                <>
                  {' '}
                  (<a
                    className="text-forest underline underline-offset-2"
                    href={licenseHref}
                    target="_blank"
                    rel="noreferrer"
                  >
                    translation information and terms
                  </a>
                  )
                </>
              )}
              .
            </p>
            <p className="mb-0">
              API availability is not confirmation of redistribution rights.
              Verify attribution, caching, audience, and commercial-use terms
              with the rights holder before publishing.
            </p>
          </div>
        )}

        {booksState.status === 'error' &&
          booksState.key === booksRequestKey && (
            <div className="mt-4 rounded-md border border-[#e7c7be] bg-[#fff8f5] p-4 text-sm text-[#8b382b]" role="alert">
              <p className="mb-2">
                Could not load books for {selectedTranslation?.name ?? selection.translationId}:{' '}
                {booksState.error}
              </p>
              <button
                className="font-semibold underline"
                type="button"
                onClick={() => setRetryBooks((count) => count + 1)}
              >
                Retry loading books
              </button>
            </div>
          )}

        <div className="mt-7 flex items-end justify-between gap-4 border-b border-border pb-5 max-[460px]:items-start max-[460px]:flex-col">
          <div>
            <p className="mb-2 text-[11px] font-bold tracking-[1.4px] text-clay uppercase">
              Selected passage
            </p>
            <h2 className="mb-0 font-serif text-[clamp(25px,4vw,34px)] leading-tight font-medium tracking-[-0.7px] text-ink">
              {selectedBook
                ? `${selectedBook.name} ${selection.chapter}`
                : selection.bookId
                  ? `${selection.bookId} ${selection.chapter}`
                  : 'Choose a book'}
            </h2>
            {selectedBook && selectedChapterIsAvailable && (
              <button
                className="mt-3 min-h-10 rounded-md border border-border bg-white px-3 text-xs font-semibold text-forest hover:bg-soft-green disabled:cursor-not-allowed disabled:opacity-50"
                type="button"
                disabled={chapterLoadState?.status !== 'success'}
                aria-pressed={currentChapterIsComplete}
                onClick={toggleChapterCompletion}
              >
                {currentChapterIsComplete
                  ? 'Mark chapter as unread'
                  : 'Mark chapter complete'}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="mr-1 text-xs text-muted" aria-live="polite">
              Text size
            </span>
            <button
              className="grid size-9 place-items-center rounded-md border border-border bg-white text-lg text-forest hover:bg-soft-green disabled:cursor-not-allowed disabled:opacity-40"
              type="button"
              aria-label="Decrease reading text size"
              title="Decrease reading text size"
              disabled={textSize <= 16}
              onClick={() => setTextSize((size) => Math.max(16, size - 2))}
            >
              −
            </button>
            <button
              className="grid size-9 place-items-center rounded-md border border-border bg-white text-lg text-forest hover:bg-soft-green disabled:cursor-not-allowed disabled:opacity-40"
              type="button"
              aria-label="Increase reading text size"
              title="Increase reading text size"
              disabled={textSize >= 26}
              onClick={() => setTextSize((size) => Math.min(26, size + 2))}
            >
              +
            </button>
          </div>
        </div>

        <div className="min-h-[230px] py-7">
          {translationsLoading ||
          (selectedTranslation && booksLoading) ||
          (selectedBook &&
            selectedChapterIsAvailable &&
            (!chapterLoadState || chapterLoadState.status === 'loading')) ? (
            <LoadingMessage label="Loading Bible passage…" />
          ) : translationsState.status === 'error' &&
            translationsState.key === String(retryTranslations) ? (
            <EmptyState
              title="Translations could not be loaded."
              message={translationsState.error ?? 'Please try again.'}
            />
          ) : booksState.status === 'error' &&
            booksState.key === booksRequestKey ? (
            <EmptyState
              title="Books could not be loaded."
              message={booksState.error ?? 'Please try again.'}
              action={{
                label: 'Retry loading books',
                onClick: () => setRetryBooks((count) => count + 1),
              }}
            />
          ) : booksState.status === 'success' &&
            booksState.key === booksRequestKey &&
            selection.bookId &&
            !selectedBook ? (
            <EmptyState
              title={`${selection.bookId} is not available in this translation.`}
              message={`Your selected passage is still ${selection.bookId} ${selection.chapter}. Select a book from this translation to continue, or switch back to a translation that includes this book.`}
              action={{
                label: `Open ${availableBooks[0]?.name ?? 'first available book'}`,
                onClick: () => {
                  const firstBook = availableBooks[0]
                  if (firstBook) {
                    setSelection((current) => ({
                      ...current,
                      bookId: firstBook.id,
                      chapter: firstBook.firstChapter,
                    }))
                  }
                },
              }}
            />
          ) : selectedBook && !selectedChapterIsAvailable ? (
            <EmptyState
              title={`${selectedBook.name} ${selection.chapter} is not available in this translation.`}
              message={`This translation includes ${selectedBook.name} chapters ${selectedBook.firstChapter} through ${selectedBook.firstChapter + selectedBook.chapterCount - 1}. Your selected passage has not been changed.`}
              action={{
                label: `Open ${selectedBook.name} ${selectedBook.firstChapter}`,
                onClick: () =>
                  setSelection((current) => ({
                    ...current,
                    chapter: selectedBook.firstChapter,
                  })),
              }}
            />
          ) : chapterLoadState?.status === 'error' ? (
            <EmptyState
              title="This passage could not be loaded."
              message={`${chapterLoadState.error ?? 'The request failed.'} The selected passage remains unchanged; it may not be available in this translation.`}
              action={{
                label: 'Retry loading passage',
                onClick: () => setRetryChapter((count) => count + 1),
              }}
            />
          ) : chapterLoadState?.status === 'success' &&
            chapterLoadState.data ? (
            <div>
              <div className="mb-5 inline-flex rounded-full border border-soft-green bg-soft-green px-3 py-1 text-[10px] font-bold tracking-[1px] text-forest uppercase">
                {selectedTranslation?.name}
              </div>
              <ol
                className="m-0 list-none space-y-3 p-0 text-ink"
                aria-label={`${selectedBook?.name} ${selection.chapter} verses`}
              >
                {chapterLoadState.data.verses.map((verse) => {
                  const reference = getVerseReference(verse.number)
                  const verseKey = reference
                    ? getBiblePersonalDataKey(reference)
                    : ''
                  const highlight = highlightById.get(verseKey)
                  const note = noteById.get(verseKey)
                  const isBookmarked = bookmarkedVerseIds.has(verseKey)
                  return (
                    <li
                      className={`rounded-md px-3 py-3 ${highlight ? highlightClasses[highlight.color] : ''}`}
                      id={`bible-verse-${verse.number}`}
                      style={{ fontSize: `${textSize}px` }}
                      tabIndex={-1}
                      key={verse.number}
                    >
                      <div className="flex items-start gap-4 leading-[1.8]">
                        <span className="min-w-6 pt-1 text-right text-xs font-bold text-clay">
                          {verse.number}
                        </span>
                        <span className="min-w-0 flex-1">{verse.text}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2 pl-10">
                        <button
                          className={`min-h-9 rounded-md border px-2.5 text-xs font-semibold ${isBookmarked ? 'border-forest bg-soft-green text-forest' : 'border-border bg-white text-muted hover:text-forest'}`}
                          type="button"
                          aria-pressed={isBookmarked}
                          aria-label={`${isBookmarked ? 'Remove bookmark for' : 'Bookmark'} ${selectedBook?.name} ${selection.chapter}:${verse.number}`}
                          onClick={() => toggleBookmark(verse.number)}
                        >
                          {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                        </button>
                        <label className="sr-only" htmlFor={`highlight-${verse.number}`}>
                          Highlight {selectedBook?.name} {selection.chapter}:{verse.number}
                        </label>
                        <select
                          className="min-h-9 max-w-full rounded-md border border-border bg-white px-2 text-xs text-ink outline-none focus:border-forest focus:ring-2 focus:ring-soft-green"
                          id={`highlight-${verse.number}`}
                          value={highlight?.color ?? ''}
                          onChange={(event) =>
                            setVerseHighlight(
                              verse.number,
                              event.target.value as BibleHighlightColor | '',
                            )
                          }
                        >
                          <option value="">No highlight</option>
                          <option value="yellow">Yellow highlight</option>
                          <option value="green">Green highlight</option>
                          <option value="blue">Blue highlight</option>
                          <option value="pink">Pink highlight</option>
                        </select>
                        <button
                          className="min-h-9 rounded-md border border-border bg-white px-2.5 text-xs font-semibold text-muted hover:text-forest"
                          type="button"
                          onClick={() => openNoteEditor(verse.number)}
                        >
                          {note ? 'Edit note' : 'Add note'}
                        </button>
                        {note && (
                          <span className="text-xs text-muted" aria-label="This verse has a saved note">
                            Note saved
                          </span>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ol>
            </div>
          ) : (
            <EmptyState
              title={
                selectedBook
                  ? 'Passage content is not available here yet.'
                  : 'No books are available for this translation.'
              }
              message={
                selectedBook
                  ? `No passage data was returned for ${selectedBook.name} ${selection.chapter} in ${selectedTranslation?.name ?? selection.translationId}. Choose another available translation or passage.`
                  : 'Choose another translation or retry loading the book list.'
              }
            />
          )}
        </div>

        <nav
          className="flex items-center justify-between gap-3 border-t border-border pt-5"
          aria-label="Chapter navigation"
        >
          <button
            className="min-h-11 rounded-md border border-border bg-white px-4 text-sm font-semibold text-forest transition-colors hover:bg-soft-green disabled:cursor-not-allowed disabled:opacity-40"
            type="button"
            onClick={() => navigateChapter(-1)}
            disabled={!canGoPrevious}
          >
            <span aria-hidden="true">← </span>
            Previous Chapter
          </button>
          <span className="text-center text-xs text-muted max-[460px]:hidden">
            {selectedBook
              ? `${selectedBook.name} ${selection.chapter}`
              : '—'}
          </span>
          <button
            className="min-h-11 rounded-md border border-border bg-white px-4 text-sm font-semibold text-forest transition-colors hover:bg-soft-green disabled:cursor-not-allowed disabled:opacity-40"
            type="button"
            onClick={() => navigateChapter(1)}
            disabled={!canGoNext}
          >
            Next Chapter
            <span aria-hidden="true"> →</span>
          </button>
        </nav>
      </section>

      {noteEditor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setNoteEditor(null)
            }
          }}
        >
          <section
            className="w-full max-w-lg rounded-xl bg-surface p-5 shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="note-editor-title"
          >
            <h2
              className="mb-1 font-serif text-2xl font-medium text-ink"
              id="note-editor-title"
            >
              {noteEditor.note ? 'Edit personal note' : 'Add personal note'}
            </h2>
            <p className="mb-4 text-sm text-muted">
              {formatVerseReference(noteEditor.reference)} ·{' '}
              {noteEditor.reference.translationName}
            </p>
            <label
              className="mb-2 block text-sm font-semibold text-ink"
              htmlFor="personal-note"
            >
              Your note
            </label>
            <textarea
              className="min-h-36 w-full resize-y rounded-md border border-border bg-white p-3 text-sm leading-6 text-ink outline-none focus:border-forest focus:ring-2 focus:ring-soft-green"
              id="personal-note"
              value={noteDraft}
              onChange={(event) => setNoteDraft(event.target.value)}
              placeholder="Write a personal reflection…"
              autoFocus
            />
            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <button
                className="min-h-10 rounded-md border border-border bg-white px-4 text-sm font-semibold text-muted"
                type="button"
                onClick={() => {
                  setNoteEditor(null)
                  setNoteDraft('')
                }}
              >
                Cancel
              </button>
              <button
                className="min-h-10 rounded-md border border-border bg-white px-4 text-sm font-semibold text-[#8b382b] disabled:opacity-40"
                type="button"
                disabled={!noteEditor.note}
                onClick={() => {
                  if (noteEditor.note) {
                    removeNote(noteEditor.note.id)
                  }
                  setNoteEditor(null)
                  setNoteDraft('')
                }}
              >
                Delete
              </button>
              <button
                className="min-h-10 rounded-md bg-forest px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                type="button"
                disabled={!noteDraft.trim()}
                onClick={saveNote}
              >
                Save note
              </button>
            </div>
          </section>
        </div>
      )}

      <section className="mt-6 grid grid-cols-2 items-start gap-5 max-[720px]:grid-cols-1">
        <div className="rounded-[10px] border border-border bg-surface p-5 shadow-[0_8px_24px_rgba(41,52,46,0.04)]">
          <h2 className="mb-4 font-serif text-2xl font-medium text-ink">
            Bookmarks <span className="text-sm text-muted">({personalData.bookmarks.length})</span>
          </h2>
          {personalData.bookmarks.length === 0 ? (
            <p className="mb-0 text-sm leading-6 text-muted">
              Bookmarked verses will be saved here on this device.
            </p>
          ) : (
            <ul className="m-0 list-none space-y-3 p-0">
              {personalData.bookmarks.map((bookmark) => (
                <li
                  className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
                  key={bookmark.id}
                >
                  <div>
                    <p className="mb-1 text-sm font-semibold text-ink">
                      {formatVerseReference(bookmark)}
                    </p>
                    <p className="mb-0 text-xs text-muted">
                      {bookmark.translationName}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="min-h-9 rounded-md border border-border bg-white px-3 text-xs font-semibold text-forest"
                      type="button"
                      onClick={() => navigateToVerse(bookmark)}
                    >
                      Open verse
                    </button>
                    <button
                      className="min-h-9 rounded-md border border-border bg-white px-3 text-xs font-semibold text-muted"
                      type="button"
                      onClick={() =>
                        commitPersonalData({
                          ...personalData,
                          bookmarks: personalData.bookmarks.filter(
                            (item) => item.id !== bookmark.id,
                          ),
                        })
                      }
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-[10px] border border-border bg-surface p-5 shadow-[0_8px_24px_rgba(41,52,46,0.04)]">
          <h2 className="mb-4 font-serif text-2xl font-medium text-ink">
            Personal notes <span className="text-sm text-muted">({personalData.notes.length})</span>
          </h2>
          {personalData.notes.length === 0 ? (
            <p className="mb-0 text-sm leading-6 text-muted">
              Notes you write on verses will be saved privately on this device.
            </p>
          ) : (
            <ul className="m-0 list-none space-y-3 p-0">
              {personalData.notes.map((note) => (
                <li
                  className="border-b border-border pb-3 last:border-0 last:pb-0"
                  key={note.id}
                >
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="mb-1 text-sm font-semibold text-ink">
                        {formatVerseReference(note)}
                      </p>
                      <p className="mb-0 text-xs text-muted">
                        {note.translationName}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="min-h-9 rounded-md border border-border bg-white px-3 text-xs font-semibold text-forest"
                        type="button"
                        onClick={() => navigateToVerse(note)}
                      >
                        Open verse
                      </button>
                      <button
                        className="min-h-9 rounded-md border border-border bg-white px-3 text-xs font-semibold text-muted"
                        type="button"
                        onClick={() => {
                          setNoteEditor({
                            reference: {
                              bookId: note.bookId,
                              bookName: note.bookName,
                              chapter: note.chapter,
                              verse: note.verse,
                              translationId: note.translationId,
                              translationName: note.translationName,
                            },
                            note,
                          })
                          setNoteDraft(note.text)
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="min-h-9 rounded-md border border-border bg-white px-3 text-xs font-semibold text-[#8b382b]"
                        type="button"
                        onClick={() => removeNote(note.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="mb-0 whitespace-pre-wrap text-sm leading-6 text-muted">
                    {note.text}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <p className="mb-0 mt-4 text-center text-xs leading-5 text-muted">
        Book search filters book names only. Scripture text search is not
        available in this reader.
      </p>
    </div>
  )
}

function EmptyState({
  title,
  message,
  action,
}: {
  title: string
  message: string
  action?: { label: string; onClick: () => void }
}) {
  return (
    <div
      className="flex min-h-[230px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-[#fbfaf7] px-6 text-center"
      role="status"
      aria-live="polite"
    >
      <span
        className="mb-3 grid size-10 place-items-center rounded-full bg-soft-green text-xl text-forest"
        aria-hidden="true"
      >
        i
      </span>
      <h3 className="mb-2 font-serif text-xl font-medium text-ink">{title}</h3>
      <p className="mb-0 max-w-[560px] text-sm leading-6 text-muted">{message}</p>
      {action && (
        <button
          className="mt-4 min-h-10 rounded-md border border-border bg-white px-4 text-sm font-semibold text-forest hover:bg-soft-green"
          type="button"
          onClick={action.onClick}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

export default BiblePage
