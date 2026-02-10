export default function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">&#127992;</div>
      <p className="empty-state__text">No sessions found</p>
      <p className="empty-state__subtext">Check back after your next training session!</p>
    </div>
  )
}
