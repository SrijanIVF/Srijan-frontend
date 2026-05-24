// src/store/leadStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import { authApi } from '../lib/api';
import { PatientType, LeadStatetype, PatientListResponse } from '@/pages/types/ptDetails';

const detectBestRoute = (item) => {
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
};

export const useLeadsStore = create<LeadStatetype>()(
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
                    } catch (error) {
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
                    } catch (error) {
                        const errorMsg = error.response?.data?.message || 'Failed to fetch leads';
                        set({ error: errorMsg, isLoading: false });
                    }
                },

                createLead: async (body: PatientType) => {
                    set({ isLoading: true, error: null })
                    try {
                        const response = await authApi.post('/lead/create-manual-lead/', body);
                        const leads = response.data as PatientListResponse;
                        set({ leads, isLoading: false });
                        return leads;
                    } catch (error) {
                        const errorMsg = error.response?.data?.message || 'Failed to create lead';
                        set({ error: errorMsg, isLoading: false });
                        throw error;
                    }
                },

                generateLead: async (body: PatientListResponse) => {
                    set({ isLoading: true, error: null })
                    try {
                        const response = await authApi.post('/lead//', body);
                        const leads = response.data as PatientListResponse;
                        set({ leads, isLoading: false });
                        return leads;
                    } catch (error) {
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
                    } catch (error) {
                        const errorMsg = error.response?.data?.message || 'Failed to dispose lead';
                        set({ error: errorMsg, isLoading: false });
                        throw error;
                    }
                },

                searchLeads: async (query) => {
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
                    } catch (error) {
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

                callBackLead: async (url) => {
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
                partialize: (state): Partial<LeadStatetype> => ({
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