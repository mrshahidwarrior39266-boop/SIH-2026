/**
 * SkillBridge — shared/auth.js
 * Client-side authentication helper.
 * Loaded on every portal page.
 */

const SB_TOKEN_KEY = 'sb_token';
const SB_USER_KEY  = 'sb_user';
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:3001/api' : '/api';

// ── Token helpers ──────────────────────────────────────────────────────────
function getToken() {
  return localStorage.getItem(SB_TOKEN_KEY);
}

function setToken(token) {
  localStorage.setItem(SB_TOKEN_KEY, token);
  // Decode and cache user from token
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    localStorage.setItem(SB_USER_KEY, JSON.stringify(payload));
  } catch (e) { /* ignore */ }
}

function clearAuth() {
  localStorage.removeItem(SB_TOKEN_KEY);
  localStorage.removeItem(SB_USER_KEY);
}

// ── User helpers ───────────────────────────────────────────────────────────
function getUser() {
  try {
    const raw = localStorage.getItem(SB_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function isLoggedIn() {
  const token = getToken();
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // Check expiry (exp is in seconds)
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

// ── Navigation helpers ─────────────────────────────────────────────────────
function getDepthPrefix() {
  // Determine how many levels deep this page is relative to root
  const parts = window.location.pathname.split('/').filter(Boolean);
  // If served via backend (localhost:3001), the HTML files are one folder deep
  // Root index.html, auth-callback.html → depth 0
  // portal pages (in subfolders) → depth 1
  if (parts.length <= 1) return '';
  return '../';
}

function redirectToLogin() {
  const prefix = getDepthPrefix();
  window.location.href = prefix + 'index.html';
}

function redirectToDashboard(role) {
  const prefix = getDepthPrefix();
  const roleMap = {
    student:     'student_dashboard_skill_gap_hub/code.html',
    recruiter:   'industry_recruiter_matching_engine/code.html',
    faculty:     'faculty_r_d_fdp_mentorship_portal/code.html',
    institution: 'institution_analytics_tpo_intelligence/code.html',
  };
  const dest = roleMap[role] || 'skillbridge_academia_industry_platform/code.html';
  window.location.href = prefix + dest;
}

// ── Logout ─────────────────────────────────────────────────────────────────
async function logout() {
  const token = getToken();
  if (token) {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
    } catch { /* ignore network errors on logout */ }
  }
  clearAuth();
  const prefix = getDepthPrefix();
  window.location.href = prefix + 'index.html';
}

// ── Guard: call on protected pages ────────────────────────────────────────
// Usage: requireAuth() at top of portal page script
function requireAuth() {
  if (!isLoggedIn()) {
    redirectToLogin();
    return false;
  }
  return true;
}

// ── API helper ─────────────────────────────────────────────────────────────
async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (res.status === 401) {
    clearAuth();
    redirectToLogin();
    throw new Error('Session expired');
  }
  return res;
}

// Expose globally
window.SBAuth = {
  getToken, setToken, clearAuth,
  getUser, isLoggedIn,
  redirectToLogin, redirectToDashboard,
  logout, requireAuth, apiFetch,
  API_BASE,
};
