import { requireAuth } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { validateCustomer } from '@/lib/validate'
import { ok, err } from '@/lib/response'

export async function GET(_, { params }) {
  const auth = await requireAuth()
  if (auth instanceof Response) return auth

  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('customers')
    .select('*, orders(id, total, status, created_at)')
    .eq('id', params.id)
    .single()

  if (error || !data) return err('Cliente no encontrado', 404)
  return ok(data)
}

export async function PUT(request, { params }) {
  const auth = await requireAuth()
  if (auth instanceof Response) return auth

  const body = await request.json()
  const validationError = validateCustomer(body)
  if (validationError) return err(validationError)

  const supabase = await createServerSupabaseClient()

  // Verificar email único excluyendo el cliente actual
  const { data: existing } = await supabase
    .from('customers')
    .select('id')
    .eq('email', body.email.trim())
    .neq('id', params.id)
    .single()

  if (existing) return err('Ya existe un cliente con ese email.', 409)

  const { data, error } = await supabase
    .from('customers')
    .update({
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone?.trim() || null,
    })
    .eq('id', params.id)
    .select()
    .single()

  if (error || !data) return err('Error al actualizar cliente', 500)
  return ok(data)
}

export async function DELETE(_, { params }) {
  const auth = await requireAuth()
  if (auth instanceof Response) return auth

  const supabase = await createServerSupabaseClient()

  // Verificar que no tenga pedidos asociados
  const { data: orders } = await supabase
    .from('orders')
    .select('id')
    .eq('customer_id', params.id)
    .limit(1)

  if (orders && orders.length > 0)
    return err('No se puede eliminar un cliente con pedidos asociados.', 409)

  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', params.id)

  if (error) return err('Error al eliminar cliente', 500)
  return ok({ deleted: true })
}