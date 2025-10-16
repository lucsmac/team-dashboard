import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RoadmapDemandCard } from './RoadmapDemandCard';
import { Calendar, CheckCircle, AlertCircle } from 'lucide-react';

/**
 * Coluna representando uma semana no roadmap
 */
export const RoadmapWeekColumn = ({ week }) => {
  const formatWeekRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const startDay = start.getDate().toString().padStart(2, '0');
    const endDay = end.getDate().toString().padStart(2, '0');
    const startMonth = start.toLocaleDateString('pt-BR', { month: 'short' });
    const endMonth = end.toLocaleDateString('pt-BR', { month: 'short' });

    if (startMonth === endMonth) {
      return `${startDay}-${endDay} ${startMonth}`;
    }
    return `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
  };

  const weekLabel = formatWeekRange(week.startDate, week.endDate);

  return (
    <div className="flex-shrink-0 w-80">
      <Card className={`h-full ${week.isCurrent ? 'ring-2 ring-primary shadow-lg' : ''}`}>
        <CardHeader className={`pb-3 ${week.isCurrent ? 'bg-primary/5' : ''}`}>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {weekLabel}
              </CardTitle>
              {week.isCurrent && (
                <Badge variant="default" className="text-xs">
                  Atual
                </Badge>
              )}
              {week.isPast && (
                <Badge variant="secondary" className="text-xs">
                  Passado
                </Badge>
              )}
              {!week.isCurrent && !week.isPast && (
                <Badge variant="outline" className="text-xs">
                  Futuro
                </Badge>
              )}
            </div>

            {/* Informações adicionais */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="font-medium">{week.demands.length}</span>
                {week.demands.length === 1 ? 'demanda' : 'demandas'}
              </span>
              {week.completionRate !== undefined && (
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  {Math.round(week.completionRate * 100)}%
                </span>
              )}
            </div>

            {/* Alertas (apenas semana atual) */}
            {week.alerts && week.alerts.length > 0 && (
              <div className="pt-2 border-t">
                <div className="flex items-center gap-2 text-xs text-orange-600">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span className="font-medium">{week.alerts.length} alerta(s)</span>
                </div>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-3 overflow-y-auto max-h-[calc(100vh-300px)]">
          {week.demands.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Nenhuma demanda nesta semana</p>
            </div>
          ) : (
            week.demands.map((demand) => (
              <RoadmapDemandCard key={demand.id} demand={demand} />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
