import { useState } from 'react'
import { useSessionData } from './hooks/useSessionData'
import Header from './components/Header'
import StudentFilter from './components/StudentFilter'
import SessionList from './components/SessionList'
import Slogan from './components/Slogan'
import './App.css'

export default function App() {
  const { data, loading, error } = useSessionData()
  const [activeStudent, setActiveStudent] = useState(null)
  const dash = data.dashboard || {}

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
      <SessionList
        sessions={data.sessions}
        students={data.students}
        activeStudent={activeStudent}
      />
    </>
  )
}
