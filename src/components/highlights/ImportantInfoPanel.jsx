import { Clock } from 'lucide-react';
import { useDashboardData } from '../../hooks/useDashboardData';
import { getInfoTypeColor } from '../../utils/colorUtils';

/**
 * Painel de informações importantes
 */
export const ImportantInfoPanel = () => {
  const { dashboardData } = useDashboardData();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500">
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-blue-600" />
        Informações Importantes
      </h2>
      <div className="space-y-3">
        {dashboardData.highlights.important.map((info) => (
          <div
            key={info.id}
            className={`p-3 rounded-lg border-l-4 ${getInfoTypeColor(info.type)}`}
          >
            <p className="text-sm text-gray-800">{info.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
