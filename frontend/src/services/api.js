/**
 * API Service - Substitui localStorage por chamadas HTTP ao backend
 */

const API_URL = import.meta.env.VITE_API_URL || '/api';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new ApiError(
      error.error || 'Request failed',
      response.status,
      error
    );
  }

  // 204 No Content
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

async function request(endpoint, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    return await handleResponse(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network error
    throw new ApiError('Network error - servidor inacessível', 0, { originalError: error });
  }
}

export const api = {
  // ========== DASHBOARD ==========

  /**
   * Carrega dashboard completo (otimizado - 1 request)
   */
  async loadDashboard() {
    return request('/dashboard');
  },

  // ========== DEVS ==========

  async getDevs() {
    return request('/devs');
  },

  async getDev(id) {
    return request(`/devs/${id}`);
  },

  async createDev(data) {
    return request('/devs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateDev(id, data) {
    return request(`/devs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteDev(id) {
    return request(`/devs/${id}`, {
      method: 'DELETE',
    });
  },

  // ========== DEMANDS ==========

  async getDemands() {
    return request('/demands');
  },

  async getDemand(id) {
    return request(`/demands/${id}`);
  },

  async getDemandsByCategory(category) {
    return request(`/demands/category/${encodeURIComponent(category)}`);
  },

  async createDemand(data) {
    return request('/demands', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateDemand(id, data) {
    return request(`/demands/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteDemand(id) {
    return request(`/demands/${id}`, {
      method: 'DELETE',
    });
  },

  // ========== DELIVERIES ==========

  async getDeliveries() {
    return request('/deliveries');
  },

  async getDelivery(id) {
    return request(`/deliveries/${id}`);
  },

  async createDelivery(data) {
    return request('/deliveries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateDelivery(id, data) {
    return request(`/deliveries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteDelivery(id) {
    return request(`/deliveries/${id}`, {
      method: 'DELETE',
    });
  },

  // ========== HIGHLIGHTS ==========

  async getHighlights() {
    return request('/highlights');
  },

  async getHighlight(id) {
    return request(`/highlights/${id}`);
  },

  async getHighlightsByType(type) {
    return request(`/highlights/type/${type}`);
  },

  async createHighlight(data) {
    return request('/highlights', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateHighlight(id, data) {
    return request(`/highlights/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteHighlight(id) {
    return request(`/highlights/${id}`, {
      method: 'DELETE',
    });
  },

  // ========== TIMELINE ==========

  async getTimeline() {
    return request('/timeline');
  },

  async getTimelineTask(id) {
    return request(`/timeline/${id}`);
  },

  async getTimelineByWeek(weekType) {
    return request(`/timeline/week/${weekType}`);
  },

  async createTimelineTask(data) {
    return request('/timeline', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateTimelineTask(id, data) {
    return request(`/timeline/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteTimelineTask(id) {
    return request(`/timeline/${id}`, {
      method: 'DELETE',
    });
  },

  // ========== CONFIG ==========

  async getConfig() {
    return request('/config');
  },

  async getConfigByKey(key) {
    return request(`/config/${key}`);
  },

  async upsertConfig(key, value) {
    return request('/config', {
      method: 'POST',
      body: JSON.stringify({ key, value }),
    });
  },

  async deleteConfig(key) {
    return request(`/config/${key}`, {
      method: 'DELETE',
    });
  },

  // ========== DEV ALLOCATIONS ==========

  async getAllocationsByWeek(weekStart) {
    return request(`/dev-allocations?weekStart=${weekStart}`);
  },

  async getDevAllocationByWeek(devId, weekStart) {
    return request(`/dev-allocations/dev/${devId}/week/${weekStart}`);
  },

  async getDevAllocationHistory(devId, months = 3) {
    return request(`/dev-allocations/dev/${devId}/history?months=${months}`);
  },

  async upsertDevAllocation(data) {
    return request('/dev-allocations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async deleteDevAllocation(id) {
    return request(`/dev-allocations/${id}`, {
      method: 'DELETE',
    });
  },

  async getCurrentWeekAllocationStats() {
    return request('/dev-allocations/stats/current-week');
  },

  // ========== JIRA INTEGRATIONS ==========

  async getJiraIntegrations() {
    return request('/jira/integrations');
  },

  async getJiraIntegration(id) {
    return request(`/jira/integrations/${id}`);
  },

  async createJiraIntegration(data) {
    return request('/jira/integrations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateJiraIntegration(id, data) {
    return request(`/jira/integrations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteJiraIntegration(id) {
    return request(`/jira/integrations/${id}`, {
      method: 'DELETE',
    });
  },

  async testJiraIntegration(id) {
    return request(`/jira/integrations/${id}/test`);
  },

  async getJiraIntegrationMetrics(id) {
    return request(`/jira/integrations/${id}/metrics`);
  },

  // ========== HEALTH CHECK ==========

  async healthCheck() {
    const response = await fetch('/health');
    return response.json();
  }
};

export { ApiError };
