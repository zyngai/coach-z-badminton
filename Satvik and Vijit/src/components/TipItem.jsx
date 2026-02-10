export default function TipItem({ tip, students }) {
  return (
    <div className="tip-item">
      <span className="tip-item__icon">&#9733;</span>
      <span className="tip-item__text">{tip.text}</span>
      {tip.students?.length > 0 && tip.students.length < students.length && (
        <span className="tip-item__badges">
          {tip.students.map((sid) => {
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
    </div>
  )
}
