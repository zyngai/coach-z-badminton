import { useState } from 'react'
import '../styles/VideoEmbed.css'

function getYouTubeId(url) {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  )
  return match ? match[1] : null
}

function getGDriveId(url) {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/)
  return match ? match[1] : null
}

export default function VideoEmbed({ video }) {
  // Facade pattern: render a lightweight poster + play button, and only mount
  // the real (heavy) iframe after the user clicks. This keeps the page fast and
  // stable even when a session has many videos — nothing loads until requested.
  const [active, setActive] = useState(false)
  const title = video.title || 'Video'

  let embedSrc = null
  let poster = null

  if (video.type === 'youtube') {
    const id = getYouTubeId(video.url)
    if (id) {
      embedSrc = `https://www.youtube.com/embed/${id}?autoplay=1`
      poster = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
    }
  } else if (video.type === 'gdrive') {
    const id = getGDriveId(video.url)
    if (id) {
      embedSrc = `https://drive.google.com/file/d/${id}/preview`
      // Drive thumbnail endpoint; falls back to a plain play card if it 404s.
      poster = `https://drive.google.com/thumbnail?id=${id}&sz=w640`
    }
  }

  // Unrecognized URL: plain link, no iframe.
  if (!embedSrc) {
    return (
      <div className="video-embed">
        <a
          className="video-embed__link"
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          &#9654; {video.title || 'Watch Video'}
        </a>
      </div>
    )
  }

  return (
    <div className="video-embed">
      {video.title && <p className="video-embed__title">{video.title}</p>}
      <div className="video-embed__wrapper">
        {active ? (
          <iframe
            src={embedSrc}
            title={title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            className="video-embed__facade"
            onClick={() => setActive(true)}
            aria-label={`Play ${title}`}
          >
            {poster && (
              <img
                className="video-embed__poster"
                src={poster}
                alt=""
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            )}
            <span className="video-embed__play">
              <svg viewBox="0 0 68 48" width="68" height="48" aria-hidden="true">
                <path
                  className="video-embed__play-bg"
                  d="M66.5 7.7c-.8-2.9-2.5-5.4-5.4-6.2C55.8.1 34 0 34 0S12.2.1 6.9 1.5C4 2.3 2.3 4.8 1.5 7.7.1 13 0 24 0 24s.1 11 1.5 16.3c.8 2.9 2.5 5.4 5.4 6.2C12.2 47.9 34 48 34 48s21.8-.1 27.1-1.5c2.9-.8 4.6-3.3 5.4-6.2C67.9 35 68 24 68 24s-.1-11-1.5-16.3z"
                />
                <path className="video-embed__play-arrow" d="M45 24 27 14v20z" />
              </svg>
            </span>
          </button>
        )}
      </div>
    </div>
  )
}
