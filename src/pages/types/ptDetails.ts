export interface PatientType {
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

export interface PatientPaginatedResType<T> {
    count: number;
    page_size: number;
    links: {
        next: string | null;
        previous: string | null;
    };
    results: T[];
}

export interface RedirectTarget {
    type: string;
    route: string;
    leadData: PatientType;
}

export interface QueryParams {
    search?: string;
    page?: number;
}

export interface DisposeLeadBody {
    patient_uid: string;
    disposition: string;
    comment?: string;
    call_back_time?: string;
}

export interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
}

export interface SearchResult {
    results: PatientType[];
    target: RedirectTarget | null;
}

export type PatientListResponse = PatientPaginatedResType<PatientType>;

export interface LeadStatetype {
    useDemoMode: boolean;
    setDemoMode: (enabled: boolean) => void;
    currentLead: PatientType | null;
    currentQueuePosition: number;
    totalLeadsInQueue: number;
    disposedLeads: PatientType[];
    leads: PatientListResponse | [];
    isLoading: boolean;
    error: string | null;
    redirectTarget?: RedirectTarget;
    query: QueryParams;
    fetchNextLead: () => Promise<PatientType | null>;
    disposeLead: (leadId: string, reason: string, notes?: string, nextFollowupDays?: number, call_back_time?: any) => Promise<void>;
    fetchAllLeads: () => Promise<PatientListResponse | void>;
    createLead: (body: PatientType) => Promise<PatientListResponse | null>;
    generateLead?: (body: PatientListResponse) => Promise<PatientListResponse | null>;
    searchLeads?: (query: string) => Promise<string>;
    clickToCall: (leadId: string) => Promise<void>;
    skipLead: () => Promise<void>;
    callBackLead: (url: string) => Promise<string>;
    resetDemo: () => void;
    clear: () => void;
}

export interface PatientData {
    uid?: string;
    patient_city_name?: string | null;
    treatment_city?: string | null;
    followup_datetime?: string | null;
    patient_name?: string | null;
    spouse_name?: string | null;
    patient_status?: string | null;
    source?: string | null;
    user_name?: string | null;
    main_mobile?: string | null;
    updated_at?: string | null;
    [k: string]: unknown;
}