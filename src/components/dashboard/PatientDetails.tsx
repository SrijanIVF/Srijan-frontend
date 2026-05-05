import { Link } from "react-router-dom";
import SectionCard from "./SectionCard";
import { FileEdit, StickyNote, MessageCircle } from "lucide-react";

const rowsLeft = [
  ["Lead ID", "92D037"],
  ["City", "Delhi"],
  ["Treatment", "IVF"],
  ["Followup Date", "2026-04-28"],
  ["Patient Name", "Test"],
  ["Relative Name", "Test"],
];
const rowsRight = [
  ["Call Status", "CFresh"],
  ["Area", "1--Delhi"],
  ["Last Call Date", "NA"],
  ["Lead Source", "SRIJAN"],
  ["Spouse Name", "NA"],
];

const PatientDetails = () => {
  return (
    <SectionCard title="Patient Details">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
        {rowsLeft.map(([k, v]) => (
          <p key={k}><span className="text-muted-foreground">{k}: </span><span className="font-semibold">{v}</span></p>
        ))}
        {rowsRight.map(([k, v]) => (
          <p key={k}><span className="text-muted-foreground">{k}: </span><span className="font-semibold">{v}</span></p>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-3 mt-6">
        <Link to="/ce/fill-info" className="bg-[image:var(--gradient-pink)] text-white px-5 py-2 rounded-md text-sm font-semibold flex items-center gap-2 shadow hover:-translate-y-0.5 transition">
          <FileEdit className="h-4 w-4" /> Fill Info
        </Link>
        <button className="bg-[hsl(272_45%_45%)] text-white px-5 py-2 rounded-md text-sm font-semibold flex items-center gap-2 shadow hover:-translate-y-0.5 transition">
          <StickyNote className="h-4 w-4" /> Add Notes
        </button>
        <button className="bg-[hsl(142_70%_45%)] text-white px-5 py-2 rounded-md text-sm font-semibold flex items-center gap-2 shadow hover:-translate-y-0.5 transition">
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </button>
      </div>
    </SectionCard>
  );
};

export default PatientDetails;