import { useState } from 'react'
import '../styles/SessionCard.css'
import { formatDate } from '../utils/dateUtils'
import { filterItems } from '../utils/filters'
import DrillItem from './DrillItem'
import TipItem from './TipItem'
import VideoEmbed from './VideoEmbed'

export default function SessionCard({ session, students, activeStudent }) {
  const [open, setOpen] = useState(false)

  const drills = filterItems(session.drills || [], activeStudent)
  const tips = filterItems(session.tips || [], activeStudent)
  const videos = filterItems(session.videos || [], activeStudent)

  return (
    <article className="session-card">
      <div className="session-card__header" onClick={() => setOpen(!open)}>
        <div className="session-card__header-left">
          <div className="session-card__date">{formatDate(session.date)}</div>
          <h2 className="session-card__title">{session.title}</h2>
        </div>
        <svg
          className={`session-card__chevron ${open ? 'session-card__chevron--open' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      <div className={`session-card__body ${open ? 'session-card__body--open' : ''}`}>
        <div className="session-card__body-inner">
          <div className="session-card__content">
            {session.summary && (
              <p className="session-card__summary">{session.summary}</p>
            )}

            {drills.length > 0 && (
              <div className="session-card__section">
                <h3 className="session-card__section-title">Drills</h3>
                {drills.map((drill, i) => (
                  <DrillItem key={i} drill={drill} students={students} />
                ))}
              </div>
            )}

            {tips.length > 0 && (
              <div className="session-card__section">
                <h3 className="session-card__section-title">Tips & Pointers</h3>
                {tips.map((tip, i) => (
                  <TipItem key={i} tip={tip} students={students} />
                ))}
              </div>
            )}

            {videos.length > 0 && (
              <div className="session-card__section">
                <h3 className="session-card__section-title">Videos</h3>
                {videos.map((video, i) => (
                  <VideoEmbed key={i} video={video} />
                ))}
              </div>
            )}

            {session.tags?.length > 0 && (
              <div className="session-card__tags">
                {session.tags.map((tag) => (
                  <span key={tag} className="session-card__tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
