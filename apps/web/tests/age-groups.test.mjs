import assert from 'node:assert/strict'
import test from 'node:test'
import { getAgeGroupForDateOfBirth } from '../src/features/auth/ageGroups.mjs'

const today = new Date('2026-10-17T00:00:00.000Z')

test('age bands use the birthday and requested boundaries', () => {
  assert.equal(getAgeGroupForDateOfBirth('2025-10-17', today), 'children')
  assert.equal(getAgeGroupForDateOfBirth('2014-10-18', today), 'children')
  assert.equal(getAgeGroupForDateOfBirth('2014-10-17', today), 'children')
  assert.equal(getAgeGroupForDateOfBirth('2013-10-17', today), 'teens')
  assert.equal(getAgeGroupForDateOfBirth('2007-10-17', today), 'teens')
  assert.equal(getAgeGroupForDateOfBirth('2006-10-17', today), 'adults')
})

test('invalid and future dates do not produce an age band', () => {
  assert.equal(getAgeGroupForDateOfBirth('', today), null)
  assert.equal(getAgeGroupForDateOfBirth('2026-10-17', today), null)
  assert.equal(getAgeGroupForDateOfBirth('2026-02-30', today), null)
  assert.equal(getAgeGroupForDateOfBirth('2026-10-18', today), null)
  assert.equal(getAgeGroupForDateOfBirth('2025-10-18', today), null)
  assert.equal(getAgeGroupForDateOfBirth('not-a-date', today), null)
})
