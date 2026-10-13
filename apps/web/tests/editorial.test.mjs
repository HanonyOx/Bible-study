import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const typescript = require('typescript')
const renderToStaticMarkup = require('react-dom/server').renderToStaticMarkup
const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function loadTypeScriptModule(relativePath, mocks = {}) {
  const sourcePath = path.resolve(webRoot, relativePath)
  const source = readFileSync(sourcePath, 'utf8')
  const compiled = typescript.transpileModule(source, {
    compilerOptions: {
      module: typescript.ModuleKind.CommonJS,
      target: typescript.ScriptTarget.ES2022,
      jsx: typescript.JsxEmit.ReactJSX,
    },
  }).outputText
  const module = { exports: {} }
  const localRequire = (specifier) => {
    if (specifier in mocks) return mocks[specifier]
    return require(specifier)
  }
  new Function('exports', 'require', 'module', compiled)(
    module.exports,
    localRequire,
    module,
  )
  return module.exports
}

const fixtureLesson = {
  id: 'lesson-id',
  age_group: 'adults',
  title: 'Editorial test lesson',
  lesson_date: null,
  sequence_number: 1,
  review_status: 'in_review',
  reviewed_at: null,
  reviewed_by: null,
  publication_status: 'draft',
  published_at: null,
  published_by: null,
  introduction: 'Introduction',
  practical_application: 'Application',
  memory_verse_reference: 'John 1:1',
  closing_prayer: 'Prayer',
  age_appropriate_explanation: null,
  interactive_activity: null,
  simple_takeaway: null,
  scripture_references: ['John 1:1'],
  learning_objectives: ['Describe the lesson'],
  sections: [
    {
      id: 'teaching-section',
      sequence_number: 1,
      section_kind: 'teaching_point',
      title: 'Teaching',
      student_content: 'Teaching content',
      discussion_questions: [],
    },
    {
      id: 'discussion-section',
      sequence_number: 2,
      section_kind: 'discussion',
        title: null,
        student_content: null,
      discussion_questions: ['What did you learn?'],
    },
  ],
}

const fixtureCurriculum = {
  id: 'curriculum-id',
  publisher: 'Word & Way',
  content_origin: 'original_word_and_way',
  name: 'Test curriculum',
  year: 2026,
  edition_label: null,
  source_title: 'Original test source',
  source_url: null,
  source_status: 'not_applicable',
  source_verified_at: null,
  source_verified_by: null,
  usage_rights_status: 'not_applicable',
  usage_rights_evidence_ref: null,
  usage_rights_verified_at: null,
  usage_rights_verified_by: null,
  review_status: 'not_reviewed',
  reviewed_at: null,
  reviewed_by: null,
  publication_status: 'draft',
  published_at: null,
  published_by: null,
  lessons: [fixtureLesson],
}

function setupService(response = { data: null, error: null }) {
  const calls = []
  const client = {
    rpc: async (name, args) => {
      calls.push({ name, args })
      return response
    },
  }
  const service = loadTypeScriptModule(
    'src/features/editorial/editorialService.ts',
    { '../../services/supabaseClient': { getSupabaseClient: () => client } },
  )
  return { calls, service }
}

test('loads and validates the nested editorial queue using the existing RPC', async () => {
  const { calls, service } = setupService({
    data: [fixtureCurriculum],
    error: null,
  })

  const queue = await service.getEditorialQueue()
  assert.deepEqual(calls, [{ name: 'get_editorial_queue', args: undefined }])
  assert.equal(queue[0].lessons[0].title, 'Editorial test lesson')
  assert.equal(queue[0].lessons[0].sections[1].discussion_questions[0], 'What did you learn?')
})

test('surfaces database authorization errors without a fallback queue', async () => {
  const { calls, service } = setupService({
    data: null,
    error: { code: '42501', message: 'Curriculum editor authorization required' },
  })

  await assert.rejects(service.getEditorialQueue(), (error) => {
    assert.equal(error.code, '42501')
    assert.match(error.message, /authorization required/)
    return true
  })
  assert.equal(calls.length, 1)
})

test('submits a lesson and approves it with the actual database RPC arguments', async () => {
  const { calls, service } = setupService()

  await service.submitLessonForReview('lesson-id')
  await service.reviewLesson('lesson-id', 'approved', '')

  assert.deepEqual(calls, [
    {
      name: 'submit_lesson_for_review',
      args: { p_lesson_id: 'lesson-id' },
    },
    {
      name: 'review_lesson',
      args: {
        p_lesson_id: 'lesson-id',
        p_decision: 'approved',
        p_feedback: null,
      },
    },
  ])
})

test('uses the curriculum lifecycle RPCs to make eligible lessons publishable', async () => {
  const { calls, service } = setupService()

  await service.submitCurriculumForReview('curriculum-id')
  await service.approveCurriculum('curriculum-id')
  await service.publishCurriculum('curriculum-id')

  assert.deepEqual(calls, [
    {
      name: 'submit_curriculum_for_review',
      args: { p_curriculum_id: 'curriculum-id' },
    },
    {
      name: 'review_curriculum',
      args: {
        p_curriculum_id: 'curriculum-id',
        p_decision: 'approved',
        p_feedback: null,
      },
    },
    {
      name: 'publish_curriculum',
      args: { p_curriculum_id: 'curriculum-id' },
    },
  ])
})

