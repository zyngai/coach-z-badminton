import SessionCard from './SessionCard'
import { hasVisibleContent } from '../utils/filters'
import '../styles/CoachingSections.css'

export default function SessionList({ sessions, students, activeStudent, suppressHomework = false, title = 'Coaching Sessions', sectionId = 'coaching', open = false, onToggle, selectedSession, onClearSelection }) {
  const visible = sessions.filter((s) => hasVisibleContent(s, activeStudent) || s.entryType === 'match-analysis' || s.homework?.some(h => !activeStudent || !h.students?.length || h.students.includes(activeStudent)))
    .sort((a,b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id))
  return (
    <section className={`session-list coaching-section coaching-section--${sectionId}`} aria-labelledby={`${sectionId}-title`}>
      <article className="session-card coaching-section__card">
        <button type="button" className="session-card__header coaching-section__toggle" aria-expanded={open} aria-controls={`${sectionId}-content`} onClick={onToggle}>
          <div className="session-card__header-left">
            <div className="session-card__date">{visible.length} {sectionId === 'tournaments' ? 'reviews' : 'sessions'} · Newest first</div>
            <h2 id={`${sectionId}-title`} className="session-card__title">{title}</h2>
          </div>
          <svg className={`session-card__chevron ${open ? 'session-card__chevron--open' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg>
        </button>
        <div id={`${sectionId}-content`} className={`session-card__body ${open ? 'session-card__body--open' : ''}`} inert={!open}>
          <div className="session-card__body-inner"><div className="session-card__content">
            {visible.length ? visible.map(session => <SessionCard key={session.id} session={session} students={students} activeStudent={activeStudent} suppressHomework={suppressHomework} forceOpen={selectedSession === session.id} onClearSelection={onClearSelection} />) : <p className="session-card__summary">{sectionId === 'tournaments' ? 'No tournament reviews yet.' : 'No coaching sessions for this selection.'}</p>}
          </div></div>
        </div>
      </article>
    </section>
  )
}
