'use client'

import { useState } from 'react'
import { useProducts } from '@/hooks/useProducts'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useMe } from '@/hooks/useMe'
import ProductForm from '@/components/shared/ProductForm'

export default function ProductsPage() {
  const { products, loading, createProduct, updateProduct, deleteProduct } = useProducts()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const { isAdmin } = useMe()

  function handleEdit(product) {
    setEditing(product)
    setFormOpen(true)
  }

  function handleClose() {
    setEditing(null)
    setFormOpen(false)
  }

  async function handleSubmit(data) {
    if (editing) return updateProduct(editing.id, data)
    return createProduct(data)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Productos</h1>
          <p className="text-muted-foreground mt-1">Gestiona tu catálogo.</p>
        </div>
          {isAdmin && (
            <Button onClick={() => setFormOpen(true)}>
              <Plus size={16} className="mr-2" /> Nuevo producto
            </Button>
          )}
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <p className="p-6 text-sm text-muted-foreground">Cargando...</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left text-muted-foreground">
                  <th className="px-6 py-3 font-medium">Nombre</th>
                  <th className="px-6 py-3 font-medium">Categoría</th>
                  <th className="px-6 py-3 font-medium">Precio</th>
                  <th className="px-6 py-3 font-medium">Stock</th>
                  <th className="px-6 py-3 font-medium">Estado</th>
                  <th className="px-6 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className="border-b last:border-0 hover:bg-muted/40">
                    <td className="px-6 py-3 font-medium">{product.name}</td>
                    <td className="px-6 py-3 text-muted-foreground">{product.category}</td>
                    <td className="px-6 py-3">${product.price}</td>
                    <td className="px-6 py-3">{product.stock}</td>
                    <td className="px-6 py-3">
                      <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                        {product.status === 'active' ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <Button size="icon" variant="ghost" onClick={() => handleEdit(product)}>
                            <Pencil size={14} />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => deleteProduct(product.id)}>
                            <Trash2 size={14} className="text-destructive" />
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <ProductForm
        open={formOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        initial={editing}
      />
    </div>
  )
}