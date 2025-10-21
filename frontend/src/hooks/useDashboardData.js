import { useDashboard } from '../context/DashboardContext';

/**
 * Hook customizado para gerenciar dados do dashboard
 * Wraps o context e adiciona helpers específicos
 */
export const useDashboardData = () => {
  const context = useDashboard();

  // Helpers derivados
  const getDevByName = (name) => {
    return context.dashboardData.devs.find(dev => dev.name === name);
  };

  const getDemandsByStatus = (status) => {
    const allDemands = Object.values(context.dashboardData.demands).flat();
    return allDemands.filter(demand => demand.status === status);
  };

  const getDemandsByPriority = (priority) => {
    const allDemands = Object.values(context.dashboardData.demands).flat();
    return allDemands.filter(demand => demand.priority === priority);
  };

  const getDemandsByDev = (devName) => {
    const allDemands = Object.values(context.dashboardData.demands).flat();
    return allDemands.filter(demand => demand.assignedDevs.includes(devName));
  };

  const getAllDemands = () => {
    return Object.values(context.dashboardData.demands).flat();
  };

  const getDemandsCount = () => {
    return getAllDemands().length;
  };

  const getActiveDemandsCount = () => {
    return getDemandsByStatus('em-andamento').length;
  };

  const getPlannedDemandsCount = () => {
    return getDemandsByStatus('planejado').length;
  };

  const getBlockersCount = () => {
    return context.dashboardData.highlights.blockers.length;
  };

  const getAchievementsCount = () => {
    return context.dashboardData.highlights.achievements.length;
  };

  const getCompletedDemandsCount = () => {
    return getDemandsByStatus('concluido').length;
  };

  const getBlockedDemandsCount = () => {
    return getDemandsByStatus('bloqueado').length;
  };

  return {
    ...context,
    // Helpers adicionais
    getDevByName,
    getDemandsByStatus,
    getDemandsByPriority,
    getDemandsByDev,
    getAllDemands,
    getDemandsCount,
    getActiveDemandsCount,
    getPlannedDemandsCount,
    getBlockersCount,
    getAchievementsCount,
    getCompletedDemandsCount,
    getBlockedDemandsCount
  };
};
