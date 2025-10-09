import { DemandCard } from './DemandCard';

/**
 * Categoria de demandas com lista de cards
 */
export const DemandCategory = ({ category, demands }) => {
  return (
    <div className="border-2 border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">{category}</h3>
        <span className="text-sm text-gray-500">{demands.length} demanda(s)</span>
      </div>
      <div className="space-y-3">
        {demands.map((demand) => (
          <DemandCard key={demand.id} demand={demand} category={category} />
        ))}
      </div>
    </div>
  );
};
