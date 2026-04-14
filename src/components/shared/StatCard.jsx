import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function StatCard({ title, value, description, icon: Icon }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && <Icon size={16} className="text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">{value}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}