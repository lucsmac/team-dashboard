import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useDashboardData } from '@/hooks/useDashboardData';

/**
 * Card de tarefa na timeline com prioridade, progresso e devs
 */
export const TaskCard = ({ task }) => {
  const { dashboardData } = useDashboardData();

  // Backend retorna assignedDevs como array de TimelineTaskAssignment { id, devId, dev: Dev }
  // Extrair os objetos dev diretamente
  const devInfos = (task.assignedDevs || [])
    .map(assignment => assignment.dev)
    .filter(dev => dev !== null && dev !== undefined);

  // Iniciais do dev para avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const priorityLabels = {
    'alta': '🔴 Alta',
    'media': '🟡 Média',
    'baixa': '🟢 Baixa'
  };

  // Filtra highlights por tipo (vindo da relação com Highlight)
  const blockers = task.highlights?.filter(h => h.type === 'entrave') || [];
  const achievements = task.highlights?.filter(h => h.type === 'conquista') || [];

  return (
    <Card className="group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-border/50 bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
      <CardContent className="p-5 space-y-4">
        {/* Header com título e badges */}
        <div className="space-y-2">
          <div className="space-y-1.5">
            {task.demand?.title && (
              <p className="text-xs font-semibold text-primary uppercase tracking-wide">
                📋 {task.demand.title}
              </p>
            )}
            <h4 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors leading-tight">
              {task.title}
            </h4>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Badge */}
            {task.status && (
              <Badge
                variant="outline"
                className={`text-xs rounded-full px-3 py-1 font-medium ${
                  task.status === 'concluida' ? 'bg-green-50 border-green-500 text-green-700' :
                  task.status === 'em-andamento' ? 'bg-blue-50 border-blue-500 text-blue-700' :
                  'bg-gray-50 border-gray-400 text-gray-700'
                }`}
              >
                {task.status === 'nao-iniciada' ? '⏸️ Não iniciada' :
                  task.status === 'em-andamento' ? '▶️ Em andamento' :
                    '✅ Concluída'}
              </Badge>
            )}
            {/* Priority Badge */}
            {task.demand?.priority && (
              <Badge
                variant={task.demand.priority === 'alta' ? 'destructive' : 'secondary'}
                className="text-xs rounded-full px-3 py-1 font-medium"
              >
                {task.demand.priority === 'alta' ? '🔴 Alta prioridade' :
                 task.demand.priority === 'media' ? '🟡 Média prioridade' :
                 '🟢 Baixa prioridade'}
              </Badge>
            )}
            {/* Category Badge */}
            {task.demand?.category ? (
              <Badge variant="outline" className="text-xs rounded-full font-medium">
                📁 {task.demand.category}
              </Badge>
            ) : task.demandId ? (
              <Badge variant="outline" className="text-xs rounded-full font-medium text-muted-foreground">
                📁 Demanda associada
              </Badge>
            ) : null}
          </div>
        </div>

        {/* Devs alocados */}
        {devInfos.length > 0 ? (
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              {devInfos.slice(0, 3).map((dev) => (
                <Avatar key={dev.id} className="h-8 w-8 border-2 border-white ring-1 ring-border/50 transition-transform hover:scale-110 hover:z-10">
                  <AvatarFallback className={`text-xs font-semibold ${dev.color || 'bg-blue-500 text-white'}`}>
                    {getInitials(dev.name)}
                  </AvatarFallback>
                </Avatar>
              ))}
              {devInfos.length > 3 && (
                <Avatar className="h-8 w-8 border-2 border-white ring-1 ring-border/50">
                  <AvatarFallback className="text-xs bg-gray-100 font-semibold">
                    +{devInfos.length - 3}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
            <div className="text-xs font-medium">
              {devInfos.length === 1 ? (
                <span className="text-foreground">{devInfos[0].name}</span>
              ) : (
                <span className="text-muted-foreground">{devInfos.length} devs alocados</span>
              )}
            </div>
          </div>
        ) : (
          <div className="text-xs text-muted-foreground italic">
            👤 Nenhum dev alocado
          </div>
        )}

        {/* Blockers - pastel sem gradiente */}
        {blockers.length > 0 && (
          <div className="flex items-start gap-2 text-xs text-red-700 bg-red-50 p-3 rounded-lg border border-red-200">
            <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span className="font-medium">{blockers[0].text}</span>
          </div>
        )}

        {/* Highlights principais - pastel sem gradiente */}
        {achievements.length > 0 && (
          <div className="flex items-start gap-2 text-xs text-blue-700 bg-blue-50 p-3 rounded-lg border border-blue-200">
            <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span className="font-medium">{achievements[0].text}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
