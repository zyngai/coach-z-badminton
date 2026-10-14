import { filterItems } from './filters.js'

export function getHomeworkLibraryConfig(dashboard = {}) {
  return dashboard.homeworkLibrary || {}
}

export function hasHomeworkLibraryOptIn(dashboard = {}) {
  return getHomeworkLibraryConfig(dashboard).enabled === true
}

export function shouldSuppressSessionHomework(dashboard = {}) {
  const config = getHomeworkLibraryConfig(dashboard)
  return config.enabled === true && config.suppressSessionHomework !== false
}

function cloneVisibleVideos(videos = [], activeStudent) {
  return filterItems(videos, activeStudent).map((video) => ({ ...video }))
}

function findSourceReference(config, sessionId, homeworkName) {
  const references = config.sourceReferences?.[sessionId] || []
  return references.find((ref) => ref.homeworkName === homeworkName) || null
}

export function buildHomeworkLibraryGroups(sessions = [], config = {}, activeStudent = null) {
  if (config.enabled !== true) return []

  return [...sessions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map((session) => {
      const homework = filterItems(session.homework || [], activeStudent).map((item) => {
        const sourceReference = findSourceReference(config, session.id, item.name)
        return {
          ...item,
          videos: cloneVisibleVideos(item.videos || [], activeStudent),
          sourceReferences: cloneVisibleVideos(sourceReference?.videos || [], activeStudent),
          sourceReferenceNote: sourceReference?.note || '',
        }
      })

      return {
        sessionId: session.id,
        date: session.date,
        dateLabel: session.dateLabel,
        title: session.title,
        homeworkNote: session.homeworkNote || '',
        homework,
      }
    })
    .filter((group) => group.homework.length > 0)
    .map((group, index) => ({
      ...group,
      expanded: index === 0,
    }))
}

// Normalize only known carry-forward aliases; distinct drills/progressions stay separate.
function materialName(name) {
  const base = name.replace(/\s*\((?:Revisited|Carried Forward) from Session \d+\)\s*$/i, '').trim()
  if (base === 'Jump Skip — Single Skips, then Double Skips' || base === 'Jump Skip — Single & Double') return 'Jump Skip — Single & Double'
  return base
}

const shortDescriptions = {
  'Dynamic Warm-Up Drills': 'Follow the reference warm-up before practice; use controlled movements and full range of motion.',
  'Jump Skip — Single & Double': 'Daily rope practice: 1–2 minutes of clean singles, then doubles when ready. Bounce from the ankles and calves, not lifted knees.',
  'Lower-Body Strength — Squats & Lunges': 'Daily bodyweight squats and lunges: controlled, full-range reps with an upright torso and aligned knees.',
  'Lunges — Strength & Stability': 'Practice forward, lateral and walking lunges with an upright torso and front knee aligned over the ankle.',
  'Full Court Shadow Movement': 'Shadow the court to directional cues: split-step, move cleanly, and recover under control.',
  'Shadow Footwork — Slow & Committed': 'Shadow rear-court movement slowly: take the needed steps, without sliding or jumping early.',
  'Dynamic Rectangle Footwork Drill': 'Pick up, backpedal, chasse across, run forward to place the shuttle, then side-step back. Stay low and balanced.',
  'Quick First Step to Six-Corner Lunges': 'Push off decisively to each corner and finish balanced. Clean mechanics before speed.',
  'Parallel Side-Shuffle Repetition': 'Shuffle in both directions with a low base, parallel feet and steady rhythm; do not cross your feet.',
  'Front-to-Back Footwork Repetition': 'Repeat the reference front-to-back pattern: low base, controlled first step, balanced arrival and recovery.',
  'Rear-Court Footwork Reset — Both Corners': 'Practice both rear-court corners slowly: low base, push-off, sideways preparation, balanced finish and recovery.',
  'Dynamic Footwork Drill': 'Practice the reference footwork at home to develop timing, rhythm and sharper court movement.',
  'Forearm Pronation in Overhead Swings': 'Practice relaxed forearm rotation for overhead swings. Smooth, correct repetitions before power.',
  'Front-to-Back Shuttle Throw': 'Repeat the reference movement with smooth travel, balance and lower-body support for the throw.',
  'Front-to-Back Footwork with Visualization': 'Picture the shuttle: accelerate through travel, slow before arrival, finish balanced and recover.',
  "Study Saina Nehwal's Match Movement": 'Study changes of speed, first-step timing, balance and recovery. Bring one movement pattern to discuss.',
  'Rear-Court Corner Footwork — Both Sides': 'Practice both corners slowly: split-step, push-off, efficient travel, early racket preparation and balanced recovery.',
}

function uniqueVideos(videos) {
  const result = new Map()
  for (const video of videos) {
    // Preserve time-marked references as distinct clips.
    const key = `${video.type}:${video.url}`
    if (!result.has(key)) result.set(key, { ...video, students: [...(video.students || [])] })
    else {
      const existing = result.get(key)
      existing.students = !existing.students.length || !video.students?.length ? [] : [...new Set([...existing.students, ...video.students])]
    }
  }
  return [...result.values()]
}

export function buildHomeworkMaterials(sessions = [], config = {}, activeStudent = null) {
  const groups = buildHomeworkLibraryGroups(sessions, config, activeStudent)
  const newestId = groups[0]?.sessionId
  const materials = new Map()
  for (const group of groups) {
    for (const item of group.homework) {
      const name = materialName(item.name)
      // Keep individual assignments distinct, including in the All-students view.
      const scope = [...(item.students || [])].sort().join(',')
      const key = `${name}:${scope}`
      if (!materials.has(key)) materials.set(key, {
        key, name, students: [...(item.students || [])], current: group.sessionId === newestId,
        description: shortDescriptions[name] || item.description?.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim() || item.description || '',
        cues: (item.notes?.match(/[^.!?]+[.!?](?:\s|$)|[^.!?]+$/g) || []).slice(0, 2).map(s => s.trim()),
        videos: [], sources: [],
      })
      const material = materials.get(key)
      material.videos.push(...item.videos, ...item.sourceReferences)
      material.sources.push({ sessionId: group.sessionId, date: group.date, dateLabel: group.dateLabel, title: group.title, homeworkNote: group.homeworkNote, homework: item })
    }
  }
  return [...materials.values()].map(m => ({ ...m, videos: uniqueVideos(m.videos) }))
}
