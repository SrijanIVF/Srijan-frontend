import { Menu, Home, Search, MessageCircle, FileText, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import LeftSidebar from "./LeftSidebar";
import { useState } from "react";

const DashboardHeader = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <header className="w-full bg-[image:var(--gradient-header)] text-white shadow-md">
      <LeftSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
      <div className="container flex items-center justify-between h-16 gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            className="p-1 rounded hover:bg-white/10 transition-colors"
          >
            <Menu className="h-6 w-6 opacity-90 hover:opacity-100" />
          </button>
          <a href="/ce" className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            <h1 className="text-2xl font-bold tracking-wide">
              SRIJAN CRM
            </h1>
          </a>
        </div>

        <button className="hidden md:flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors px-5 py-2 rounded-md text-sm font-semibold">
          <Search className="h-4 w-4" />
          FIND DOCTOR & COST
        </button>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" className="gap-2 bg-white text-foreground hover:bg-white/90">
            Call Logs <FileText className="h-4 w-4" />
          </Button>
          <div className="h-9 w-9 rounded-full bg-[hsl(142_70%_45%)] flex items-center justify-center shadow-md cursor-pointer">
            <MessageCircle className="h-5 w-5 fill-white text-white" />
          </div>
          <div className="h-9 w-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center cursor-pointer">
            <User className="h-5 w-5" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;