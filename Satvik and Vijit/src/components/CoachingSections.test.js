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
async function load(name, data) {
  const filename = fileURLToPath(new URL(name === 'App' ? '../App.jsx' : `./${name}.jsx`, import.meta.url))
  const result = await build({entryPoints:[filename],bundle:true,platform:'node',format:'cjs',jsx:'automatic',loader:{'.css':'empty'},external:['react','react-dom','react/jsx-runtime'],write:false, plugins:data ? [{name:'loaded-tenant-data',setup(b){b.onResolve({filter:/useSessionData$/},()=>({path:'loaded-data',namespace:'qa'}));b.onLoad({filter:/.*/,namespace:'qa'},()=>({contents:`export function useSessionData(){return {data:${JSON.stringify(data)},loading:false,error:null}}`,loader:'js'}))}}] : []})
  const m = new Module(filename); m.paths = Module._nodeModulePaths(dirname(filename)); m._compile(result.outputFiles[0].text,filename); return m.exports.default
}
test('both loaded tenant apps expose the three ordered closed main sections', async () => {
  for (const tenant of ['satvik-vijit','anamithraa']) {
    const data = JSON.parse(readFileSync(new URL(`../../tenants/${tenant}/sessions.json`, import.meta.url), 'utf8'))
    const App = await load('App',data)
    const html = renderToStaticMarkup(React.createElement(App))
    const h = html.indexOf('id="homework-library-title"')
    const c = html.indexOf('id="coaching-title"')
    const t = html.indexOf('id="tournaments-title"')
    assert.ok(h >= 0 && h < c && c < t,tenant)
    for (const id of ['homework-library','coaching','tournaments']) assert.match(html,new RegExp(`aria-expanded="false" aria-controls="${id}-content"`))
    assert.doesNotMatch(html, /<iframe/)
  }
})

test('session groups default collapsed with semantic buttons and inert bodies', async () => {
  const List = await load('SessionList')
  const html = renderToStaticMarkup(React.createElement(List,{sessions:[{id:'a',date:'2026-01-01',title:'Old',videos:[{url:'https://youtu.be/PjmuZfd2tIc',type:'youtube'}]},{id:'b',date:'2026-10-01',title:'New',videos:[{url:'https://youtu.be/PjmuZfd2tIc',type:'youtube'}]}],students:[],activeStudent:null,title:'Coaching Sessions',sectionId:'coaching',open:false,onToggle:()=>{}}))
  assert.match(html, /<button[^>]*aria-expanded="false"/)
  assert.match(html, />Coaching Sessions<\/h2>/)
  assert.match(html, /id="coaching-content"[^>]*inert=""/)
  assert.ok(html.indexOf('>New</h2>') < html.indexOf('>Old</h2>'))
  assert.doesNotMatch(html, /<iframe/)
})
