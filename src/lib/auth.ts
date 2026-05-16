export const API_BASE = "https://api.srijanivfcentre.com/api/v1";

export interface AuthUserPayload {
  user_id: string;
  username: string;
  usergroup: string;
}

export interface LoginResponse {
  access?: string;
  refresh?: string;
  token?: string;
  user?: AuthUserPayload;
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


export async function clickToCall(patient_uid: string) {
  const token = getToken();
  const res = await fetch(`${API_BASE}/lead/lead-click-to-call/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/plain, */*",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ patient_uid }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = (data && (data.detail || data.message)) || `Call failed (${res.status})`;
    throw new Error(typeof msg === "string" ? msg : "Call failed");
  }
  return data as { lead_uuid?: string; call_status?: string; call_response?: string };
}

export async function agentDisposition(
  patient_uid: string,
  disposition: string,
  comment: string,
  call_back_time?: string
) {
  const token = getToken();

  const payload: any = {
    patient_uid,
    disposition,
    comment,
  };

  // only for callback case
  if (
    disposition === "call_back_later" &&
    call_back_time
  ) {
    payload.call_back_time = call_back_time;
  }

  const res = await fetch(
    `${API_BASE}/lead/agent-disposition/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/plain, */*",
        ...(token
          ? { Authorization: `Bearer ${token}` }
          : {}),
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg =
      (data && (data.detail || data.message)) ||
      `Disposition failed (${res.status})`;

    throw new Error(
      typeof msg === "string"
        ? msg
        : "Disposition failed"
    );
  }

  return data;
}

export async function getPatientNextDashboard(
  signal?: AbortSignal
) {
  const token = getToken();

  const res = await fetch(
    `${API_BASE}/lead/patient-next-dashboard/`,
    {
      method: "GET",
      signal,
      headers: {
        "Content-Type": "application/json",
        ...(token
          ? { Authorization: `Bearer ${token}` }
          : {}),
      },
    }
  );

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg =
      (data && (data.detail || data.message)) ||
      `Request failed (${res.status})`;

    throw new Error(
      typeof msg === "string"
        ? msg
        : "Request failed"
    );
  }

  return data?.data ?? data;
}