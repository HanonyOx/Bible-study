import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const typescript = require('typescript')
const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function loadTypeScriptModule(relativePath, cache = new Map()) {
  const sourcePath = path.resolve(webRoot, relativePath)
  if (cache.has(sourcePath)) return cache.get(sourcePath).exports

  const module = { exports: {} }
  cache.set(sourcePath, module)
  const source = readFileSync(sourcePath, 'utf8')
  const compiled = typescript.transpileModule(source, {
    compilerOptions: {
      module: typescript.ModuleKind.CommonJS,
      target: typescript.ScriptTarget.ES2022,
    },
  }).outputText
  const localRequire = (specifier) => {
    if (!specifier.startsWith('.')) return require(specifier)
    const resolved = path.resolve(path.dirname(sourcePath), `${specifier}.ts`)
    return loadTypeScriptModule(path.relative(webRoot, resolved), cache)
  }
  new Function('exports', 'require', 'module', compiled)(
    module.exports,
    localRequire,
    module,
  )
  return module.exports
}

const lessonData = loadTypeScriptModule(
  'src/features/sunday-school/sundaySchoolData.ts',
)
const originalData = loadTypeScriptModule(
  'src/features/sunday-school/originalSundaySchoolLessons.ts',
)
const demoData = loadTypeScriptModule(
  'src/features/sunday-school/demoLessonData.ts',
)
const lessons = originalData.originalSundaySchoolLessons

test('the original study set has 12 complete lessons in each age group', () => {
  assert.equal(lessons.length, 36)
  assert.equal(new Set(lessons.map(({ id }) => id)).size, 36)

  for (const ageGroup of ['children', 'teens', 'adults']) {
    const ageGroupLessons = lessons.filter(
      (lesson) => lesson.ageGroup === ageGroup,
    )
    assert.equal(ageGroupLessons.length, 12, `${ageGroup} lesson count`)
    for (const lesson of ageGroupLessons) {
      assert.ok(lesson.id)
      assert.ok(lesson.title)
      assert.ok(lesson.mainScriptureReference)
      assert.ok(lesson.learningObjectives.length >= 2)
      assert.ok(lesson.learningObjectives.length <= 4)
      assert.ok(lesson.introduction)
      assert.ok(lesson.teachingPoints.length >= 3)
      assert.ok(lesson.practicalApplication)
      assert.ok(lesson.discussionQuestions.length >= 3)
      assert.ok(lesson.discussionQuestions.length <= 5)
      assert.ok(lesson.memoryVerseReference)
      assert.ok(lesson.closingPrayer)
      assert.equal(lesson.contentOrigin, 'original_word_and_way')
      assert.equal(lesson.publicationStatus, 'draft')
      assert.equal(lesson.reviewStatus, 'not_reviewed')
      if (ageGroup === 'children') {
        assert.ok(lesson.ageAppropriateExplanation)
        assert.ok(lesson.interactiveActivity)
        assert.ok(lesson.simpleTakeaway)
      }
    }
  }
})

test('the generated seed keeps all lesson relationships and draft publication state', () => {
  const seedPath = path.resolve(
    webRoot,
    '..',
    '..',
    'supabase',
    'seeds',
    'original_word_and_way_studies.sql',
  )
  const seed = readFileSync(seedPath, 'utf8')
  assert.equal((seed.match(/insert into public\.lessons \(/g) ?? []).length, 36)
  assert.equal(
    (seed.match(/insert into public\.lesson_scripture_references \(/g) ?? [])
      .length,
    36,
  )
  assert.equal(
    (seed.match(/insert into public\.lesson_learning_objectives \(/g) ?? [])
      .length,
    108,
  )
  assert.equal(
    (seed.match(/insert into public\.lesson_sections \(/g) ?? []).length,
    144,
  )
  assert.equal(
    (seed.match(/insert into public\.lesson_discussion_questions \(/g) ?? [])
      .length,
    108,
  )
  assert.match(seed, /'not_reviewed', 'draft'/)
  assert.match(seed, /content_origin[\s\S]*'original_word_and_way'/)
  assert.match(seed, /on conflict \(id\) do nothing;/)
  assert.match(seed, /commit;\s*$/)
})

test('student visibility requires publication, review, and source eligibility', () => {
  assert.deepEqual(lessonData.getStudentVisibleLessons(), [])

  const originalLesson = {
    ...lessons[24],
    publicationStatus: 'published',
    reviewStatus: 'approved',
  }
  const originalCurriculum = {
    ...lessonData.sundaySchoolCurricula[0],
    publicationStatus: 'published',
  }
  assert.equal(
    lessonData.isStudentVisibleLesson(originalLesson, originalCurriculum),
    true,
  )
  assert.equal(
    lessonData.isStudentVisibleLesson(
      { ...originalLesson, reviewStatus: 'not_reviewed' },
      originalCurriculum,
    ),
    false,
  )
  assert.equal(
    lessonData.isStudentVisibleLesson(originalLesson, {
      ...originalCurriculum,
      publicationStatus: 'under_review',
    }),
    false,
  )

  const externalLesson = {
    ...originalLesson,
    contentOrigin: 'licensed_external',
  }
  const externalCurriculum = {
    ...originalCurriculum,
    source: {
      kind: 'official',
      title: 'Verified test edition',
      url: 'https://example.invalid/test-edition',
    },
    usageRightsStatus: 'approved',
  }
  assert.equal(
    lessonData.isStudentVisibleLesson(externalLesson, externalCurriculum),
    true,
  )
  assert.equal(
    lessonData.isStudentVisibleLesson(externalLesson, {
      ...externalCurriculum,
      usageRightsStatus: 'unverified',
    }),
    false,
  )
})

test('the opt-in demo preview covers all groups without publishing database records', () => {
  const demoLessons = demoData.getLocalDemonstrationLessons()

  assert.equal(demoLessons.length, 36)
  assert.equal(lessonData.sundaySchoolCurricula.length, 1)
  assert.equal(
    lessonData.sundaySchoolCurricula[0].name,
    'Word & Way Demonstration Curriculum — 2026',
  )

  for (const ageGroup of ['children', 'teens', 'adults']) {
    assert.equal(
      demoLessons.filter((lesson) => lesson.ageGroup === ageGroup).length,
      12,
      `${ageGroup} demo lesson count`,
    )
  }

  assert.ok(
    demoLessons.every(
      (lesson) =>
        lesson.publicationStatus === 'draft' &&
        lesson.reviewStatus === 'not_reviewed',
    ),
  )
  assert.deepEqual(lessonData.getStudentVisibleLessons(), [])
})

test('lesson search filters by age group, title, and Scripture reference', () => {
  const children = lessonData.filterStudentLessons(
    lessons,
    'children',
    'Genesis 6',
  )
  assert.equal(children.length, 1)
  assert.equal(children[0].id, 'children-noah-obeys-god')

  const teens = lessonData.filterStudentLessons(lessons, 'teens', 'prayer')
  assert.equal(teens.length, 1)
  assert.equal(teens[0].id, 'teens-prayer-personal-growth')

  assert.deepEqual(
    lessonData.filterStudentLessons(lessons, 'adults', 'no matching topic'),
    [],
  )
})
