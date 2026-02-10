import '../styles/VideoEmbed.css'

function getYouTubeId(url) {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  )
  return match ? match[1] : null
}

export default function VideoEmbed({ video }) {
  if (video.type === 'youtube') {
    const videoId = getYouTubeId(video.url)
    if (videoId) {
      return (
        <div className="video-embed">
          {video.title && <p className="video-embed__title">{video.title}</p>}
          <div className="video-embed__wrapper">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title={video.title || 'Video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )
    }
  }

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
