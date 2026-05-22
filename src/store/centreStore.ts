import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import { authApi } from '../lib/api';

interface DropdownItem {
    id: any;
    name: string;
}

interface CityState {
    patientCities: DropdownItem[];
    treatmentCenters: DropdownItem[];
    leadSource: any,
    users: any;
    call_status: any;
    isLoading: boolean;
    error: string | null;
    getCity: () => Promise<any>;
    getFilter: () => Promise<any>;
}

export const useCentreStore = create<CityState>()(
    devtools(
        persist(
            (set) => ({
                patientCities: [],
                treatmentCenters: [],
                users: [],
                call_status: [],
                leadSource: null,
                isLoading: false,
                error: null,

                getCity: async () => {
                    set({ isLoading: true, error: null });
                    try {
                        const response = await authApi.get('/core/city/');
                        
                        const { patient_city, treatment_city, lead_source } = response.data;
                        
                        set({ 
                            patientCities: patient_city || [], 
                            treatmentCenters: treatment_city || [], 
                            leadSource: lead_source || [],
                            isLoading: false 
                        });
                        
                        return response.data;
                    }
                    catch (error: any) {
                        const errorMsg = error.response?.data?.message || 'Failed to fetch cities';
                        set({ error: errorMsg, isLoading: false });
                        return null;
                    }
                },
                 getFilter: async () => {
                    set({ isLoading: true, error: null });
                    try {
                        const response = await authApi.get('/core/filter/');
                        
                        const { users, call_status} = response.data;
                        
                        set({ 
                            users: users,
                            call_status: call_status,
                            isLoading: false 
                        });
                        
                        return response.data;
                    }
                    catch (error: any) {
                        const errorMsg = error.response?.data?.message || 'Failed to fetch cities';
                        set({ error: errorMsg, isLoading: false });
                        return null;
                    }
                }
            }),
            {
                name: 'centre-storage', 
            }
        ),
    )
)

export const useCity = () => useCentreStore(
    useShallow(
        state => ({
            patientCities: state.patientCities,
            treatmentCenters: state.treatmentCenters,
            leadSource: state.leadSource,
            userss: state.users,
            call_status: state.call_status,
            getCity: state.getCity,
            getFilter: state.getFilter,
            isLoading: state.isLoading,
            error: state.error
        })
    )
)