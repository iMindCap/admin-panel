import { createServerSupabaseClient } from './supabase'

export async function getSession() {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  return user
}

export async function requireAuth() {
  const user = await getSession()
  if (!user) {
    return Response.json({ error: 'No autorizado' }, { status: 401 })
  }
  return user
}