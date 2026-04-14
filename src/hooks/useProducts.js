'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  async function fetchProducts() {
    setLoading(true)
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    setProducts(data || [])
    setLoading(false)
  }

  async function createProduct(product) {
    const { error } = await supabase.from('products').insert(product)
    if (!error) fetchProducts()
    return { error }
  }

  async function updateProduct(id, product) {
    const { error } = await supabase.from('products').update(product).eq('id', id)
    if (!error) fetchProducts()
    return { error }
  }

  async function deleteProduct(id) {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (!error) fetchProducts()
    return { error }
  }

  useEffect(() => { fetchProducts() }, [])

  return { products, loading, createProduct, updateProduct, deleteProduct }
}