test('rejects locally blank feedback and sends required feedback for a return', async () => {
  const { calls, service } = setupService()

  await assert.rejects(
    service.reviewLesson('lesson-id', 'rejected', '  '),
    /feedback/,
  )
  assert.equal(calls.length, 0)

  await service.reviewLesson('lesson-id', 'rejected', ' Please revise the lesson. ')
  assert.deepEqual(calls[0], {
    name: 'review_lesson',
    args: {
      p_lesson_id: 'lesson-id',
      p_decision: 'rejected',
      p_feedback: 'Please revise the lesson.',
    },
  })
})

test('saves draft content using the existing JSONB RPC contract', async () => {
  const { calls, service } = setupService()
  const content = {
    title: 'Draft',
    age_group: 'adults',
    lesson_date: null,
    sequence_number: 1,
    introduction: 'Intro',
    practical_application: 'Apply',
    memory_verse_reference: 'John 1:1',
    closing_prayer: 'Prayer',
    age_appropriate_explanation: null,
    interactive_activity: null,
    simple_takeaway: null,
    scripture_references: ['John 1:1'],
    learning_objectives: ['Learn'],
    teaching_points: [{ title: 'Point', student_content: 'Content' }],
    discussion_questions: ['Question?'],
  }

  await service.saveLessonDraft('lesson-id', content)
  assert.deepEqual(calls, [
    {
      name: 'save_lesson_draft',
      args: { p_lesson_id: 'lesson-id', p_content: content },
    },
  ])
})

test('reports publication and withdrawal RPC failures to the caller', async () => {
  const { calls, service } = setupService({
    data: null,
    error: { code: '23514', message: 'The parent curriculum must be published' },
  })

  await assert.rejects(service.publishLesson('lesson-id'), (error) => {
    assert.equal(error.code, '23514')
    assert.match(error.message, /parent curriculum/)
    return true
  })
  assert.equal(calls[0].name, 'publish_lesson')

  await assert.rejects(service.unpublishLesson('lesson-id', ''), /reason/)
  assert.equal(calls.length, 1)
})

test('withdraws published lessons with a required reason using the correct RPC', async () => {
  const { calls, service } = setupService()

  await service.unpublishLesson('lesson-id', 'Rights review requested')
  assert.deepEqual(calls, [
    {
      name: 'unpublish_lesson',
      args: {
        p_lesson_id: 'lesson-id',
        p_reason: 'Rights review requested',
      },
    },
  ])
})

test('queue reducer presents loading, ordinary error, and denied states distinctly', () => {
  const stateModule = loadTypeScriptModule(
    'src/features/editorial/editorialState.ts',
  )
  const loading = stateModule.editorialQueueReducer(
    stateModule.initialEditorialQueueState,
    { type: 'loading' },
  )
  assert.equal(loading.loading, true)

  const withCachedQueue = stateModule.editorialQueueReducer(loading, {
    type: 'loaded',
    curricula: [fixtureCurriculum],
  })
  const failed = stateModule.editorialQueueReducer(withCachedQueue, {
    type: 'failed',
    error: 'Curriculum editor authorization required',
    accessDenied: true,
  })
  assert.equal(failed.error, 'Curriculum editor authorization required')
  assert.equal(failed.accessDenied, true)
  assert.equal(failed.curricula, null)
})

test('queue feedback component renders loading and authorization failure states', () => {
  const { EditorialQueueFeedback } = loadTypeScriptModule(
    'src/features/editorial/EditorialQueueFeedback.tsx',
  )
  const loadingMarkup = renderToStaticMarkup(
    EditorialQueueFeedback({
      empty: false,
      onRetry: () => {},
      state: {
        curricula: null,
        loading: true,
        error: null,
        accessDenied: false,
      },
    }),
  )
  assert.match(loadingMarkup, /role="status"/)
  assert.match(loadingMarkup, /Loading editorial queue/)

  const deniedMarkup = renderToStaticMarkup(
    EditorialQueueFeedback({
      empty: false,
      onRetry: () => {},
      state: {
        curricula: null,
        loading: false,
        error: 'Curriculum editor authorization required',
        accessDenied: true,
      },
    }),
  )
  assert.match(deniedMarkup, /role="alert"/)
  assert.match(deniedMarkup, /Editorial access is not available/)
  assert.match(deniedMarkup, /Try again/)
})

test('queue feedback component renders its empty state', () => {
  const { EditorialQueueFeedback } = loadTypeScriptModule(
    'src/features/editorial/EditorialQueueFeedback.tsx',
  )
  const markup = renderToStaticMarkup(
    EditorialQueueFeedback({
      empty: true,
      onRetry: () => {},
      state: {
        curricula: [],
        loading: false,
        error: null,
        accessDenied: false,
      },
    }),
  )
  assert.match(markup, /role="status"/)
  assert.match(markup, /editorial queue is empty/)
})
