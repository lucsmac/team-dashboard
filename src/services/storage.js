import { STORAGE_KEY } from '../utils/constants';
import { validateDashboardData } from '../utils/dataValidation';

export const storageService = {
  /**
   * Salva os dados do dashboard no localStorage
   */
  save: (data) => {
    try {
      if (!validateDashboardData(data)) {
        console.warn('Tentativa de salvar dados inválidos');
        return false;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      return false;
    }
  },

  /**
   * Carrega os dados do dashboard do localStorage
   */
  load: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      const data = JSON.parse(stored);
      if (!validateDashboardData(data)) {
        console.warn('Dados armazenados são inválidos');
        return null;
      }
      return data;
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      return null;
    }
  },

  /**
   * Remove os dados do dashboard do localStorage
   */
  clear: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
      return false;
    }
  },

  /**
   * Exporta os dados como JSON para download
   */
  exportToJSON: (data, filename = 'dashboard-export.json') => {
    try {
      const json = JSON.stringify(data, null, 2);
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
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      return false;
    }
  },

  /**
   * Importa dados de um arquivo JSON
   */
  importFromJSON: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (!validateDashboardData(data)) {
            reject(new Error('Dados importados são inválidos'));
            return;
          }
          resolve(data);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsText(file);
    });
  }
};
