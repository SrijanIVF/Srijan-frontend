import SectionCard from "./SectionCard";
import { FileEdit, StickyNote, MessageCircle, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { authApi } from "@/lib/api";
import { PatientData } from "@/pages/types/ptDetails";
import CommentModal from "../CommentModal/CommentModal";

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

  if (!patientData) {
    return (
      <SectionCard title="Patient Details">
        <h2 style={{ textAlign: "center" }}>No Lead Found</h2>
      </SectionCard>
    )
  } else
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
            to={`/agent/fill-info/${patientData?.id}`}
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
        {notesOpen &&
          <CommentModal open={notesOpen} setOpen={setNotesOpen} patientData={patientData} />
        }
      </SectionCard >
    );
};

export default PatientDetails;