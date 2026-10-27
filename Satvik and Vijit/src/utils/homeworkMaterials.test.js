import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import * as library from './homeworkLibrary.js'
const load = t => JSON.parse(readFileSync(new URL(`../../tenants/${t}/sessions.json`, import.meta.url), 'utf8'))
const data = load('satvik-vijit')
test('material-first library merges true repeats without changing homework history', () => {
  assert.equal(typeof library.buildHomeworkMaterials, 'function')
  const before = JSON.stringify(data)
  const materials = library.buildHomeworkMaterials(data.sessions, data.dashboard.homeworkLibrary)
  assert.equal(materials.length, 13)
  assert.equal(materials.filter(m => m.name === 'Dynamic Warm-Up Drills').length, 1)
  assert.equal(materials.find(m => m.name === 'Dynamic Warm-Up Drills').sources.length, 5)
  assert.equal(materials.find(m => m.name === 'Dynamic Warm-Up Drills').videos.length, 1)
  assert.equal(materials.filter(m => m.current).length, 2)
  assert.equal(materials.reduce((n,m) => n+m.sources.length, 0), data.sessions.reduce((n,s) => n+(s.homework?.length || 0), 0))
  assert.equal(JSON.stringify(data), before)
})

test('student filtering retains own latest cue/clip and shared references only', () => {
  for (const student of ['satvik','vijit']) {
    const other = student === 'satvik' ? 'vijit' : 'satvik'
    const materials = library.buildHomeworkMaterials(data.sessions, data.dashboard.homeworkLibrary, student)
    assert.equal(materials.filter(m => m.current).length, 1)
    assert.ok(materials.find(m => m.current).name.toLowerCase().includes(student))
    assert.ok(materials.every(m => m.videos.every(v => !v.students?.length || v.students.includes(student))))
    assert.ok(materials.every(m => m.sources.every(s => !s.homework.students?.length || s.homework.students.includes(student))))
    assert.ok(!materials.some(m => m.name.toLowerCase().startsWith(other)))
    const bothCorners = materials.find(m => m.name === 'Rear-Court Footwork Reset — Both Corners')
    assert.equal(bothCorners.videos.length, 4)
    assert.ok(bothCorners.sources[0].homework.notes.includes('right-to-left'))
  }
})

test('Anu repeated materials merge while distinct progression and source pointers survive', () => {
  const anu = load('anamithraa')
  const before = JSON.stringify(anu)
  const materials = library.buildHomeworkMaterials(anu.sessions, anu.dashboard.homeworkLibrary, 'anamithraa')
  assert.equal(materials.length, 6)
  assert.equal(materials[0].current, true)
  assert.equal(materials[0].name, 'Rear-Court Corner Footwork — Both Sides')
  assert.equal(materials[0].sources[0].sessionId, '2026-10-23')
  assert.match(materials[0].cues[0], /shuffling/)
  assert.equal(materials[0].sources[1].sessionId, '2026-08-07')
  assert.match(materials[0].sources[1].homework.description, /Drills 3 and 4/)
  assert.equal(materials.find(m => m.name === 'Dynamic Footwork Drill').sources.length, 2)
  assert.equal(materials.find(m => m.name === 'Dynamic Footwork Drill').videos.length, 1)
  assert.ok(materials.some(m => m.name === 'Front-to-Back Shuttle Throw'))
  assert.ok(materials.some(m => m.name === 'Front-to-Back Footwork with Visualization'))
  assert.equal(materials.reduce((n,m) => n+m.sources.length, 0), 9)
  assert.equal(JSON.stringify(anu), before)
})
