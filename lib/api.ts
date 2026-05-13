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
