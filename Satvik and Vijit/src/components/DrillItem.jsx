import VideoEmbed from './VideoEmbed'
import { filterItems } from '../utils/filters'

export default function DrillItem({ drill, students, number, activeStudent }) {
  const videos = filterItems(drill.videos || [], activeStudent)
  return (
    <div className="drill-item">
      <div className="drill-item__header">
        {number && <span className="drill-item__number">Drill {number}</span>}
        <span className="drill-item__name">{drill.name}</span>
        {drill.students?.length > 0 && drill.students.length < students.length && (
          drill.students.map((sid) => {
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
          })
        )}
      </div>
      {drill.description && (
        <p className="drill-item__description">{drill.description}</p>
      )}
      {drill.notes && (
        <p className="drill-item__notes">{drill.notes}</p>
      )}
      {videos.length > 0 && (
        <div className="drill-item__videos">
          {videos.map((video, i) => (
            <VideoEmbed key={i} video={video} />
          ))}
        </div>
      )}
    </div>
  )
}
