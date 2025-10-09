import { useDashboardData } from '../../hooks/useDashboardData';
import { PriorityIndicator } from './StatusIndicator';

/**
 * Legenda de prioridades
 */
export const PriorityLegend = () => {
  const { dashboardData } = useDashboardData();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Prioridade</h2>
      <div className="flex gap-6">
        {dashboardData.priorities.map((priority) => (
          <div key={priority.level} className="flex items-center gap-2">
            <PriorityIndicator priority={priority.level} size="md" />
            <span className="font-medium text-gray-700">{priority.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
