import { Link as LinkIcon, User } from 'lucide-react';
import { useDashboardData } from '../../hooks/useDashboardData';
import { PriorityIndicator } from '../common/StatusIndicator';
import { getStatusColor, getValueBadgeColor } from '../../utils/colorUtils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

/**
 * Card individual de demanda
 */
export const DemandCard = ({ demand, category }) => {
  const { dashboardData } = useDashboardData();

  return (
    <Card className={`${getStatusColor(demand.status)} hover:shadow-md transition-shadow`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <PriorityIndicator priority={demand.priority} size="sm" />
            <h4 className="font-semibold text-foreground text-sm leading-tight">{demand.title}</h4>
          </div>
          <Badge variant="outline" className={`text-xs shrink-0 ${getValueBadgeColor(demand.value)}`}>
            {demand.value}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Descrição */}
        <p className="text-sm text-muted-foreground leading-relaxed">{demand.details}</p>

        {/* Desenvolvedores */}
        {demand.assignedDevs.length > 0 && (
          <div className="flex items-center gap-2">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
            <div className="flex gap-1 flex-wrap">
              {demand.assignedDevs.map((devName, idx) => {
                const dev = dashboardData.devs.find(d => d.name === devName);
                if (!dev) return null;
                return (
                  <Badge key={idx} variant="secondary" className={`text-xs ${dev.color}`}>
                    {devName}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        {/* Links */}
        {demand.links.length > 0 && (
          <div className="flex gap-2 flex-wrap pt-1">
            {demand.links.map((link, idx) => (
              <a
                key={idx}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-foreground hover:text-foreground/80 underline flex items-center gap-1"
              >
                <LinkIcon className="w-3 h-3" />
                Link {idx + 1}
              </a>
            ))}
          </div>
        )}

        {/* Status */}
        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-xs text-muted-foreground capitalize">
            {demand.status.replace('-', ' ')}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
