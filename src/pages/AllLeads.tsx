import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Pencil, Loader2 } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardFooter from "@/components/dashboard/DashboardFooter";

import { Input } from "@/components/ui/input";

import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

import { authApi } from "@/lib/api";

interface Lead {
    id: number;
    uid: string;
    patient_name: string;
    spouse_name: string;
    patient_city_name: string;
    treatment_city_name: string;
    patient_status: string;
    followup_datetime: string;
    priority: string;
    source_name: string;
    patient_language: string;
    treatment: string;
    user_name: string;
}

const AllLeads = () => {
    const [loading, setLoading] = useState(false);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [city, setCity] = useState("");
    const [status, setStatus] = useState("all");
    const [source, setSource] = useState("all");
    const [treatment, setTreatment] = useState("all");
    const [priority, setPriority] = useState("all");
    const [language, setLanguage] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [tCity, setTCity] = useState("");

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const res =
                await authApi.get(
                    "/lead/patients/?page=1&page_size=50"
                );
            setLeads(res.data?.results || []);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const filtered =
        useMemo(() => {
            return leads.filter((l) => {
                if (city &&
                    !l.patient_city_name
                        ?.toLowerCase()
                        .includes(
                            city.toLowerCase()
                        )
                )
                    return false;
                if (tCity &&
                    !l.treatment_city_name
                        ?.toLowerCase()
                        .includes(
                            tCity.toLowerCase()
                        ))
                    return false;
                if (
                    status !== "all" &&
                    l.patient_status !== status
                )
                    return false;
                if (source !== "all" &&
                    l.source_name !== source
                )
                    return false;

                if (
                    treatment !== "all" &&
                    l.treatment !== treatment
                )
                    return false;

                if (
                    priority !== "all" &&
                    l.priority !== priority
                )
                    return false;

                if (
                    language !== "all" &&
                    l.patient_language !== language
                )
                    return false;

                if (
                    startDate &&
                    l.followup_datetime?.slice(
                        0,
                        10
                    ) < startDate
                )
                    return false;

                if (
                    endDate &&
                    l.followup_datetime?.slice(
                        0,
                        10
                    ) > endDate
                )
                    return false;

                return true;
            });

        }, [
            leads,
            city,
            tCity,
            status,
            source,
            treatment,
            priority,
            language,
            startDate,
            endDate,
        ]);

    const reset = () => {
        setCity("");
        setStatus("all");
        setSource("all");
        setTreatment("all");
        setPriority("all");
        setLanguage("all");
        setStartDate("");
        setEndDate("");
        setTCity("");
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <DashboardHeader />
            <main className="flex-1 container py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">All Leads</h1>
                    <Link to="/" className="text-sm">← Back</Link>
                </div>
                <div className="bg-card rounded-xl p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <Input
                            placeholder="Patient City"
                            value={city}
                            onChange={(e) =>
                                setCity(
                                    e.target.value
                                )
                            }
                        />
                        <Input
                            placeholder="Treatment City"
                            value={tCity}
                            onChange={(e) =>
                                setTCity(
                                    e.target.value
                                )
                            }
                        />

                        <Select
                            value={status}
                            onValueChange={
                                setStatus
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>

                            <SelectContent>

                                <SelectItem value="all">
                                    All
                                </SelectItem>

                                <SelectItem value="fresh">
                                    Fresh
                                </SelectItem>

                                <SelectItem value="verified">
                                    Verified
                                </SelectItem>

                            </SelectContent>

                        </Select>

                        <Input
                            type="date"
                            value={startDate}
                            onChange={(e) =>
                                setStartDate(
                                    e.target.value
                                )
                            }
                        />

                        <Input
                            type="date"
                            value={endDate}
                            onChange={(e) =>
                                setEndDate(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    <div className="flex justify-end mt-4">

                        <button
                            onClick={reset}
                            className="px-4 py-2 bg-gray-200 rounded"
                        >
                            Reset
                        </button>

                    </div>

                </div>

                <div className="bg-card rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-800 text-white">
                                    <th className="p-3">Lead ID</th>
                                    <th>Patient</th>
                                    <th>Spouse</th>
                                    <th>Support</th>
                                    <th>Patient City</th>
                                    <th>Treatment City</th>
                                    <th>Treatment</th>
                                    <th>Followup</th>
                                    <th>Status</th>
                                    <th>Language</th>
                                    <th>Source</th>
                                    <th>Comments</th>
                                    <th>Edit</th>
                                    <th>Priority</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading && (
                                    <tr>
                                        <td
                                            colSpan={14}
                                            className="py-10"
                                        >
                                            <div className="flex justify-center">
                                                <Loader2 className="animate-spin" />
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                {filtered.map(
                                    (l) => (
                                        <tr key={l.id} className="border-b">
                                            <td className="p-3 text-center">{l.uid}</td>
                                            <td className="text-center">{l.patient_name}</td>
                                            <td className="text-center">{l.spouse_name}</td>
                                            <td className="text-center">{l.user_name}</td>
                                            <td className="text-center">{l.patient_city_name}</td>
                                            <td className="text-center">{l.treatment_city_name}</td>
                                            <td className="text-center">{l.treatment}</td>
                                            <td className="text-center">{l.followup_datetime}</td>
                                            <td className="text-center">{l.patient_status}</td>
                                            <td className="text-center">{l.patient_language}</td>
                                            <td className="text-center">{l.source_name}</td>
                                            <td className="text-center"><MessageSquare className="h-4 w-4 inline" /></td>
                                            <td className="text-center">
                                                <Link to={`/agent/fill-info/${l.id}`} state={{ leadData: l, }}>
                                                    <Pencil className="h-4 w-4 inline" />
                                                </Link>
                                            </td>
                                            <td className="text-center">{l.priority}</td>
                                        </tr>
                                    )
                                )}

                                {!loading &&
                                    filtered.length ===
                                    0 && (

                                        <tr>

                                            <td
                                                colSpan={14}
                                                className="text-center py-10"
                                            >

                                                No Leads Found

                                            </td>

                                        </tr>

                                    )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </main>

            <DashboardFooter />

        </div>
    );
};

export default AllLeads;