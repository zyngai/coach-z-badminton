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
  const homework = filterItems(session.homework || [], activeStudent)
  const observations = filterItems(session.observations || [], activeStudent)

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
            {session.takeaway && (
              <div className="session-card__takeaway">
                <h3 className="session-card__section-title">Main Takeaway</h3>
                <p className="session-card__takeaway-text">{session.takeaway}</p>
              </div>
            )}

            {session.summary && (
              <p className="session-card__summary">{session.summary}</p>
            )}

            {observations.length > 0 && (
              <div className="session-card__section session-card__observations">
                <h3 className="session-card__section-title">
                  <span className="session-card__observations-icon">&#9888;</span>
                  Critical Observations — Focus for Next Sessions
                </h3>
                <ul className="session-card__observations-list">
                  {observations.map((obs, i) => (
                    <li key={i} className="session-card__observation">
                      <span className="session-card__observation-text">{obs.text}</span>
                      {obs.students?.length > 0 && obs.students.length < students.length && (
                        <span className="tip-item__badges">
                          {obs.students.map((sid) => {
                            const student = students.find((s) => s.id === sid)
                            return student ? (
                              <span
                                key={sid}
                                className="student-badge"
                                style={{ backgroundColor: student.avatarColor }}
                              >
                                {student.name}
                              </span>
                            ) : null
                          })}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {drills.length > 0 && (
              <div className="session-card__section">
                <h3 className="session-card__section-title">Drills</h3>
                {drills.map((drill, i) => (
                  <DrillItem key={i} drill={drill} students={students} number={i + 1} activeStudent={activeStudent} />
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

            {homework.length > 0 && (
              <div className="session-card__section session-card__homework">
                <h3 className="session-card__section-title">
                  <span className="session-card__homework-icon">&#9998;</span>
                  Homework
                </h3>
                {homework.map((hw, i) => (
                  <DrillItem key={i} drill={hw} students={students} number={i + 1} activeStudent={activeStudent} label="HW" />
                ))}
                {session.homeworkNote && (
                  <p className="session-card__homework-note">{session.homeworkNote}</p>
                )}
              </div>
            )}

            {session.closingImage && (
              <div className="session-card__closing-image">
                <img
                  src={session.closingImage.src}
                  alt={session.closingImage.alt}
                  className="session-card__closing-img"
                />
                {session.closingImage.caption && (
                  <p className="session-card__closing-caption">{session.closingImage.caption}</p>
                )}
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
