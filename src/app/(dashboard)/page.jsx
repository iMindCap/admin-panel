import { DollarSign, ShoppingCart, Users, Package } from 'lucide-react'
import StatCard from '@/components/shared/StatCard'
import RevenueChart from '@/components/shared/RevenueChart'
import RecentOrders from '@/components/shared/RecentOrders'

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Resumen general de tu tienda.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Ingresos del mes"
          value="$8,400"
          description="+12% vs mes anterior"
          icon={DollarSign}
        />
        <StatCard
          title="Pedidos nuevos"
          value="38"
          description="Últimos 30 días"
          icon={ShoppingCart}
        />
        <StatCard
          title="Clientes"
          value="214"
          description="+5 esta semana"
          icon={Users}
        />
        <StatCard
          title="Productos activos"
          value="57"
          description="3 con stock bajo"
          icon={Package}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <RecentOrders />
      </div>
    </div>
  )
}