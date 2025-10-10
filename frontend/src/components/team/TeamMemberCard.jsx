import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight, Code, Award, Edit2, Trash2 } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { DEV_ROLE_LABELS, SENIORITY_LABELS, DEV_ROLE_COLORS, SENIORITY_COLORS } from '@/utils/enums';

/**
 * Card individual de desenvolvedor
 */
export const TeamMemberCard = ({ dev, onEdit, onDelete }) => {
  const { editMode } = useDashboardData();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <div className={`inline-block px-4 py-2 rounded-lg font-semibold ${dev.color}`}>
            {dev.name}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              Semana Atual
            </Badge>
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(dev)}
                className="h-8 w-8 p-0"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (window.confirm(`Tem certeza que deseja remover ${dev.name}?`)) {
                    onDelete(dev.id);
                  }
                }}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Badge
            variant="secondary"
            className={`text-xs ${DEV_ROLE_COLORS[dev.role] || 'bg-gray-100'}`}
          >
            <Code className="h-3 w-3 mr-1" />
            {DEV_ROLE_LABELS[dev.role] || dev.role}
          </Badge>
          <Badge
            variant="secondary"
            className={`text-xs ${SENIORITY_COLORS[dev.seniority] || 'bg-gray-100'}`}
          >
            <Award className="h-3 w-3 mr-1" />
            {SENIORITY_LABELS[dev.seniority] || dev.seniority}
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
        <div className="bg-muted/50 p-3 rounded-lg border-l-2 border-foreground">
          <p className="text-xs text-foreground font-medium mb-1">Esta Semana</p>
          <p className="text-sm font-semibold text-foreground">{dev.thisWeek}</p>
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
