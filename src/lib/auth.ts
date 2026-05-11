export const API_BASE = "https://api.srijanivfcentre.com/api/v1";

export interface LoginResponse {
  access?: string;
  refresh?: string;
  token?: string;
  [k: string]: unknown;
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      (data && (data.detail || data.message || data.error)) ||
      `Login failed (${res.status})`;
    throw new Error(typeof msg === "string" ? msg : "Login failed");
  }
  const token = data.access || data.token || data.access_token || "";
  if (token) localStorage.setItem("token", token);
  if (data.refresh) localStorage.setItem("refresh_token", data.refresh as string);
  if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
  return data as LoginResponse;
}

export function getToken(): string {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("access_token") ||
    localStorage.getItem("authToken") ||
    ""
  );
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
}

export function isAuthenticated(): boolean {
  return !!getToken();
}