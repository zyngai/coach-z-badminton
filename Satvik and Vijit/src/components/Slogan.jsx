import '../styles/Slogan.css'

export default function Slogan() {
  return (
    <div className="slogan">
      <div className="slogan__rule" aria-hidden="true"></div>
      <p className="slogan__text">
        <span className="slogan__quote">“</span>
        In Badminton, You Can Only Be Fast When You Are Slow
        <span className="slogan__quote">”</span>
      </p>
      <div className="slogan__rule" aria-hidden="true"></div>
    </div>
  )
}
