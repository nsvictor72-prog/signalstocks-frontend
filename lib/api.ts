export const API_BASE = "https://signalstocks-backend-production.up.railway.app";

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

export async function getSignals() {
  return apiFetch("/api/signals");
}

export async function getOptions() {
  return apiFetch("/api/options");
}

export async function getPerformance() {
  return apiFetch("/api/performance");
}

export async function getTrackRecord() {
  return apiFetch("/api/track-record");
}
