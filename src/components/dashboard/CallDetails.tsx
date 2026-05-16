import SectionCard from "./SectionCard";
import { Link } from "react-router-dom";
import {
  PhoneIncoming, PhoneOutgoing, FolderOpen, Database, Upload,
  PhoneCall, TrendingUp, CalendarClock, CalendarDays, AlertTriangle, CheckCircle2,
} from "lucide-react";

import { useEffect, useState } from "react";
import { clickToCall, getToken, API_BASE } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";

const tiles = [
  { label: "All Leads", icon: FolderOpen, style: "bg-[image:var(--gradient-pink)]", count: 0, to: "/agent/all-leads" },
  { label: "C_FRESH", icon: Database, style: "bg-gradient-to-br from-[hsl(272_45%_50%)] to-[hsl(280_45%_45%)]", count: 0 },
  { label: "New Status Lead", icon: Upload, style: "bg-gradient-to-br from-[hsl(345_55%_45%)] to-[hsl(355_55%_40%)]", count: 0 },
  { label: "Call Back", icon: PhoneCall, style: "bg-[image:var(--gradient-green)]", count: 0 },
  { label: "Positive Calls", icon: TrendingUp, style: "bg-[image:var(--gradient-orange)]", count: 0 },
  { label: "Today Call Back", style: "bg-[image:var(--gradient-pink)]", icon: CalendarClock, count: 0 },
  { label: "Tentative Appointment", icon: CalendarDays, style: "bg-[image:var(--gradient-blue)]", count: 0 },
  { label: "Appointment Missed", icon: AlertTriangle, style: "bg-gradient-to-br from-[hsl(0_60%_55%)] to-[hsl(15_65%_50%)]", count: 0 },
  { label: "Appointment Done", icon: CheckCircle2, style: "bg-[image:var(--gradient-teal)]", count: 0 },
];

const CallDetails = () => {

  const [uid, setUid] = useState("");
  const [calling, setCalling] = useState(false);
  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        const token = getToken();
        const res = await fetch(`${API_BASE}/lead/patient-next-dashboard/`, {
          signal: ctrl.signal,
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) return;
        const json = await res.json();
        const u = (json?.data ?? json)?.uid;
        if (u) setUid(String(u));
      } catch { /* ignore */ }
    })();
    return () => ctrl.abort();
  }, []);
  const handleDialOutgoing = async () => {
    const target = uid.trim();
    if (!target) {
      toast({ title: "No patient UID", description: "Enter or load a patient UID first.", variant: "destructive" });
      return;
    }
    if (calling) return;
    setCalling(true);
    try {
      const data = await clickToCall(target);
      toast({ title: "Call initiated", description: data?.call_response || `Status: ${data?.call_status ?? "ok"}` });
    } catch (e) {
      toast({ title: "Call failed", description: (e as Error).message, variant: "destructive" });
    } finally {
      setTimeout(() => setCalling(false), 1500);
    }
  };

  return (
    <SectionCard title="Call Details">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div className="flex items-center bg-white rounded-md overflow-hidden border border-border shadow-sm">
          <input placeholder="Pick Incoming" className="flex-1 px-4 py-2 outline-none text-sm" />
          <button className="bg-[image:var(--gradient-pink)] px-4 py-2.5 text-white">
            <PhoneIncoming className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center bg-white rounded-md overflow-hidden border border-border shadow-sm">
          {/* <input placeholder="Dial Outgoing" className="flex-1 px-4 py-2 outline-none text-sm" />
          <button className="bg-[image:var(--gradient-pink)] px-4 py-2.5 text-white">
            <PhoneOutgoing className="h-4 w-4" />
          </button> */}
          <input
            placeholder="Dial Outgoing (Patient UID)"
            className="flex-1 px-4 py-2 outline-none text-sm"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
          />
          <button
            onClick={handleDialOutgoing}
            disabled={calling}
            className="bg-[image:var(--gradient-pink)] px-4 py-2.5 text-white disabled:opacity-60"
          ></button>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {tiles.map((t) => (
          <Link
            key={t.label}
            to={(t as { to?: string }).to ?? "#"}
            className={`${t.style} relative text-white rounded-md py-3 px-3 text-sm font-semibold flex items-center gap-2 shadow hover:-translate-y-0.5 transition`}
          >
            <t.icon className="h-4 w-4" />
            <span className="truncate">{t.label}</span>
            <span className="absolute -top-2 -right-2 bg-[hsl(0_75%_55%)] text-white text-[10px] h-5 min-w-5 px-1 rounded-full flex items-center justify-center shadow">
              {t.count}
            </span>
          </Link>
        ))}
      </div>
    </SectionCard>
  );
};

export default CallDetails;