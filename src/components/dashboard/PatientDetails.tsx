import SectionCard from "./SectionCard";
import { FileEdit, StickyNote, MessageCircle, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

const fmt = (v: unknown) =>
  v === null || v === undefined || v === "" ? "NA" : String(v);

const fmtDate = (v?: string | null) => {
  if (!v) return "NA";
  const d = new Date(v);
  return isNaN(d.getTime()) ? "NA" : d.toLocaleString();
};

const PatientDetails = ({
  patientData,
  loading
}: {
  patientData: PatientData | null;
  loading: boolean;
}) => {
  const [notesOpen, setNotesOpen] = useState(false);

  const rowsLeft: [string, string][] = [
    ["Lead ID", fmt(patientData?.uid)],
    ["City", fmt(patientData?.patient_city_name)],
    ["Treatment", fmt(patientData?.treatment_name ?? "NA")],
    ["Followup Date", fmtDate(patientData?.followup_datetime)],
    ["Patient Name", fmt(patientData?.patient_name)],
    ["Relative Name", fmt(patientData?.spouse_name)],
  ];

  const rowsRight: [string, string][] = [
    ["Call Status", fmt(patientData?.patient_status)],
    ["Area", fmt(patientData?.patient_city_name)],
    ["Last Call Date", fmtDate(patientData?.updated_at)],
    ["Lead Source", fmt(patientData?.user_name)],
    ["Spouse Name", fmt(patientData?.spouse_name)],
  ];

  const systemLogs = [
    {
      date: "2025-08-11 : 17:41:04",
      who: "PROSPACT",
      action: "Dial Outgoing Call on : XXXXXX5997",
      tag: "Dialed Outgoing Call",
    },
  ];

  const whatsappMsgs = [
    {
      date: "2025-08-02/13:20:08",
      text: "Welcome to Crysta IVF!",
    },
  ];

  return (
    <SectionCard title="Patient Details">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
        {rowsLeft.map(([k, v]) => (
          <p key={k}>
            <span className="text-muted-foreground">{k}: </span>
            <span className="font-semibold">{v}</span>
          </p>
        ))}

        {rowsRight.map(([k, v]) => (
          <p key={k}>
            <span className="text-muted-foreground">{k}: </span>
            <span className="font-semibold">{v}</span>
          </p>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-3 mt-6">
        <Link
          to="/agent/fill-info"
          className="bg-[image:var(--gradient-pink)] text-white px-5 py-2 rounded-md text-sm font-semibold flex items-center gap-2 shadow hover:-translate-y-0.5 transition"
        >
          <FileEdit className="h-4 w-4" />
          Fill Info
        </Link>

        <button
          onClick={() => setNotesOpen(true)}
          className="bg-[hsl(272_45%_45%)] text-white px-5 py-2 rounded-md text-sm font-semibold flex items-center gap-2 shadow hover:-translate-y-0.5 transition"
        >
          <StickyNote className="h-4 w-4" />
          Add Notes
        </button>

        <button className="bg-[hsl(142_70%_45%)] text-white px-5 py-2 rounded-md text-sm font-semibold flex items-center gap-2 shadow hover:-translate-y-0.5 transition">
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </button>
      </div>

      <Dialog open={notesOpen} onOpenChange={setNotesOpen}>
        <DialogContent className="max-w-6xl p-0 gap-0 overflow-hidden bg-[hsl(230_60%_97%)]">
          <DialogHeader className="bg-[image:var(--gradient-brand)] px-6 py-4">
            <DialogTitle className="text-white text-lg font-bold">
              Lead Id : {patientData?.uid}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 max-h-[80vh] overflow-y-auto">
            <div className="bg-white rounded-xl shadow-[var(--shadow-card)] flex flex-col">
              <div className="px-5 py-3 border-b-2 border-[hsl(272_60%_55%)]">
                <h3 className="font-bold text-sm tracking-wide">
                  SYSTEM GENERATED
                </h3>
              </div>

              <div className="p-3 space-y-2 max-h-72 overflow-y-auto">
                {systemLogs.map((l, i) => (
                  <div
                    key={i}
                    className="bg-[hsl(230_60%_98%)] rounded px-3 py-1.5 text-xs"
                  >
                    <span className="text-[hsl(142_70%_35%)] font-semibold">
                      {l.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-[var(--shadow-card)] flex flex-col">
              <div className="px-5 py-3 border-b-2 border-[hsl(142_70%_45%)]">
                <h3 className="font-bold text-sm tracking-wide">
                  WHATSAPP HISTORY
                </h3>
              </div>

              <div className="p-3 space-y-2 max-h-60 overflow-y-auto">
                {whatsappMsgs.map((m, i) => (
                  <div
                    key={i}
                    className="bg-[hsl(120_50%_95%)] rounded-lg px-3 py-2 text-xs leading-relaxed"
                  >
                    {m.text}
                  </div>
                ))}
              </div>

              <div className="p-3 border-t flex gap-2">
                <input
                  placeholder="Add comment..."
                  className="flex-1 px-3 py-2 rounded-md border border-border text-sm outline-none"
                />

                <button className="px-4 py-2 rounded-md bg-muted text-muted-foreground text-sm font-semibold flex items-center gap-1">
                  <Send className="h-3.5 w-3.5" />
                  Send
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </SectionCard>
  );
};

export default PatientDetails;