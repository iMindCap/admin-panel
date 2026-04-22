'use client'

import { useEffect, useState } from 'react'

export function useMe() {
  const [me, setMe] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMe() {
      const res = await fetch('/api/me')
      const json = await res.json()
      if (res.ok) setMe(json.data)
      setLoading(false)
    }
    fetchMe()
  }, [])

  const isAdmin = me?.role === 'admin'
  const isViewer = me?.role === 'viewer'

  return { me, loading, isAdmin, isViewer }
}