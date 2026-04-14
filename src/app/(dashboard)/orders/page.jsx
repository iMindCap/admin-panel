'use client'

import { useState } from 'react'
import { useOrders } from '@/hooks/useOrders'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import OrderStatusBadge from '@/components/shared/OrderStatusBadge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, Search } from 'lucide-react'

const statuses = ['pending', 'shipped', 'delivered', 'cancelled']

export default function OrdersPage() {
  const { orders, loading, updateStatus } = useOrders()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const filtered = orders.filter(order => {
    const matchSearch =
      order.customers?.name.toLowerCase().includes(search.toLowerCase()) ||
      order.id.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || order.status === filterStatus
    return matchSearch && matchStatus
  })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Pedidos</h1>
        <p className="text-muted-foreground mt-1">Gestiona y actualiza el estado de los pedidos.</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente o ID..."
            className="pl-8"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              {filterStatus === 'all' ? 'Todos los estados' : filterStatus}
              <ChevronDown size={14} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFilterStatus('all')}>
              Todos
            </DropdownMenuItem>
            {statuses.map(s => (
              <DropdownMenuItem key={s} onClick={() => setFilterStatus(s)}>
                {s}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <p className="p-6 text-sm text-muted-foreground">Cargando...</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left text-muted-foreground">
                  <th className="px-6 py-3 font-medium">ID</th>
                  <th className="px-6 py-3 font-medium">Cliente</th>
                  <th className="px-6 py-3 font-medium">Total</th>
                  <th className="px-6 py-3 font-medium">Estado</th>
                  <th className="px-6 py-3 font-medium">Fecha</th>
                  <th className="px-6 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => (
                  <tr key={order.id} className="border-b last:border-0 hover:bg-muted/40">
                    <td className="px-6 py-3 text-muted-foreground font-mono text-xs">
                      #{order.id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-3">
                      <p className="font-medium">{order.customers?.name}</p>
                      <p className="text-xs text-muted-foreground">{order.customers?.email}</p>
                    </td>
                    <td className="px-6 py-3">${order.total}</td>
                    <td className="px-6 py-3">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-3 text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString('es-MX')}
                    </td>
                    <td className="px-6 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="gap-1">
                            Cambiar <ChevronDown size={12} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {statuses.map(s => (
                            <DropdownMenuItem
                              key={s}
                              onClick={() => updateStatus(order.id, s)}
                              disabled={order.status === s}
                            >
                              {s}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      No se encontraron pedidos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}