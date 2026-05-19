export const API_BASE = "https://signalstocks-backend-production.up.railway.app";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function setToken(token: string) {
  localStorage.setItem("token", token);
}

export function clearToken() {
  localStorage.removeItem("token");
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || data.message || "Request failed");
  }
  return data;
}

export async function register(email: string, password: string) {
  return apiFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function login(email: string, password: string) {
  return apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function verifyEmail(token: string) {
  return apiFetch(`/api/auth/verify/${token}`);
}

export async function resendVerification(email: string) {
  return apiFetch("/api/auth/resend-verification", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function forgotPassword(email: string) {
  return apiFetch("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token: string, new_password: string) {
  return apiFetch("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, new_password }),
  });
}

export async function getSignals() {
  const token = getToken();
  return apiFetch("/api/signals", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getOptions() {
  const token = getToken();
  return apiFetch("/api/options", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getPerformance() {
  const token = getToken();
  return apiFetch("/api/performance", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getTrackRecord() {
  return apiFetch("/api/track-record");
}

export async function getMe() {
  const token = getToken();
  return apiFetch("/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function changePassword(current_password: string, new_password: string) {
  const token = getToken();
  return apiFetch("/api/auth/change-password", {
    method: "POST",
    body: JSON.stringify({ current_password, new_password }),
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function deleteAccount() {
  const token = getToken();
  const res = await fetch(`${API_BASE}/api/auth/me`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || "Failed to delete account");
  }
}

export async function createPaperTrade(body: {
  ticker: string;
  entry_price: number;
  signal_type: string;
  stop_loss?: number;
  take_profit?: number;
  notes?: string;
}) {
  const token = getToken();
  return apiFetch("/api/portfolio/paper", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getPortfolioPositions() {
  const token = getToken();
  return apiFetch("/api/portfolio", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function closePortfolioPosition(id: number, exit_price: number) {
  const token = getToken();
  return apiFetch(`/api/portfolio/${id}/close`, {
    method: "POST",
    body: JSON.stringify({ exit_price }),
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function deletePortfolioPosition(id: number) {
  const token = getToken();
  return apiFetch(`/api/portfolio/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// Portfolio is stored client-side in localStorage
export interface PortfolioPosition {
  id: string;
  ticker: string;
  shares: number;
  entry_price: number;
  stop_loss?: number;
  take_profit?: number;
  entry_date: string;
  notes?: string;
  is_open: boolean;
  exit_price?: number;
  exit_date?: string;
  signal_type?: string;
}

export function getPortfolio(): PortfolioPosition[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("portfolio") || "[]");
  } catch {
    return [];
  }
}

export function savePortfolio(positions: PortfolioPosition[]) {
  localStorage.setItem("portfolio", JSON.stringify(positions));
}
