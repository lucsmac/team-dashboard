import { TrendingUp } from 'lucide-react';
import { useDashboardData } from '../../hooks/useDashboardData';
import { DemandCategory } from './DemandCategory';

/**
 * Grid de categorias de demandas
 */
export const DemandsGrid = () => {
  const { dashboardData } = useDashboardData();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5" />
        Demandas por Categoria
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(dashboardData.demands).map(([category, demands]) => (
          <DemandCategory key={category} category={category} demands={demands} />
        ))}
      </div>
    </div>
  );
};
