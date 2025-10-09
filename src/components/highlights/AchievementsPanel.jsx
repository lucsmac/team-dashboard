import { Flame } from 'lucide-react';
import { useDashboardData } from '../../hooks/useDashboardData';

/**
 * Painel de conquistas/highlights
 */
export const AchievementsPanel = () => {
  const { dashboardData } = useDashboardData();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-500">
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Flame className="w-5 h-5 text-green-600" />
        Highlights da Semana
      </h2>
      <div className="space-y-3">
        {dashboardData.highlights.achievements.map((achievement) => (
          <div
            key={achievement.id}
            className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500"
          >
            <p className="text-sm text-gray-800">{achievement.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
