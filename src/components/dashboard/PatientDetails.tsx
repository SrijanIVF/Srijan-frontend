import SectionCard from "./SectionCard";
import { FileEdit, StickyNote, MessageCircle, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { authApi } from "@/lib/api";
import styles from "./Comments.module.css";

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
  const [commentsLoading, setCommentsLoading] = useState(false);

  const [systemComments, setSystemComments] = useState([]);
  const [ceComments, setCeComments] = useState([]);
  const [waComments, setWaComments] = useState([]);
  const [pccComments, setPccComments] = useState([]);

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

  useEffect(() => {
    if (!notesOpen || !patientData?.uid) return;

    fetchComments();
  }, [notesOpen, patientData]);

  const fetchComments = async () => {
    try {

      setCommentsLoading(true);

      const res = await authApi.get(
        `/communication/patient-comments/?patient_id=${patientData?.uid}`
      );

      const data = res.data || {};

      setSystemComments(
        data.system_comments || []
      );

      setCeComments(
        data.manual_comments || []
      );

    } catch (err) {

      console.log(err);

    } finally {

      setCommentsLoading(false);

    }
  };

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
        <DialogContent className="max-w-7xl p-0 overflow-hidden bg-[#eef0ff]">

          <DialogHeader className="bg-indigo-700 px-6 py-4">
            <DialogTitle className="text-white text-xl font-bold">
              Lead Id : {patientData?.uid}
            </DialogTitle>
          </DialogHeader>

          <div className="grid lg:grid-cols-2 gap-4 p-4">

            {/* SYSTEM */}

            <div className="bg-white rounded-xl overflow-hidden">

              <div className="border-b-4 border-purple-600 px-5 py-3">
                <h3 className="font-bold text-xl">
                  SYSTEM GENERATED
                </h3>
              </div>

              <div className="h-[300px] overflow-y-auto p-3 space-y-2">

                {systemComments.map((c, index) => (

                  <div
                    key={c.id || index}
                    className={styles.commentItem}
                  >

                    <span className={styles.commentDate}>
                      {c.created_at?.substring(0, 10)}
                    </span>

                    <span className={styles.separator}>:</span>

                    <span className={styles.commentTime}>
                      {c.created_at?.substring(11, 19)}
                    </span>

                    <span className={styles.separator}>:</span>

                    <span className={styles.commentUser}>
                      {c.user_name}
                    </span>

                    <span className={styles.separator}>:</span>

                    <span className={styles.commentText}>
                      {c.comment}
                    </span>

                  </div>

                ))}

              </div>

            </div>

            {/* COMMENT HISTORY */}

            <div className="bg-white rounded-xl overflow-hidden">

              <div className="border-b-4 border-orange-500 px-5 py-3">
                <h3 className="font-bold text-xl">
                  COMMENT HISTORY
                </h3>
              </div>

              <div className="h-[300px] overflow-y-auto p-3">

                {ceComments.map((c, index) => (

                  <div
                    key={c.id || index}
                    className={styles.commentItem}
                  >

                    <span className={styles.commentDate}>
                      {c.created_at?.substring(0, 10)}
                    </span>

                    <span className={styles.separator}>
                      :
                    </span>

                    <span className={styles.commentTime}>
                      {c.created_at?.substring(11, 19)}
                    </span>

                    <span className={styles.separator}>
                      :
                    </span>

                    <span className={styles.commentUser}>
                      {c.user_name}
                    </span>

                    <span className={styles.separator}>
                      :
                    </span>

                    <span className={styles.commentText}>
                      {c.comment}
                    </span>

                  </div>

                ))}

              </div>

            </div>

            {/* WHATSAPP */}

            <div className="bg-white rounded-xl overflow-hidden">

              <div className="border-b-4 border-green-500 px-5 py-3">
                <h3 className="font-bold text-xl">
                  WHATSAPP HISTORY
                </h3>
              </div>

              <div className="h-[250px] overflow-y-auto p-3 space-y-2">

                {waComments.map((c) => (

                  <div
                    key={c.id}
                    className="bg-green-50 rounded-lg p-3"
                  >
                    {c.message}
                  </div>

                ))}

              </div>

              <div className="p-3 border-t flex gap-2">

                <input
                  className="flex-1 border rounded p-2"
                  placeholder="Add comment..."
                />

                <button className="bg-gray-200 px-5 rounded">
                  Send
                </button>

              </div>

            </div>

            {/* PCC */}

            <div className="bg-white rounded-xl overflow-hidden">

              <div className="border-b-4 border-red-500 px-5 py-3">

                <h3 className="font-bold text-xl">
                  PCC HISTORY / SYSTEM
                </h3>

              </div>

              <div className="h-[300px] overflow-y-auto p-3">

                {pccComments.map((c) => (

                  <div
                    key={c.id}
                    className="bg-slate-100 rounded p-2 mb-2"
                  >
                    {c.comment}
                  </div>

                ))}

              </div>

            </div>

          </div>

        </DialogContent>
      </Dialog>
    </SectionCard >
  );
};

export default PatientDetails;