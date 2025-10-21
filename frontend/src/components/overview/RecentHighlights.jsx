import { AlertCircle, Award, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useDashboardData } from '@/hooks/useDashboardData';

/**
 * Highlights recentes (entraves e conquistas)
 */
export const RecentHighlights = () => {
  const { dashboardData } = useDashboardData();

  const recentBlockers = dashboardData.highlights.blockers.slice(0, 2);
  const recentAchievements = dashboardData.highlights.achievements.slice(0, 2);

  // Helper para buscar demand por ID
  const getDemand = (demandId) => {
    if (!dashboardData?.demands) return null;

    for (const category in dashboardData.demands) {
      const demand = dashboardData.demands[category].find(d => d.id === demandId);
      if (demand) return { ...demand, category };
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Card de Entraves */}
      <Card id="blockers-section">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <CardTitle>Entraves</CardTitle>
            <Badge variant="destructive" className="text-xs ml-auto">
              {dashboardData.highlights.blockers.length}
            </Badge>
          </div>
          <CardDescription>Requerem atenção imediata</CardDescription>
        </CardHeader>
        <CardContent>
          {recentBlockers.length > 0 ? (
            <div className="space-y-2">
              {recentBlockers.map((blocker) => {
                const demand = blocker.demandId ? getDemand(blocker.demandId) : null;

                return (
                  <Alert key={blocker.id} variant="destructive" className="py-2">
                    <AlertDescription className="text-xs">
                      {demand && (
                        <div className="font-medium text-red-700 mb-1">
                          {demand.category}: {demand.title}
                        </div>
                      )}
                      <div>{blocker.text}</div>
                    </AlertDescription>
                  </Alert>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhum entrave</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Card de Conquistas */}
      <Card id="achievements-section">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-green-600" />
            <CardTitle>Conquistas</CardTitle>
            <Badge variant="outline" className="text-xs ml-auto">
              {dashboardData.highlights.achievements.length}
            </Badge>
          </div>
          <CardDescription>Celebrando o progresso</CardDescription>
        </CardHeader>
        <CardContent>
          {recentAchievements.length > 0 ? (
            <div className="space-y-2">
              {recentAchievements.map((achievement) => {
                const demand = achievement.demandId ? getDemand(achievement.demandId) : null;

                return (
                  <Alert key={achievement.id} className="py-2 border-green-500/20 bg-green-500/5">
                    <AlertDescription className="text-xs text-foreground">
                      {demand && (
                        <div className="font-medium text-green-700 mb-1">
                          {demand.category}: {demand.title}
                        </div>
                      )}
                      <div>{achievement.text}</div>
                    </AlertDescription>
                  </Alert>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhuma conquista</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
