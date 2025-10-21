import { useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Hook para processar dados e prepará-los para os gráficos
 */
export const useChartData = () => {
  const { timeline, devs, demands } = useDashboard();

  // Dados para o gráfico de linha de conclusão semanal
  const weeklyCompletionData = useMemo(() => {
    if (!timeline) return [];

    const data = [];

    // Adicionar semana anterior se existir
    if (timeline.previousWeek && timeline.previousWeek.startDate) {
      const completionRate = Math.round((timeline.previousWeek.completionRate || 0) * 100);
      data.push({
        week: `Sem ${format(new Date(timeline.previousWeek.startDate), 'dd/MM', { locale: ptBR })}`,
        completionRate,
        completed: timeline.previousWeek.completed || 0,
        total: timeline.previousWeek.total || 0
      });
    }

    // Adicionar semana atual
    if (timeline.currentWeek?.tasks && timeline.currentWeek.startDate) {
      const tasks = timeline.currentWeek.tasks;
      const completed = tasks.filter(t => t.status === 'concluida').length;
      const total = tasks.length;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

      data.push({
        week: `Sem ${format(new Date(timeline.currentWeek.startDate), 'dd/MM', { locale: ptBR })}`,
        completionRate,
        completed,
        total
      });
    }

    // Adicionar projeção para próximas semanas (se houver histórico)
    if (timeline.upcomingWeeks?.length > 0 && data.length >= 2) {
      const avgCompletion = data.reduce((sum, w) => sum + w.completionRate, 0) / data.length;

      timeline.upcomingWeeks.slice(0, 2).forEach((week) => {
        if (week.startDate) {
          data.push({
            week: `Sem ${format(new Date(week.startDate), 'dd/MM', { locale: ptBR })}`,
            completionRate: Math.round(avgCompletion),
            completed: 0,
            total: week.plannedTasks?.length || 0,
            isProjection: true
          });
        }
      });
    }

    return data;
  }, [timeline]);

  // Dados para o gráfico de barras empilhadas (tasks por status)
  const tasksByStatusData = useMemo(() => {
    if (!timeline) return [];

    const data = [];

    // Semana anterior
    if (timeline.previousWeek && timeline.previousWeek.startDate) {
      const completed = timeline.previousWeek.completed || 0;
      const total = timeline.previousWeek.total || 0;

      data.push({
        week: `Sem ${format(new Date(timeline.previousWeek.startDate), 'dd/MM', { locale: ptBR })}`,
        concluida: completed,
        'em-andamento': 0,
        'nao-iniciada': total - completed
      });
    }

    // Semana atual
    if (timeline.currentWeek?.tasks && timeline.currentWeek.startDate) {
      const tasks = timeline.currentWeek.tasks;
      const byStatus = {
        concluida: 0,
        'em-andamento': 0,
        'nao-iniciada': 0
      };

      tasks.forEach(task => {
        const status = task.status || 'nao-iniciada';
        byStatus[status] = (byStatus[status] || 0) + 1;
      });

      data.push({
        week: `Sem ${format(new Date(timeline.currentWeek.startDate), 'dd/MM', { locale: ptBR })}`,
        ...byStatus
      });
    }

    // Próximas semanas (todas como não iniciadas)
    if (timeline.upcomingWeeks?.length > 0) {
      timeline.upcomingWeeks.slice(0, 1).forEach((week) => {
        if (week.startDate) {
          data.push({
            week: `Sem ${format(new Date(week.startDate), 'dd/MM', { locale: ptBR })}`,
            concluida: 0,
            'em-andamento': 0,
            'nao-iniciada': week.plannedTasks?.length || 0
          });
        }
      });
    }

    return data;
  }, [timeline]);

  // Dados para o gráfico de pizza (tasks por categoria)
  // Retorna dados para ambas as semanas
  const tasksByCategoryData = useMemo(() => {
    if (!timeline) return { previous: [], current: [] };

    const categoryColors = {
      '4DX': '#3b82f6',
      'Redemoinho': '#8b5cf6',
      'Stellantis': '#10b981',
      'Projetos Especiais': '#f59e0b'
    };

    // Helper para contar categorias de um array de tasks
    const countCategories = (tasks) => {
      const categoryCounts = {};
      if (tasks && Array.isArray(tasks)) {
        tasks.forEach(task => {
          const category = task.category || task.demand?.category || 'Outros';
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });
      }
      return Object.entries(categoryCounts)
        .map(([name, value]) => ({
          name,
          value,
          color: categoryColors[name] || '#6b7280'
        }))
        .filter(item => item.value > 0)
        .sort((a, b) => b.value - a.value);
    };

    return {
      previous: countCategories(timeline.previousWeek?.tasks),
      current: countCategories(timeline.currentWeek?.tasks)
    };
  }, [timeline]);

  // Dados para o gráfico de barras horizontais (tasks por desenvolvedor)
  // Compara semana anterior vs semana atual
  const tasksByDeveloperData = useMemo(() => {
    if (!devs) return [];

    const devTaskCounts = {};

    // Contar tarefas da semana anterior
    if (timeline?.previousWeek?.tasks) {
      timeline.previousWeek.tasks.forEach(task => {
        if (task.assignedDevs && Array.isArray(task.assignedDevs)) {
          task.assignedDevs.forEach(assignedDev => {
            const devName = assignedDev?.dev?.name || assignedDev?.name || String(assignedDev);
            if (devName) {
              if (!devTaskCounts[devName]) {
                devTaskCounts[devName] = { previous: 0, current: 0 };
              }
              devTaskCounts[devName].previous += 1;
            }
          });
        }
      });
    }

    // Contar tarefas da semana atual
    if (timeline?.currentWeek?.tasks) {
      timeline.currentWeek.tasks.forEach(task => {
        if (task.assignedDevs && Array.isArray(task.assignedDevs)) {
          task.assignedDevs.forEach(assignedDev => {
            const devName = assignedDev?.dev?.name || assignedDev?.name || String(assignedDev);
            if (devName) {
              if (!devTaskCounts[devName]) {
                devTaskCounts[devName] = { previous: 0, current: 0 };
              }
              devTaskCounts[devName].current += 1;
            }
          });
        }
      });
    }

    // Mapear para os dados do gráfico incluindo cores dos devs
    return Object.entries(devTaskCounts)
      .map(([name, counts]) => {
        const dev = devs.find(d => d.name === name);
        return {
          name,
          previous: counts.previous,
          current: counts.current,
          color: dev?.color?.includes('bg-')
            ? getColorFromTailwind(dev.color)
            : '#3b82f6'
        };
      })
      .sort((a, b) => (b.previous + b.current) - (a.previous + a.current));
  }, [timeline, devs]);

  return {
    weeklyCompletionData,
    tasksByStatusData,
    tasksByCategoryData,
    tasksByDeveloperData
  };
};

/**
 * Converte classe Tailwind de cor para código hex
 */
function getColorFromTailwind(tailwindClass) {
  const colorMap = {
    'bg-red-200': '#fecaca',
    'bg-yellow-200': '#fef08a',
    'bg-blue-200': '#bfdbfe',
    'bg-gray-800': '#1f2937',
    'bg-white': '#ffffff',
    'bg-green-200': '#bbf7d0',
    'bg-purple-200': '#e9d5ff',
    'bg-orange-200': '#fed7aa',
    'bg-teal-200': '#99f6e4'
  };

  // Extrair a primeira classe bg-* encontrada
  const match = tailwindClass.match(/bg-\w+-\d+/);
  if (match) {
    return colorMap[match[0]] || '#3b82f6';
  }

  return '#3b82f6';
}
