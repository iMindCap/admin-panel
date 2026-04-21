import { requireAuth } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { validateCustomer } from '@/lib/validate'
import { ok, err } from '@/lib/response'

export async function GET() {
  const auth = await requireAuth()
  if (auth instanceof Response) return auth

  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('customers')
    .select('*, orders(id, total, status, created_at)')
    .order('created_at', { ascending: false })

  if (error) return err('Error al obtener clientes', 500)
  return ok(data)
}

export async function POST(request) {
  const auth = await requireAuth()
  if (auth instanceof Response) return auth

  const body = await request.json()
  const validationError = validateCustomer(body)
  if (validationError) return err(validationError)

  const supabase = await createServerSupabaseClient()

  // Verificar email único
  const { data: existing } = await supabase
    .from('customers')
    .select('id')
    .eq('email', body.email.trim())
    .single()

  if (existing) return err('Ya existe un cliente con ese email.', 409)

  const { data, error } = await supabase
    .from('customers')
    .insert({
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone?.trim() || null,
    })
    .select()
    .single()

  if (error) return err('Error al crear cliente', 500)
  return ok(data, 201)
}