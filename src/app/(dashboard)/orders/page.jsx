'use client'

import { useState } from 'react'
import { useOrders } from '@/hooks/useOrders'
import { useProducts } from '@/hooks/useProducts'
import { useCustomers } from '@/hooks/useCustomers'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import OrderStatusBadge from '@/components/shared/OrderStatusBadge'
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from '@/components/ui/dialog'
import { ChevronDown, Search, Plus, Trash2 } from 'lucide-react'

const statuses = ['pending', 'shipped', 'delivered', 'cancelled']

function OrderForm({ open, onClose, onSubmit, customers, products }) {
  const [customerId, setCustomerId] = useState('')
  const [items, setItems] = useState([{ product_id: '', quantity: 1 }])
  const [error, setError] = useState(null)

  function addItem() {
    setItems(prev => [...prev, { product_id: '', quantity: 1 }])
  }

  function removeItem(index) {
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  function updateItem(index, field, value) {
    setItems(prev => prev.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    ))
  }

  async function handleSubmit() {
    const { error } = await onSubmit({
      customer_id: customerId,
      items: items.map(i => ({ ...i, quantity: parseInt(i.quantity) })),
    })
    if (error) {
      setError(error)
    } else {
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Nuevo pedido</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <Label>Cliente</Label>
            <select
              value={customerId}
              onChange={e => setCustomerId(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm bg-background"
            >
              <option value="">Seleccionar cliente...</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Productos</Label>
            {items.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <select
                  value={item.product_id}
                  onChange={e => updateItem(index, 'product_id', e.target.value)}
                  className="border rounded-md px-3 py-2 text-sm bg-background flex-1"
                >
                  <option value="">Seleccionar producto...</option>
                  {products
                    .filter(p => p.status === 'active' && p.stock > 0)
                    .map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} — ${p.price} (stock: {p.stock})
                      </option>
                    ))}
                </select>
                <Input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={e => updateItem(index, 'quantity', e.target.value)}
                  className="w-20"
                />
                {items.length > 1 && (
                  <Button size="icon" variant="ghost" onClick={() => removeItem(index)}>
                    <Trash2 size={14} className="text-destructive" />
                  </Button>
                )}
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addItem} className="self-start">
              <Plus size={14} className="mr-1" /> Agregar producto
            </Button>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-2 mt-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSubmit}>Crear pedido</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function OrdersPage() {
  const { orders, loading, updateStatus, createOrder } = useOrders()
  const { products } = useProducts()
  const { customers } = useCustomers()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [formOpen, setFormOpen] = useState(false)

  const filtered = orders.filter(order => {
    const matchSearch =
      order.customers?.name.toLowerCase().includes(search.toLowerCase()) ||
      order.id.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || order.status === filterStatus
    return matchSearch && matchStatus
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Pedidos</h1>
          <p className="text-muted-foreground mt-1">Gestiona y actualiza el estado de los pedidos.</p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus size={16} className="mr-2" /> Nuevo pedido
        </Button>
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
            <DropdownMenuItem onClick={() => setFilterStatus('all')}>Todos</DropdownMenuItem>
            {statuses.map(s => (
              <DropdownMenuItem key={s} onClick={() => setFilterStatus(s)}>{s}</DropdownMenuItem>
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
                  <th className="px-6 py-3 font-medium">Productos</th>
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
                    <td className="px-6 py-3 text-muted-foreground text-xs">
                      {order.order_items?.map(i => i.products?.name).join(', ') || '—'}
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
                              disabled={
                                order.status === s ||
                                ['cancelled', 'delivered'].includes(order.status)
                              }
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
                    <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                      No se encontraron pedidos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <OrderForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={createOrder}
        customers={customers}
        products={products}
      />
    </div>
  )
}