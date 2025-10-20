import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarClock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { ALLOCATION_TYPE_LABELS, ALLOCATION_TYPE_EMOJIS } from '@/utils/enums';

/**
 * Card de overview com estatísticas de alocação da semana atual
 */
export function AllocationOverview() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

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
      <CardContent className="space-y-3">
        {Object.entries(stats.byType).map(([type, data]) => (
          <div key={type} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">{ALLOCATION_TYPE_EMOJIS[type]}</span>
              <span className="text-sm font-medium">{ALLOCATION_TYPE_LABELS[type]}</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold">{data.count}</div>
              <div className="text-xs text-muted-foreground">
                {data.devs.length > 1 ? `${data.devs.length} devs` : '1 dev'}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
