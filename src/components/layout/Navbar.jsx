'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { useMe } from '@/hooks/useMe'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function Navbar() {
  const router = useRouter()
  const supabase = createClient()
  const { me } = useMe()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="h-16 border-b bg-background flex items-center justify-end gap-3 px-6">
      {me && (
        <Badge variant={me.role === 'admin' ? 'default' : 'secondary'}>
          {me.role}
        </Badge>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarFallback>
              {me?.email?.charAt(0).toUpperCase() || 'A'}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="text-xs text-muted-foreground" disabled>
            {me?.email}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}