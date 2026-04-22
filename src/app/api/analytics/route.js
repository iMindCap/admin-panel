import { requireAuth } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { ok, err } from '@/lib/response'

export async function GET() {
  const auth = await requireAuth()
  if (auth instanceof Response) return auth

  const supabase = await createServerSupabaseClient()

  const [
    { data: orders },
    { data: products },
    { data: orderItems },
  ] = await Promise.all([
    supabase.from('orders').select('id, status, total, created_at'),
    supabase.from('products').select('id, name, category, stock, status, price'),
    supabase.from('order_items').select('product_id, quantity, unit_price, products(name, category)'),
  ])

  // Pedidos por estado
  const statusCount = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1
    return acc
  }, {})
  const ordersByStatus = Object.entries(statusCount).map(([name, value]) => ({ name, value }))

  // Ingresos por mes (últimos 6 meses)
  const now = new Date()
  const revenueByMonth = {}
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const label = date.toLocaleString('es-MX', { month: 'short' })
    revenueByMonth[label] = 0
  }

  orders
    .filter(o => o.status !== 'cancelled')
    .forEach(o => {
      const date = new Date(o.created_at)
      const monthDiff =
        (now.getFullYear() - date.getFullYear()) * 12 +
        (now.getMonth() - date.getMonth())
      if (monthDiff <= 5) {
        const label = date.toLocaleString('es-MX', { month: 'short' })
        if (revenueByMonth[label] !== undefined) {
          revenueByMonth[label] += Number(o.total)
        }
      }
    })

  const revenueChart = Object.entries(revenueByMonth).map(([month, total]) => ({
    month,
    total: parseFloat(total.toFixed(2)),
  }))

  // Productos por categoría
  const categoryCount = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1
    return acc
  }, {})
  const productsByCategory = Object.entries(categoryCount).map(([name, value]) => ({ name, value }))

  // Productos más vendidos
  const soldByProduct = {}
  orderItems.forEach(item => {
    const name = item.products?.name || item.product_id
    soldByProduct[name] = (soldByProduct[name] || 0) + item.quantity
  })
  const topProducts = Object.entries(soldByProduct)
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5)

  // Productos con stock bajo
  const lowStock = products
    .filter(p => p.stock <= 20 && p.status === 'active')
    .sort((a, b) => a.stock - b.stock)

  return ok({
    ordersByStatus,
    revenueChart,
    productsByCategory,
    topProducts,
    lowStock,
  })
}