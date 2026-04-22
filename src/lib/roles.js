import { createServerSupabaseClient } from './supabase-server'

export async function getUserRole(userId) {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single()
  return data?.role || 'viewer'
}

export async function requireRole(allowedRoles = ['admin']) {
  const { getSession } = await import('./auth')
  const user = await getSession()

  if (!user) {
    return Response.json({ error: 'No autorizado' }, { status: 401 })
  }

  const role = await getUserRole(user.id)

  if (!allowedRoles.includes(role)) {
    return Response.json(
      { error: 'No tienes permisos para realizar esta acción.' },
      { status: 403 }
    )
  }

  return { user, role }
}