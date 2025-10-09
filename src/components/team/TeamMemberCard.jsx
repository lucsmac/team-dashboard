import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowRight } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';

/**
 * Card individual de desenvolvedor
 */
export const TeamMemberCard = ({ dev }) => {
  const { editMode, updateDev } = useDashboardData();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className={`inline-block px-4 py-2 rounded-lg font-semibold ${dev.color}`}>
            {dev.name}
          </div>
          <Badge variant="outline" className="text-xs">
            <Calendar className="h-3 w-3 mr-1" />
            Semana Atual
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Semana Anterior */}
        <div>
          <p className="text-xs text-muted-foreground mb-1">Semana Anterior</p>
          <p className="text-sm text-gray-700">{dev.lastWeek}</p>
        </div>

        {/* Esta Semana */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-xs text-blue-600 font-medium mb-1">Esta Semana</p>
          <p className="text-sm font-semibold text-gray-900">{dev.thisWeek}</p>
        </div>

        {/* Próxima Semana */}
        <div>
          <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
            Próxima Semana
            <ArrowRight className="h-3 w-3" />
          </p>
          <p className="text-sm text-gray-700">{dev.nextWeek}</p>
        </div>
      </CardContent>
    </Card>
  );
};
