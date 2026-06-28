import '../styles/Header.css'

// Optional "Upload Video" button. Leave as null (or the placeholder) to hide it;
// set to a real Google Form URL to show it. Kept out of the live UI until configured
// so we never ship a dead link.
const UPLOAD_FORM_URL = null

export default function Header({ title, subtitle }) {
  return (
    <header className="header">
      <div className="header__content">
        <h1 className="header__title">{title || 'Coach Z Badminton Training'}</h1>
        <div className="header__divider"></div>
        {subtitle && <p className="header__subtitle">{subtitle}</p>}
      </div>
      {UPLOAD_FORM_URL && !UPLOAD_FORM_URL.includes('YOUR_FORM_ID') && (
        <a
          href={UPLOAD_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="header__upload-btn"
        >
          Upload Video
        </a>
      )}
    </header>
  )
}
