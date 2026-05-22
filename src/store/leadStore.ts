// src/store/leadsStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import { authApi } from '../lib/api';

export interface Patient {
    id: number;
    uid: string;
    patient_name: string;
    patient_age: number | null;
    patient_gender: string | null;
    email: string;
    patient_city_name: string;
    patient_status: string;
    user_name: string;
    created_at: string;
    updated_at: string;
    main_mobile: string;
    secondary_mobile: string | null;
    whatsapp_mobile: string | null;
    emergency_mobile: string | null;
    spouse_name: string | null;
    spouse_age: number | null;
    marital_status: string | null;
    marriage_duration: string | null;
    address: string | null;
    any_baby: boolean | null;
    baby_count: number | null;
    trying_conceive_duration: string | null;
    annual_income: string | null;
    emi_eligibility: boolean;
    call_back: string | null;
    followup_datetime: string;
    priority: string;
    is_disposition: boolean;
    lead: string;
    user: string;
    source: string;
    patient_city: number;
    treatment_city: number | null;
}

export interface PaginatedResponse<T> {
    count: number;
    page_size: number;
    links: {
        next: string | null;
        previous: string | null;
    };
    results: T[];
}

export type PatientListResponse = PaginatedResponse<Patient>;

interface LeadsState {
    useDemoMode: boolean;
    setDemoMode: (enabled: boolean) => void;

    currentLead: Patient | null;
    currentQueuePosition: number;
    totalLeadsInQueue: number;
    disposedLeads: Patient[];
    leads: PatientListResponse | [];
    isLoading: boolean;
    error: string | null;
    redirectTarget?: any;
    query: any;

    fetchNextLead: () => Promise<Patient | null>;
    disposeLead: (leadId: string, reason: string, notes?: string, nextFollowupDays?: number, call_back_time?: any) => Promise<void>;
    fetchAllLeads: () => Promise<PatientListResponse | void>;
    createLead: (body: Patient) => Promise<PatientListResponse | null>;
    generateLead?: (body: any) => Promise<PatientListResponse | null>;
    searchLeads?: (query: any) => Promise<any>;
    clickToCall: (leadId: string) => Promise<void>;
    skipLead: () => Promise<void>;
    callBackLead: (url: string) => Promise<any>;
    resetDemo: () => void;
    clear: () => void;
}


const detectBestRoute = (item: any) => {
    if (item.uid?.match(/^[A-Z0-9]{6,}-?\d*$/)) {
        return {
            type: 'lead',
            route: `/agent/leads/${item.uid}/dashboard`,
            leadData: item
        };
    }

    if (item.uid) {
        return {
            type: 'lead',
            route: `/agent/leads/${item.uid}/dashboard`,
            leadData: item
        };
    }

    return null;
    // return {
    //     type: 'search',
    //     route: `/agent/search?q=${encodeURIComponent(item.uid || item.patient_name)}`
    // };
};


