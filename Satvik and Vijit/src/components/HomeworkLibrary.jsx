import { useState } from 'react'
import '../styles/SessionCard.css'
import '../styles/HomeworkLibrary.css'
import '../styles/CoachingSections.css'
import { formatDate } from '../utils/dateUtils'
import { buildHomeworkMaterials, getHomeworkLibraryConfig, hasHomeworkLibraryOptIn } from '../utils/homeworkLibrary'
import VideoEmbed from './VideoEmbed'

export default function HomeworkLibrary({ dashboard, sessions, activeStudent, onRevealSource }) {
  const [open, setOpen] = useState(false)
  if (!hasHomeworkLibraryOptIn(dashboard)) return null
  const materials = buildHomeworkMaterials(sessions, getHomeworkLibraryConfig(dashboard), activeStudent)
  return (
    <section className="session-list homework-library" aria-labelledby="homework-library-title">
      <article className="session-card homework-library__card">
        <button type="button" className="session-card__header homework-library__toggle" aria-expanded={open} aria-controls="homework-library-content" onClick={() => setOpen(!open)}>
          <div className="session-card__header-left">
            <div className="session-card__date">Practice priorities &amp; reference clips</div>
            <h2 id="homework-library-title" className="session-card__title">Homework</h2>
          </div>
          <svg className={`session-card__chevron ${open ? 'session-card__chevron--open' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg>
        </button>
        <div id="homework-library-content" className={`session-card__body ${open ? 'session-card__body--open' : ''}`} inert={!open}>
          <div className="session-card__body-inner"><div className="session-card__content">
            <p className="session-card__summary">Current focus first. Repeated assignments are combined; original cues and source sessions remain available.</p>
            {!materials.length && <p className="session-card__summary">No homework assigned for this selection yet.</p>}
            {materials.map(material => (
              <details key={material.key} className="homework-library__group" open={material.current}>
                <summary className="homework-library__summary">
                  <span className="homework-library__session">{material.name}</span>
                  {material.current && <span className="homework-library__priority">Current focus</span>}
                </summary>
                <div className="homework-library__body">
                  <p className="session-card__summary">{material.description}</p>
                  {material.current && material.cues.length > 0 && <ul className="homework-library__cues">{material.cues.map((cue,i) => <li key={i}>{cue}</li>)}</ul>}
                  {material.videos.length > 0 && <div className="homework-library__videos">{material.videos.map(video => <VideoEmbed key={`${video.type}:${video.url}`} video={video} />)}</div>}
                  <details className="homework-library__sources">
                    <summary>Original cues &amp; source sessions ({material.sources.length})</summary>
                    {material.sources.map((source,i) => (
                      <div className="homework-library__source" key={`${source.sessionId}-${i}`}>
                        <p><strong>{source.title}</strong> · {source.dateLabel || formatDate(source.date)}</p>
                        <p>{source.homework.description}</p>
                        {source.homework.notes && <p>{source.homework.notes}</p>}
                        {source.homeworkNote && <p>{source.homeworkNote}</p>}
                        {source.homework.sourceReferenceNote && <p>{source.homework.sourceReferenceNote}</p>}
                        <button type="button" className="homework-library__source-link" onClick={() => onRevealSource?.(source.sessionId)}>Open source session</button>
                      </div>
                    ))}
                  </details>
                </div>
              </details>
            ))}
          </div></div>
        </div>
      </article>
    </section>
  )
}
