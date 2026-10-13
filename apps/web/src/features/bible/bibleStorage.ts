import { useState } from 'react'
import type {
  BibleBookmark,
  BibleChapterReference,
  BibleHighlight,
  BibleHighlightColor,
  BibleNote,
  BiblePassageReference,
  BiblePersonalData,
  BibleVerseReference,
} from './bibleData'

const STORAGE_KEY_PREFIX = 'word-way:bible-personal-data:v1'

const emptyPersonalData: BiblePersonalData = {
  bookmarks: [],
  highlights: [],
  notes: [],
  progress: {
    lastRead: null,
    completedChapters: [],
  },
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0
}

function isPassageReference(value: unknown): value is BiblePassageReference {
  return (
    isRecord(value) &&
    isNonEmptyString(value.bookId) &&
    isPositiveInteger(value.chapter) &&
    isNonEmptyString(value.translationId)
  )
}

function isVerseReference(
  value: unknown,
): value is Record<string, unknown> & BibleVerseReference {
  return (
    isRecord(value) &&
    isNonEmptyString(value.bookId) &&
    isNonEmptyString(value.bookName) &&
    isPositiveInteger(value.chapter) &&
    isPositiveInteger(value.verse) &&
    isNonEmptyString(value.translationId) &&
    isNonEmptyString(value.translationName)
  )
}

function isChapterReference(value: unknown): value is BibleChapterReference {
  return (
    isRecord(value) &&
    isNonEmptyString(value.bookId) &&
    isPositiveInteger(value.chapter)
  )
}

function parsePersonalData(value: unknown): BiblePersonalData {
  if (
    !isRecord(value) ||
    !Array.isArray(value.bookmarks) ||
    !Array.isArray(value.highlights) ||
    !Array.isArray(value.notes) ||
    !isRecord(value.progress)
  ) {
    throw new Error('Saved reader data has an unsupported format.')
  }

  const bookmarks: BibleBookmark[] = value.bookmarks.filter(
    (item): item is BibleBookmark =>
      isRecord(item) &&
      isVerseReference(item) &&
      isNonEmptyString(item.id) &&
      isNonEmptyString(item.createdAt),
  )
  const validColors: BibleHighlightColor[] = ['yellow', 'green', 'blue', 'pink']
  const highlights: BibleHighlight[] = value.highlights.filter(
    (item): item is BibleHighlight =>
      isRecord(item) &&
      isVerseReference(item) &&
      isNonEmptyString(item.id) &&
      typeof item.color === 'string' &&
      validColors.some((color) => color === item.color) &&
      isNonEmptyString(item.updatedAt),
  )
  const notes: BibleNote[] = value.notes.filter(
    (item): item is BibleNote =>
      isRecord(item) &&
      isVerseReference(item) &&
      isNonEmptyString(item.id) &&
      typeof item.text === 'string' &&
      item.text.trim().length > 0 &&
      isNonEmptyString(item.createdAt) &&
      isNonEmptyString(item.updatedAt),
  )
  const completedChapters = value.progress.completedChapters
  if (!Array.isArray(completedChapters)) {
    throw new Error('Saved reading progress has an unsupported format.')
  }
  const uniqueChapters = new Map<string, BibleChapterReference>()
  for (const item of completedChapters) {
    if (isChapterReference(item)) {
      uniqueChapters.set(`${item.bookId}/${item.chapter}`, item)
    }
  }

  const lastRead = value.progress.lastRead
  return {
    bookmarks: uniqueBy(bookmarks, (item) => item.id),
    highlights: uniqueBy(highlights, (item) => item.id),
    notes: uniqueBy(notes, (item) => item.id),
    progress: {
      lastRead: isPassageReference(lastRead) ? lastRead : null,
      completedChapters: [...uniqueChapters.values()],
    },
  }
}

function uniqueBy<T>(items: T[], getKey: (item: T) => string): T[] {
  return [...new Map(items.map((item) => [getKey(item), item])).values()]
}

export function getBiblePersonalDataKey(reference: BibleVerseReference): string {
  return `${reference.translationId}/${reference.bookId}/${reference.chapter}/${reference.verse}`
}

export function getBiblePersonalDataStorageKey(
  storageScope: string | null,
): string | null {
  return storageScope
    ? `${STORAGE_KEY_PREFIX}:${encodeURIComponent(storageScope)}`
    : null
}

export function loadBiblePersonalData(): {
  data: BiblePersonalData
  warning: string | null
}
export function loadBiblePersonalData(storageScope: string | null): {
  data: BiblePersonalData
  warning: string | null
}
export function loadBiblePersonalData(
  storageScope: string | null = 'guest',
): {
  data: BiblePersonalData
  warning: string | null
} {
  if (!storageScope) {
    return {
      data: emptyPersonalData,
      warning:
        'Sign-in status could not be verified. Personal reading data was not loaded.',
    }
  }

  try {
    const storageKey = getBiblePersonalDataStorageKey(storageScope)
    const storedValue = storageKey
      ? window.localStorage.getItem(storageKey)
      : null
    if (!storedValue) {
      return { data: emptyPersonalData, warning: null }
    }
    return {
      data: parsePersonalData(JSON.parse(storedValue) as unknown),
      warning: null,
    }
  } catch {
    return {
      data: emptyPersonalData,
      warning:
        'Saved reader data could not be read. Your new changes will remain on this device for this session.',
    }
  }
}

export function saveBiblePersonalData(
  data: BiblePersonalData,
  storageScope: string | null = 'guest',
): string | null {
  const storageKey = getBiblePersonalDataStorageKey(storageScope)
  if (!storageKey) {
    return 'Personal reading data was not saved because sign-in status could not be verified.'
  }

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(data))
    return null
  } catch {
    return 'Reader data could not be saved to this browser. Check storage settings or available space.'
  }
}

export function useBiblePersonalData(storageScope: string | null) {
  const [entry, setEntry] = useState(() => ({
    storageScope,
    ...loadBiblePersonalData(storageScope),
  }))

  const currentEntry =
    entry.storageScope === storageScope
      ? entry
      : {
          storageScope,
          ...loadBiblePersonalData(storageScope),
        }

  function commit(nextData: BiblePersonalData) {
    setEntry({
      storageScope,
      data: nextData,
      warning: saveBiblePersonalData(nextData, storageScope),
    })
  }

  return {
    data: currentEntry.data,
    commit,
    storageWarning: currentEntry.warning,
    storageScope: currentEntry.storageScope,
  }
}

export function makeVerseReference(
  reference: BiblePassageReference,
  bookName: string,
  translationName: string,
  verse: number,
): BibleVerseReference {
  return {
    bookId: reference.bookId,
    bookName,
    chapter: reference.chapter,
    verse,
    translationId: reference.translationId,
    translationName,
  }
}

export function formatVerseReference(reference: BibleVerseReference): string {
  return `${reference.bookName} ${reference.chapter}:${reference.verse}`
}

export function hasCompletedChapter(
  completions: BibleChapterReference[],
  bookId: string,
  chapter: number,
): boolean {
  return completions.some(
    (item) => item.bookId === bookId && item.chapter === chapter,
  )
}
