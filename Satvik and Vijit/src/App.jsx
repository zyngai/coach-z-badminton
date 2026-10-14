import { useState } from 'react'
import { useSessionData } from './hooks/useSessionData'
import Header from './components/Header'
import StudentFilter from './components/StudentFilter'
import HomeworkLibrary from './components/HomeworkLibrary'
import SessionList from './components/SessionList'
import Slogan from './components/Slogan'
import { shouldSuppressSessionHomework } from './utils/homeworkLibrary'
import './App.css'

export default function App() {
  const { data, loading, error } = useSessionData()
  const [activeStudent, setActiveStudent] = useState(null)
  const dash = data.dashboard || {}
  const [openSections, setOpenSections] = useState({ coaching: false, tournaments: false })
  const [selectedSession, setSelectedSession] = useState(null)
  const toggleSection = id => setOpenSections(previous => ({ ...previous, [id]: !previous[id] }))
  const revealSource = id => {
    setOpenSections(previous => ({ ...previous, coaching: true }))
    setSelectedSession(id)
    setTimeout(() => document.getElementById(`session-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 350)
  }

  if (loading) {
    return (
      <>
        <Header title={dash.title} subtitle={dash.subtitle} />
        <p style={{ textAlign: 'center', padding: '2rem', color: '#9CA3AF' }}>
          Loading sessions...
        </p>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header title={dash.title} subtitle={dash.subtitle} />
        <p style={{ textAlign: 'center', padding: '2rem', color: '#EF4444' }}>
          Error: {error}
        </p>
      </>
    )
  }

  return (
    <>
      <Header title={dash.title} subtitle={dash.subtitle} />
      <StudentFilter
        students={data.students}
        activeStudent={activeStudent}
        onFilter={setActiveStudent}
      />
      <Slogan />
      <HomeworkLibrary
        dashboard={dash}
        sessions={data.sessions}
        students={data.students}
        activeStudent={activeStudent}
        onRevealSource={revealSource}
      />
      <SessionList
        sessions={data.sessions.filter(s => s.entryType !== 'match-analysis')}
        students={data.students}
        activeStudent={activeStudent}
        suppressHomework={shouldSuppressSessionHomework(dash)}
        title="Coaching Sessions" sectionId="coaching" open={openSections.coaching}
        onToggle={() => toggleSection('coaching')} selectedSession={selectedSession}
        onClearSelection={() => setSelectedSession(null)}
      />
      <SessionList
        sessions={data.sessions.filter(s => s.entryType === 'match-analysis')}
        students={data.students}
        activeStudent={activeStudent}
        title="Tournament Reviews" sectionId="tournaments" open={openSections.tournaments}
        onToggle={() => toggleSection('tournaments')}
      />
    </>
  )
}
