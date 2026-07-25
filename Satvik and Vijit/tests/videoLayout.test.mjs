import assert from 'node:assert/strict'
import test from 'node:test'

import { getDrillVideosClass } from '../src/utils/videoLayout.js'

test('uses a scoped side-by-side class for comparison drills', () => {
  assert.equal(
    getDrillVideosClass('side-by-side'),
    'drill-item__videos drill-item__videos--side-by-side',
  )
})

test('keeps the existing stacked layout for ordinary drills', () => {
  assert.equal(getDrillVideosClass(), 'drill-item__videos')
})
