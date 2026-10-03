import test from 'node:test'
import assert from 'node:assert/strict'
import {
  buildHomeworkLibraryGroups,
  getHomeworkLibraryConfig,
  hasHomeworkLibraryOptIn,
  shouldSuppressSessionHomework,
} from './homeworkLibrary.js'

const students = [
  { id: 'satvik', name: 'Satvik', avatarColor: '#2563EB' },
  { id: 'vijit', name: 'Vijit', avatarColor: '#DC2626' },
]

function sampleData() {
  return {
    dashboard: {
      homeworkLibrary: {
        enabled: true,
        suppressSessionHomework: true,
        sourceReferences: {
          '2026-08-07': [
            {
              homeworkName: 'Rear-Court Footwork Reset — Both Corners',
              note: 'Use these source-session references so the old “Drill 1 / Drill 2” pointer still works in the library.',
              videos: [
                { title: 'Drill 1 source clip', url: 'https://youtu.be/source1', type: 'youtube', students: ['satvik', 'vijit'] },
                { title: 'Drill 2 source reference', url: 'https://youtu.be/source2', type: 'youtube', students: [] },
              ],
            },
          ],
        },
      },
    },
    students,
    sessions: [
      {
        id: '2026-10-02',
        date: '2026-10-02',
        title: 'Session 14 — Newest',
        homework: [
          {
            name: 'Satvik cue',
            description: 'Record your own clip.',
            students: ['satvik'],
            videos: [{ title: 'Satvik own clip', url: 'https://youtu.be/satvik', type: 'youtube', students: ['satvik'] }],
          },
          {
            name: 'Vijit cue',
            description: 'Record your own clip.',
            students: ['vijit'],
            videos: [{ title: 'Vijit own clip', url: 'https://youtu.be/vijit', type: 'youtube', students: ['vijit'] }],
          },
        ],
        homeworkNote: 'Newest note.',
      },
      {
        id: '2026-08-07',
        date: '2026-08-07',
        title: 'Session 12 — Historical',
        homework: [
          {
            name: 'Rear-Court Footwork Reset — Both Corners',
            description: 'Use Drill 1 and Drill 2 above.',
            students: ['satvik', 'vijit'],
            notes: 'Quality first.',
          },
        ],
      },
      {
        id: '2026-09-04',
        date: '2026-09-04',
        title: 'Session 13 — No Homework',
        drills: [{ name: 'Do not pull random drill clips', videos: [{ title: 'Irrelevant', url: 'https://youtu.be/nope', type: 'youtube', students: [] }] }],
      },
    ],
  }
}

test('homework library requires explicit dashboard opt-in', () => {
  assert.equal(hasHomeworkLibraryOptIn({}), false)
  assert.equal(hasHomeworkLibraryOptIn({ homeworkLibrary: { enabled: false } }), false)
  assert.equal(hasHomeworkLibraryOptIn({ homeworkLibrary: { enabled: true } }), true)
  assert.equal(shouldSuppressSessionHomework({ homeworkLibrary: { enabled: true } }), true)
  assert.equal(shouldSuppressSessionHomework({ homeworkLibrary: { enabled: true, suppressSessionHomework: false } }), false)
})

test('aggregates actual homework newest-first without mutating sessions', () => {
  const data = sampleData()
  const before = JSON.stringify(data.sessions)
  const groups = buildHomeworkLibraryGroups(data.sessions, getHomeworkLibraryConfig(data.dashboard), null)

  assert.deepEqual(groups.map((group) => group.sessionId), ['2026-10-02', '2026-08-07'])
  assert.equal(groups[0].expanded, true)
  assert.equal(groups[1].expanded, false)
  assert.deepEqual(groups.map((group) => group.homework.length), [2, 1])
  assert.equal(JSON.stringify(data.sessions), before)
})

test('filters homework and source references by student', () => {
  const data = sampleData()
  const groups = buildHomeworkLibraryGroups(data.sessions, getHomeworkLibraryConfig(data.dashboard), 'satvik')

  assert.deepEqual(groups.map((group) => group.sessionId), ['2026-10-02', '2026-08-07'])
  assert.deepEqual(groups[0].homework.map((item) => item.name), ['Satvik cue'])
  assert.deepEqual(groups[0].homework[0].videos.map((video) => video.title), ['Satvik own clip'])
  assert.deepEqual(groups[1].homework[0].sourceReferences.map((video) => video.title), ['Drill 1 source clip', 'Drill 2 source reference'])
})

test('uses explicit source references for stranded historical pointers without pulling unrelated clips', () => {
  const data = sampleData()
  const groups = buildHomeworkLibraryGroups(data.sessions, getHomeworkLibraryConfig(data.dashboard), null)
  const historical = groups.find((group) => group.sessionId === '2026-08-07')

  assert.equal(historical.homework[0].videos.length, 0)
  assert.deepEqual(historical.homework[0].sourceReferences.map((video) => video.url), [
    'https://youtu.be/source1',
    'https://youtu.be/source2',
  ])
  assert.equal(JSON.stringify(groups).includes('https://youtu.be/nope'), false)
})
