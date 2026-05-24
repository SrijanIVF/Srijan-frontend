import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MessageSquare, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import SectionCard from "@/components/dashboard/SectionCard";
import { fetchAppointments, setFilters, resetFilters } from "@/store/AppointmentsSlice";
import { dateFormate } from "@/helpers/format";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardFooter from "@/components/dashboard/DashboardFooter";

import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AppDataType } from "./types/appDetails";

export default function Appointments() {
    const dispatch = useDispatch();

    const { appointments, loading, filters } = useSelector(
        (state: any) => state.appointments
    );

    useEffect(() => {
        dispatch(fetchAppointments({ page: 1, filters }));
    }, [filters]);

    const handleChange = (key: string, value: any) => {
        dispatch(setFilters({ [key]: value }));
    };

    const reset = () => {
        dispatch(resetFilters());
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <DashboardHeader />
            <main className="flex-1 container py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Appointments Filters</h1>
                    <Link to="/" className="text-sm">← Back</Link>
                </div>

                {/* FILTERS */}
                <div className="bg-card rounded-2xl p-6 shadow-sm border space-y-5">
                    {/* FILTER GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {/* Patient UID */}
                        <div className="space-y-1">
                            <label className="text-xs text-muted-foreground">Patient UID</label>
                            <Input
                                placeholder="Enter UID"
                                value={filters.patient_uid}
                                onChange={(e) =>
                                    handleChange("patient_uid", e.target.value)
                                }
                            />
                        </div>
                        {/* Centre Code */}
                        <div className="space-y-1">
                            <label className="text-xs text-muted-foreground">Centre Code</label>
                            <Input
                                placeholder="Enter Code"
                                value={filters.centre_code}
                                onChange={(e) =>
                                    handleChange("centre_code", e.target.value)
                                }
                            />
                        </div>

                        {/* Status */}
                        <div className="space-y-1">
                            <label className="text-xs text-muted-foreground">Status</label>
                            <Select
                                value={filters.status}
                                onValueChange={(val) => handleChange("status", val)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="fresh">Fresh</SelectItem>
                                    <SelectItem value="verified">Verified</SelectItem>
                                    <SelectItem value="app_scheduled">Appointment Scheduled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Start Date */}
                        <div className="space-y-1">
                            <label className="text-xs text-muted-foreground">
                                Appointment Start
                            </label>
                            <Input
                                type="date"
                                value={filters.appStartDate}
                                onChange={(e) =>
                                    handleChange("appStartDate", e.target.value)
                                }
                            />
                        </div>

                        {/* End Date */}
                        <div className="space-y-1">
                            <label className="text-xs text-muted-foreground">
                                Appointment End
                            </label>
                            <Input
                                type="date"
                                value={filters.appEndDate}
                                onChange={(e) =>
                                    handleChange("appEndDate", e.target.value)
                                }
                            />
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-end items-center gap-3 pt-2 border-t">
                        <button
                            onClick={reset}
                            className="px-4 py-2 text-sm rounded-lg bg-black text-white hover:bg-black/80 transition"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                {/* TABLE */}
                < SectionCard title="Appointments" >
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gradient-to-r from-pink-500 to-violet-600 text-white">
                                    <th className="p-3">Appt ID</th>
                                    <th>Patient UID</th>
                                    <th>Centre Code</th>
                                    <th>App. Status</th>
                                    <th>Appt Date</th>
                                    <th>Followup</th>
                                    <th>Created At</th>
                                    <th>Loan</th>
                                    <th>Visited</th>
                                    {/* <th>Call</th> */}
                                    <th>Comment</th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={10} className="text-center py-8">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : appointments?.length ? (
                                    appointments.map((app: AppDataType) => (
                                        <tr key={app.id} className="border-b">
                                            <td className="text-center p-2">{app.id}</td>
                                            <td className="text-center">{app.patient_uid}</td>
                                            <td className="text-center">{app.centre_code}</td>
                                            <td className="text-center">{app.appt_status_name}</td>
                                            <td className="text-center">{dateFormate(app.appt_datetime)}</td>
                                            <td className="text-center">{dateFormate(app.followup_datetime)}</td>
                                            <td className="text-center">{dateFormate(app.created_at)}</td>
                                            <td className="text-center">{app.loan_required}</td>
                                            <td className="text-center">{app.who_visited}</td>
                                            {/* <td className="text-center">
                                                <Link to={`/agent/fill-info/${app.id}`} state={{ leadData: app }}>
                                                    <Pencil className="h-4 w-4 inline" />
                                                </Link>
                                            </td> */}
                                            <td className="text-center">
                                                <MessageSquare className="h-4 w-4 inline" />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={10} className="text-center py-8">
                                            No appointments found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </SectionCard >
            </main >

            <DashboardFooter />
        </div >
    );
}