import { useState } from 'react';
import { CheckCircle, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Seção da semana anterior com highlights e taxa de conclusão
 */
export const PreviousWeekSection = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { startDate, endDate, completionRate, completed, total, highlights, notes } = data;

  const completionPercent = Math.round(completionRate * 100);

  // Formata período
  const periodText = `${format(new Date(startDate), 'd MMM', { locale: ptBR })} - ${format(new Date(endDate), 'd MMM', { locale: ptBR })}`;

  return (
    <Card className="bg-green-50/30 border-green-200 opacity-80 hover:opacity-100 transition-opacity">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Semana Anterior
            </CardTitle>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{periodText}</span>
            </div>
          </div>
          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
            Completada
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Taxa de conclusão */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Taxa de Conclusão</span>
            <span className="font-semibold text-green-700">
              {completionPercent}% ({completed}/{total})
            </span>
          </div>
          <Progress value={completionPercent} className="h-2" />
        </div>

        {/* Highlights preview */}
        {!isExpanded && highlights.length > 0 && (
          <div className="text-sm text-muted-foreground">
            <p className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-600" />
              {highlights[0].text}
            </p>
            {highlights.length > 1 && (
              <p className="text-xs mt-1">+{highlights.length - 1} conquista(s)</p>
            )}
          </div>
        )}

        {/* Conteúdo expandido */}
        {isExpanded && (
          <div className="space-y-3 pt-2 border-t">
            {/* Todos os highlights */}
            {highlights.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">🎉 Conquistas da Semana</h4>
                {highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm bg-green-100 p-2 rounded">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{highlight.text}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Observações */}
            {notes && (
              <div className="space-y-1">
                <h4 className="text-sm font-medium">📝 Observações</h4>
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded italic">
                  "{notes}"
                </p>
              </div>
            )}
          </div>
        )}

        {/* Botão expandir/colapsar */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              Ver menos
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              Ver detalhes
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
