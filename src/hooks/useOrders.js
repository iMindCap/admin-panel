'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export function useOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  async function fetchOrders() {
    setLoading(true)
    const { data } = await supabase
      .from('orders')
      .select('*, customers(name, email)')
      .order('created_at', { ascending: false })
    setOrders(data || [])
    setLoading(false)
  }

  async function updateStatus(id, status) {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
    if (!error) fetchOrders()
    return { error }
  }

  useEffect(() => { fetchOrders() }, [])

  return { orders, loading, updateStatus }
}