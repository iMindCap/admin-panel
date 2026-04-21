export function validateProduct({ name, price, stock, category, status }) {
  if (!name || name.trim() === '')
    return 'El nombre es requerido.'
  if (price === undefined || isNaN(price) || price < 0)
    return 'El precio debe ser un número positivo.'
  if (stock === undefined || isNaN(stock) || stock < 0)
    return 'El stock debe ser un número positivo.'
  if (!category || category.trim() === '')
    return 'La categoría es requerida.'
  if (!['active', 'inactive'].includes(status))
    return 'El estado debe ser active o inactive.'
  return null
}

export function validateCustomer({ name, email, phone }) {
  if (!name || name.trim() === '')
    return 'El nombre es requerido.'
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return 'El email no es válido.'
  if (phone && phone.trim().length < 7)
    return 'El teléfono no es válido.'
  return null
}

export function validateOrder({ customer_id, items }) {
  if (!customer_id)
    return 'El cliente es requerido.'
  if (!items || !Array.isArray(items) || items.length === 0)
    return 'El pedido debe tener al menos un producto.'
  for (const item of items) {
    if (!item.product_id)
      return 'Cada item debe tener un producto.'
    if (!item.quantity || item.quantity < 1)
      return 'La cantidad debe ser mayor a 0.'
  }
  return null
}