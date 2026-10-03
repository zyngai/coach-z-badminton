import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const data = JSON.parse(readFileSync(new URL('../../tenants/satvik-vijit/sessions.json', import.meta.url), 'utf8'))
const session = data.sessions.find((s) => s.id === '2026-10-02')

test('Session 14 preserves six supplied clips and three drills in coach order', () => {
  assert.equal(session.date, '2026-10-02')
  assert.equal(session.drills.length, 3)
  assert.deepEqual(session.drills.flatMap((d) => d.videos.map((v) => v.url)), [
    'https://youtu.be/vMnc-8s1pSM', 'https://youtu.be/wjSHQt1jM4s',
    'https://youtu.be/WeRjpUjCZxs', 'https://youtu.be/GB89j7sB_5o',
    'https://youtu.be/0tojdUntFeo', 'https://youtu.be/cQfn5sIdgjQ',
  ])
})

test('Session 14 respects confirmed Unlisted settings without claiming videos are Private', () => {
  assert.equal(JSON.stringify(session).includes('Private'), false)
  assert.equal(JSON.stringify(session).includes('visibility changed'), false)
})

test('this week homework is scoped footwork with each students own check-in clip', () => {
  assert.equal(session.homework.length, 2)
  assert.deepEqual(session.homework.map((h) => h.students), [['satvik'], ['vijit']])
  assert.deepEqual(session.homework.map((h) => h.videos.map((v) => v.url)), [
    ['https://youtu.be/vMnc-8s1pSM'], ['https://youtu.be/wjSHQt1jM4s'],
  ])
})
