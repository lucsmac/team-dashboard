import { AlertCircle } from 'lucide-react';
import { useDashboardData } from '../../hooks/useDashboardData';
import { getSeverityColor } from '../../utils/colorUtils';

/**
 * Painel de entraves/bloqueios
 */
export const BlockersPanel = () => {
  const { dashboardData } = useDashboardData();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-red-500">
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-red-600" />
        Entraves
      </h2>
      <div className="space-y-3">
        {dashboardData.highlights.blockers.map((blocker) => (
          <div
            key={blocker.id}
            className={`p-3 rounded-lg border-l-4 ${getSeverityColor(blocker.severity)}`}
          >
            <p className="text-sm text-gray-800">{blocker.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
