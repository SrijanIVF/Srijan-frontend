import SectionCard from "./SectionCard";
import { FileEdit, StickyNote, MessageCircle, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {getPatientNextDashboard} from "@/lib/auth"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PatientData {
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

const PatientDetails = () => {
  const [notesOpen, setNotesOpen] = useState(false);
  const [data, setData] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const response =
          await getPatientNextDashboard(
            controller.signal
          );

        setData(response);

        console.log(response);
      } catch (e) {
        if ((e as Error).name === "AbortError")
          return;

        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    };

    load();

    return () => controller.abort();
  }, []);

  const rowsLeft: [string, string][] = [
    ["Lead ID", fmt(data?.uid)],
    ["City", fmt(data?.patient_city_name)],
    ["Treatment", fmt((data)?.treatment_name ?? "NA")],
    ["Followup Date", fmtDate(data?.followup_datetime)],
    ["Patient Name", fmt(data?.patient_name)],
    ["Relative Name", fmt(data?.spouse_name)],
  ];
  const rowsRight: [string, string][] = [
    ["Call Status", fmt(data?.patient_status)],
    ["Area", fmt(data?.patient_city_name)],
    ["Last Call Date", fmtDate(data?.updated_at)],
    ["Lead Source", fmt(data?.user_name)],
    ["Spouse Name", fmt(data?.spouse_name)],
  ];

  const systemLogs = [
    { date: "2025-08-11 : 17:41:04", who: "PROSPACT", action: "Dial Outgoing Call on : XXXXXX5997", tag: "Dialed Outgoing Call" },
    { date: "2025-08-02 : 14:50:49", who: "PROSPACT", action: "Update Prospect: Cut Call : Priority: SuperCritical", tag: "cut_call" },
    { date: "2025-08-02 : 14:50:17", who: "PROSPACT", action: "Call Started: outbound-api, 114", tag: "Call Started" },
    { date: "2025-08-02 : 14:48:22", who: "PROSPACT", action: "Dial Outgoing Call on : XXXXXX5997", tag: "Dialed Outgoing Call" },
    { date: "2025-08-02 : 13:20:08", who: "CE_Nishi", action: "Call Started: outbound-api, 175", tag: "Call Started" },
    { date: "2025-08-02 : 13:20:05", who: "CE_Nishi", action: "Update CFresh: Cut Call : Priority: SuperCritical", tag: "cut_call" },
    { date: "2025-08-02 : 13:17:05", who: "CE_Nishi", action: "Dial Outgoing Call on : XXXXXX5997", tag: "Dialed Outgoing Call" },
    { date: "2025-08-02 : 13:09:42", who: "", action: "Created and assign to CE_Nishi lead from Crysta", tag: "Lead Created" },
  ];

  const whatsappMsgs = [
    { date: "2025-08-02/13:20:08", text: 'Welcome to Crysta IVF! Thank you for choosing Crysta IVF and giving our fertility experts an opportunity to provide you with our personalized and comprehensive fertility care. Call Fertility care coordinator @ 8938935353 for expert help.' },
    { date: "2025-08-02/13:09:43", text: '*Greetings!* 🙏 Thank you for your interest in Crysta IVF. Expect a callback from our expert shortly. We\'re here to assist you. 😊  - Crysta IVF Team - 😊 Karien Khushyion ki Shuruaat Crysta Ke Saath' },
  ];

  return (
    <SectionCard title="Patient Details">
      {loading && <p className="text-sm text-muted-foreground">Loading patient details…</p>}
      {error && <p className="text-sm text-destructive">Failed to load: {error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
        {rowsLeft.map(([k, v]) => (
          <p key={k}><span className="text-muted-foreground">{k}: </span><span className="font-semibold">{v}</span></p>
        ))}
        {rowsRight.map(([k, v]) => (
          <p key={k}><span className="text-muted-foreground">{k}: </span><span className="font-semibold">{v}</span></p>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-3 mt-6">
        <Link to="/agent/fill-info" className="bg-[image:var(--gradient-pink)] text-white px-5 py-2 rounded-md text-sm font-semibold flex items-center gap-2 shadow hover:-translate-y-0.5 transition">
          <FileEdit className="h-4 w-4" /> Fill Info
        </Link>
        <button onClick={() => setNotesOpen(true)} className="bg-[hsl(272_45%_45%)] text-white px-5 py-2 rounded-md text-sm font-semibold flex items-center gap-2 shadow hover:-translate-y-0.5 transition">
          <StickyNote className="h-4 w-4" /> Add Notes
        </button>
        <button className="bg-[hsl(142_70%_45%)] text-white px-5 py-2 rounded-md text-sm font-semibold flex items-center gap-2 shadow hover:-translate-y-0.5 transition">
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </button>
      </div>

      <Dialog open={notesOpen} onOpenChange={setNotesOpen}>
        <DialogContent className="max-w-6xl p-0 gap-0 overflow-hidden bg-[hsl(230_60%_97%)]">
          <DialogHeader className="bg-[image:var(--gradient-brand)] px-6 py-4">
            <DialogTitle className="text-white text-lg font-bold">Lead Id : 25E107</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 max-h-[80vh] overflow-y-auto">
            {/* System Generated */}
            <div className="bg-white rounded-xl shadow-[var(--shadow-card)] flex flex-col">
              <div className="px-5 py-3 border-b-2 border-[hsl(272_60%_55%)]">
                <h3 className="font-bold text-sm tracking-wide">SYSTEM GENERATED</h3>
              </div>
              <div className="p-3 space-y-2 max-h-72 overflow-y-auto">
                {systemLogs.map((l, i) => (
                  <div key={i} className="bg-[hsl(230_60%_98%)] rounded px-3 py-1.5 text-xs">
                    <span className="text-[hsl(142_70%_35%)] font-semibold">{l.date}</span>
                    {l.who && <> : <span className="text-[hsl(0_70%_50%)] font-semibold">{l.who}</span></>}
                    {" : "}<span className="text-[hsl(var(--brand-blue))] font-semibold">{l.action}</span>
                    {" : "}<span className="text-[hsl(var(--brand-pink))] font-semibold">{l.tag} :</span>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp History */}
            <div className="bg-white rounded-xl shadow-[var(--shadow-card)] flex flex-col">
              <div className="px-5 py-3 border-b-2 border-[hsl(142_70%_45%)]">
                <h3 className="font-bold text-sm tracking-wide">WHATSAPP HISTORY</h3>
              </div>
              <div className="p-3 space-y-2 max-h-60 overflow-y-auto">
                {whatsappMsgs.map((m, i) => (
                  <div key={i} className="bg-[hsl(120_50%_95%)] rounded-lg px-3 py-2 text-xs leading-relaxed">
                    <span className="text-[hsl(142_70%_35%)] font-semibold">{m.date}: </span>
                    <span className="text-[hsl(0_70%_50%)] font-semibold">Admin :</span>{" "}
                    <span className="text-[hsl(var(--brand-blue))]">{m.text}</span>
                  </div>
                ))}
              </div>
              <div className="px-3 pb-2 flex gap-2">
                <button className="px-3 py-1 rounded-full border border-border text-xs">📋 English Templates</button>
                <button className="px-3 py-1 rounded-full border border-border text-xs">📋 Hindi Templates</button>
              </div>
              <div className="p-3 border-t flex gap-2">
                <input placeholder="Add comment..." className="flex-1 px-3 py-2 rounded-md border border-border text-sm outline-none" />
                <button className="px-4 py-2 rounded-md bg-muted text-muted-foreground text-sm font-semibold flex items-center gap-1">
                  <Send className="h-3.5 w-3.5" /> Send
                </button>
              </div>
            </div>

            {/* Comment History */}
            <div className="bg-white rounded-xl shadow-[var(--shadow-card)] flex flex-col min-h-[280px]">
              <div className="px-5 py-3 border-b-2 border-[hsl(40_90%_55%)]">
                <h3 className="font-bold text-sm tracking-wide">COMMENT HISTORY</h3>
              </div>
              <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">No comments.</div>
            </div>

            {/* PCC History */}
            <div className="bg-white rounded-xl shadow-[var(--shadow-card)] flex flex-col min-h-[280px]">
              <div className="px-5 py-3 border-b-2 border-[hsl(0_70%_55%)]">
                <h3 className="font-bold text-sm tracking-wide">PCC HISTORY / SYSTEM</h3>
              </div>
              <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">No PCC comments.</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </SectionCard>
  );
};

export default PatientDetails;