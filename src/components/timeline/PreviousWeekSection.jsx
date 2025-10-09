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
    <Card className="relative bg-gradient-to-br from-green-50/30 via-white to-green-50/20 backdrop-blur-sm border border-green-200/60 opacity-60 hover:opacity-100 transition-all duration-300 hover:shadow-lg rounded-2xl overflow-hidden hover:scale-[1] scale-[0.99]">
      {/* Accent gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-300 via-green-500 to-green-300" />

      <CardHeader className="pb-4 pt-5">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <CardTitle className="text-base font-bold flex items-center gap-2.5">
              <div className="p-1.5 bg-green-100 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-foreground">Semana Anterior</span>
            </CardTitle>
            <div className="flex items-center gap-2 text-xs text-muted-foreground ml-11">
              <Calendar className="h-3.5 w-3.5" />
              <span className="font-medium">{periodText}</span>
            </div>
          </div>
          <Badge variant="outline" className="bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-green-300 px-3 py-1 rounded-full font-semibold">
            Completada
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Taxa de conclusão */}
        <div className="space-y-3 p-4 bg-white/60 backdrop-blur rounded-xl border border-green-100">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-medium">Taxa de Conclusão</span>
            <span className="font-bold text-green-700 text-base">
              {completionPercent}% <span className="text-xs font-normal text-muted-foreground">({completed}/{total})</span>
            </span>
          </div>
          <div className="relative w-full bg-green-100/50 rounded-full h-3 overflow-hidden">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>

        {/* Highlights preview */}
        {!isExpanded && highlights.length > 0 && (
          <div className="bg-white/50 p-4 rounded-xl border border-green-100">
            <p className="flex items-center gap-2 text-sm font-medium">
              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
              <span className="text-foreground">{highlights[0].text}</span>
            </p>
            {highlights.length > 1 && (
              <p className="text-xs text-muted-foreground mt-2 ml-6 font-medium">
                +{highlights.length - 1} conquista(s)
              </p>
            )}
          </div>
        )}

        {/* Conteúdo expandido */}
        {isExpanded && (
          <div className="space-y-4 pt-3 border-t border-green-100">
            {/* Todos os highlights */}
            {highlights.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <span className="text-lg">🎉</span>
                  Conquistas da Semana
                </h4>
                {highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm bg-gradient-to-r from-green-50 to-green-100/50 p-4 rounded-xl border border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="font-medium text-foreground">{highlight.text}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Observações */}
            {notes && (
              <div className="space-y-2">
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <span className="text-lg">📝</span>
                  Observações
                </h4>
                <p className="text-sm text-muted-foreground bg-secondary/50 p-4 rounded-xl border italic leading-relaxed">
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
          className="w-full hover:bg-green-50/50 rounded-xl"
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
