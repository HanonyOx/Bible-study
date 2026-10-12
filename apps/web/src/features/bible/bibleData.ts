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
