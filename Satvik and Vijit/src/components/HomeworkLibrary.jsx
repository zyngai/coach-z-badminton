import { useState } from 'react'
import '../styles/SessionCard.css'
import '../styles/HomeworkLibrary.css'
import { formatDate } from '../utils/dateUtils'
import { buildHomeworkLibraryGroups, getHomeworkLibraryConfig, hasHomeworkLibraryOptIn } from '../utils/homeworkLibrary'
import DrillItem from './DrillItem'
import VideoEmbed from './VideoEmbed'

export default function HomeworkLibrary({ dashboard, sessions, students, activeStudent }) {
  const [open, setOpen] = useState(false)
  if (!hasHomeworkLibraryOptIn(dashboard)) return null

  const config = getHomeworkLibraryConfig(dashboard)
  const groups = buildHomeworkLibraryGroups(sessions, config, activeStudent)
  if (groups.length === 0) return null

  return (
    <section className="session-list homework-library" aria-labelledby="homework-library-title">
      <article className="session-card homework-library__card">
        <button
          type="button"
          className="session-card__header homework-library__toggle"
          aria-expanded={open}
          aria-controls="homework-library-content"
          onClick={() => setOpen(!open)}
        >
          <div className="session-card__header-left">
            <div className="session-card__date">Practice &amp; reference videos</div>
            <h2 id="homework-library-title" className="session-card__title">Homework</h2>
          </div>
          <svg
            className={`session-card__chevron ${open ? 'session-card__chevron--open' : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        <div id="homework-library-content" className={`session-card__body ${open ? 'session-card__body--open' : ''}`} inert={!open}>
          <div className="session-card__body-inner">
            <div className="session-card__content">
              <p className="session-card__summary">
                This week’s homework comes first. Older assignments and their reference clips are grouped by session below.
              </p>
              {groups.map((group) => (
                <details key={group.sessionId} className="homework-library__group" open={group.expanded}>
                  <summary className="homework-library__summary">
                    <span className="session-card__date">{group.dateLabel || formatDate(group.date)}</span>
                    <span className="homework-library__session">{group.title}</span>
                  </summary>
                  <div className="homework-library__body">
                    {group.homework.map((homework, index) => (
                      <div key={`${group.sessionId}-${homework.name}-${index}`} className="homework-library__item">
                        <DrillItem drill={homework} students={students} number={index + 1} activeStudent={activeStudent} label="HW" />
                        {homework.sourceReferences.length > 0 && (
                          <div className="homework-library__source-references">
                            <p className="session-card__section-title">Source-session references</p>
                            {homework.sourceReferenceNote && (
                              <p className="homework-library__source-note">{homework.sourceReferenceNote}</p>
                            )}
                            <div className="homework-library__videos">
                              {homework.sourceReferences.map((video, videoIndex) => (
                                <VideoEmbed key={`${video.url}-${videoIndex}`} video={video} />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    {group.homeworkNote && (
                      <p className="session-card__homework-note">{group.homeworkNote}</p>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </article>
    </section>
  )
}
