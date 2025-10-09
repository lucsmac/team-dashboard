import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { initialData } from '../data/initialData';
import { storageService } from '../services/storage';

const DashboardContext = createContext(null);

export const DashboardProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState(() => {
    // Tenta carregar dados do localStorage, senão usa dados iniciais
    const stored = storageService.load();

    // Merge: preserva dados do localStorage, mas adiciona novos campos de initialData
    if (stored) {
      return {
        ...initialData,  // Campos novos (como timeline)
        ...stored,       // Dados existentes do localStorage
        // Garante que timeline sempre existe (não sobrescrever se já existir)
        timeline: stored.timeline || initialData.timeline
      };
    }

    return initialData;
  });

  const [editMode, setEditMode] = useState(false);

  // Auto-save no localStorage sempre que os dados mudarem
  useEffect(() => {
    storageService.save(dashboardData);
  }, [dashboardData]);

  // Métodos para atualizar dados
  const updateDev = useCallback((devId, updates) => {
    setDashboardData(prev => ({
      ...prev,
      devs: prev.devs.map(dev =>
        dev.id === devId ? { ...dev, ...updates } : dev
      )
    }));
  }, []);

  const addDev = useCallback((newDev) => {
    setDashboardData(prev => ({
      ...prev,
      devs: [...prev.devs, newDev]
    }));
  }, []);

  const removeDev = useCallback((devId) => {
    setDashboardData(prev => ({
      ...prev,
      devs: prev.devs.filter(dev => dev.id !== devId)
    }));
  }, []);

  const updateDemand = useCallback((category, demandId, updates) => {
    setDashboardData(prev => ({
      ...prev,
      demands: {
        ...prev.demands,
        [category]: prev.demands[category].map(demand =>
          demand.id === demandId ? { ...demand, ...updates } : demand
        )
      }
    }));
  }, []);

  const addDemand = useCallback((category, newDemand) => {
    setDashboardData(prev => ({
      ...prev,
      demands: {
        ...prev.demands,
        [category]: [...(prev.demands[category] || []), newDemand]
      }
    }));
  }, []);

  const removeDemand = useCallback((category, demandId) => {
    setDashboardData(prev => ({
      ...prev,
      demands: {
        ...prev.demands,
        [category]: prev.demands[category].filter(demand => demand.id !== demandId)
      }
    }));
  }, []);

  const updateDelivery = useCallback((deliveryId, updates) => {
    setDashboardData(prev => ({
      ...prev,
      deliveries: prev.deliveries.map(delivery =>
        delivery.id === deliveryId ? { ...delivery, ...updates } : delivery
      )
    }));
  }, []);

  const addDelivery = useCallback((newDelivery) => {
    setDashboardData(prev => ({
      ...prev,
      deliveries: [...prev.deliveries, newDelivery]
    }));
  }, []);

  const removeDelivery = useCallback((deliveryId) => {
    setDashboardData(prev => ({
      ...prev,
      deliveries: prev.deliveries.filter(delivery => delivery.id !== deliveryId)
    }));
  }, []);

  const updateHighlight = useCallback((type, highlightId, updates) => {
    setDashboardData(prev => ({
      ...prev,
      highlights: {
        ...prev.highlights,
        [type]: prev.highlights[type].map(item =>
          item.id === highlightId ? { ...item, ...updates } : item
        )
      }
    }));
  }, []);

  const addHighlight = useCallback((type, newHighlight) => {
    setDashboardData(prev => ({
      ...prev,
      highlights: {
        ...prev.highlights,
        [type]: [...prev.highlights[type], newHighlight]
      }
    }));
  }, []);

  const removeHighlight = useCallback((type, highlightId) => {
    setDashboardData(prev => ({
      ...prev,
      highlights: {
        ...prev.highlights,
        [type]: prev.highlights[type].filter(item => item.id !== highlightId)
      }
    }));
  }, []);

  const updateWeek = useCallback((newWeek) => {
    setDashboardData(prev => ({
      ...prev,
      week: newWeek
    }));
  }, []);

  const resetData = useCallback(() => {
    setDashboardData(initialData);
    storageService.clear();
  }, []);

  const exportData = useCallback(() => {
    const filename = `dashboard-${new Date().toISOString().split('T')[0]}.json`;
    return storageService.exportToJSON(dashboardData, filename);
  }, [dashboardData]);

  const importData = useCallback(async (file) => {
    try {
      const data = await storageService.importFromJSON(file);
      setDashboardData(data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  const toggleEditMode = useCallback(() => {
    setEditMode(prev => !prev);
  }, []);

  const value = {
    dashboardData,
    editMode,
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
