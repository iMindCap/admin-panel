'use client'

import { useState } from 'react'
import { useCustomers } from '@/hooks/useCustomers'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Users } from 'lucide-react'

export default function CustomersPage() {
  const { customers, loading } = useCustomers()
  const [search, setSearch] = useState('')

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Clientes</h1>
        <p className="text-muted-foreground mt-1">
          {customers.length} clientes registrados.
        </p>
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
                      <td className="px-6 py-3 text-muted-foreground">
                        {customer.phone || '—'}
                      </td>
                      <td className="px-6 py-3">
                        <Badge variant="secondary">{orderCount}</Badge>
                      </td>
                      <td className="px-6 py-3 font-medium">
                        ${totalSpent.toFixed(2)}
                      </td>
                      <td className="px-6 py-3 text-muted-foreground">
                        {new Date(customer.created_at).toLocaleDateString('es-MX')}
                      </td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                      No se encontraron clientes.
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