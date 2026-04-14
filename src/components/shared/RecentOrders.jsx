import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const orders = [
  { id: '#0012', customer: 'Ana García',    total: '$120.00', status: 'entregado' },
  { id: '#0013', customer: 'Luis Pérez',    total: '$89.50',  status: 'pendiente' },
  { id: '#0014', customer: 'María López',   total: '$245.00', status: 'enviado'   },
  { id: '#0015', customer: 'Carlos Ruiz',   total: '$60.00',  status: 'cancelado' },
  { id: '#0016', customer: 'Sofía Méndez',  total: '$310.00', status: 'pendiente' },
]

const statusVariant = {
  entregado: 'default',
  pendiente:  'secondary',
  enviado:    'outline',
  cancelado:  'destructive',
}

export default function RecentOrders() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Pedidos recientes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {orders.map(order => (
            <div key={order.id} className="flex items-center justify-between text-sm">
              <div className="flex flex-col">
                <span className="font-medium">{order.customer}</span>
                <span className="text-xs text-muted-foreground">{order.id}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium">{order.total}</span>
                <Badge variant={statusVariant[order.status]}>
                  {order.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}