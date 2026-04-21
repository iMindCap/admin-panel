'use client'

import { useEffect, useState } from 'react'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function fetchProducts() {
    setLoading(true)
    const res = await fetch('/api/products')
    const json = await res.json()
    if (!res.ok) {
      setError(json.error)
    } else {
      setProducts(json.data)
    }
    setLoading(false)
  }

  async function createProduct(product) {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    })
    const json = await res.json()
    if (res.ok) fetchProducts()
    return { error: res.ok ? null : json.error }
  }

  async function updateProduct(id, product) {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    })
    const json = await res.json()
    if (res.ok) fetchProducts()
    return { error: res.ok ? null : json.error }
  }

  async function deleteProduct(id) {
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
    const json = await res.json()
    if (res.ok) fetchProducts()
    return { error: res.ok ? null : json.error }
  }

  useEffect(() => { fetchProducts() }, [])

  return { products, loading, error, createProduct, updateProduct, deleteProduct }
}