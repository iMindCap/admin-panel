import { requireAuth } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { validateOrder } from '@/lib/validate'
import { ok, err } from '@/lib/response'

export async function GET() {
  const auth = await requireAuth()
  if (auth instanceof Response) return auth

  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*, customers(name, email), order_items(id, quantity, unit_price, products(name))')
    .order('created_at', { ascending: false })

  if (error) return err('Error al obtener pedidos', 500)
  return ok(data)
}

export async function POST(request) {
  const auth = await requireAuth()
  if (auth instanceof Response) return auth

  const body = await request.json()
  const validationError = validateOrder(body)
  if (validationError) return err(validationError)

  const supabase = await createServerSupabaseClient()

  // Verificar que el cliente existe
  const { data: customer } = await supabase
    .from('customers')
    .select('id')
    .eq('id', body.customer_id)
    .single()

  if (!customer) return err('El cliente no existe.', 404)

  // Verificar stock de cada producto
  for (const item of body.items) {
    const { data: product } = await supabase
      .from('products')
      .select('id, name, stock, price')
      .eq('id', item.product_id)
      .single()

    if (!product) return err(`Producto no encontrado.`, 404)
    if (product.stock < item.quantity)
      return err(`Stock insuficiente para "${product.name}". Disponible: ${product.stock}.`, 409)
  }

  // Calcular total en el servidor
  let total = 0
  const itemsWithPrice = []

  for (const item of body.items) {
    const { data: product } = await supabase
      .from('products')
      .select('price')
      .eq('id', item.product_id)
      .single()

    const unitPrice = parseFloat(product.price)
    total += unitPrice * item.quantity
    itemsWithPrice.push({ ...item, unit_price: unitPrice })
  }

  // Crear el pedido
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_id: body.customer_id,
      status: 'pending',
      total: parseFloat(total.toFixed(2)),
    })
    .select()
    .single()

  if (orderError) return err('Error al crear el pedido.', 500)

  // Insertar los items
  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(
      itemsWithPrice.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
      }))
    )

  if (itemsError) {
    await supabase.from('orders').delete().eq('id', order.id)
    return err('Error al crear los items del pedido.', 500)
  }

  // Descontar stock de cada producto
  for (const item of itemsWithPrice) {
    const { data: product } = await supabase
      .from('products')
      .select('stock')
      .eq('id', item.product_id)
      .single()

    await supabase
      .from('products')
      .update({ stock: product.stock - item.quantity })
      .eq('id', item.product_id)
  }

  return ok(order, 201)
}