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
