import { requireAuth } from '@/lib/auth'
import { getUserRole } from '@/lib/roles'
import { ok, err } from '@/lib/response'

export async function GET() {
  const auth = await requireAuth()
  if (auth instanceof Response) return auth

  const role = await getUserRole(auth.id)
  return ok({ email: auth.email, role })
}