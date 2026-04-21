'use client'

import { useState } from 'react'
import { useCustomers } from '@/hooks/useCustomers'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, Pencil, Trash2 } from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

function CustomerForm({ open, onClose, onSubmit, initial }) {
  const empty = { name: '', email: '', phone: '' }
  const [form, setForm] = useState(initial || empty)
  const [error, setError] = useState(null)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit() {
    const { error } = await onSubmit(form)
    if (error) {
      setError(error)
    } else {
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{initial ? 'Editar cliente' : 'Nuevo cliente'}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <Label>Nombre</Label>
            <Input name="name" value={form.name} onChange={handleChange} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Email</Label>
            <Input name="email" type="email" value={form.email} onChange={handleChange} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Teléfono</Label>
            <Input name="phone" value={form.phone} onChange={handleChange} />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSubmit}>Guardar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function CustomersPage() {
  const { customers, loading, createCustomer, updateCustomer, deleteCustomer } = useCustomers()
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  function handleEdit(customer) {
    setEditing(customer)
    setFormOpen(true)
  }

  function handleClose() {
    setEditing(null)
    setFormOpen(false)
  }

  async function handleSubmit(data) {
    if (editing) return updateCustomer(editing.id, data)
    return createCustomer(data)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Clientes</h1>
          <p className="text-muted-foreground mt-1">{customers.length} clientes registrados.</p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus size={16} className="mr-2" /> Nuevo cliente
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre o email..."
          className="pl-8"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <p className="p-6 text-sm text-muted-foreground">Cargando...</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left text-muted-foreground">
                  <th className="px-6 py-3 font-medium">Cliente</th>
                  <th className="px-6 py-3 font-medium">Teléfono</th>
                  <th className="px-6 py-3 font-medium">Pedidos</th>
                  <th className="px-6 py-3 font-medium">Total gastado</th>
                  <th className="px-6 py-3 font-medium">Registro</th>
                  <th className="px-6 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(customer => {
                  const totalSpent = customer.orders
                    ?.filter(o => o.status !== 'cancelled')
                    .reduce((sum, o) => sum + Number(o.total), 0) || 0
                  const orderCount = customer.orders?.length || 0

                  return (
                    <tr key={customer.id} className="border-b last:border-0 hover:bg-muted/40">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                            {customer.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-xs text-muted-foreground">{customer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-muted-foreground">{customer.phone || '—'}</td>
                      <td className="px-6 py-3">
                        <Badge variant="secondary">{orderCount}</Badge>
                      </td>
                      <td className="px-6 py-3 font-medium">${totalSpent.toFixed(2)}</td>
                      <td className="px-6 py-3 text-muted-foreground">
                        {new Date(customer.created_at).toLocaleDateString('es-MX')}
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <Button size="icon" variant="ghost" onClick={() => handleEdit(customer)}>
                            <Pencil size={14} />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => deleteCustomer(customer.id)}>
                            <Trash2 size={14} className="text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      No se encontraron clientes.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <CustomerForm
        open={formOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        initial={editing}
      />
    </div>
  )
}