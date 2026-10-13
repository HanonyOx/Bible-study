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
  const localRequire = (specifier) =>
    specifier.startsWith('.')
      ? loadTypeScriptModule(
          path.relative(
            webRoot,
            path.resolve(path.dirname(sourcePath), `${specifier}.ts`),
          ),
          cache,
        )
      : require(specifier)
  new Function('exports', 'require', 'module', compiled)(
    module.exports,
    localRequire,
    module,
  )
  return module.exports
}

const storage = loadTypeScriptModule('src/features/bible/bibleStorage.ts')

test('Bible personal data uses a separate browser-storage key for each account', () => {
  const previousWindow = globalThis.window
  const values = new Map()
  globalThis.window = {
    localStorage: {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value),
    },
  }

  try {
    const accountA = {
      bookmarks: [
        {
          id: 'bookmark-a',
          bookId: 'GEN',
          bookName: 'Genesis',
          chapter: 1,
          verse: 1,
          translationId: 'BSB',
          translationName: 'Berean Standard Bible',
          createdAt: '2026-01-01T00:00:00.000Z',
        },
      ],
      highlights: [],
      notes: [],
      progress: { lastRead: null, completedChapters: [] },
    }

    assert.notEqual(
      storage.getBiblePersonalDataStorageKey('user-a'),
      storage.getBiblePersonalDataStorageKey('user-b'),
    )
    assert.equal(storage.saveBiblePersonalData(accountA, 'user-a'), null)
    assert.deepEqual(storage.loadBiblePersonalData('user-a').data, accountA)
    assert.deepEqual(storage.loadBiblePersonalData('user-b').data.bookmarks, [])
    assert.equal(storage.saveBiblePersonalData(accountA, null)?.includes('not saved'), true)
    assert.equal(storage.loadBiblePersonalData(null).data.bookmarks.length, 0)
  } finally {
    if (previousWindow === undefined) {
      delete globalThis.window
    } else {
      globalThis.window = previousWindow
    }
  }
})
