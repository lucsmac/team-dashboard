import { useEffect, useState } from 'react';
import { Users, TrendingUp, AlertCircle, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboardData } from '@/hooks/useDashboardData';
import { api } from '@/services/api';

/**
 * Cards de métricas principais do dashboard
 */
export const MetricsCards = () => {
  const {
    dashboardData,
    getActiveDemandsCount,
    getPlannedDemandsCount,
    getBlockersCount,
    getAchievementsCount
  } = useDashboardData();

  const [allocationStats, setAllocationStats] = useState(null);
  const [loadingAllocations, setLoadingAllocations] = useState(true);

  useEffect(() => {
    loadAllocationStats();
  }, []);

  const loadAllocationStats = async () => {
    try {
      const data = await api.getCurrentWeekAllocationStats();
      setAllocationStats(data);
    } catch (error) {
      console.error('Erro ao carregar stats de alocação:', error);
    } finally {
      setLoadingAllocations(false);
    }
  };

  // Conta devs únicos alocados em TODAS as alocações (roadmap, genius, service desk)
  const activeDevs = allocationStats?.uniqueDevs || 0;
  const totalDevs = dashboardData.devs?.length || 0;
  const utilization = totalDevs > 0 ? Math.round((activeDevs / totalDevs) * 100) : 0;

  // Prepara detalhamento da alocação para exibição
  const allocationDetail = allocationStats?.byType ?
    Object.entries(allocationStats.byType)
      .map(([type, data]) => {
        const emoji = type === 'roadmap' ? '🔵' : type === 'service-desk' ? '🟠' : '🟢';
        return `${emoji}${data.count}`;
      })
      .join(' ') : '';

  // Função para rolar até uma seção específica
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const metrics = [
    {
      title: 'Devs focados',
      value: `${activeDevs}/${totalDevs}`,
      subtitle: allocationDetail || `${utilization}% utilização`,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-muted/50',
      clickable: false
    },
    {
      title: 'Demandas ativas',
      value: getActiveDemandsCount(),
      subtitle: `${getPlannedDemandsCount()} planejadas`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-muted/50',
      clickable: false
    },
    {
      title: 'Entraves',
      value: getBlockersCount(),
      subtitle: 'requerem atenção',
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-muted/50',
      clickable: true,
      onClick: () => scrollToSection('blockers-section')
    },
    {
      title: 'Conquistas',
      value: getAchievementsCount(),
      subtitle: 'esta semana',
      icon: Award,
      color: 'text-foreground',
      bgColor: 'bg-muted/50',
      clickable: true,
      onClick: () => scrollToSection('achievements-section')
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card
            key={metric.title}
            className={`transition-all hover:shadow-lg hover:-translate-y-1 ${
              metric.clickable ? 'cursor-pointer' : ''
            }`}
            onClick={metric.clickable ? metric.onClick : undefined}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                {metric.subtitle}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
