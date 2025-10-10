import { AlertCircle, Award, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useDashboardData } from '@/hooks/useDashboardData';
import { getSeverityColor, getInfoTypeColor } from '@/utils/colorUtils';

/**
 * Página de highlights (entraves, conquistas, informações importantes)
 */
export const HighlightsPage = () => {
  const { dashboardData } = useDashboardData();

  const { blockers, achievements, important } = dashboardData.highlights;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Entraves */}
      <Card className="border-t-2 border-red-600">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Entraves
            </CardTitle>
            <Badge variant="destructive">{blockers.length}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {blockers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nenhum entrave no momento 🎉
            </p>
          ) : (
            blockers.map((blocker) => (
              <Alert
                key={blocker.id}
                variant={blocker.severity === 'alta' ? 'destructive' : 'default'}
                className="py-3"
              >
                <AlertDescription className="text-sm">
                  {blocker.text}
                  <Badge
                    variant="outline"
                    className="ml-2 text-xs"
                  >
                    {blocker.severity}
                  </Badge>
                </AlertDescription>
              </Alert>
            ))
          )}
        </CardContent>
      </Card>

      {/* Conquistas */}
      <Card className="border-t-2 border-green-600">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-green-600" />
              Conquistas
            </CardTitle>
            <Badge variant="outline">
              {achievements.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {achievements.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nenhuma conquista registrada ainda
            </p>
          ) : (
            achievements.map((achievement) => (
              <Alert
                key={achievement.id}
                className="py-3 border-green-500/20 bg-green-500/5"
              >
                <AlertDescription className="text-sm text-foreground">
                  {achievement.text}
                </AlertDescription>
              </Alert>
            ))
          )}
        </CardContent>
      </Card>

      {/* Informações Importantes */}
      <Card className="border-t-2 border-foreground">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5 text-foreground" />
              Informações
            </CardTitle>
            <Badge variant="outline">
              {important.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {important.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nenhuma informação importante no momento
            </p>
          ) : (
            important.map((info) => {
              const bgClass = info.type === 'success'
                ? 'bg-green-500/5 border-green-500/20'
                : info.type === 'warning'
                  ? 'bg-yellow-500/5 border-yellow-500/20'
                  : 'bg-muted/30 border-border';

              return (
                <Alert
                  key={info.id}
                  className={`py-3 ${bgClass}`}
                >
                  <AlertDescription className="text-sm text-foreground">
                    {info.text}
                  </AlertDescription>
                </Alert>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
};
