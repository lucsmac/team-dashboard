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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alertas & Conquistas</CardTitle>
        <CardDescription>Status recente do time</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Entraves */}
        {recentBlockers.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <h4 className="text-sm font-medium">Entraves</h4>
              <Badge variant="destructive" className="text-xs">
                {dashboardData.highlights.blockers.length}
              </Badge>
            </div>
            {recentBlockers.map((blocker) => (
              <Alert key={blocker.id} variant="destructive" className="py-2">
                <AlertDescription className="text-xs">
                  {blocker.text}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Conquistas */}
        {recentAchievements.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-green-600" />
              <h4 className="text-sm font-medium">Conquistas</h4>
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                {dashboardData.highlights.achievements.length}
              </Badge>
            </div>
            {recentAchievements.map((achievement) => (
              <Alert key={achievement.id} className="py-2 border-green-200 bg-green-50">
                <AlertDescription className="text-xs text-green-900">
                  {achievement.text}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Estado vazio */}
        {recentBlockers.length === 0 && recentAchievements.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhum alerta ou conquista recente</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
