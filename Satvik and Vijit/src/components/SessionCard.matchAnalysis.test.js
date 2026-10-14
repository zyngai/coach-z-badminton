import test from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'
import { build } from 'esbuild'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const require = createRequire(import.meta.url)
const Module = require('node:module')
const filename = fileURLToPath(new URL('./SessionCard.jsx', import.meta.url))
const result = await build({
  entryPoints: [filename],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  jsx: 'automatic',
  loader: { '.css': 'empty' },
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  write: false,
})
const compiled = new Module(filename)
compiled.paths = Module._nodeModulePaths(dirname(filename))
compiled._compile(result.outputFiles[0].text, filename)
const SessionCard = compiled.exports.default

const data = JSON.parse(readFileSync(new URL('../../tenants/anamithraa/sessions.json', import.meta.url), 'utf8'))
const students = data.students
const render = (session) => renderToStaticMarkup(React.createElement(SessionCard, { session, students, activeStudent: null }))
const juniorNationals = data.sessions.find((s) => s.id === '2026-07-08')
const fortiusSouth = data.sessions.find((s) => s.id === '2026-10-03')

test('source navigation can open the exact session card and offers keyboard controls', () => {
  const html = renderToStaticMarkup(React.createElement(SessionCard, {session:juniorNationals,students,forceOpen:true}))
  assert.match(html, /id="session-2026-07-08"/)
  assert.match(html, /<button[^>]*aria-expanded="true"/)
  assert.match(html, /class="session-card__body session-card__body--open"/)
})

test('Fortius review renders seven concise semantic bullets while keeping old reviews compatible', () => {
  assert.equal(fortiusSouth.coachCommentBullets?.length, 7)
  const html = render(fortiusSouth)
  assert.match(html, /<ul class="session-card__review-bullets">/)
  assert.equal((html.match(/<li class="session-card__review-bullet"/g) || []).length, 7)
  assert.match(html, /second game/i)
  assert.match(render(juniorNationals), /<p>/)
})

test('Fortius South review data excludes private training plan and keeps approved metadata/video', () => {
  assert.ok(fortiusSouth, 'expected Fortius South review entry to exist')
  assert.equal(fortiusSouth.entryType, 'match-analysis')
  assert.equal(fortiusSouth.date, '2026-10-03')
  assert.equal(fortiusSouth.dateLabel, 'October 3–4, 2026')
  assert.equal(fortiusSouth.title, '2026 Fortius South OLC Badminton Tournament')
  assert.equal(Object.hasOwn(fortiusSouth, 'trainingPlan'), false)
  assert.equal(JSON.stringify(fortiusSouth).includes('Overhead-corner footwork and balanced contact'), false)
  assert.deepEqual(fortiusSouth.videos, [
    {
      title: 'Fortius OLC — Singles Match',
      url: 'https://www.youtube.com/live/PjmuZfd2tIc?feature=shared',
      type: 'youtube',
      students: ['anamithraa'],
    },
  ])
})

test('match-analysis card hides training plan only when omitted, preserves explicit prior plan, and lazy-loads embeds', () => {
  assert.ok(juniorNationals?.trainingPlan, 'expected prior Junior Nationals training plan fixture')
  const fortiusHtml = render(fortiusSouth)
  assert.match(fortiusHtml, /Tournament Match Analysis/)
  assert.match(fortiusHtml, /October 3–4, 2026/)
  assert.match(fortiusHtml, /Fortius OLC — Singles Match/)
  assert.match(fortiusHtml, /i\.ytimg\.com\/vi\/PjmuZfd2tIc\/hqdefault\.jpg/)
  assert.doesNotMatch(fortiusHtml, /Training Plan/)
  assert.doesNotMatch(fortiusHtml, /\bTBD\b/)
  assert.doesNotMatch(fortiusHtml, /<iframe\b/)

  const juniorHtml = render(juniorNationals)
  assert.match(juniorHtml, /Training Plan/)
  assert.match(juniorHtml, /Forearm pronation → hit the clear consistently/)
  assert.doesNotMatch(juniorHtml, /<iframe\b/)
})
