import { AlertCircle, Award, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useDashboardData } from '@/hooks/useDashboardData';
import { getSeverityColor, getInfoTypeColor } from '@/utils/colorUtils';

/**
 * Aba de highlights (entraves, conquistas, informações importantes)
 */
export const HighlightsTab = () => {
  const { dashboardData } = useDashboardData();

  const { blockers, achievements, important } = dashboardData.highlights;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Entraves */}
      <Card className="border-t-4 border-red-500">
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
      <Card className="border-t-4 border-green-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-green-600" />
              Conquistas
            </CardTitle>
            <Badge variant="outline" className="bg-green-50 text-green-700">
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
                className="py-3 border-green-200 bg-green-50"
              >
                <AlertDescription className="text-sm text-green-900">
                  {achievement.text}
                </AlertDescription>
              </Alert>
            ))
          )}
        </CardContent>
      </Card>

      {/* Informações Importantes */}
      <Card className="border-t-4 border-blue-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              Informações
            </CardTitle>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
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
                ? 'bg-green-50 border-green-200 text-green-900'
                : info.type === 'warning'
                  ? 'bg-yellow-50 border-yellow-200 text-yellow-900'
                  : 'bg-blue-50 border-blue-200 text-blue-900';

              return (
                <Alert
                  key={info.id}
                  className={`py-3 ${bgClass}`}
                >
                  <AlertDescription className="text-sm">
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
