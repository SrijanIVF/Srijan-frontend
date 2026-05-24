import SectionCard from "./SectionCard";
import { AlertCircle } from "lucide-react";

const LeadsLists = () => {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <button className="w-full relative bg-[image:var(--gradient-pink)] text-white py-3 rounded-md font-semibold shadow flex items-center justify-center gap-2">
          <AlertCircle className="h-4 w-4" /> Not Attempted Lead
          <span className="absolute -top-2 right-4 bg-[hsl(0_75%_55%)] text-white text-xs h-6 min-w-6 px-2 rounded-full flex items-center justify-center shadow">623</span>
        </button>
        <SectionCard title="Missed Calls : 0">
          <p className="text-center text-muted-foreground py-6">No Leads</p>
        </SectionCard>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <button className="w-full bg-[image:var(--gradient-pink)] text-white py-3 rounded-md font-semibold shadow flex items-center justify-center gap-2">
            <AlertCircle className="h-4 w-4" /> Not Attempted Followup
          </button>
        </div>
        <SectionCard title="PCFresh Leads : 0">
          <p className="text-center text-muted-foreground py-6">No Leads</p>
        </SectionCard>
      </div>
    </div>
  );
};

export default LeadsLists;