import SectionCard from "./SectionCard";
import { Link } from "react-router-dom";
import {
  PhoneIncoming,
  PhoneOutgoing,
  FolderOpen,
  Database,
  Upload,
  PhoneCall,
  TrendingUp,
  CalendarClock,
  CalendarDays,
  AlertTriangle,
  CheckCircle2,
  Phone,
} from "lucide-react";

import { useEffect, useState } from "react";
import { clickToCall, getToken, API_BASE } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";
import { PatientData } from "@/pages/types/ptDetails";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type NumberChoice = "primary" | "secondary";

const CallDetails = ({ patientData }: { patientData: PatientData }) => {
  const tiles = [
    {
      label: "All Leads",
      icon: FolderOpen,
      style: "bg-[image:var(--gradient-pink)]",
      count: 0,
      to: "/agent/all-leads",
    },
    {
      label: "C_FRESH",
      icon: Database,
      style: "bg-gradient-to-br from-[hsl(272_45%_50%)] to-[hsl(280_45%_45%)]",
      count: 0,
    },
    {
      label: "New Status Lead",
      icon: Upload,
      style: "bg-gradient-to-br from-[hsl(345_55%_45%)] to-[hsl(355_55%_40%)]",
      count: 0,
    },
    {
      label: "Call Back",
      icon: PhoneCall,
      style: "bg-[image:var(--gradient-green)]",
      count: 0,
    },
    {
      label: "Today Call Back",
      style: "bg-[image:var(--gradient-pink)]",
      icon: CalendarClock,
      count: 0,
    },
    {
      label: "Appointments",
      icon: CalendarDays,
      style: "bg-[image:var(--gradient-blue)]",
      count: 0,
      to: `/agent/appointments/${patientData?.id}`,
    },
    {
      label: "Appointment Missed",
      icon: AlertTriangle,
      style: "bg-gradient-to-br from-[hsl(0_60%_55%)] to-[hsl(15_65%_50%)]",
      count: 0,
    },
    {
      label: "Appointment Done",
      icon: CheckCircle2,
      style: "bg-[image:var(--gradient-teal)]",
      count: 0,
    },
  ];

  const [uid, setUid] = useState("");
  const [calling, setCalling] = useState(false);
  const [openPicker, setOpenPicker] = useState(false);

  const [numbers, setNumbers] = useState<{
    primary: string;
    secondary: string;
    whatsapp: string;
  }>({ primary: "", secondary: "", whatsapp: "" });

  // Seed from patientData prop
  useEffect(() => {
    if (!patientData) return;
    setNumbers((prev) => ({
      primary: patientData.main_mobile  || "",
      secondary: patientData.secondary_mobile  || "",
      whatsapp: patientData.whatsapp_mobile  || "",
    }));
    if (patientData.uid) setUid(String(patientData.uid));
  }, [
    patientData?.main_mobile,
    patientData?.secondary_mobile,
    patientData?.whatsapp_mobile,
    patientData?.uid,
  ]);

  // Fallback fetch (uid + numbers)
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
        const d = json?.data ?? json;

        if (d?.uid) setUid((prev) => prev || String(d.uid));
        setNumbers((prev) => ({
          primary: prev.primary || d?.main_mobile || "",
          secondary: prev.secondary || d?.secondary_mobile || "",
          whatsapp: prev.whatsapp || d?.whatsapp_mobile || "",
        }));
      } catch {
        /* ignore */
      }
    })();
    return () => ctrl.abort();
  }, []);

  const hasPrimary = !!numbers.primary.trim();
  const hasSecondary = !!numbers.secondary.trim();

  const handleDialOutgoing = () => {
    const target = uid.trim();
    if (!target) {
      toast({
        title: "No patient UID",
        description: "Enter or load a patient UID first.",
        variant: "destructive",
      });
      return;
    }
    if (!hasPrimary && !hasSecondary) {
      toast({
        title: "No number available",
        description: "This patient has no primary or alternate number.",
        variant: "destructive",
      });
      return;
    }
    // If only one number exists, dial it directly without popup
    if (hasPrimary && !hasSecondary) {
      dial("primary");
      return;
    }
    if (!hasPrimary && hasSecondary) {
      dial("secondary");
      return;
    }
    // Both exist -> show picker
    setOpenPicker(true);
  };

  const dial = async (type: NumberChoice) => {
    if (calling) return;
    setCalling(true);
    try {
      const data = await clickToCall(uid.trim(), type);
      toast({
        title: `Calling ${type} number`,
        description:
          data?.call_response || `Status: ${data?.call_status ?? "ok"}`,
      });
      setOpenPicker(false);
    } catch (e) {
      toast({
        title: "Call failed",
        description: (e as Error).message,
        variant: "destructive",
      });
    } finally {
      setTimeout(() => setCalling(false), 1500);
    }
  };

  return (
    <SectionCard title="Call Details">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {/* Incoming */}
        <div className="flex items-center bg-white rounded-md overflow-hidden border border-border shadow-sm">
          <input
            placeholder="Pick Incoming"
            className="flex-1 px-4 py-2 outline-none text-sm"
          />
          <button className="bg-[image:var(--gradient-pink)] px-4 py-2.5 text-white">
            <PhoneIncoming className="h-4 w-4" />
          </button>
        </div>

        {/* Outgoing */}
        <div className="flex items-center bg-white rounded-md overflow-hidden border border-border shadow-sm">
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
          >
            <PhoneOutgoing className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tiles */}
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

      {/* Number picker popup */}
      <Dialog open={openPicker} onOpenChange={setOpenPicker}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="text-center text-lg font-bold">
              Which number do you want to call?
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            <NumberOption
              label="Primary Number"
              value={numbers.primary}
              disabled={!hasPrimary || calling}
              onClick={() => dial("primary")}
              gradient="bg-[image:var(--gradient-green)]"
            />
            <NumberOption
              label="Alternate Number"
              value={numbers.secondary}
              disabled={!hasSecondary || calling}
              onClick={() => dial("secondary")}
              gradient="bg-[image:var(--gradient-pink)]"
            />

            {calling && (
              <p className="text-center text-xs text-muted-foreground">
                Placing call…
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </SectionCard>
  );
};

const NumberOption = ({
  label,
  value,
  disabled,
  onClick,
  gradient,
}: {
  label: string;
  value: string;
  disabled?: boolean;
  onClick: () => void;
  gradient: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition
      ${
        disabled
          ? "bg-muted text-muted-foreground border-border opacity-60 cursor-not-allowed"
          : "bg-white border-border hover:shadow-md hover:-translate-y-0.5"
      }`}
  >
    <div className="flex items-center gap-3">
      <span
        className={`${gradient} text-white h-9 w-9 rounded-full flex items-center justify-center shadow`}
      >
        <Phone className="h-4 w-4" />
      </span>
      <div className="text-left">
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-xs font-mono text-muted-foreground">
          {value || "Not available"}
        </p>
      </div>
    </div>

    <span
      className={`text-xs font-semibold px-3 py-1 rounded-full ${
        disabled
          ? "bg-muted text-muted-foreground"
          : "bg-[image:var(--gradient-pink)] text-white"
      }`}
    >
      {disabled ? "N/A" : "Call"}
    </span>
  </button>
);

export default CallDetails;
