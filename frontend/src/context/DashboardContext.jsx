import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { initialData } from '../data/initialData';
import { api, ApiError } from '../services/api';

const DashboardContext = createContext(null);

export const DashboardProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // ========== TIMELINE ==========

  const loadTimeline = useCallback(async () => {
    try {
      const timeline = await api.getTimeline();

      // Helper para processar array de tasks para PreviousWeek
      const processPreviousWeekTasks = (tasks) => {
        if (!tasks || tasks.length === 0) {
          return null;
        }

        const completed = tasks.filter(t => t.status === 'concluida').length;
        const total = tasks.length;

        // Pegar conquistas dos highlights
        const highlights = tasks.flatMap(t => {
          return (t.highlights || [])
            .filter(h => h.type === 'achievements')
            .map(h => ({ text: h.text }));
        });

        const dates = tasks.map(t => new Date(t.weekStart).getTime());
        const startDate = new Date(Math.min(...dates));
        const endDates = tasks.map(t => new Date(t.weekEnd).getTime());
        const endDate = new Date(Math.max(...endDates));

        return {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          completionRate: total > 0 ? completed / total : 0,
          completed,
          total,
          highlights,
          // Adicionar as tasks completas para exibição
          tasks: tasks.map(t => ({
            ...t,
            priority: t.demand?.priority || 'media',
            category: t.demand?.category || ''
          })),
          notes: null
        };
      };

      // Helper para processar array de tasks para CurrentWeek
      const processCurrentWeekTasks = (tasks) => {
        if (!tasks || tasks.length === 0) {
          return null;
        }

        const dates = tasks.map(t => new Date(t.weekStart).getTime());
        const startDate = new Date(Math.min(...dates));
        const endDates = tasks.map(t => new Date(t.weekEnd).getTime());
        const endDate = new Date(Math.max(...endDates));

        // Coletar alerts: entraves dos highlights
        const alerts = [];

        tasks.forEach(t => {
          // Adicionar entraves (tipo 'blockers' nos highlights)
          (t.highlights || [])
            .filter(h => h.type === 'blockers')
            .forEach(h => {
              alerts.push({
                text: `🚫 ${h.text}`,
                severity: h.severity || 'alta'
              });
            });
        });

        return {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          // Keep full task objects with all relationships intact for TaskCard
          tasks: tasks.map(t => ({
            ...t,
            // Keep assignedDevs as-is with full structure { id, devId, dev: {...} }
            // Add computed priority field for sorting/filtering
            priority: t.demand?.priority || 'media',
            category: t.demand?.category || '',
            progress: t.progress || 0
          })),
          alerts
        };
      };

      // Helper para processar array de tasks para UpcomingWeeks
      const processUpcomingWeekTasks = (tasks) => {
        if (!tasks || tasks.length === 0) {
          return null;
        }

        const dates = tasks.map(t => new Date(t.weekStart).getTime());
        const startDate = new Date(Math.min(...dates));
        const endDates = tasks.map(t => new Date(t.weekEnd).getTime());
        const endDate = new Date(Math.max(...endDates));

        return {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          // Keep full task objects with all relationships intact
          plannedTasks: tasks.map(t => ({
            ...t,
            // Keep assignedDevs as-is with full structure { id, devId, dev: {...} }
            // Add computed priority and category fields for easier access
            priority: t.demand?.priority || 'media',
            category: t.demand?.category || ''
          })),
          notes: null
        };
      };

      const previousWeek = processPreviousWeekTasks(timeline.previous);
      const currentWeek = processCurrentWeekTasks(timeline.current);
      const upcomingWeeks = timeline.upcoming && timeline.upcoming.length > 0
        ? [processUpcomingWeekTasks(timeline.upcoming)]
        : [];

      setDashboardData(prev => ({
        ...prev,
        timeline: {
          previousWeek,
          currentWeek,
          upcomingWeeks: upcomingWeeks.filter(Boolean)
        }
      }));

      return { success: true };
    } catch (err) {
      console.error('Error loading timeline:', err);
      return { success: false, error: err.message };
    }
  }, []);

  // Carregar dados do backend na inicialização
  const loadDashboard = useCallback(async () => {
    console.log('🔄 loadDashboard called');
    try {
      setLoading(true);
      setError(null);

      console.log('📡 Calling api.loadDashboard()...');
      const data = await api.loadDashboard();
      console.log('✅ Dashboard data received:', data);
      setDashboardData(data);

      // Carregar timeline separadamente usando loadTimeline
      try {
        console.log('📡 Calling loadTimeline()...');
        await loadTimeline();
      } catch (timelineErr) {
        console.warn('⚠️ Timeline não disponível:', timelineErr);
        // Se timeline falhar, usar do initialData
        setDashboardData(prev => ({
          ...prev,
          timeline: initialData.timeline
        }));
      }
    } catch (err) {
      console.error('❌ Error loading dashboard:', err);
      setError(err);

      // Fallback para dados iniciais se o backend estiver offline
      if (err instanceof ApiError && err.status === 0) {
        console.warn('⚠️ Backend offline, usando dados iniciais...');
        setDashboardData(initialData);
      }
    } finally {
      setLoading(false);
      console.log('✓ loadDashboard finished');
    }
  }, [loadTimeline]);

  // Carregar na montagem
  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // ========== DEVS ==========

  const updateDev = useCallback(async (devId, updates) => {
    try {
      const updated = await api.updateDev(devId, updates);

      setDashboardData(prev => ({
        ...prev,
        devs: prev.devs.map(dev => dev.id === devId ? updated : dev)
      }));

      return { success: true };
    } catch (err) {
      console.error('Error updating dev:', err);
      return { success: false, error: err.message };
    }
  }, []);

  const addDev = useCallback(async (newDev) => {
    try {
      const created = await api.createDev(newDev);

      setDashboardData(prev => ({
        ...prev,
        devs: [...prev.devs, created]
      }));

      return { success: true, data: created };
    } catch (err) {
      console.error('Error adding dev:', err);
      return { success: false, error: err.message };
    }
  }, []);

  const removeDev = useCallback(async (devId) => {
    try {
      await api.deleteDev(devId);

      setDashboardData(prev => ({
        ...prev,
        devs: prev.devs.filter(dev => dev.id !== devId)
      }));

      return { success: true };
    } catch (err) {
      console.error('Error removing dev:', err);
      return { success: false, error: err.message };
    }
  }, []);

  // ========== DEMANDS ==========

  const updateDemand = useCallback(async (category, demandId, updates) => {
    try {
      const updated = await api.updateDemand(demandId, { ...updates, category });

      setDashboardData(prev => ({
        ...prev,
        demands: {
          ...prev.demands,
          [category]: prev.demands[category].map(demand =>
            demand.id === demandId ? updated : demand
          )
        }
      }));

      return { success: true };
    } catch (err) {
      console.error('Error updating demand:', err);
      return { success: false, error: err.message };
    }
  }, []);

  const addDemand = useCallback(async (category, newDemand) => {
    try {
      const created = await api.createDemand({ ...newDemand, category });

      setDashboardData(prev => ({
        ...prev,
        demands: {
          ...prev.demands,
          [category]: [...(prev.demands[category] || []), created]
        }
      }));

      return { success: true, data: created };
    } catch (err) {
      console.error('Error adding demand:', err);
      return { success: false, error: err.message };
    }
  }, []);

  const removeDemand = useCallback(async (category, demandId) => {
    try {
      await api.deleteDemand(demandId);

      setDashboardData(prev => ({
        ...prev,
        demands: {
          ...prev.demands,
          [category]: prev.demands[category].filter(demand => demand.id !== demandId)
        }
      }));

      return { success: true };
    } catch (err) {
      console.error('Error removing demand:', err);
      return { success: false, error: err.message };
    }
  }, []);

  // ========== DELIVERIES ==========

  const updateDelivery = useCallback(async (deliveryId, updates) => {
    try {
      const updated = await api.updateDelivery(deliveryId, updates);

      setDashboardData(prev => ({
        ...prev,
        deliveries: prev.deliveries.map(delivery =>
          delivery.id === deliveryId ? updated : delivery
        )
      }));

      return { success: true };
    } catch (err) {
      console.error('Error updating delivery:', err);
      return { success: false, error: err.message };
    }
  }, []);

  const addDelivery = useCallback(async (newDelivery) => {
    try {
      const created = await api.createDelivery(newDelivery);

      setDashboardData(prev => ({
        ...prev,
        deliveries: [...prev.deliveries, created]
      }));

      return { success: true, data: created };
    } catch (err) {
      console.error('Error adding delivery:', err);
      return { success: false, error: err.message };
    }
  }, []);

  const removeDelivery = useCallback(async (deliveryId) => {
    try {
      await api.deleteDelivery(deliveryId);

      setDashboardData(prev => ({
        ...prev,
        deliveries: prev.deliveries.filter(delivery => delivery.id !== deliveryId)
      }));

      return { success: true };
    } catch (err) {
      console.error('Error removing delivery:', err);
      return { success: false, error: err.message };
    }
  }, []);

  // ========== HIGHLIGHTS ==========

  const updateHighlight = useCallback(async (type, highlightId, updates) => {
    try {
      const updated = await api.updateHighlight(highlightId, { ...updates, type });

      setDashboardData(prev => ({
        ...prev,
        highlights: {
          ...prev.highlights,
          [type]: prev.highlights[type].map(item =>
            item.id === highlightId ? updated : item
          )
        }
      }));

      return { success: true };
    } catch (err) {
      console.error('Error updating highlight:', err);
      return { success: false, error: err.message };
    }
  }, []);

  const addHighlight = useCallback(async (type, newHighlight) => {
    try {
      const created = await api.createHighlight({ ...newHighlight, type });

      setDashboardData(prev => ({
        ...prev,
        highlights: {
          ...prev.highlights,
          [type]: [...prev.highlights[type], created]
        }
      }));

      return { success: true, data: created };
    } catch (err) {
      console.error('Error adding highlight:', err);
      return { success: false, error: err.message };
    }
  }, []);

  const removeHighlight = useCallback(async (type, highlightId) => {
    try {
      await api.deleteHighlight(highlightId);

      setDashboardData(prev => ({
        ...prev,
        highlights: {
          ...prev.highlights,
          [type]: prev.highlights[type].filter(item => item.id !== highlightId)
        }
      }));

      return { success: true };
    } catch (err) {
      console.error('Error removing highlight:', err);
      return { success: false, error: err.message };
    }
  }, []);

  const addTimelineTask = useCallback(async (newTask) => {
    try {
      const created = await api.createTimelineTask(newTask);

      // Recarregar timeline para manter sincronizado
      await loadTimeline();

      return { success: true, data: created };
    } catch (err) {
      console.error('Error adding timeline task:', err);
      return { success: false, error: err.message };
    }
  }, [loadTimeline]);

  const updateTimelineTask = useCallback(async (taskId, updates) => {
    try {
      const updated = await api.updateTimelineTask(taskId, updates);

      // Recarregar timeline para manter sincronizado
      await loadTimeline();

      return { success: true, data: updated };
    } catch (err) {
      console.error('Error updating timeline task:', err);
      return { success: false, error: err.message };
    }
  }, [loadTimeline]);

  const removeTimelineTask = useCallback(async (taskId) => {
    try {
      await api.deleteTimelineTask(taskId);

      // Recarregar timeline para manter sincronizado
      await loadTimeline();

      return { success: true };
    } catch (err) {
      console.error('Error removing timeline task:', err);
      return { success: false, error: err.message };
    }
  }, [loadTimeline]);

  // ========== CONFIG ==========

  const updateWeek = useCallback(async (newWeek) => {
    try {
      await api.upsertConfig('week', newWeek);

      setDashboardData(prev => ({
        ...prev,
        week: newWeek
      }));

      return { success: true };
    } catch (err) {
      console.error('Error updating week:', err);
      return { success: false, error: err.message };
    }
  }, []);

  // ========== UTILITY FUNCTIONS ==========

  const resetData = useCallback(() => {
    setDashboardData(initialData);
  }, []);

  const exportData = useCallback(() => {
    const filename = `dashboard-${new Date().toISOString().split('T')[0]}.json`;
    const json = JSON.stringify(dashboardData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  }, [dashboardData]);

  const importData = useCallback(async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          setDashboardData(data);
          resolve({ success: true });
        } catch (error) {
          resolve({ success: false, error: error.message });
        }
      };
      reader.onerror = () => resolve({ success: false, error: 'Error reading file' });
      reader.readAsText(file);
    });
  }, []);

  const toggleEditMode = useCallback(() => {
    setEditMode(prev => !prev);
  }, []);

  const value = {
    dashboardData,
    // Desempacotar dashboardData para acesso direto às propriedades
    timeline: dashboardData?.timeline,
    devs: dashboardData?.devs,
    demands: dashboardData?.demands,
    deliveries: dashboardData?.deliveries,
    highlights: dashboardData?.highlights,
    week: dashboardData?.week,
    priorities: dashboardData?.priorities,
    loading,
    error,
    editMode,
    loadDashboard,
    toggleEditMode,
    updateDev,
    addDev,
    removeDev,
    updateDemand,
    addDemand,
    removeDemand,
    updateDelivery,
    addDelivery,
    removeDelivery,
    updateHighlight,
    addHighlight,
    removeHighlight,
    loadTimeline,
    addTimelineTask,
    updateTimelineTask,
    removeTimelineTask,
    updateWeek,
    resetData,
    exportData,
    importData
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard deve ser usado dentro de um DashboardProvider');
  }
  return context;
};
