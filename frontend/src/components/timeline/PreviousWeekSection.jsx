import { useState } from 'react';
import { CheckCircle, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyTaskPlaceholder } from './EmptyTaskPlaceholder';
import { TaskCard } from './TaskCard';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const PreviousWeekSection = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    startDate,
    endDate,
    completionRate = 0,
    completed = 0,
    total = 0,
    highlights = [],
    tasks = [],
    notes
  } = data || {};

  // Usar datas padrão se não fornecidas (semana passada)
  const now = new Date();
  const lastSunday = new Date(now);
  lastSunday.setDate(now.getDate() - now.getDay() - 7);
  const lastSaturday = new Date(lastSunday);
  lastSaturday.setDate(lastSunday.getDate() + 6);

  const effectiveStartDate = startDate || lastSunday.toISOString();
  const effectiveEndDate = endDate || lastSaturday.toISOString();

  const completionPercent = Math.round(completionRate * 100);

  const periodText = `${format(new Date(effectiveStartDate), 'd MMM', { locale: ptBR })} - ${format(new Date(effectiveEndDate), 'd MMM', { locale: ptBR })}`;

  // Agrupar tasks por status e separar 4DX
  const groupTasksByStatus = (taskList) => {
    return {
      concluida: taskList.filter(t => t.status === 'concluida'),
      'em-andamento': taskList.filter(t => t.status === 'em-andamento'),
      'nao-iniciada': taskList.filter(t => t.status === 'nao-iniciada')
    };
  };

  const tasks4DX = tasks.filter(t => t.category === '4DX');
  const otherTasks = tasks.filter(t => t.category !== '4DX');

  const grouped4DX = groupTasksByStatus(tasks4DX);
  const groupedOther = groupTasksByStatus(otherTasks);

  // Helper para renderizar grupo de tasks por status
  const renderStatusGroup = (status, taskList, label, icon, color) => {
    if (taskList.length === 0) return null;

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge
            variant={status === 'concluida' ? 'default' : status === 'em-andamento' ? 'secondary' : 'outline'}
            className={`text-xs font-semibold px-3 py-1 ${
              status === 'concluida' ? 'bg-green-100 text-green-800 border-green-300' :
              status === 'em-andamento' ? 'bg-blue-100 text-blue-800 border-blue-300' :
              'bg-gray-100 text-gray-800 border-gray-300'
            }`}
          >
            {icon} {label} ({taskList.length})
          </Badge>
        </div>
        <div className="space-y-3 pl-4 border-l-2" style={{ borderColor: color }}>
          {taskList.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="relative border opacity-70 hover:opacity-100 transition-all duration-300 hover:shadow-lg rounded-xl overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-muted-foreground" />

      <CardHeader className="pb-4 pt-5">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <CardTitle className="text-base font-bold flex items-center gap-2.5">
              <div className="p-1.5 bg-muted rounded-lg">
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="text-foreground">Semana anterior</span>
            </CardTitle>
            <div className="flex items-center gap-2 text-xs text-muted-foreground ml-11">
              <Calendar className="h-3.5 w-3.5" />
              <span className="font-medium">{periodText}</span>
            </div>
          </div>
          <Badge variant="outline" className="px-3 py-1 rounded-full font-medium">
            Completada
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-medium">Taxa de conclusão</span>
            <span className="font-bold text-green-700 text-base">
              {completionPercent}% <span className="text-xs font-normal text-muted-foreground">({completed}/{total})</span>
            </span>
          </div>
          <div className="relative w-full bg-muted rounded-full h-2.5 overflow-hidden">
            <div
              className="h-2.5 rounded-full bg-green-500 transition-all duration-500"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>

        {!isExpanded && (
          <>
            {highlights.length > 0 ? (
              <div className="bg-muted/20 p-4 rounded-lg border">
                <p className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-foreground">{highlights[0].text}</span>
                </p>
                {highlights.length > 1 && (
                  <p className="text-xs text-muted-foreground mt-2 ml-6 font-medium">
                    +{highlights.length - 1} conquista(s)
                  </p>
                )}
              </div>
            ) : (
              <EmptyTaskPlaceholder
                count={1}
                message="Nenhuma conquista registrada"
                compact
              />
            )}
          </>
        )}

        {isExpanded && (
          <div className="space-y-6 pt-3 border-t">
            {/* Tasks da semana */}
            {tasks.length > 0 && (
              <div className="space-y-5">
                <h4 className="text-sm font-bold flex items-center gap-2 text-foreground">
                  <span className="text-lg">📋</span>
                  Tarefas da Semana
                </h4>

                {/* Seção 4DX */}
                {tasks4DX.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2">
                      <div className="h-px flex-1 bg-gradient-to-r from-blue-500/50 to-transparent"></div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-full">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                          4DX - Foco Estratégico
                        </span>
                      </div>
                      <div className="h-px flex-1 bg-gradient-to-l from-blue-500/50 to-transparent"></div>
                    </div>

                    <div className="space-y-5 pl-1">
                      {renderStatusGroup('concluida', grouped4DX.concluida, 'Concluídas', '✅', '#22c55e')}
                      {renderStatusGroup('em-andamento', grouped4DX['em-andamento'], 'Em Andamento', '▶️', '#3b82f6')}
                      {renderStatusGroup('nao-iniciada', grouped4DX['nao-iniciada'], 'Não Iniciadas', '⏸️', '#9ca3af')}
                    </div>
                  </div>
                )}

                {/* Outras Demandas */}
                {otherTasks.length > 0 && (
                  <div className="space-y-4">
                    {tasks4DX.length > 0 && (
                      <div className="flex items-center gap-2 pb-2">
                        <div className="h-px flex-1 bg-gradient-to-r from-muted to-transparent"></div>
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-2">
                          Outras Demandas
                        </span>
                        <div className="h-px flex-1 bg-gradient-to-l from-muted to-transparent"></div>
                      </div>
                    )}

                    <div className="space-y-5">
                      {renderStatusGroup('concluida', groupedOther.concluida, 'Concluídas', '✅', '#22c55e')}
                      {renderStatusGroup('em-andamento', groupedOther['em-andamento'], 'Em Andamento', '▶️', '#3b82f6')}
                      {renderStatusGroup('nao-iniciada', groupedOther['nao-iniciada'], 'Não Iniciadas', '⏸️', '#9ca3af')}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Conquistas */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <span className="text-lg">🎉</span>
                Conquistas da Semana
              </h4>
              {highlights.length > 0 ? (
                <>
                  {highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm bg-muted/20 p-4 rounded-lg border">
                      <CheckCircle className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <span className="font-medium text-foreground">{highlight.text}</span>
                    </div>
                  ))}
                </>
              ) : (
                <EmptyTaskPlaceholder
                  count={2}
                  message="Nenhuma conquista registrada"
                  compact
                />
              )}
            </div>

            {notes && (
              <div className="space-y-2">
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <span className="text-lg">📝</span>
                  Observações
                </h4>
                <p className="text-sm text-muted-foreground bg-muted/20 p-4 rounded-lg border italic leading-relaxed">
                  "{notes}"
                </p>
              </div>
            )}
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full hover:bg-muted/30 rounded-lg"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-2" />
              Ver menos
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-2" />
              Ver detalhes
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
