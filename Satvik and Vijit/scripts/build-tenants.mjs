#!/usr/bin/env node
/*
 * Multi-tenant build.
 *
 * Reads tenants/registry.json and produces, for each tenant:
 *   - a Vite build with the correct `base` (so asset URLs resolve under its subpath)
 *   - that tenant's data copied to <out>/data/sessions.json
 *
 * Output layout (combined into one dist/ for GitHub Pages):
 *   dist/                      -> root tenant (Satvik & Vijit)  -> /coach-z-badminton/
 *   dist/<slug>/               -> each non-root tenant          -> /coach-z-badminton/<slug>/
 *
 * Adding a student later = drop tenants/<id>/sessions.json + one registry entry.
 * No code changes.
 */
import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, rmSync, cpSync, readFileSync, copyFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const registry = JSON.parse(readFileSync(join(root, 'tenants', 'registry.json'), 'utf8'))
const finalDist = join(root, 'dist')

// Start clean.
rmSync(finalDist, { recursive: true, force: true })
mkdirSync(finalDist, { recursive: true })

for (const t of registry.tenants) {
  const dataFile = join(root, 'tenants', t.data)
  if (!existsSync(dataFile)) {
    console.error(`\n[skip] ${t.id}: data file missing -> ${t.data}`)
    continue
  }

  const tmpOut = join(root, '.tenant-build', t.id)
  rmSync(tmpOut, { recursive: true, force: true })

  console.log(`\n=== Building tenant: ${t.id}  (base ${t.basePath}) ===`)
  execSync('npx vite build', {
    cwd: root,
    stdio: 'inherit',
    env: {
      ...process.env,
      VITE_BASE: t.basePath,
      VITE_DATA_PATH: `${t.basePath}data/sessions.json`,
      TENANT_OUT_DIR: tmpOut,
    },
  })

  // Inject this tenant's data as the served sessions.json.
  mkdirSync(join(tmpOut, 'data'), { recursive: true })
  copyFileSync(dataFile, join(tmpOut, 'data', 'sessions.json'))

  // Place into the combined dist: root tenant at top level, others under their slug.
  const dest = t.root ? finalDist : join(finalDist, t.slug)
  mkdirSync(dest, { recursive: true })
  cpSync(tmpOut, dest, { recursive: true })
  console.log(`    -> ${t.root ? 'dist/' : 'dist/' + t.slug + '/'}`)
}

console.log('\nMulti-tenant build complete.')
console.log('Tenants:')
for (const t of registry.tenants) {
  console.log(`  - ${t.name.padEnd(16)} ${t.basePath}`)
}

// If no tenant occupies the site root, write a minimal placeholder there so the
// bare URL doesn't 404 and reveals nothing about who the dashboards belong to.
const hasRoot = registry.tenants.some((t) => t.root)
if (!hasRoot && !existsSync(join(finalDist, 'index.html'))) {
  const placeholder = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Coach Z Badminton Training</title>
<style>
  html,body{height:100%;margin:0}
  body{display:flex;align-items:center;justify-content:center;
    font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
    background:#0b0f14;color:#9CA3AF}
  .card{text-align:center;padding:2rem}
  h1{font-size:1.1rem;color:#e5e7eb;margin:0 0 .25rem}
  p{font-size:.85rem;margin:0}
</style>
</head>
<body>
  <div class="card">
    <h1>Coach Z Badminton Training</h1>
    <p>Private training dashboards. Access is by direct link only.</p>
  </div>
</body>
</html>
`
  mkdirSync(finalDist, { recursive: true })
  writeFileSync(join(finalDist, 'index.html'), placeholder)
  console.log('\nWrote root placeholder (no tenant occupies root).')
}

