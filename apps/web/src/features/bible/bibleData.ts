export type Testament = 'Old Testament' | 'New Testament'

export type BibleBook = {
  id: string
  name: string
  testament: Testament
  chapterCount: number
}

export type TranslationId =
  | 'KJV'
  | 'NKJV'
  | 'NIV'
  | 'ESV'
  | 'NLT'
  | 'CSB'
  | 'NASB'
  | 'AMP'
  | 'GNT'
  | 'CEV'
  | 'WEB'
  | 'BSB'

export type PlannedTranslation = {
  id: TranslationId
  name: string
}

export type BiblePassageReference = {
  bookId: string
  chapter: number
  translationId: TranslationId
}

export type PlaceholderLine = {
  number: number
  text: string
}

export type PlaceholderPassage = BiblePassageReference & {
  lines: PlaceholderLine[]
}

export const bibleBooks: BibleBook[] = [
  { id: 'genesis', name: 'Genesis', testament: 'Old Testament', chapterCount: 50 },
  { id: 'exodus', name: 'Exodus', testament: 'Old Testament', chapterCount: 40 },
  { id: 'leviticus', name: 'Leviticus', testament: 'Old Testament', chapterCount: 27 },
  { id: 'numbers', name: 'Numbers', testament: 'Old Testament', chapterCount: 36 },
  { id: 'deuteronomy', name: 'Deuteronomy', testament: 'Old Testament', chapterCount: 34 },
  { id: 'joshua', name: 'Joshua', testament: 'Old Testament', chapterCount: 24 },
  { id: 'judges', name: 'Judges', testament: 'Old Testament', chapterCount: 21 },
  { id: 'ruth', name: 'Ruth', testament: 'Old Testament', chapterCount: 4 },
  { id: '1-samuel', name: '1 Samuel', testament: 'Old Testament', chapterCount: 31 },
  { id: '2-samuel', name: '2 Samuel', testament: 'Old Testament', chapterCount: 24 },
  { id: '1-kings', name: '1 Kings', testament: 'Old Testament', chapterCount: 22 },
  { id: '2-kings', name: '2 Kings', testament: 'Old Testament', chapterCount: 25 },
  { id: '1-chronicles', name: '1 Chronicles', testament: 'Old Testament', chapterCount: 29 },
  { id: '2-chronicles', name: '2 Chronicles', testament: 'Old Testament', chapterCount: 36 },
  { id: 'ezra', name: 'Ezra', testament: 'Old Testament', chapterCount: 10 },
  { id: 'nehemiah', name: 'Nehemiah', testament: 'Old Testament', chapterCount: 13 },
  { id: 'esther', name: 'Esther', testament: 'Old Testament', chapterCount: 10 },
  { id: 'job', name: 'Job', testament: 'Old Testament', chapterCount: 42 },
  { id: 'psalms', name: 'Psalms', testament: 'Old Testament', chapterCount: 150 },
  { id: 'proverbs', name: 'Proverbs', testament: 'Old Testament', chapterCount: 31 },
  { id: 'ecclesiastes', name: 'Ecclesiastes', testament: 'Old Testament', chapterCount: 12 },
  { id: 'song-of-solomon', name: 'Song of Solomon', testament: 'Old Testament', chapterCount: 8 },
  { id: 'isaiah', name: 'Isaiah', testament: 'Old Testament', chapterCount: 66 },
  { id: 'jeremiah', name: 'Jeremiah', testament: 'Old Testament', chapterCount: 52 },
  { id: 'lamentations', name: 'Lamentations', testament: 'Old Testament', chapterCount: 5 },
  { id: 'ezekiel', name: 'Ezekiel', testament: 'Old Testament', chapterCount: 48 },
  { id: 'daniel', name: 'Daniel', testament: 'Old Testament', chapterCount: 12 },
  { id: 'hosea', name: 'Hosea', testament: 'Old Testament', chapterCount: 14 },
  { id: 'joel', name: 'Joel', testament: 'Old Testament', chapterCount: 3 },
  { id: 'amos', name: 'Amos', testament: 'Old Testament', chapterCount: 9 },
  { id: 'obadiah', name: 'Obadiah', testament: 'Old Testament', chapterCount: 1 },
  { id: 'jonah', name: 'Jonah', testament: 'Old Testament', chapterCount: 4 },
  { id: 'micah', name: 'Micah', testament: 'Old Testament', chapterCount: 7 },
  { id: 'nahum', name: 'Nahum', testament: 'Old Testament', chapterCount: 3 },
  { id: 'habakkuk', name: 'Habakkuk', testament: 'Old Testament', chapterCount: 3 },
  { id: 'zephaniah', name: 'Zephaniah', testament: 'Old Testament', chapterCount: 3 },
  { id: 'haggai', name: 'Haggai', testament: 'Old Testament', chapterCount: 2 },
  { id: 'zechariah', name: 'Zechariah', testament: 'Old Testament', chapterCount: 14 },
  { id: 'malachi', name: 'Malachi', testament: 'Old Testament', chapterCount: 4 },
  { id: 'matthew', name: 'Matthew', testament: 'New Testament', chapterCount: 28 },
  { id: 'mark', name: 'Mark', testament: 'New Testament', chapterCount: 16 },
  { id: 'luke', name: 'Luke', testament: 'New Testament', chapterCount: 24 },
  { id: 'john', name: 'John', testament: 'New Testament', chapterCount: 21 },
  { id: 'acts', name: 'Acts', testament: 'New Testament', chapterCount: 28 },
  { id: 'romans', name: 'Romans', testament: 'New Testament', chapterCount: 16 },
  { id: '1-corinthians', name: '1 Corinthians', testament: 'New Testament', chapterCount: 16 },
  { id: '2-corinthians', name: '2 Corinthians', testament: 'New Testament', chapterCount: 13 },
  { id: 'galatians', name: 'Galatians', testament: 'New Testament', chapterCount: 6 },
  { id: 'ephesians', name: 'Ephesians', testament: 'New Testament', chapterCount: 6 },
  { id: 'philippians', name: 'Philippians', testament: 'New Testament', chapterCount: 4 },
  { id: 'colossians', name: 'Colossians', testament: 'New Testament', chapterCount: 4 },
  { id: '1-thessalonians', name: '1 Thessalonians', testament: 'New Testament', chapterCount: 5 },
  { id: '2-thessalonians', name: '2 Thessalonians', testament: 'New Testament', chapterCount: 3 },
  { id: '1-timothy', name: '1 Timothy', testament: 'New Testament', chapterCount: 6 },
  { id: '2-timothy', name: '2 Timothy', testament: 'New Testament', chapterCount: 4 },
  { id: 'titus', name: 'Titus', testament: 'New Testament', chapterCount: 3 },
  { id: 'philemon', name: 'Philemon', testament: 'New Testament', chapterCount: 1 },
  { id: 'hebrews', name: 'Hebrews', testament: 'New Testament', chapterCount: 13 },
  { id: 'james', name: 'James', testament: 'New Testament', chapterCount: 5 },
  { id: '1-peter', name: '1 Peter', testament: 'New Testament', chapterCount: 5 },
  { id: '2-peter', name: '2 Peter', testament: 'New Testament', chapterCount: 3 },
  { id: '1-john', name: '1 John', testament: 'New Testament', chapterCount: 5 },
  { id: '2-john', name: '2 John', testament: 'New Testament', chapterCount: 1 },
  { id: '3-john', name: '3 John', testament: 'New Testament', chapterCount: 1 },
  { id: 'jude', name: 'Jude', testament: 'New Testament', chapterCount: 1 },
  { id: 'revelation', name: 'Revelation', testament: 'New Testament', chapterCount: 22 },
]

export const plannedTranslations: PlannedTranslation[] = [
  { id: 'KJV', name: 'KJV' },
  { id: 'NKJV', name: 'NKJV' },
  { id: 'NIV', name: 'NIV' },
  { id: 'ESV', name: 'ESV' },
  { id: 'NLT', name: 'NLT' },
  { id: 'CSB', name: 'CSB' },
  { id: 'NASB', name: 'NASB' },
  { id: 'AMP', name: 'AMP' },
  { id: 'GNT', name: 'GNT' },
  { id: 'CEV', name: 'CEV' },
  { id: 'WEB', name: 'WEB' },
  { id: 'BSB', name: 'BSB' },
]

export const placeholderPassages: PlaceholderPassage[] = [
  {
    bookId: 'genesis',
    chapter: 1,
    translationId: 'WEB',
    lines: [
      {
        number: 1,
        text: 'Demonstration text for the reading layout only. This is not a Bible verse.',
      },
      {
        number: 2,
        text: 'No Scripture text is included in this local placeholder sample.',
      },
    ],
  },
]
