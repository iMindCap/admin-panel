import { requireAuth } from '@/lib/auth'
import { requireRole } from '@/lib/roles'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { validateProduct } from '@/lib/validate'
import { ok, err } from '@/lib/response'

export async function GET() {
  const auth = await requireAuth()
  if (auth instanceof Response) return auth

  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return err('Error al obtener productos', 500)
  return ok(data)
}

export async function POST(request) {
  const result = await requireRole(['admin'])
  if (result instanceof Response) return result

  const body = await request.json()
  const validationError = validateProduct(body)
  if (validationError) return err(validationError)

  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('products')
    .insert({
      name: body.name.trim(),
      price: parseFloat(body.price),
      stock: parseInt(body.stock),
      category: body.category.trim(),
      status: body.status,
    })
    .select()
    .single()

  if (error) return err('Error al crear producto', 500)
  return ok(data, 201)
}