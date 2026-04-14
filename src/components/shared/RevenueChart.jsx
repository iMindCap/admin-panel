'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const data = [
  { month: 'Ene', ingresos: 4200 },
  { month: 'Feb', ingresos: 5800 },
  { month: 'Mar', ingresos: 4900 },
  { month: 'Abr', ingresos: 7200 },
  { month: 'May', ingresos: 6100 },
  { month: 'Jun', ingresos: 8400 },
  { month: 'Jul', ingresos: 7900 },
]

export default function RevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Ingresos por mes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
            />
            <Tooltip
              formatter={(value) => [`$${value}`, 'Ingresos']}
            />
            <Area
              type="monotone"
              dataKey="ingresos"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#colorIngresos)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}