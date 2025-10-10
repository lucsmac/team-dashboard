import { CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDashboardData } from '@/hooks/useDashboardData';
import { getValueBadgeColor } from '@/utils/colorUtils';

/**
 * Lista de próximas entregas
 */
export const UpcomingDeliveries = () => {
  const { dashboardData } = useDashboardData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximas Entregas</CardTitle>
        <CardDescription>O que vamos entregar esta semana</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dashboardData.deliveries.slice(0, 3).map((delivery) => (
            <div key={delivery.id} className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2 flex-1">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{delivery.title}</p>
                    <Badge
                      variant="outline"
                      className="mt-1 text-xs"
                    >
                      {delivery.valueType}
                    </Badge>
                  </div>
                </div>
              </div>

              <ul className="ml-6 space-y-1">
                {delivery.items.slice(0, 2).map((item, idx) => (
                  <li key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                    <span className="text-muted-foreground">•</span>
                    <span className="truncate">{item}</span>
                  </li>
                ))}
                {delivery.items.length > 2 && (
                  <li className="text-xs text-muted-foreground italic">
                    +{delivery.items.length - 2} mais...
                  </li>
                )}
              </ul>
            </div>
          ))}

          {dashboardData.deliveries.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhuma entrega planejada</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
