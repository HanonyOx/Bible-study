export type Testament = 'Old Testament' | 'New Testament' | 'Other books'

export type BibleBook = {
  id: string
  name: string
  order: number
  chapterCount: number
  firstChapter: number
}

export type BibleTranslation = {
  id: string
  name: string
  shortName: string
  language: string
  licenseUrl: string
}

export type BiblePassageReference = {
  bookId: string
  chapter: number
  translationId: string
}

export type BibleVerse = {
  number: number
  text: string
}

export type BibleChapter = BiblePassageReference & {
  verses: BibleVerse[]
}

export type BibleVerseReference = {
  bookId: string
  bookName: string
  chapter: number
  verse: number
  translationId: string
  translationName: string
}

export type BibleBookmark = BibleVerseReference & {
  id: string
  createdAt: string
}

export type BibleHighlightColor = 'yellow' | 'green' | 'blue' | 'pink'

export type BibleHighlight = BibleVerseReference & {
  id: string
  color: BibleHighlightColor
  updatedAt: string
}

export type BibleNote = BibleVerseReference & {
  id: string
  text: string
  createdAt: string
  updatedAt: string
}

export type BibleChapterReference = Pick<
  BiblePassageReference,
  'bookId' | 'chapter'
>

export type BibleReadingProgress = {
  lastRead: BiblePassageReference | null
  completedChapters: BibleChapterReference[]
}

export type BiblePersonalData = {
  bookmarks: BibleBookmark[]
  highlights: BibleHighlight[]
  notes: BibleNote[]
  progress: BibleReadingProgress
}
