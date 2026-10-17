import {
  INITIAL_USERS,
  INITIAL_ORGANIZATIONS,
  INITIAL_DONATIONS,
  INITIAL_REQUESTS,
  INITIAL_PICKUPS,
  INITIAL_NOTIFICATIONS,
  INITIAL_REPORTS,
  PLATFORM_IMPACT_STATS
} from '../data/fixtures';

const STORAGE_KEYS = {
  USERS: 'foodloop_users_v1',
  ORGANIZATIONS: 'foodloop_orgs_v1',
  DONATIONS: 'foodloop_donations_v1',
  REQUESTS: 'foodloop_requests_v1',
  PICKUPS: 'foodloop_pickups_v1',
  NOTIFICATIONS: 'foodloop_notifications_v1',
  REPORTS: 'foodloop_reports_v1',
  ACTIVE_ROLE: 'foodloop_active_role_v1'
};

function getFromStorage(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item);
  } catch {
    return fallback;
  }
}

function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`[FoodLoop Storage] Could not save ${key}`, err);
  }
}

export const StorageAdapter = {
  getUsers: () => getFromStorage(STORAGE_KEYS.USERS, INITIAL_USERS),
  saveUsers: (users) => saveToStorage(STORAGE_KEYS.USERS, users),

  getOrganizations: () => getFromStorage(STORAGE_KEYS.ORGANIZATIONS, INITIAL_ORGANIZATIONS),
  saveOrganizations: (orgs) => saveToStorage(STORAGE_KEYS.ORGANIZATIONS, orgs),

  getDonations: () => getFromStorage(STORAGE_KEYS.DONATIONS, INITIAL_DONATIONS),
  saveDonations: (donations) => saveToStorage(STORAGE_KEYS.DONATIONS, donations),

  getRequests: () => getFromStorage(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS),
  saveRequests: (requests) => saveToStorage(STORAGE_KEYS.REQUESTS, requests),

  getPickups: () => getFromStorage(STORAGE_KEYS.PICKUPS, INITIAL_PICKUPS),
  savePickups: (pickups) => saveToStorage(STORAGE_KEYS.PICKUPS, pickups),

  getNotifications: () => getFromStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS),
  saveNotifications: (notifs) => saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifs),

  getReports: () => getFromStorage(STORAGE_KEYS.REPORTS, INITIAL_REPORTS),
  saveReports: (reports) => saveToStorage(STORAGE_KEYS.REPORTS, reports),

  getActiveRole: () => getFromStorage(STORAGE_KEYS.ACTIVE_ROLE, 'ngo'),
  saveActiveRole: (role) => saveToStorage(STORAGE_KEYS.ACTIVE_ROLE, role),

  resetToDefault: () => {
    Object.values(STORAGE_KEYS).forEach(k => {
      try { localStorage.removeItem(k); } catch {}
    });
  }
};
