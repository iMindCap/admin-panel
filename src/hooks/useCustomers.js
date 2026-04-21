'use client'

import { useEffect, useState } from 'react'

export function useCustomers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function fetchCustomers() {
    setLoading(true)
    const res = await fetch('/api/customers')
    const json = await res.json()
    if (!res.ok) {
      setError(json.error)
    } else {
      setCustomers(json.data)
    }
    setLoading(false)
  }

  async function createCustomer(customer) {
    const res = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    })
    const json = await res.json()
    if (res.ok) fetchCustomers()
    return { error: res.ok ? null : json.error }
  }

  async function updateCustomer(id, customer) {
    const res = await fetch(`/api/customers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    })
    const json = await res.json()
    if (res.ok) fetchCustomers()
    return { error: res.ok ? null : json.error }
  }

  async function deleteCustomer(id) {
    const res = await fetch(`/api/customers/${id}`, { method: 'DELETE' })
    const json = await res.json()
    if (res.ok) fetchCustomers()
    return { error: res.ok ? null : json.error }
  }

  useEffect(() => { fetchCustomers() }, [])

  return { customers, loading, error, createCustomer, updateCustomer, deleteCustomer }
}