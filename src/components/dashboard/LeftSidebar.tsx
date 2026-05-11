import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Pause,
  ClipboardList,
  PlusCircle,
  CheckCircle2,
  Mic,
  MessageSquare,
  ArrowLeftRight,
  LogIn,
} from "lucide-react";
import { useState } from "react";

interface LeftSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const items = [
  { label: "Pause", icon: Pause, style: "bg-[image:var(--gradient-green)] text-white border-transparent" },
  { label: "Your Report Card", icon: LogIn, style: "bg-card text-foreground" },
  // { label: "Create Kaizen", icon: PlusCircle, style: "bg-card text-foreground" },
  // { label: "CE Kaizen", icon: CheckCircle2, style: "bg-card text-foreground" },
  { label: "Call Recording", icon: Mic, style: "bg-card text-foreground" },
  { label: "Send message to patients", icon: MessageSquare, style: "bg-[image:var(--gradient-blue)] text-white border-transparent" },
  // { label: "Conversion", icon: ArrowLeftRight, style: "bg-[image:var(--gradient-pink)] text-white border-transparent" },
];

const LeftSidebar = ({ open, onOpenChange }: LeftSidebarProps) => {
  const [city, setCity] = useState("");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-80 sm:max-w-sm bg-background p-4 overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle className="bg-[image:var(--gradient-brand)] bg-clip-text text-transparent">
            Quick Actions
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-3">
          {items.map((it) => (
            <button
              key={it.label}
              className={`${it.style} w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-border text-sm font-semibold shadow-sm hover:shadow-md transition`}
            >
              <it.icon className="h-4 w-4" />
              {it.label}
            </button>
          ))}

          {/* <div className="mt-4 p-4 rounded-xl border border-border bg-card space-y-3">
            <h3 className="text-sm font-semibold text-[hsl(var(--brand-blue))]">City Wise Leads</h3>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city..."
              className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-[hsl(var(--brand-pink))]"
            />
            <button className="w-full bg-[image:var(--gradient-pink)] text-white py-2 rounded-md text-sm font-semibold hover:shadow-md transition">
              Submit
            </button>
          </div> */}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default LeftSidebar;