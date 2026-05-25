import { useEffect, useState } from "react";
import {
  PhoneOff,
  AlertTriangle,
  PhoneCall,
  Ban,
  Search,
  Loader2,
  CheckCircle,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";

import { agentDisposition } from "@/lib/auth";
import { PatientData } from "@/pages/types/ptDetails";
import { SmartLeadSearch } from "./Search/Search";
import { CityItem } from "@/pages/FillInfo";
import { API_BASE, getToken } from "@/lib/auth";

type FormKey =
  | "ring"
  | "noexist"
  | "callback"
  | "notreq"
  | "fresh"
  | "altno"
  | "whatsapp"
  | "todaycb"
  | "language"
  | null;

const statusPills = [
  {
    key: "ring" as const,
    label: "Ring/Switch Off/Call",
    icon: PhoneOff,
    bg: "bg-[hsl(35_60%_82%)] text-[hsl(30_50%_35%)]",
  },
  {
    key: "noexist" as const,
    label: "No. Does Not Exist",
    icon: AlertTriangle,
    bg: "bg-[hsl(195_45%_75%)] text-[hsl(200_50%_25%)]",
  },
  {
    key: "callback" as const,
    label: "Call Back",
    icon: PhoneCall,
    bg: "bg-[hsl(150_40%_65%)] text-[hsl(150_45%_20%)]",
  },
  {
    key: "notreq" as const,
    label: "Treatment Not Required",
    icon: Ban,
    bg: "bg-[hsl(20_70%_70%)] text-[hsl(15_55%_25%)]",
  },
];

const actions = [
  {
    key: "fresh" as const,
    label: "Update Fresh",
    style: "bg-[image:var(--gradient-blue)]",
  },
  {
    key: "altno" as const,
    label: "Add Alt. No.",
    style:
      "bg-gradient-to-br from-[hsl(225_70%_45%)] to-[hsl(235_70%_40%)]",
  },
  {
    key: "whatsapp" as const,
    label: "Add WhatsApp. No.",
    style: "bg-[image:var(--gradient-green)]",
  },
  {
    key: "todaycb" as const,
    label: "Today Call Back",
    style: "bg-[image:var(--gradient-pink)]",
  },
  {
    key: "language" as const,
    label: "Language",
    style: "bg-[image:var(--gradient-teal)]",
  },
];

const titles: Record<Exclude<FormKey, null>, string> = {
  ring: "Please click on confirm button and wait for redirection",
  noexist: "No. Does Not Exist",
  callback: "Call Back",
  notreq: "Treatment Not Required",
  fresh: "Dispose Current Lead",
  altno: "Add Alternate No.",
  whatsapp: "Add WhatsApp No.",
  todaycb: "Today CallBack.",
  language: "Language",
};

const SubmitBtn = ({
  variant = "muted",
  children = "SUBMIT",
}: { variant?: "muted" | "pink" | "green"; children?: React.ReactNode }) => {
  const map = {
    muted: "bg-muted text-muted-foreground hover:bg-muted/80",
    pink: "bg-[image:var(--gradient-pink)] text-white hover:shadow-lg",
    green: "bg-[image:var(--gradient-green)] text-white hover:shadow-lg",
  };
  return (
    <button
      type="submit"
      className={`w-full py-2.5 rounded-md text-sm font-semibold tracking-wide transition ${map[variant]}`}
    >
      {children}
    </button>
  );
};

const DISPOSITION_REASONS = [
  { label: "Ringing", value: "ringing" },
  { label: "Busy", value: "busy" },
  { label: "Switch Off", value: "switch_off" },
  { label: "Call Cut", value: "call_cut" },
  { label: "Temporarily Out of Service", value: "temporarily_out_of_service" },
  { label: "Incoming Not Available", value: "incoming_not_available" },
  { label: "Out of Coverage Area", value: "out_of_coverage_area" },
  { label: "Agree for Appointment", value: "agree_for_appt" },
  { label: "Invalid Number", value: "invalid_number" },
  { label: "Call Back Required", value: "call_back_later" },
  { label: "Today Call Back", value: "today_call_back" },
  { label: "Fertility Case", value: "fertility_case" },
  { label: "Treatment Ongoing at Another Center", value: "treatment_ongoing_elsewhere" },
  { label: "Already Pregnant", value: "already_pregnant" },
  { label: "Already Having Baby", value: "already_having_baby" },
  { label: "Low Age", value: "low_age" },
  { label: "Unmarried – Treatment Not Required", value: "unmarried" },
  { label: "Location / Distance Issue", value: "location_issue" },
  { label: "Non-Fertility Case", value: "non_fertility_case" },
  { label: "Invalid Case", value: "invalid_case" },
  { label: "Not Interested", value: "not_interested" },
  { label: "Other", value: "other" },
];

const FormBody = ({
  formKey,
  setOpenForm,
  patientUid,
  refreshPatient,
}: {
  formKey: Exclude<FormKey, null>;
  setOpenForm;
  patientUid: string;
  refreshPatient: () => Promise<void>;
}) => {
  const [dispositionReason, setDispositionReason] = useState("");
  const [notes, setNotes] = useState("");
  const [callBackDateTime, setCallBackDateTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [city, setCity] = useState("");

  const [cities, setCities] = useState<{
    patient_city: CityItem[];
    treatment_city: CityItem[];
  }>({
    patient_city: [],
    treatment_city: [],
  });

  const handleDispose = async () => {
    try {
      setIsSubmitting(true);

      await agentDisposition(
        patientUid,
        dispositionReason,
        notes,
        callBackDateTime,
        city,
      );

      setDispositionReason("");
      setNotes("");
      setCallBackDateTime("");

      setOpenForm(null);

      // NEXT LEAD REFRESH
      await refreshPatient();
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchCityDropdown = async () => {
    try {
      const token = getToken();
      const res =
        await fetch(`${API_BASE}/core/city/`, {
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}`, } : {}),
          },
        });
      const data = await res.json();
      setCities(data);
    } catch (err) {
      console.log(err);
    }
  };

  const location_reason = dispositionReason === "location_issue"

  useEffect(() => {
    fetchCityDropdown()
  }, [location_reason])

  switch (formKey) {
    case "fresh":
      return (
        <div className="space-y-4 pt-2">
          <Select
            value={dispositionReason}
            onValueChange={setDispositionReason}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Disposition Reason" />
            </SelectTrigger>

            <SelectContent>
              {DISPOSITION_REASONS.map((reason) => (
                <SelectItem
                  key={reason.value}
                  value={reason.value}
                >
                  {reason.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {dispositionReason === "call_back_later" && (
            <div className="space-y-2">
              <Label>Call Back Date & Time</Label>

              <Input
                type="datetime-local"
                value={callBackDateTime}
                onChange={(e) =>
                  setCallBackDateTime(e.target.value)
                }
              />
            </div>
          )}

          {dispositionReason === "location_issue" && (
            // <div className="space-y-2">
            //   <Label>City</Label>
            //   <Select
            //     value={city}
            //     onValueChange={(v) => setCity(v)}
            //   >
            //     <SelectTrigger>
            //       <SelectValue />
            //     </SelectTrigger>
            //     <SelectContent>
            //       {cities.patient_city.map(
            //         (city) => (
            //           <SelectItem
            //             key={city.id}
            //             value={String(city.id)}
            //           >
            //             {city.name}
            //           </SelectItem>
            //         ))}
            //     </SelectContent>
            //   </Select>
            // </div>
            <Input
              value={city}
              placeholder="Enter Your City"
              onChange={(e) => setCity(e.target.value)}
            />
          )}

          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add Notes"
          />

          <Button
            onClick={handleDispose}
            disabled={
              !patientUid ||
              !dispositionReason ||
              isSubmitting
            }
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Dispose Lead
              </>
            )}
          </Button>
        </div>
      );

    default:
      return <div>No Form</div>;
  }
};

const ActionBar = ({
  patientData,
  refreshPatient,
}: {
  patientData: PatientData;
  refreshPatient: () => Promise<void>;
}) => {

  const [openForm, setOpenForm] = useState<FormKey>(null);

  return (
    <section className="space-y-4">

      {/* STATUS BUTTONS */}
      <div className="bg-card rounded-xl p-4 shadow-[var(--shadow-card)] flex flex-wrap gap-3 justify-center">
        {statusPills.map((p) => (
          <button
            key={p.label}
            onClick={() => setOpenForm(p.key)}
            className={`${p.bg} px-5 py-2 rounded-md text-sm font-semibold flex items-center gap-2`}
          >
            {p.label}
            <p.icon className="h-4 w-4" />
          </button>
        ))}
      </div>

      {/* ACTION BUTTONS */}
      <div className="bg-card rounded-xl p-4 shadow-[var(--shadow-card)] flex flex-wrap items-center gap-3">
        {actions.map((a) => (
          <button
            key={a.label}
            onClick={() => setOpenForm(a.key)}
            className={`${a.style} text-white px-5 py-2.5 rounded-md text-sm font-semibold`}
          >
            {a.label}
          </button>
        ))}

        {/* SEARCH */}
        {/* <div className="flex-1 min-w-[220px] flex items-center rounded-md overflow-hidden border">
          <input
            type="text"
            placeholder="Search Here..."
            className="flex-1 px-4 py-2 outline-none bg-white text-sm"
          />

          <button className="bg-[image:var(--gradient-pink)] text-white px-4 py-2.5">
            <Search className="h-4 w-4" />
          </button>
        </div> */}

        <SmartLeadSearch />
      </div>

      {/* POPUP */}
      <Dialog
        open={openForm !== null}
        onOpenChange={(o) => !o && setOpenForm(null)}
      >
        <DialogContent className="sm:max-w-lg">

          {openForm && (
            <>
              <DialogHeader className="border-b pb-3">
                <DialogTitle className="text-center text-xl font-bold">
                  {titles[openForm]}
                </DialogTitle>
              </DialogHeader>

              <FormBody
                formKey={openForm}
                setOpenForm={setOpenForm}
                patientUid={patientData?.uid}
                refreshPatient={refreshPatient}
              />
            </>
          )}

        </DialogContent>
      </Dialog>

    </section>
  );
};

export default ActionBar;