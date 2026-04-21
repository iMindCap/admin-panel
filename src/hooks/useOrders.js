'use client'

import { useEffect, useState } from 'react'

export function useOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function fetchOrders() {
    setLoading(true)
    const res = await fetch('/api/orders')
    const json = await res.json()
    if (!res.ok) {
      setError(json.error)
    } else {
      setOrders(json.data)
    }
    setLoading(false)
  }

  async function createOrder(order) {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    })
    const json = await res.json()
    if (res.ok) fetchOrders()
    return { error: res.ok ? null : json.error }
  }

  async function updateStatus(id, status) {
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    const json = await res.json()
    if (res.ok) fetchOrders()
    return { error: res.ok ? null : json.error }
  }

  useEffect(() => { fetchOrders() }, [])

  return { orders, loading, error, createOrder, updateStatus }
}