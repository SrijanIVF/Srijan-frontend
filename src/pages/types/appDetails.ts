export interface AppDataType {
    id: number;
    patient_uid: string;
    patient: number;
    appt_status: number;
    appt_status_name: string;
    followup_datetime: string;
    appt_datetime: string;
    loan_required: string;
    who_visited: string;
    centre_code: string;
    centre: number;
    camp_centre: string;
    doctor: string;
    dr_remark: number;
    created_by: string;
    created_at: string;
    updated_at: string;
}

export interface AppointmentState {
    loading: boolean;
    error: string | null;
    appointments: AppDataType[];
    count: number;
    filters: any;
}