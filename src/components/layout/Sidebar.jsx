'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  BarChart2,
  Settings
} from 'lucide-react'

const links = [
  { href: '/',            label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/orders',      label: 'Pedidos',    icon: ShoppingCart },
  { href: '/products',    label: 'Productos',  icon: Package },
  { href: '/customers',   label: 'Clientes',   icon: Users },
  { href: '/analytics',   label: 'Analíticas', icon: BarChart2 },
  { href: '/settings',    label: 'Ajustes',    icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 shrink-0 border-r bg-background h-screen sticky top-0 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b">
        <span className="font-semibold text-base">Admin Panel</span>
      </div>
      <nav className="flex flex-col gap-1 p-3 flex-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
              pathname === href
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}