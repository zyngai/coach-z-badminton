import { useState, useEffect } from 'react'

export function useSessionData() {
  const [data, setData] = useState({ students: [], sessions: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('./data/sessions.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load sessions')
        return res.json()
      })
      .then((json) => {
        const sorted = {
          ...json,
          sessions: [...json.sessions].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          ),
        }
        setData(sorted)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return { data, loading, error }
}
