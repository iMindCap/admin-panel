import { requireAuth } from '@/lib/auth'
import { requireRole } from '@/lib/roles'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { validateProduct } from '@/lib/validate'
import { ok, err } from '@/lib/response'

export async function GET(_, { params }) {
  const auth = await requireAuth()
  if (auth instanceof Response) return auth

  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !data) return err('Producto no encontrado', 404)
  return ok(data)
}

export async function PUT(request, { params }) {
  const result = await requireRole(['admin'])
  if (result instanceof Response) return result

  const body = await request.json()
  const validationError = validateProduct(body)
  if (validationError) return err(validationError)

  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('products')
    .update({
      name: body.name.trim(),
      price: parseFloat(body.price),
      stock: parseInt(body.stock),
      category: body.category.trim(),
      status: body.status,
    })
    .eq('id', params.id)
    .select()
    .single()

  if (error || !data) return err('Error al actualizar producto', 500)
  return ok(data)
}

export async function DELETE(_, { params }) {
  const result = await requireRole(['admin'])
  if (result instanceof Response) return result

  const supabase = await createServerSupabaseClient()

  const { data: items } = await supabase
    .from('order_items')
    .select('id')
    .eq('product_id', params.id)
    .limit(1)

  if (items && items.length > 0)
    return err('No se puede eliminar un producto con pedidos asociados.', 409)

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', params.id)

  if (error) return err('Error al eliminar producto', 500)
  return ok({ deleted: true })
}