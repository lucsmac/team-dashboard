import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CalendarClock, ArrowRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '@/services/api';
import { ALLOCATION_TYPE_LABELS, ALLOCATION_TYPE_EMOJIS, ALLOCATION_TYPE_COLORS } from '@/utils/enums';

/**
 * Card de overview com estatísticas de alocação da semana atual
 */
export function AllocationOverview() {
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Recarregar dados quando entrar na aba overview
    if (location.pathname === '/overview' || location.pathname === '/') {
      loadStats();
    }
  }, [location.pathname]);

  const loadStats = async () => {
    try {
      const data = await api.getCurrentWeekAllocationStats();
      setStats(data);
    } catch (error) {
      console.error('Erro ao carregar stats de alocação:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5" />
            Alocação do Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Carregando...</div>
        </CardContent>
      </Card>
    );
  }

  if (!stats || stats.totalAllocations === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5" />
            Alocação do Time
          </CardTitle>
          <CardDescription>Nenhuma alocação cadastrada esta semana</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={() => navigate('/allocation')} className="w-full">
            Gerenciar Alocações
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5" />
              Alocação Esta Semana
            </CardTitle>
            <CardDescription>{stats.uniqueDevs} desenvolvedores alocados</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/allocation')}>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(stats.byType).map(([type, data]) => {
          const percentage = Math.round((data.count / stats.totalAllocations) * 100);
          const colorClass = type === 'roadmap' ? 'bg-blue-500' :
                           type === 'service-desk' ? 'bg-orange-500' :
                           'bg-green-500';

          return (
            <div key={type} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{ALLOCATION_TYPE_EMOJIS[type]}</span>
                  <span className="text-sm font-medium">{ALLOCATION_TYPE_LABELS[type]}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">{data.count} alocações</div>
                  <div className="text-xs text-muted-foreground">
                    {data.devs.length} {data.devs.length > 1 ? 'devs' : 'dev'} · {percentage}%
                  </div>
                </div>
              </div>
              <div className="relative">
                <Progress value={percentage} className="h-2" />
                <div
                  className={`absolute top-0 left-0 h-2 rounded-full transition-all ${colorClass}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
