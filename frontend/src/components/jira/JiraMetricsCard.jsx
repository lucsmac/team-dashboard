import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, TrendingUp, ListTodo, Clock } from 'lucide-react';
import { api } from '@/services/api';

/**
 * Card com métricas de um board Jira
 */
export function JiraMetricsCard({ integration }) {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMetrics();
  }, [integration.id]);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getJiraIntegrationMetrics(integration.id);
      setMetrics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Métricas do Board</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Métricas do Board</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-destructive">
            Erro ao carregar métricas: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Métricas do Board</CardTitle>
        <CardDescription>Situação atual do {integration.name}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListTodo className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Backlog</span>
          </div>
          <Badge variant="outline">{metrics.backlogSize || 0}</Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">Em Progresso</span>
          </div>
          <Badge variant="outline" className="bg-blue-50">
            {metrics.inProgressCount || 0}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">Concluídas (esta semana)</span>
          </div>
          <Badge variant="outline" className="bg-green-50">
            {metrics.completedThisWeek || 0}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
