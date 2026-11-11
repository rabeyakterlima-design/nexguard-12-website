// NEXGUARD 12 Central API Client
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class NexGuardApi {
  constructor() {
    this.token = localStorage.getItem('nexguard_token') || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('nexguard_token', token);
    } else {
      localStorage.removeItem('nexguard_token');
    }
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...(options.headers || {}),
    };

    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Request failed');
      }
      return data;
    } catch (err) {
      console.warn(`[API Fail] ${endpoint}:`, err.message);
      throw err;
    }
  }

  // Auth
  async login(email, password, mfaCode) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, mfaCode }),
    });
  }

  async switchPersona(role) {
    return this.request('/auth/switch-persona', {
      method: 'POST',
      body: JSON.stringify({ role }),
    });
  }

  async getMe() {
    return this.request('/auth/me');
  }

  // Owner
  async getOwnerOverview() {
    return this.request('/owner/overview');
  }

  async getAdmins() {
    return this.request('/owner/admins');
  }

  async createAdmin(payload) {
    return this.request('/owner/admins', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async toggleAdminStatus(id) {
    return this.request(`/owner/admins/${id}/toggle-status`, { method: 'POST' });
  }

  async removeAdmin(id) {
    return this.request(`/owner/admins/${id}`, { method: 'DELETE' });
  }

  async getAuditLogs() {
    return this.request('/owner/audit-logs');
  }

  async getSystemHealth() {
    return this.request('/owner/system-health');
  }

  // Modules
  async scanUrlPhishing(url) {
    return this.request('/modules/phishing/scan', {
      method: 'POST',
      body: JSON.stringify({ url }),
    });
  }

  async scanWebShield(targetDomain) {
    return this.request('/modules/webshield/scan', {
      method: 'POST',
      body: JSON.stringify({ targetDomain }),
    });
  }

  async analyzeNetwork(payload) {
    return this.request('/modules/network/analyze', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getVaultItems() {
    return this.request('/modules/vault/items');
  }

  async createVaultItem(payload) {
    return this.request('/modules/vault/items', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async deleteVaultItem(id) {
    return this.request(`/modules/vault/items/${id}`, { method: 'DELETE' });
  }

  async getSocIncidents() {
    return this.request('/modules/cyber-soc/incidents');
  }

  async triageIncident(id, status, remediationNote) {
    return this.request(`/modules/cyber-soc/incidents/${id}/triage`, {
      method: 'POST',
      body: JSON.stringify({ status, remediationNote }),
    });
  }

  async lookupThreat(query) {
    return this.request('/modules/threat-intel/lookup', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
  }

  async getForensicCases() {
    return this.request('/modules/forensics/cases');
  }

  // Commercial
  async getPlans() {
    return this.request('/commercial/plans');
  }

  async getSubscriptions() {
    return this.request('/commercial/subscriptions');
  }

  async getLicenses() {
    return this.request('/commercial/licenses');
  }

  async checkoutPayment(payload) {
    return this.request('/commercial/payments/checkout', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async verifyPaymentCallback(payload) {
    return this.request('/commercial/payments/verify-callback', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}

export const api = new NexGuardApi();
