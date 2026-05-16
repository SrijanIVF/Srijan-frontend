import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Pencil } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardFooter from "@/components/dashboard/DashboardFooter";
import { Input } from "@/components/ui/input";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

type Urgency = "SuperCritical" | "Urgent" | "Normal";
type RowStatus =
    | "Appointment Convert"
    | "Appointment Missed"
    | "CFresh"
    | "New";

interface Lead {
    id: string;
    patient: string;
    spouse: string;
    support: string;
    patientCity: string;
    treatmentCity: string;
    treatment: string;
    followup: string;
    status: RowStatus;
    language: string;
    source: string;
    urgency: Urgency;
}

const LEADS: Lead[] = [
    { id: "123", patient: "User1", spouse: "user12", support: "CE_Nishi", patientCity: "Sasaram", treatmentCity: "Patna", treatment: "IVF", followup: "2026-05-07 16:16", status: "Appointment Convert", language: "Hindi", source: "NA", urgency: "SuperCritical" },
    { id: "456", patient: "User2", spouse: "user34", support: "CE_Nishi", patientCity: "patna-siwan", treatmentCity: "Patna", treatment: "IVF", followup: "2026-05-07 15:53", status: "Appointment Convert", language: "None", source: "NA", urgency: "SuperCritical" },
    { id: "789", patient: "User3", spouse: "user56", support: "CE_Nishi", patientCity: "Kanpur", treatmentCity: "Kanpur", treatment: "IVF", followup: "2026-05-07 15:46", status: "Appointment Convert", language: "Hindi", source: "NA", urgency: "SuperCritical" },
];

const rowBg: Record<RowStatus, string> = {
    "Appointment Convert": "bg-[hsl(130_60%_82%)]",
    "Appointment Missed": "bg-[hsl(0_85%_88%)]",
    CFresh: "bg-[hsl(25_95%_70%)]",
    New: "bg-[hsl(195_75%_82%)]",
};

