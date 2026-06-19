import { useState, useEffect } from 'react'

export const useFetch = (fetchFn, dependencies = []) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await fetchFn()
        if (!cancelled) {
          setData(result.data)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message)
          setData(null)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      cancelled = true
    }
  }, dependencies)

  return { data, loading, error }
}
