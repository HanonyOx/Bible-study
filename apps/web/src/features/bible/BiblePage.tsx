import { useMemo, useState } from 'react'
import {
  bibleBooks,
  plannedTranslations,
  placeholderPassages,
  type BibleBook,
  type BiblePassageReference,
  type TranslationId,
} from './bibleData'

const initialBook = bibleBooks[0]
const initialTranslation: TranslationId = 'WEB'

function getAdjacentChapter(
  book: BibleBook,
  chapter: number,
  direction: -1 | 1,
): { book: BibleBook; chapter: number } | undefined {
  const bookIndex = bibleBooks.findIndex((item) => item.id === book.id)

  if (direction === -1) {
    if (chapter > 1) {
      return { book, chapter: chapter - 1 }
    }

    const previousBook = bibleBooks[bookIndex - 1]
    return previousBook
      ? { book: previousBook, chapter: previousBook.chapterCount }
      : undefined
  }

  if (chapter < book.chapterCount) {
    return { book, chapter: chapter + 1 }
  }

  const nextBook = bibleBooks[bookIndex + 1]
  return nextBook ? { book: nextBook, chapter: 1 } : undefined
}

function BiblePage() {
  const [selection, setSelection] = useState<BiblePassageReference>({
    bookId: initialBook.id,
    chapter: 1,
    translationId: initialTranslation,
  })
  const [bookSearch, setBookSearch] = useState('')
  const [textSize, setTextSize] = useState(18)

  const selectedBook =
    bibleBooks.find((book) => book.id === selection.bookId) ?? initialBook
  const normalizedSearch = bookSearch.trim().toLocaleLowerCase()
  const filteredBooks = useMemo(
    () =>
      bibleBooks.filter(
        (book) =>
          book.id === selection.bookId ||
          book.name.toLocaleLowerCase().includes(normalizedSearch),
      ),
    [normalizedSearch, selection.bookId],
  )
  const previousChapter = getAdjacentChapter(
    selectedBook,
    selection.chapter,
    -1,
  )
  const nextChapter = getAdjacentChapter(selectedBook, selection.chapter, 1)
  const passage = placeholderPassages.find(
    (item) =>
      item.bookId === selectedBook.id &&
      item.chapter === selection.chapter &&
      item.translationId === selection.translationId,
  )

  function selectBook(bookId: string) {
    setSelection((current) => ({ ...current, bookId, chapter: 1 }))
    setBookSearch('')
  }

  function navigateChapter(direction: -1 | 1) {
    const destination = getAdjacentChapter(
      selectedBook,
      selection.chapter,
      direction,
    )
    if (destination) {
      setSelection((current) => ({
        ...current,
        bookId: destination.book.id,
        chapter: destination.chapter,
      }))
      setBookSearch('')
    }
  }

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
          Choose a book, chapter, and planned translation option. This reader
          preview does not contain licensed Scripture text.
        </p>
      </section>

      <section
        className="rounded-[10px] border border-border bg-surface p-6 shadow-[0_8px_24px_rgba(41,52,46,0.04)] max-[720px]:p-4"
        aria-label="Bible reader controls and passage"
      >
        <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(110px,0.55fr)_minmax(130px,0.8fr)] gap-4 max-[720px]:grid-cols-2 max-[460px]:grid-cols-1">
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
            />
            <label
              className="sr-only"
              htmlFor="book-select"
            >
              Select a Bible book
            </label>
            <select
              className="min-h-11 rounded-md border border-border bg-white px-3 text-sm text-ink outline-none focus:border-forest focus:ring-2 focus:ring-soft-green"
              id="book-select"
              value={selection.bookId}
              onChange={(event) => selectBook(event.target.value)}
            >
              {(['Old Testament', 'New Testament'] as const).map(
                (testament) => {
                  const testamentBooks = filteredBooks.filter(
                    (book) => book.testament === testament,
                  )
                  return testamentBooks.length > 0 ? (
                    <optgroup label={testament} key={testament}>
                      {testamentBooks.map((book) => (
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
                },
              )}
            </select>
            {filteredBooks.length === 1 &&
              selectedBook.name.toLocaleLowerCase() !== normalizedSearch &&
              normalizedSearch && (
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
              className="min-h-11 rounded-md border border-border bg-white px-3 text-sm text-ink outline-none focus:border-forest focus:ring-2 focus:ring-soft-green"
              id="chapter-select"
              value={selection.chapter}
              onChange={(event) =>
                setSelection((current) => ({
                  ...current,
                  chapter: Number(event.target.value),
                }))
              }
            >
              {Array.from(
                { length: selectedBook.chapterCount },
                (_, index) => index + 1,
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
              Planned translation options
            </label>
            <select
              className="min-h-11 rounded-md border border-border bg-white px-3 text-sm text-ink outline-none focus:border-forest focus:ring-2 focus:ring-soft-green"
              id="translation-select"
              value={selection.translationId}
              onChange={(event) => {
                const translation = plannedTranslations.find(
                  (option) => option.id === event.target.value,
                )
                if (translation) {
                  setSelection((current) => ({
                    ...current,
                    translationId: translation.id,
                  }))
                }
              }}
            >
              {plannedTranslations.map((translation) => (
                <option value={translation.id} key={translation.id}>
                  {translation.name} — planned
                  {translation.id === 'WEB' ? ' · demo layout sample' : ''}
                </option>
              ))}
            </select>
            <p className="m-0 text-[11px] leading-4 text-muted">
              Text availability and licensing have not been confirmed.
            </p>
          </div>
        </div>

        <div className="mt-7 flex items-end justify-between gap-4 border-b border-border pb-5 max-[460px]:items-start max-[460px]:flex-col">
          <div>
            <p className="mb-2 text-[11px] font-bold tracking-[1.4px] text-clay uppercase">
              Selected passage
            </p>
            <h2 className="mb-0 font-serif text-[clamp(25px,4vw,34px)] leading-tight font-medium tracking-[-0.7px] text-ink">
              {selectedBook.name} {selection.chapter}
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
          {passage ? (
            <div>
              <div className="mb-5 inline-flex rounded-full border border-[#e9d6b0] bg-[#fbf4e5] px-3 py-1 text-[10px] font-bold tracking-[1px] text-[#76532f] uppercase">
                Layout demo · not Scripture
              </div>
              <p className="mb-5 text-xs leading-5 text-muted">
                A sample display for {selectedBook.name} {selection.chapter}.
                This local placeholder is not text from the{' '}
                {selection.translationId}{' '}
                translation and is not a Bible verse.
              </p>
              <ol
                className="m-0 list-none space-y-4 p-0 text-ink"
                aria-label="Illustrative placeholder lines, not Bible verses"
              >
                {passage.lines.map((line) => (
                  <li
                    className="flex gap-4 leading-[1.8]"
                    style={{ fontSize: `${textSize}px` }}
                    key={line.number}
                  >
                    <span className="min-w-6 pt-1 text-right text-xs font-bold text-clay">
                      {String(line.number).padStart(2, '0')}
                    </span>
                    <span>{line.text}</span>
                  </li>
                ))}
              </ol>
            </div>
          ) : (
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
              <h3 className="mb-2 font-serif text-xl font-medium text-ink">
                Passage content is not available here yet.
              </h3>
              <p className="mb-0 max-w-[520px] text-sm leading-6 text-muted">
                No local placeholder is available for {selectedBook.name}{' '}
                {selection.chapter} in {selection.translationId}. The translation
                options are planned only; no Bible text is currently connected.
              </p>
            </div>
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
            disabled={!previousChapter}
          >
            <span aria-hidden="true">← </span>
            Previous Chapter
          </button>
          <span className="text-center text-xs text-muted max-[460px]:hidden">
            {selectedBook.name} {selection.chapter}
          </span>
          <button
            className="min-h-11 rounded-md border border-border bg-white px-4 text-sm font-semibold text-forest transition-colors hover:bg-soft-green disabled:cursor-not-allowed disabled:opacity-40"
            type="button"
            onClick={() => navigateChapter(1)}
            disabled={!nextChapter}
          >
            Next Chapter
            <span aria-hidden="true"> →</span>
          </button>
        </nav>
      </section>

      <p className="mb-0 mt-4 text-center text-xs leading-5 text-muted">
        Book search filters book names only. Scripture text search is not
        available in this preview.
      </p>
    </div>
  )
}

export default BiblePage