const AllLeads = () => {
    const [city, setCity] = useState("");
    const [status, setStatus] = useState("all");
    const [source, setSource] = useState("all");
    const [treatment, setTreatment] = useState("all");
    const [priority, setPriority] = useState("all");
    const [language, setLanguage] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [tCity, setTCity] = useState("");

    const filtered = useMemo(() => {
        return LEADS.filter((l) => {
            if (city && !l.patientCity.toLowerCase().includes(city.toLowerCase())) return false;
            if (tCity && !l.treatmentCity.toLowerCase().includes(tCity.toLowerCase())) return false;
            if (status !== "all" && l.status !== status) return false;
            if (source !== "all" && l.source !== source) return false;
            if (treatment !== "all" && l.treatment !== treatment) return false;
            if (priority !== "all" && l.urgency !== priority) return false;
            if (language !== "all" && l.language !== language) return false;
            if (startDate && l.followup.slice(0, 10) < startDate) return false;
            if (endDate && l.followup.slice(0, 10) > endDate) return false;
            return true;
        });
    }, [city, tCity, status, source, treatment, priority, language, startDate, endDate]);

    const reset = () => {
        setCity(""); setStatus("all"); setSource("all"); setTreatment("all");
        setPriority("all"); setLanguage("all"); setStartDate(""); setEndDate(""); setTCity("");
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <DashboardHeader />
            <main className="flex-1 container py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold bg-[image:var(--gradient-brand)] bg-clip-text text-transparent">
                        All Leads
                    </h1>
                    <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Back</Link>
                </div>

                {/* Filters */}
                <div className="bg-card rounded-xl shadow-[var(--shadow-card)] p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <Input placeholder="Patient City" value={city} onChange={(e) => setCity(e.target.value)} />
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger><SelectValue placeholder="All Status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="Appointment Convert">Appointment Convert</SelectItem>
                                <SelectItem value="Appointment Missed">Appointment Missed</SelectItem>
                                <SelectItem value="CFresh">CFresh</SelectItem>
                                <SelectItem value="New">New</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={source} onValueChange={setSource}>
                            <SelectTrigger><SelectValue placeholder="All Source" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Source</SelectItem>
                                <SelectItem value="Crysta">Crysta</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={treatment} onValueChange={setTreatment}>
                            <SelectTrigger><SelectValue placeholder="All Treatment" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Treatment</SelectItem>
                                <SelectItem value="IVF">IVF</SelectItem>
                                <SelectItem value="IUI">IUI</SelectItem>
                                <SelectItem value="NA">NA</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={priority} onValueChange={setPriority}>
                            <SelectTrigger><SelectValue placeholder="All Priority" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Priority</SelectItem>
                                <SelectItem value="SuperCritical">SuperCritical</SelectItem>
                                <SelectItem value="Urgent">Urgent</SelectItem>
                                <SelectItem value="Normal">Normal</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={language} onValueChange={setLanguage}>
                            <SelectTrigger><SelectValue placeholder="All Languages" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Languages</SelectItem>
                                <SelectItem value="Hindi">Hindi</SelectItem>
                                <SelectItem value="None">None</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input placeholder="Treatment City" value={tCity} onChange={(e) => setTCity(e.target.value)} />
                        <div>
                            <label className="text-xs text-muted-foreground">Followup Start Date</label>
                            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </div>
                        <div>
                            <label className="text-xs text-muted-foreground">Followup End Date</label>
                            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>
                    </div>
                    <div className="mt-4 flex gap-5 justify-end align-items-center">
                        <button onClick={() => { }} className="bg-[image:var(--gradient-green)] text-white font-semibold rounded-md px-4 py-2 shadow hover:-translate-y-0.5 transition">
                            FILTER
                        </button>
                        <button onClick={reset} className="bg-muted-foreground/40 hover:bg-muted-foreground/60 text-white font-semibold rounded-md px-6 py-2 transition">
                            RESET
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-card rounded-xl shadow-[var(--shadow-card)] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-[image:var(--gradient-card-header)] text-white text-left">
                                    {[
                                        "Call ID", "Patient", "Spouse Name", "Patient Support", "Patient City",
                                        "Treatment City", "Treatment", "Followup Date/Time", "Status", "Language",
                                        "Source", "Comments", "Edit", "Urgency",
                                    ].map((h) => (
                                        <th key={h} className="px-3 py-3 font-semibold whitespace-nowrap text-center">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((l) => (
                                    <tr key={l.id} className={`${rowBg[l.status]} text-foreground/90 border-b border-white/40 hover:brightness-95 transition`}>
                                        <td className="px-3 py-2 font-mono font-semibold text-center">{l.id}</td>
                                        <td className="px-3 py-2 text-center">{l.patient}</td>
                                        <td className="px-3 py-2 text-center">{l.spouse}</td>
                                        <td className="px-3 py-2 text-center">{l.support}</td>
                                        <td className="px-3 py-2 text-center">{l.patientCity}</td>
                                        <td className="px-3 py-2 text-center">{l.treatmentCity}</td>
                                        <td className="px-3 py-2 text-center">{l.treatment}</td>
                                        <td className="px-3 py-2 text-center whitespace-nowrap">{l.followup}</td>
                                        <td className="px-3 py-2 text-center">{l.status}</td>
                                        <td className="px-3 py-2 text-center">{l.language}</td>
                                        <td className="px-3 py-2 text-center">{l.source}</td>
                                        <td className="px-3 py-2 text-center">
                                            <button className="inline-flex" aria-label="comments">
                                                <MessageSquare className="h-4 w-4" />
                                            </button>
                                        </td>
                                        <td className="px-3 py-2 text-center">
                                            <Link to="/agent/fill-info" aria-label="edit" className="inline-flex">
                                                <Pencil className="h-4 w-4" />
                                            </Link>
                                        </td>
                                        <td className="px-3 py-2 text-center font-semibold">{l.urgency}</td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={14} className="text-center text-muted-foreground py-10">No leads found</td>
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