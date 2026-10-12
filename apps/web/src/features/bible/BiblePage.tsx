import { useEffect, useMemo, useState } from 'react'
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
  BiblePassageReference,
  BibleTranslation,
  Testament,
} from './bibleData'

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
  const [selection, setSelection] =
    useState<BiblePassageReference>(initialSelection)
  const [bookSearch, setBookSearch] = useState('')
  const [textSize, setTextSize] = useState(18)
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
                className="m-0 list-none space-y-4 p-0 text-ink"
                aria-label={`${selectedBook?.name} ${selection.chapter} verses`}
              >
                {chapterLoadState.data.verses.map((verse) => (
                  <li
                    className="flex gap-4 leading-[1.8]"
                    style={{ fontSize: `${textSize}px` }}
                    key={verse.number}
                  >
                    <span className="min-w-6 pt-1 text-right text-xs font-bold text-clay">
                      {verse.number}
                    </span>
                    <span>{verse.text}</span>
                  </li>
                ))}
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
