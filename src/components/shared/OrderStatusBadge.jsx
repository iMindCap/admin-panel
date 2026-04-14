import { Badge } from '@/components/ui/badge'

const config = {
  pending:   { label: 'Pendiente',  variant: 'secondary'    },
  shipped:   { label: 'Enviado',    variant: 'outline'      },
  delivered: { label: 'Entregado',  variant: 'default'      },
  cancelled: { label: 'Cancelado',  variant: 'destructive'  },
}

export default function OrderStatusBadge({ status }) {
  const { label, variant } = config[status] || { label: status, variant: 'outline' }
  return <Badge variant={variant}>{label}</Badge>
}