export const useLeadsStore = create<LeadsState>()(
    devtools(
        persist(
            (set, get) => ({
                useDemoMode: true,
                setDemoMode: (enabled) => set({ useDemoMode: enabled }),
                currentLead: null,
                currentQueuePosition: 0,
                totalLeadsInQueue: 0,
                disposedLeads: [],
                leads: { count: 0, page_size: 0, links: { next: null, previous: null }, results: [] },
                isLoading: false,
                error: null,
                redirectTarget: null,
                query: null,


                fetchNextLead: async () => {
                    const state = get();
                    set({ isLoading: true, error: null });

                    try {
                        if (!state.useDemoMode) {
                            const response = await authApi.get('/lead/patient-next-dashboard/');
                            const lead = response.data
                            set({ currentLead: lead, currentQueuePosition: lead.queue_position, totalLeadsInQueue: lead.total });
                            return lead;
                        }
                    } catch (error: any) {
                        const errorMsg = error.response?.data?.message || 'Failed to fetch lead';
                        set({ error: errorMsg, isLoading: false });
                        return null;
                    }
                },

                fetchAllLeads: async (url = "") => {
                    const state = get();
                    set({ isLoading: true, error: null });
                    try {
                        if (!state.useDemoMode) {
                            const response = await authApi.get(`/lead/patients/${url}`);
                            const leads = response.data as PatientListResponse;
                            set({ leads, isLoading: false });
                            return;
                        }
                    } catch (error: any) {
                        const errorMsg = error.response?.data?.message || 'Failed to fetch leads';
                        set({ error: errorMsg, isLoading: false });
                    }
                },

                createLead: async (body: Patient) => {
                    set({ isLoading: true, error: null })
                    try {
                        const response = await authApi.post('/lead/create-manual-lead/', body);
                        const leads = response.data as PatientListResponse;
                        set({ leads, isLoading: false });
                        return leads;
                    } catch (error: any) {
                        const errorMsg = error.response?.data?.message || 'Failed to create lead';
                        set({ error: errorMsg, isLoading: false });
                        throw error;
                    }
                },

                generateLead: async (body: any) => {
                    set({ isLoading: true, error: null })
                    try {
                        const response = await authApi.post('/lead//', body);
                        const leads = response.data as PatientListResponse;
                        set({ leads, isLoading: false });
                        return leads;
                    } catch (error: any) {
                        const errorMsg = error.response?.data?.message || 'Failed to create lead';
                        set({ error: errorMsg, isLoading: false });
                        throw error;
                    }
                },

                disposeLead: async (patient_uid: string, disposition: string, comment?: string, call_back_time?: any) => {
                    const state = get();
                    set({ isLoading: true, error: null });

                    const body: any = {
                        patient_uid,
                        disposition,
                        comment,
                    }

                    if (call_back_time) {
                        body["call_back_time"] = call_back_time
                    }

                    try {
                        if (!state.useDemoMode) {
                            await authApi.post(`/lead/agent-disposition/`, body);
                            await state.fetchNextLead();
                            set({ isLoading: false });
                            return;
                        }
                    } catch (error: any) {
                        const errorMsg = error.response?.data?.message || 'Failed to dispose lead';
                        set({ error: errorMsg, isLoading: false });
                        throw error;
                    }
                },

                searchLeads: async (query: string) => {
                    set({ isLoading: true, query });

                    try {
                        const response = await authApi.get(
                            `/lead/patients/?search=${encodeURIComponent(query)}`
                        );

                        const data = response.data;
                        const results = data?.results || [];

                        const bestMatch = results?.[0];

                        const target = bestMatch
                            ? detectBestRoute(bestMatch)
                            : null;

                        set({
                            leads: results,
                            redirectTarget: target,
                            isLoading: false,
                        });

                        return {
                            results,
                            target,
                        };
                    } catch (error) {
                        console.error("Search failed:", error);

                        set({
                            isLoading: false,
                            leads: [],
                            redirectTarget: null,
                        });

                        return {
                            results: [],
                            target: null,
                        };
                    }
                },

                clickToCall: async (leadId: string) => {
                    const state = get();
                    set({ isLoading: true, error: null });
                    try {
                        if (!state.useDemoMode) {
                            await authApi.post(`/lead/lead-click-to-call/`, { patient_uid: leadId });
                            set({ isLoading: false });
                            return;
                        }
                        setTimeout(() => {
                            set({ isLoading: false });
                        }, 1000);
                    } catch (error: any) {
                        const errorMsg = error.response?.data?.message || 'Failed to initiate call';
                        set({ error: errorMsg, isLoading: false });
                        throw error;
                    }
                },

                skipLead: async () => {
                    await get().fetchNextLead();
                },

                resetDemo: () => {
                    set({
                        currentLead: null,
                        currentQueuePosition: 0,
                        disposedLeads: [],
                        leads: [],
                        error: null
                    });
                },

                callBackLead: async (url: string) => {
                    set({ isLoading: true });
                    try {
                        const response = await authApi.get(`/lead/callback/${url}`);
                        const leads = response.data as PatientListResponse;

                        set({
                            leads: leads,
                            isLoading: false
                        });

                    } catch (error) {
                        console.error('Search failed:', error);
                    } finally {
                        set({ isLoading: false });
                    }
                },

                clear: () => set({ query: '', currentLead: null, redirectTarget: null }),
            }),
            {
                name: 'leads-demo-storage',
                partialize: (state): Partial<LeadsState> => ({
                    disposedLeads: state.disposedLeads,
                    useDemoMode: state.useDemoMode
                })
            }
        ),
        { patient_name: 'leads-store' }
    )
);

export const useCurrentLead = () => useLeadsStore(
    useShallow(state => ({
        currentLead: state.currentLead,
        queuePosition: state.currentQueuePosition,
        total: state.totalLeadsInQueue,
        isLoading: state.isLoading,
        error: state.error,
        useDemoMode: state.useDemoMode,
        leads: state.leads,
        query: state.query,
        redirectTarget: state.redirectTarget,
        fetchNextLead: state.fetchNextLead,
        disposeLead: state.disposeLead,
        clickToCall: state.clickToCall,
        skipLead: state.skipLead,
        resetDemo: state.resetDemo,
        setDemoMode: state.setDemoMode,
        fetchAllLeads: state.fetchAllLeads,
        createLead: state.createLead,
        searchLeads: state.searchLeads,
        callBackLead: state.callBackLead,
        clear: state.clear,
    }))
);

useLeadsStore.getState().setDemoMode(false);