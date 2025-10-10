import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { initialData } from '../data/initialData';
import { api, ApiError } from '../services/api';

const DashboardContext = createContext(null);

export const DashboardProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // Carregar dados do backend na inicialização
  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await api.loadDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError(err);

      // Fallback para dados iniciais se o backend estiver offline
      if (err instanceof ApiError && err.status === 0) {
        console.warn('Backend offline, usando dados iniciais...');
        setDashboardData(initialData);
      }
    } finally {
      setLoading(false);
    }
  }, []);

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
