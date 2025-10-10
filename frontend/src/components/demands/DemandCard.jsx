import { Link as LinkIcon, User, TrendingUp, CheckCircle, Edit2, Trash2 } from 'lucide-react';
import { useDashboardData } from '../../hooks/useDashboardData';
import { PriorityIndicator } from '../common/StatusIndicator';
import { getStatusColor, getValueBadgeColor } from '../../utils/colorUtils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DEMAND_STAGE_LABELS, STAGE_COLORS } from '@/utils/enums';

/**
 * Card individual de demanda
 */
export const DemandCard = ({ demand, category, onEdit, onDelete }) => {
  const { dashboardData } = useDashboardData();

  // Buscar timeline tasks vinculadas
  const linkedTasks = demand.timelineTasks || [];

  return (
    <Card className={`${getStatusColor(demand.status)} hover:shadow-md transition-shadow`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <PriorityIndicator priority={demand.priority} size="sm" />
            <h4 className="font-semibold text-foreground text-sm leading-tight">{demand.title}</h4>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="outline" className={`text-xs ${getValueBadgeColor(demand.value)}`}>
              {demand.value}
            </Badge>
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(demand)}
                className="h-7 w-7 p-0"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (window.confirm(`Tem certeza que deseja remover a demanda "${demand.title}"?`)) {
                    onDelete(demand.id);
                  }
                }}
                className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
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

        {/* Etapa da demanda */}
        {demand.stage && (
          <div className="flex items-center gap-2 pt-1">
            <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
            <Badge variant="secondary" className={`text-xs ${STAGE_COLORS[demand.stage] || ''}`}>
              {DEMAND_STAGE_LABELS[demand.stage] || demand.stage}
            </Badge>
          </div>
        )}

        {/* Timeline tasks vinculadas */}
        {linkedTasks.length > 0 && (
          <div className="pt-2 border-t space-y-1">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Timeline Tasks ({linkedTasks.length})
            </p>
            <div className="space-y-1">
              {linkedTasks.slice(0, 3).map((task, idx) => (
                <div key={idx} className="text-xs text-gray-600 flex items-center gap-2">
                  <div className="flex-1 truncate">{task.title}</div>
                  <Badge variant="outline" className="text-xs">
                    {task.progress}%
                  </Badge>
                </div>
              ))}
              {linkedTasks.length > 3 && (
                <p className="text-xs text-muted-foreground italic">
                  +{linkedTasks.length - 3} mais
                </p>
              )}
            </div>
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
