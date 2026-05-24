import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "@/lib/api";
import { AppointmentState } from "@/pages/types/appDetails";

export const fetchAppointments = createAsyncThunk(
  "appointments/fetch",
  async ({ page = 1, filters }: any) => {
    const params = new URLSearchParams();

    params.append("page", page);
    params.append("page_size", "50");

    if (filters?.patient_uid) params.append("patient_uid", filters.patient_uid);
    if (filters?.centre_code) params.append("centre_code", filters.centre_code);
    if (filters?.status && filters.status !== "all")
      params.append("status", filters.status);
    if (filters?.appStartDate) params.append("start_date", filters.appStartDate);
    if (filters?.appEndDate) params.append("end_date", filters.appEndDate);
    if (filters?.appDate) params.append("app_date", filters.appDate);

    const res = await authApi.get(`/appt/appointment/?${params.toString()}`);
    return res.data;
  }
);

const initialState: AppointmentState = {
  loading: false,
  error: null,
  appointments: [],
  count: 0,

  filters: {
    patient_uid: "",
    centre_code: "",
    status: "all",
    appStartDate: "",
    appEndDate: "",
    appDate: "",
  },
};

const appointmentsSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },

    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload.results;
        state.count = action.payload.count;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });
  },
});

export const { setFilters, resetFilters } = appointmentsSlice.actions;
export default appointmentsSlice.reducer;