import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthUser {
  user_id: string;
  username: string;
  usergroup: string;
}

interface AuthState {
  user: AuthUser | null;
  access: string | null;
  refresh: string | null;
  usergroup: string | null;
}

const loadInitial = (): AuthState => {
  try {
    const raw = localStorage.getItem("auth");
    if (raw) return JSON.parse(raw) as AuthState;
  } catch {
    // ignore
  }
  return { user: null, access: null, refresh: null, usergroup: null };
};

const initialState: AuthState = loadInitial();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(
      state,
      action: PayloadAction<{ user: AuthUser; access: string; refresh: string }>
    ) {
      state.user = action.payload.user;
      state.access = action.payload.access;
      state.refresh = action.payload.refresh;
      state.usergroup = action.payload.user.usergroup;
      localStorage.setItem("auth", JSON.stringify(state));
    },
    clearAuth(state) {
      state.user = null;
      state.access = null;
      state.refresh = null;
      state.usergroup = null;
      localStorage.removeItem("auth");
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;