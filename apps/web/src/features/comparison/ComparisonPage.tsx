import { useEffect, useMemo, useState } from 'react'
import {
  fetchBooks,
  fetchChapter,
  fetchEnglishTranslations,
  getAdjacentBook,
} from '../bible/bibleApi'
import type {
  BibleBook,
  BibleChapter,
  BiblePassageReference,
  BibleTranslation,
} from '../bible/bibleData'

type LoadState<T> = {
  key: string
  status: 'loading' | 'success' | 'error'
  data: T
  error: string | null
}

type PassageSelection = Pick<BiblePassageReference, 'bookId' | 'chapter'>

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : 'An unexpected error occurred while contacting the Bible API.'
}

function LoadingMessage() {
  return (
    <div
      className="flex min-h-56 items-center justify-center gap-3 py-8 text-sm text-muted"
      role="status"
      aria-live="polite"
    >
      <span
        className="size-5 animate-spin rounded-full border-2 border-soft-green border-t-forest"
        aria-hidden="true"
      />
      Loading passage…
    </div>
  )
}

function PassagePanel({
  heading,
  translationId,
  onTranslationChange,
  translations,
  passage,
}: {
  heading: string
  translationId: string
  onTranslationChange: (translationId: string) => void
  translations: BibleTranslation[]
  passage: PassageSelection
}) {
  const [retryCount, setRetryCount] = useState(0)
  const [chapterState, setChapterState] =
    useState<LoadState<BibleChapter | null> | null>(null)
  const requestKey = `${translationId}/${passage.bookId}/${passage.chapter}:${retryCount}`
  const translation = translations.find((item) => item.id === translationId)
  const isLoading =
    Boolean(passage.bookId) &&
    (chapterState?.key !== requestKey || chapterState.status === 'loading')
  const currentChapter =
    chapterState?.key === requestKey ? chapterState : null

  useEffect(() => {
    if (!passage.bookId || !translationId) {
      return
    }

    const controller = new AbortController()
    fetchChapter(
      translationId,
      passage.bookId,
      passage.chapter,
      controller.signal,
    )
      .then((chapter) => {
        setChapterState({
          key: requestKey,
          status: 'success',
          data: chapter,
          error: null,
        })
      })
      .catch((error: unknown) => {
        if (!isAbortError(error)) {
          setChapterState({
            key: requestKey,
            status: 'error',
            data: null,
            error: getErrorMessage(error),
          })
        }
      })

    return () => controller.abort()
  }, [passage.bookId, passage.chapter, requestKey, translationId])

  return (
    <section
      className="flex min-w-0 w-full flex-col rounded-[10px] border border-border bg-surface p-5 shadow-[0_8px_24px_rgba(41,52,46,0.04)]"
      aria-label={`${heading} comparison panel`}
    >
      <div className="mb-4 flex min-w-0 flex-col gap-2 border-b border-border pb-4">
        <p className="mb-1 text-[11px] font-bold tracking-[1.4px] text-clay uppercase">
          {heading}
        </p>
        <h2 className="mb-1 break-words font-serif text-2xl font-medium tracking-[-0.5px] text-ink">
          {translation?.name ?? 'Select a translation'}
        </h2>
        <label
          className="text-xs font-semibold text-ink"
          htmlFor={`${heading === 'Translation 1' ? 'left' : 'right'}-translation`}
        >
          Choose translation
        </label>
        <select
          className="min-h-11 w-full min-w-0 max-w-full rounded-md border border-border bg-white px-3 text-sm text-ink outline-none focus:border-forest focus:ring-2 focus:ring-soft-green disabled:opacity-60"
          id={`${heading === 'Translation 1' ? 'left' : 'right'}-translation`}
          value={translationId}
          onChange={(event) => onTranslationChange(event.target.value)}
          disabled={!translations.length}
        >
          {translations.map((item) => (
            <option value={item.id} key={item.id}>
              {item.shortName} — {item.name}
            </option>
          ))}
        </select>
      </div>

      <div className="min-h-56 w-full min-w-0 flex-1">
        {!passage.bookId ? (
          <div className="flex min-h-56 items-center justify-center rounded-lg border border-dashed border-border bg-[#fbfaf7] px-5 text-center text-sm leading-6 text-muted">
            Choose a book and chapter to read this translation.
          </div>
        ) : isLoading ? (
          <LoadingMessage />
        ) : currentChapter?.status === 'error' ? (
          <div
            className="flex min-h-56 flex-col items-center justify-center rounded-lg border border-dashed border-[#e7c7be] bg-[#fff8f5] px-5 text-center"
            role="alert"
          >
            <h3 className="mb-2 font-serif text-xl font-medium text-ink">
              This passage could not be loaded.
            </h3>
            <p className="mb-4 text-sm leading-6 text-muted">
              {currentChapter.error ??
                'This translation may not include the selected passage.'}
            </p>
            <button
              className="rounded-md border border-border bg-white px-4 py-2 text-sm font-semibold text-forest hover:bg-soft-green"
              type="button"
              onClick={() => setRetryCount((count) => count + 1)}
            >
              Retry this panel
            </button>
          </div>
        ) : currentChapter?.status === 'success' &&
          currentChapter.data ? (
          <ol
            className="m-0 list-none space-y-4 p-0 text-ink"
            aria-label={`${passage.bookId} ${passage.chapter} verses in ${translation?.name ?? translationId}`}
          >
            {currentChapter.data.verses.map((verse) => (
              <li
                className="flex gap-3 text-[15px] leading-[1.8]"
                key={verse.number}
              >
                <span className="min-w-6 pt-1 text-right text-xs font-bold text-clay">
                  {verse.number}
                </span>
                <span>{verse.text}</span>
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    </section>
  )
}

function ComparisonPage() {
  const [retryTranslations, setRetryTranslations] = useState(0)
  const [retryBooks, setRetryBooks] = useState(0)
  const [translationsState, setTranslationsState] = useState<
    LoadState<BibleTranslation[]>
  >({
    key: '0',
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
  const [passage, setPassage] = useState<PassageSelection>({
    bookId: '',
    chapter: 1,
  })
  const [leftTranslationId, setLeftTranslationId] = useState('BSB')
  const [rightTranslationId, setRightTranslationId] = useState('ENGWEBP')

  useEffect(() => {
    const controller = new AbortController()
    const requestKey = String(retryTranslations)

    fetchEnglishTranslations(controller.signal)
      .then((translations) => {
        if (translations.length === 0) {
          throw new Error('The API did not return any English translations.')
        }
        setTranslationsState({
          key: requestKey,
          status: 'success',
          data: translations,
          error: null,
        })

        const leftDefault =
          translations.find((translation) => translation.id === 'BSB') ??
          translations[0]
        const rightDefault =
          translations.find((translation) => translation.id === 'ENGWEBP') ??
          translations.find(
            (translation) => translation.id !== leftDefault.id,
          ) ??
          leftDefault
        setLeftTranslationId(leftDefault.id)
        setRightTranslationId(rightDefault.id)
      })
      .catch((error: unknown) => {
        if (!isAbortError(error)) {
          setTranslationsState({
            key: requestKey,
            status: 'error',
            data: [],
            error: getErrorMessage(error),
          })
        }
      })

    return () => controller.abort()
  }, [retryTranslations])

  const translationsLoading =
    translationsState.key !== String(retryTranslations) ||
    translationsState.status === 'loading'
  const translations = translationsState.data
  const booksRequestKey = `${leftTranslationId}:${retryBooks}`
  const booksLoading =
    booksState.key !== booksRequestKey || booksState.status === 'loading'
  const books = useMemo(
    () =>
      booksState.key === booksRequestKey &&
      booksState.status === 'success'
        ? booksState.data
        : [],
    [booksRequestKey, booksState.data, booksState.key, booksState.status],
  )
  const selectedBook = books.find((book) => book.id === passage.bookId)

  useEffect(() => {
    if (
      translationsLoading ||
      translationsState.status !== 'success' ||
      !leftTranslationId
    ) {
      return
    }

    const controller = new AbortController()
    const requestKey = booksRequestKey
    fetchBooks(leftTranslationId, controller.signal)
      .then((availableBooks) => {
        if (availableBooks.length === 0) {
          throw new Error(
            'The API did not return any books for the selected translation.',
          )
        }
        setBooksState({
          key: requestKey,
          status: 'success',
          data: availableBooks,
          error: null,
        })
        setPassage((current) => ({
          ...current,
          bookId: availableBooks.some((book) => book.id === current.bookId)
            ? current.bookId
            : availableBooks[0].id,
          chapter: availableBooks.some((book) => book.id === current.bookId)
            ? current.chapter
            : availableBooks[0].firstChapter,
        }))
      })
      .catch((error: unknown) => {
        if (!isAbortError(error)) {
          setBooksState({
            key: requestKey,
            status: 'error',
            data: [],
            error: getErrorMessage(error),
          })
        }
      })

    return () => controller.abort()
  }, [
    booksRequestKey,
    leftTranslationId,
    translationsLoading,
    translationsState.status,
  ])

  const currentChapter = selectedBook
    ? passage.chapter - selectedBook.firstChapter + 1
    : 0
  const previousBook =
    selectedBook && currentChapter === 1
      ? getAdjacentBook(books, selectedBook, -1)
      : undefined
  const nextBook =
    selectedBook && currentChapter === selectedBook.chapterCount
      ? getAdjacentBook(books, selectedBook, 1)
      : undefined
  const canGoPrevious =
    Boolean(selectedBook) && (currentChapter > 1 || Boolean(previousBook))
  const canGoNext =
    Boolean(selectedBook) &&
    (currentChapter < (selectedBook?.chapterCount ?? 0) || Boolean(nextBook))

  function navigateChapter(direction: -1 | 1) {
    if (!selectedBook) {
      return
    }
    if (direction === -1) {
      if (currentChapter > 1) {
        setPassage((current) => ({
          ...current,
          chapter: current.chapter - 1,
        }))
      } else if (previousBook) {
        setPassage({
          bookId: previousBook.id,
          chapter:
            previousBook.firstChapter + previousBook.chapterCount - 1,
        })
      }
      return
    }
    if (currentChapter < selectedBook.chapterCount) {
      setPassage((current) => ({
        ...current,
        chapter: current.chapter + 1,
      }))
    } else if (nextBook) {
      setPassage({
        bookId: nextBook.id,
        chapter: nextBook.firstChapter,
      })
    }
  }

  return (
    <div className="mx-auto w-[min(1120px,calc(100%-64px))] py-[46px] pb-[52px] max-[720px]:w-[min(100%-36px,560px)] max-[720px]:py-[25px] max-[720px]:pb-[34px] max-[390px]:w-[calc(100%-28px)]">
      <section className="mb-7">
        <p className="mb-[15px] text-[11px] leading-[1.5] font-bold tracking-[1.65px] text-clay uppercase">
          Translation comparison
        </p>
        <h1 className="mb-3 max-w-[720px] font-serif text-[clamp(34px,5vw,48px)] leading-[1.12] font-medium tracking-[-1.3px] text-ink">
          See the wording side by side.
        </h1>
        <p className="mb-0 max-w-[680px] text-sm leading-6 text-muted">
          Select one passage and compare the wording returned for each available
          English translation.
        </p>
      </section>

      <section
        className="mb-5 rounded-[10px] border border-border bg-surface p-5 shadow-[0_8px_24px_rgba(41,52,46,0.04)]"
        aria-label="Comparison passage controls"
      >
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(120px,0.45fr)] gap-4 max-[520px]:grid-cols-1">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-ink" htmlFor="compare-book">
              Bible book
            </label>
            <select
              className="min-h-11 rounded-md border border-border bg-white px-3 text-sm text-ink outline-none focus:border-forest focus:ring-2 focus:ring-soft-green disabled:opacity-60"
              id="compare-book"
              value={selectedBook?.id ?? ''}
              disabled={books.length === 0}
              onChange={(event) => {
                const book = books.find((item) => item.id === event.target.value)
                if (book) {
                  setPassage({ bookId: book.id, chapter: book.firstChapter })
                }
              }}
            >
              {books.map((book) => (
                <option value={book.id} key={book.id}>
                  {book.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-ink" htmlFor="compare-chapter">
              Chapter
            </label>
            <select
              className="min-h-11 rounded-md border border-border bg-white px-3 text-sm text-ink outline-none focus:border-forest focus:ring-2 focus:ring-soft-green disabled:opacity-60"
              id="compare-chapter"
              value={selectedBook ? passage.chapter : ''}
              disabled={!selectedBook}
              onChange={(event) =>
                setPassage((current) => ({
                  ...current,
                  chapter: Number(event.target.value),
                }))
              }
            >
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
        </div>

        {translationsLoading ||
        (translationsState.status === 'success' && booksLoading) ? (
          <p className="mb-0 mt-3 text-xs text-muted" role="status">
            Loading translations and books…
          </p>
        ) : null}

        {translationsState.status === 'error' &&
          translationsState.key === String(retryTranslations) && (
            <div className="mt-3 text-sm text-[#8b382b]" role="alert">
              <p className="mb-2">
                Could not load available translations: {translationsState.error}
              </p>
              <button
                className="font-semibold underline"
                type="button"
                onClick={() => setRetryTranslations((count) => count + 1)}
              >
                Retry loading translations
              </button>
            </div>
          )}

        {booksState.status === 'error' &&
          booksState.key === booksRequestKey && (
            <div className="mt-3 text-sm text-[#8b382b]" role="alert">
              <p className="mb-2">
                Could not load books: {booksState.error}
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

        <div className="mt-4 rounded-md bg-[#fbfaf7] px-4 py-3 text-xs leading-5 text-muted">
          API availability does not confirm permission to redistribute or
          monetize a translation. Before publishing, verify the rights holder’s
          terms for attribution, caching, audience, and commercial use.
        </div>
      </section>

      <div className="mb-4 flex items-center justify-between gap-3">
        <button
          className="min-h-11 rounded-md border border-border bg-white px-4 text-sm font-semibold text-forest transition-colors hover:bg-soft-green disabled:cursor-not-allowed disabled:opacity-40"
          type="button"
          onClick={() => navigateChapter(-1)}
          disabled={!canGoPrevious}
        >
          <span aria-hidden="true">← </span>
          Previous Chapter
        </button>
        <h2 className="mb-0 text-center font-serif text-xl font-medium text-ink">
          {selectedBook
            ? `${selectedBook.name} ${passage.chapter}`
            : passage.bookId
              ? `${passage.bookId} ${passage.chapter}`
              : 'Select a passage'}
        </h2>
        <button
          className="min-h-11 rounded-md border border-border bg-white px-4 text-sm font-semibold text-forest transition-colors hover:bg-soft-green disabled:cursor-not-allowed disabled:opacity-40"
          type="button"
          onClick={() => navigateChapter(1)}
          disabled={!canGoNext}
        >
          Next Chapter
          <span aria-hidden="true"> →</span>
        </button>
      </div>

      {translations.length > 0 && (
        <>
          <div className="grid min-w-0 grid-cols-2 items-stretch gap-6 max-[760px]:grid-cols-1">
            <PassagePanel
              heading="Translation 1"
              translationId={leftTranslationId}
              onTranslationChange={setLeftTranslationId}
              translations={translations}
              passage={passage}
            />
            <PassagePanel
              heading="Translation 2"
              translationId={rightTranslationId}
              onTranslationChange={setRightTranslationId}
              translations={translations}
              passage={passage}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default ComparisonPage
