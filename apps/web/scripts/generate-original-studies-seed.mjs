import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'
import { createRequire } from 'node:module'

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const webDirectory = path.resolve(scriptDirectory, '..')
const repositoryDirectory = path.resolve(webDirectory, '..', '..')
const require = createRequire(path.join(webDirectory, 'package.json'))
const typescript = require('typescript')
const sourcePath = path.join(
  webDirectory,
  'src',
  'features',
  'sunday-school',
  'originalSundaySchoolLessons.ts',
)
const source = await readFile(sourcePath, 'utf8')
const compiled = typescript.transpileModule(source, {
  compilerOptions: {
    module: typescript.ModuleKind.CommonJS,
    target: typescript.ScriptTarget.ES2022,
  },
}).outputText
const exports = {}
vm.runInNewContext(compiled, {
  exports,
  require: () => {
    throw new Error('The lesson source unexpectedly requires a runtime module')
  },
})

const lessons = exports.originalSundaySchoolLessons
if (!Array.isArray(lessons) || lessons.length !== 36) {
  throw new Error('Expected exactly 36 original studies in the TypeScript source')
}

const namespace = Buffer.from('b2dd88476291568fa1a6140ef4c919b3', 'hex')
function stableUuid(value) {
  const hash = createHash('sha1')
    .update(namespace)
    .update(value, 'utf8')
    .digest()
  hash[6] = (hash[6] & 0x0f) | 0x50
  hash[8] = (hash[8] & 0x3f) | 0x80
  const hex = hash.subarray(0, 16).toString('hex')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

function sql(value) {
  if (value === null || value === undefined) return 'null'
  if (typeof value === 'number') return String(value)
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  return `'${String(value).replaceAll("'", "''")}'`
}

const curriculumId = stableUuid('word-and-way-original-studies-2026')
const statements = [
  `-- Generated from apps/web/src/features/sunday-school/originalSundaySchoolLessons.ts.
-- Imported records intentionally remain drafts until a trusted editorial workflow approves and publishes them.
begin;
insert into public.curriculum_editions (
  id, publisher, content_origin, name, year, edition_label, source_title, source_url,
  source_status, usage_rights_status, review_status, publication_status
) values (
  ${sql(curriculumId)}, 'Word & Way', 'original_word_and_way', 'Original Word & Way Bible Studies',
  2026, 'Original collection', 'Original Word & Way Bible study collection',
  null, 'not_applicable', 'not_applicable', 'not_reviewed', 'draft'
)
on conflict (id) do nothing;`,
]

for (const lesson of lessons) {
  const lessonId = stableUuid(`lesson:${lesson.id}`)
  statements.push(`insert into public.lessons (
  id, curriculum_id, age_group, title, lesson_date, sequence_number,
  review_status, publication_status, introduction, practical_application,
  memory_verse_reference, closing_prayer, age_appropriate_explanation,
  interactive_activity, simple_takeaway
) values (
  ${sql(lessonId)}, ${sql(curriculumId)}, ${sql(lesson.ageGroup)},
  ${sql(lesson.title)}, ${sql(lesson.lessonDate)}, ${sql(lesson.sequenceNumber)},
  'not_reviewed', 'draft', ${sql(lesson.introduction)},
  ${sql(lesson.practicalApplication)}, ${sql(lesson.memoryVerseReference)},
  ${sql(lesson.closingPrayer)}, ${sql(lesson.ageAppropriateExplanation ?? null)},
  ${sql(lesson.interactiveActivity ?? null)}, ${sql(lesson.simpleTakeaway ?? null)}
)
on conflict (id) do nothing;`)

  for (const [index, reference] of lesson.scriptureReferences.entries()) {
    statements.push(`insert into public.lesson_scripture_references (
  id, lesson_id, sequence_number, reference
) values (
  ${sql(stableUuid(`reference:${lesson.id}:${index + 1}`))},
  ${sql(lessonId)}, ${index + 1}, ${sql(reference)}
)
on conflict (id) do nothing;`)
  }

  for (const [index, objective] of lesson.learningObjectives.entries()) {
    statements.push(`insert into public.lesson_learning_objectives (
  id, lesson_id, sequence_number, objective
) values (
  ${sql(stableUuid(`objective:${lesson.id}:${index + 1}`))},
  ${sql(lessonId)}, ${index + 1}, ${sql(objective)}
)
on conflict (id) do nothing;`)
  }

  const discussionSectionId = stableUuid(`section:${lesson.id}:discussion`)
  for (const [index, point] of lesson.teachingPoints.entries()) {
    statements.push(`insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  ${sql(stableUuid(`section:${lesson.id}:teaching:${index + 1}`))},
  ${sql(lessonId)}, ${index + 1}, 'teaching_point', ${sql(point.title)},
  ${sql(point.studentContent)}
)
on conflict (id) do nothing;`)
  }

  statements.push(`insert into public.lesson_sections (
  id, lesson_id, sequence_number, section_kind, title, student_content
) values (
  ${sql(discussionSectionId)}, ${sql(lessonId)},
  ${lesson.teachingPoints.length + 1}, 'discussion', 'Discussion questions', ''
)
on conflict (id) do nothing;`)

  for (const [index, question] of lesson.discussionQuestions.entries()) {
    statements.push(`insert into public.lesson_discussion_questions (
  id, section_id, sequence_number, question
) values (
  ${sql(stableUuid(`question:${lesson.id}:${index + 1}`))},
  ${sql(discussionSectionId)}, ${index + 1}, ${sql(question)}
)
on conflict (id) do nothing;`)
  }
}

statements.push('commit;')
const seedDirectory = path.join(repositoryDirectory, 'supabase', 'seeds')
const outputPath = path.join(seedDirectory, 'original_word_and_way_studies.sql')
await mkdir(seedDirectory, { recursive: true })
await writeFile(outputPath, `${statements.join('\n\n')}\n`, 'utf8')
console.log(`Wrote ${lessons.length} draft studies to ${outputPath}`)
