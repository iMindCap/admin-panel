import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import OrderStatusBadge from '@/components/shared/OrderStatusBadge'

export default function RecentOrders({ orders = [] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Pedidos recientes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay pedidos aún.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map(order => (
              <div key={order.id} className="flex items-center justify-between text-sm">
                <div className="flex flex-col">
                  <span className="font-mono text-xs text-muted-foreground">
                    #{order.id.slice(0, 8)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString('es-MX')}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium">${order.total}</span>
                  <OrderStatusBadge status={order.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}