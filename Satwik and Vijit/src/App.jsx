import { useState } from 'react'
import { useSessionData } from './hooks/useSessionData'
import Header from './components/Header'
import StudentFilter from './components/StudentFilter'
import SessionList from './components/SessionList'
import './App.css'

export default function App() {
  const { data, loading, error } = useSessionData()
  const [activeStudent, setActiveStudent] = useState(null)

  if (loading) {
    return (
      <>
        <Header />
        <p style={{ textAlign: 'center', padding: '2rem', color: '#9CA3AF' }}>
          Loading sessions...
        </p>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header />
        <p style={{ textAlign: 'center', padding: '2rem', color: '#EF4444' }}>
          Error: {error}
        </p>
      </>
    )
  }

  return (
    <>
      <Header />
      <StudentFilter
        students={data.students}
        activeStudent={activeStudent}
        onFilter={setActiveStudent}
      />
      <SessionList
        sessions={data.sessions}
        students={data.students}
        activeStudent={activeStudent}
      />
    </>
  )
}
