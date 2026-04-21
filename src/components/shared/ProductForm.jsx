'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const empty = { name: '', price: '', stock: '', category: '', status: 'active' }

export default function ProductForm({ open, onClose, onSubmit, initial }) {
  const [form, setForm] = useState(initial || empty)
  const [error, setError] = useState(null)
  
  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit() {
    const payload = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
    }
    const { error } = await onSubmit(payload)
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
          <DialogTitle>{initial ? 'Editar producto' : 'Nuevo producto'}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <Label>Nombre</Label>
            <Input name="name" value={form.name} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Precio</Label>
              <Input name="price" type="number" value={form.price} onChange={handleChange} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Stock</Label>
              <Input name="stock" type="number" value={form.stock} onChange={handleChange} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Categoría</Label>
            <Input name="category" value={form.category} onChange={handleChange} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Estado</Label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="border rounded-md px-3 py-2 text-sm bg-background"
            >
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>
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