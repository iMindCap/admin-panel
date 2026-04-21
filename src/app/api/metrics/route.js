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
    { data: customers },
  ] = await Promise.all([
    supabase.from('orders').select('id, total, status, created_at'),
    supabase.from('products').select('id, stock, status'),
    supabase.from('customers').select('id, created_at'),
  ])

  // Ingresos del mes actual
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const revenueThisMonth = orders
    .filter(o => o.status !== 'cancelled' && o.created_at >= startOfMonth)
    .reduce((sum, o) => sum + Number(o.total), 0)

  // Ingresos del mes anterior
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
  const revenueLastMonth = orders
    .filter(o =>
      o.status !== 'cancelled' &&
      o.created_at >= startOfLastMonth &&
      o.created_at < startOfMonth
    )
    .reduce((sum, o) => sum + Number(o.total), 0)

  const revenueChange = revenueLastMonth === 0
    ? 100
    : (((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100).toFixed(1)

  // Pedidos nuevos este mes
  const ordersThisMonth = orders.filter(o => o.created_at >= startOfMonth).length

  // Clientes nuevos esta semana
  const startOfWeek = new Date()
  startOfWeek.setDate(now.getDate() - 7)
  const newCustomersThisWeek = customers.filter(
    c => new Date(c.created_at) >= startOfWeek
  ).length

  // Productos activos y con stock bajo
  const activeProducts = products.filter(p => p.status === 'active').length
  const lowStockProducts = products.filter(p => p.stock <= 20 && p.status === 'active').length

  // Ingresos por mes para la gráfica (últimos 6 meses)
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
      const monthDiff = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth())
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

  // Pedidos recientes (últimos 5)
  const recentOrders = orders
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5)

  return ok({
    revenueThisMonth: parseFloat(revenueThisMonth.toFixed(2)),
    revenueChange: parseFloat(revenueChange),
    ordersThisMonth,
    totalCustomers: customers.length,
    newCustomersThisWeek,
    activeProducts,
    lowStockProducts,
    revenueChart,
    recentOrders,
  })
}