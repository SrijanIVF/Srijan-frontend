import { Menu, Home, Search, MessageCircle, FileText, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import LeftSidebar from "./LeftSidebar";
import { useState } from "react";
import { LogOut } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { useNavigate } from "react-router-dom";
import AgentsPerformance from "../AgentPerformance";

const DashboardHeader = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };


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
          <a href="/agent" className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            <h1 className="text-2xl font-bold tracking-wide">SRIJAN CRM</h1>
          </a>
        </div>

        <button className="hidden md:flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors px-5 py-2 rounded-md text-sm font-semibold">
          <Search className="h-4 w-4" />
          FIND DOCTOR & COST
        </button>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            className="gap-2 bg-white text-foreground hover:bg-white/90"
            onClick={() => setOpenModal(!openModal)}
          >
            Agent Performance <FileText className="h-4 w-4" />
          </Button>
          <div className="h-9 w-9 rounded-full bg-[hsl(142_70%_45%)] flex items-center justify-center shadow-md cursor-pointer">
            <MessageCircle className="h-5 w-5 fill-white text-white" />
          </div>
          <div className="relative">
            <button
              onClick={() => setOpenProfile(!openProfile)}
              className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 shadow-lg hover:scale-105 transition flex items-center justify-center"
            >
              <User className="h-5 w-5 text-white" />
            </button>

            {openProfile && (
              <div className="absolute right-0 top-12 w-40 bg-white rounded-xl shadow-xl border overflow-hidden z-50">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 flex items-center gap-2 text-red-600 hover:bg-red-50 transition text-sm font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {openModal && (
        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogContent className="max-w-[95vw] md:max-w-6xl max-h-[90vh] overflow-hidden p-0">
            <DialogHeader className="px-6 pt-6 pb-2 border-b">
              <DialogTitle>Agent Performance</DialogTitle>
            </DialogHeader>

            <div className="overflow-y-auto max-h-[80vh] px-6">
              <AgentsPerformance />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </header>
  );
};

export default DashboardHeader;