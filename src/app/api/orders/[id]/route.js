import { requireAuth } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { ok, err } from '@/lib/response'

export async function GET(_, { params }) {
  const auth = await requireAuth()
  if (auth instanceof Response) return auth

  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*, customers(name, email), order_items(id, quantity, unit_price, products(name, id))')
    .eq('id', params.id)
    .single()

  if (error || !data) return err('Pedido no encontrado', 404)
  return ok(data)
}

export async function PATCH(request, { params }) {
  const auth = await requireAuth()
  if (auth instanceof Response) return auth

  const body = await request.json()
  const { status } = body

  const validStatuses = ['pending', 'shipped', 'delivered', 'cancelled']
  if (!validStatuses.includes(status))
    return err('Estado no válido.', 400)

  const supabase = await createServerSupabaseClient()

  // Obtener el pedido actual
  const { data: order } = await supabase
    .from('orders')
    .select('*, order_items(product_id, quantity)')
    .eq('id', params.id)
    .single()

  if (!order) return err('Pedido no encontrado.', 404)

  // No permitir cambios desde cancelled o delivered
  if (['cancelled', 'delivered'].includes(order.status))
    return err(`No se puede cambiar un pedido ${order.status}.`, 409)

  // Si se cancela, devolver stock
  if (status === 'cancelled') {
    for (const item of order.order_items) {
      const { data: product } = await supabase
        .from('products')
        .select('stock')
        .eq('id', item.product_id)
        .single()

      await supabase
        .from('products')
        .update({ stock: product.stock + item.quantity })
        .eq('id', item.product_id)
    }
  }

  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', params.id)
    .select()
    .single()

  if (error) return err('Error al actualizar el pedido.', 500)
  return ok(data)
}