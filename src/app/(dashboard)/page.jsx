'use client'

import { useEffect, useState } from 'react'
import { DollarSign, ShoppingCart, Users, Package } from 'lucide-react'
import StatCard from '@/components/shared/StatCard'
import RevenueChart from '@/components/shared/RevenueChart'
import RecentOrders from '@/components/shared/RecentOrders'

export default function DashboardPage() {
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMetrics() {
      const res = await fetch('/api/metrics')
      const json = await res.json()
      if (res.ok) setMetrics(json.data)
      setLoading(false)
    }
    fetchMetrics()
  }, [])

  if (loading) return <p className="text-sm text-muted-foreground">Cargando...</p>
  if (!metrics) return <p className="text-sm text-destructive">Error al cargar métricas.</p>

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Resumen general de tu tienda.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Ingresos del mes"
          value={`$${metrics.revenueThisMonth.toLocaleString()}`}
          description={`${metrics.revenueChange >= 0 ? '+' : ''}${metrics.revenueChange}% vs mes anterior`}
          icon={DollarSign}
        />
        <StatCard
          title="Pedidos nuevos"
          value={metrics.ordersThisMonth}
          description="Este mes"
          icon={ShoppingCart}
        />
        <StatCard
          title="Clientes"
          value={metrics.totalCustomers}
          description={`+${metrics.newCustomersThisWeek} esta semana`}
          icon={Users}
        />
        <StatCard
          title="Productos activos"
          value={metrics.activeProducts}
          description={
            metrics.lowStockProducts > 0
              ? `${metrics.lowStockProducts} con stock bajo`
              : 'Stock en buen nivel'
          }
          icon={Package}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RevenueChart data={metrics.revenueChart} />
        </div>
        <RecentOrders orders={metrics.recentOrders} />
      </div>
    </div>
  )
}