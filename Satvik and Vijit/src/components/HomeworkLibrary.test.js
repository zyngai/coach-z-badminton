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
const filename = fileURLToPath(new URL('./HomeworkLibrary.jsx', import.meta.url))
const result = await build({ entryPoints: [filename], bundle: true, platform: 'node', format: 'cjs', jsx: 'automatic', loader: { '.css': 'empty' }, external: ['react', 'react-dom', 'react/jsx-runtime'], write: false })
const compiled = new Module(filename)
compiled.paths = Module._nodeModulePaths(dirname(filename))
compiled._compile(result.outputFiles[0].text, filename)
const HomeworkLibrary = compiled.exports.default
const data = JSON.parse(readFileSync(new URL('../../tenants/satvik-vijit/sessions.json', import.meta.url), 'utf8'))
const render = (dashboard = data.dashboard) => renderToStaticMarkup(React.createElement(HomeworkLibrary, { dashboard, sessions: data.sessions, students: data.students, activeStudent: null }))

test('Homework uses the existing session card shell and starts collapsed', () => {
  const html = render()
  assert.match(html, /class="session-card homework-library__card"/)
  assert.match(html, /class="session-card__header homework-library__toggle"[^>]*aria-expanded="false"/)
  assert.match(html, /class="session-card__body "/)
  assert.match(html, /class="session-card__chevron "/)
  assert.match(html, /id="homework-library-title" class="session-card__title">Homework/)
})

test('Homework renders no initial video iframes and remains tenant opt-in', () => {
  assert.doesNotMatch(render(), /<iframe\b/)
  assert.equal(render({}), '')
})
