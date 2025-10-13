import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Plus } from 'lucide-react';

/**
 * Placeholder visual para manter o grid quando não há tasks
 */
export const EmptyTaskPlaceholder = ({ count = 2, message, compact = false }) => {
  const placeholders = Array.from({ length: count }, (_, i) => i);

  if (compact) {
    // Versão compacta para seções colapsadas
    return (
      <div className="space-y-2">
        {placeholders.map((i) => (
          <div
            key={i}
            className="p-4 border-2 border-dashed border-muted rounded-xl bg-muted/10 hover:bg-muted/20 transition-colors"
          >
            <div className="flex items-center justify-center gap-3 text-muted-foreground">
              <Calendar className="h-5 w-5" />
              <span className="text-sm font-medium">
                {i === 0 && message ? message : 'Nenhuma tarefa'}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Versão completa para seção ativa
  return (
    <div className="space-y-4">
      {placeholders.map((i) => (
        <Card
          key={i}
          className="border-2 border-dashed border-muted hover:border-primary/30 transition-all duration-300 bg-muted/10 hover:bg-muted/20"
        >
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
              <div className="p-4 rounded-full bg-muted">
                {i === 0 ? (
                  <Plus className="h-8 w-8" />
                ) : (
                  <Calendar className="h-8 w-8" />
                )}
              </div>
              <div className="text-center space-y-1">
                <p className="text-base font-semibold text-foreground">
                  {i === 0 && message ? message : 'Espaço para nova tarefa'}
                </p>
                <p className="text-sm">
                  {i === 0
                    ? 'Adicione tarefas para visualizá-las aqui'
                    : 'Placeholder para manter o layout'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
