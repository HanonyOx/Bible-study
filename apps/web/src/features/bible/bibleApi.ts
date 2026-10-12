import type {
  BibleBook,
  BibleChapter,
  BibleTranslation,
  BibleVerse,
  Testament,
} from './bibleData'

const API_ROOT = 'https://bible.helloao.org/api'

type ApiContentBlock = {
  type: string
  number?: number
  text?: string
}

const oldTestamentIds = new Set([
  'GEN', 'EXO', 'LEV', 'NUM', 'DEU', 'JOS', 'JDG', 'RUT', '1SA', '2SA',
  '1KI', '2KI', '1CH', '2CH', 'EZR', 'NEH', 'EST', 'JOB', 'PSA', 'PRO',
  'ECC', 'SNG', 'ISA', 'JER', 'LAM', 'EZK', 'DAN', 'HOS', 'JOL', 'AMO',
  'OBA', 'JON', 'MIC', 'NAM', 'HAB', 'ZEP', 'HAG', 'ZEC', 'MAL',
])
const newTestamentIds = new Set([
  'MAT', 'MRK', 'LUK', 'JHN', 'ACT', 'ROM', '1CO', '2CO', 'GAL', 'EPH',
  'PHP', 'COL', '1TH', '2TH', '1TI', '2TI', 'TIT', 'PHM', 'HEB', 'JAS',
  '1PE', '2PE', '1JN', '2JN', '3JN', 'JUD', 'REV',
])

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function requireString(
  value: unknown,
  field: string,
): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`Bible API response has an invalid ${field}.`)
  }
  return value
}

function requireNumber(
  value: unknown,
  field: string,
): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`Bible API response has an invalid ${field}.`)
  }
  return value
}

async function getJson(url: string, signal: AbortSignal): Promise<unknown> {
  const response = await fetch(url, { signal })
  if (!response.ok) {
    throw new Error(
      `Bible API request failed (${response.status} ${response.statusText}).`,
    )
  }
  return response.json() as Promise<unknown>
}

function parseTranslation(value: unknown): BibleTranslation {
  if (!isRecord(value)) {
    throw new Error('Bible API returned an invalid translation record.')
  }
  return {
    id: requireString(value.id, 'translation ID'),
    name: requireString(value.name, 'translation name'),
    shortName:
      typeof value.shortName === 'string' && value.shortName
        ? value.shortName
        : requireString(value.id, 'translation ID'),
    language: requireString(value.language, 'translation language'),
    licenseUrl:
      typeof value.licenseUrl === 'string' ? value.licenseUrl : '',
  }
}

export async function fetchEnglishTranslations(
  signal: AbortSignal,
): Promise<BibleTranslation[]> {
  const response = await getJson(`${API_ROOT}/available_translations.json`, signal)
  if (!isRecord(response) || !Array.isArray(response.translations)) {
    throw new Error('Bible API returned an invalid translations list.')
  }
  return response.translations
    .map(parseTranslation)
    .filter((translation) => translation.language === 'eng')
}

export async function fetchBooks(
  translationId: string,
  signal: AbortSignal,
): Promise<BibleBook[]> {
  const response = await getJson(
    `${API_ROOT}/${encodeURIComponent(translationId)}/books.json`,
    signal,
  )
  if (!isRecord(response) || !Array.isArray(response.books)) {
    throw new Error('Bible API returned an invalid book list.')
  }

  return response.books
    .map((value): BibleBook => {
      if (!isRecord(value)) {
        throw new Error('Bible API returned an invalid book record.')
      }
      return {
        id: requireString(value.id, 'book ID'),
        name:
          typeof value.commonName === 'string' && value.commonName
            ? value.commonName
            : requireString(value.name, 'book name'),
        order: requireNumber(value.order, 'book order'),
        chapterCount: requireNumber(
          value.numberOfChapters,
          'book chapter count',
        ),
        firstChapter: requireNumber(
          value.firstChapterNumber,
          'first chapter number',
        ),
      }
    })
    .sort((a, b) => a.order - b.order)
}

export function getTestament(bookId: string): Testament {
  if (oldTestamentIds.has(bookId)) {
    return 'Old Testament'
  }
  if (newTestamentIds.has(bookId)) {
    return 'New Testament'
  }
  return 'Other books'
}

export async function fetchChapter(
  translationId: string,
  bookId: string,
  chapterNumber: number,
  signal: AbortSignal,
): Promise<BibleChapter> {
  const response = await getJson(
    `${API_ROOT}/${encodeURIComponent(translationId)}/${encodeURIComponent(bookId)}/${chapterNumber}.simple.json`,
    signal,
  )
  if (!isRecord(response) || !isRecord(response.chapter)) {
    throw new Error('Bible API returned an invalid chapter.')
  }
  const content = response.chapter.content
  if (!Array.isArray(content)) {
    throw new Error('Bible API returned an invalid chapter content list.')
  }

  const verses: BibleVerse[] = content
    .filter(
      (block): block is ApiContentBlock =>
        isRecord(block) && block.type === 'verse',
    )
    .map((block) => ({
      number: requireNumber(block.number, 'verse number'),
      text: requireString(block.text, 'verse text'),
    }))

  if (verses.length === 0) {
    throw new Error('This chapter has no readable verses in the API response.')
  }

  return {
    translationId,
    bookId,
    chapter: chapterNumber,
    verses,
  }
}

export function groupBooks(books: BibleBook[]): Map<Testament, BibleBook[]> {
  const groups = new Map<Testament, BibleBook[]>([
    ['Old Testament', []],
    ['New Testament', []],
    ['Other books', []],
  ])

  for (const book of books) {
    groups.get(getTestament(book.id))?.push(book)
  }
  return groups
}

export function getAdjacentBook(
  books: BibleBook[],
  selectedBook: BibleBook,
  direction: -1 | 1,
): BibleBook | undefined {
  return books[books.findIndex((book) => book.id === selectedBook.id) + direction]
}
