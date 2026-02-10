import SessionCard from './SessionCard'
import EmptyState from './EmptyState'
import { hasVisibleContent } from '../utils/filters'

export default function SessionList({ sessions, students, activeStudent }) {
  const visible = sessions.filter((s) => hasVisibleContent(s, activeStudent))

  if (visible.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="session-list">
      {visible.map((session) => (
        <SessionCard
          key={session.id}
          session={session}
          students={students}
          activeStudent={activeStudent}
        />
      ))}
    </div>
  )
}
