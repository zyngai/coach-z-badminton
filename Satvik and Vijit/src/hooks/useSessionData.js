import { useState, useEffect } from 'react'

// Per-tenant data file. Each tenant build sets VITE_DATA_PATH; falls back to the
// default location for a plain single-tenant `npm run dev`.
const DATA_PATH = import.meta.env.VITE_DATA_PATH || './data/sessions.json'

export function useSessionData() {
  const [data, setData] = useState({ dashboard: {}, students: [], sessions: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(DATA_PATH)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load sessions')
        return res.json()
      })
      .then((json) => {
        const sorted = {
          dashboard: json.dashboard || {},
          ...json,
          sessions: [...(json.sessions || [])].sort(
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
