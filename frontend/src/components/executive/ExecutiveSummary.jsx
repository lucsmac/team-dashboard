import { useDashboardData } from '../../hooks/useDashboardData';

/**
 * Resumo executivo com métricas principais
 */
export const ExecutiveSummary = () => {
  const {
    dashboardData,
    getActiveDemandsCount,
    getPlannedDemandsCount,
    getBlockersCount,
    getAchievementsCount
  } = useDashboardData();

  const activeDevs = dashboardData.devs.length;
  const totalDemands = Object.values(dashboardData.demands).flat().length;
  const utilization = Math.round((activeDevs / 10) * 100); // Assumindo time de até 10 devs

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
      <h2 className="text-xl font-bold mb-4">📊 Resumo Executivo - Status do Time</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/10 backdrop-blur rounded-lg p-4">
          <div className="text-sm mb-2 opacity-90">Capacidade</div>
          <div className="text-2xl font-bold">{activeDevs} Devs Ativos</div>
          <div className="text-sm mt-1">Utilização: ~{utilization}%</div>
        </div>

        <div className="bg-white/10 backdrop-blur rounded-lg p-4">
          <div className="text-sm mb-2 opacity-90">Demandas Ativas</div>
          <div className="text-2xl font-bold">{getActiveDemandsCount()} em andamento</div>
          <div className="text-sm mt-1">{getPlannedDemandsCount()} planejadas</div>
        </div>

        <div className="bg-white/10 backdrop-blur rounded-lg p-4">
          <div className="text-sm mb-2 opacity-90">Alertas</div>
          <div className="text-2xl font-bold">{getBlockersCount()} Entraves</div>
          <div className="text-sm mt-1">{getAchievementsCount()} Conquistas</div>
        </div>
      </div>
    </div>
  );
};
