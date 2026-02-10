import '../styles/StudentFilter.css'

export default function StudentFilter({ students, activeStudent, onFilter }) {
  return (
    <div className="student-filter">
      <span className="student-filter__label">Filter by:</span>
      <div className="student-filter__buttons">
        <button
          className={`student-filter__all ${!activeStudent ? 'student-filter__all--active' : ''}`}
          onClick={() => onFilter(null)}
        >
          All
        </button>
        {students.map((s) => (
          <button
            key={s.id}
            className={`student-filter__btn ${activeStudent === s.id ? 'student-filter__btn--active' : ''}`}
            style={{ backgroundColor: s.avatarColor }}
            onClick={() => onFilter(activeStudent === s.id ? null : s.id)}
            title={s.name}
          >
            {s.name[0]}
          </button>
        ))}
      </div>
    </div>
  )
}
