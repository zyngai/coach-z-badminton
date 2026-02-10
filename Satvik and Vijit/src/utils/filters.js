export function filterItems(items, activeStudent) {
  if (!activeStudent) return items
  return items.filter(
    (item) => !item.students?.length || item.students.includes(activeStudent)
  )
}

export function hasVisibleContent(session, activeStudent) {
  const drills = filterItems(session.drills || [], activeStudent)
  const tips = filterItems(session.tips || [], activeStudent)
  const videos = filterItems(session.videos || [], activeStudent)
  return drills.length > 0 || tips.length > 0 || videos.length > 0
}
