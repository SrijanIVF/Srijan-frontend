import { useEffect, useState } from "react";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardFooter from "@/components/dashboard/DashboardFooter";
import ActionBar from "@/components/dashboard/ActionBar";
import PatientDetails, { PatientData } from "@/components/dashboard/PatientDetails";
import CallDetails from "@/components/dashboard/CallDetails";
import LeadsLists from "@/components/dashboard/LeadsLists";

import { getPatientNextDashboard } from "@/lib/auth";

const CEAgentDashboard = () => {
  const [patientData, setPatientData] = useState<PatientData>(null);
  const [loading, setLoading] = useState(true);

  const refreshPatient = async () => {
    try {
      setLoading(true);

      const response = await getPatientNextDashboard();

      setPatientData(response);

      console.log("NEXT LEAD =>", response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshPatient();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DashboardHeader />

      <main className="flex-1 container py-6 space-y-6">
        <ActionBar
          patientData={patientData}
          refreshPatient={refreshPatient}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <PatientDetails patientData={patientData} loading={loading} />

          <CallDetails />
        </div>

        <LeadsLists />
      </main>

      <DashboardFooter />
    </div>
  );
};

export default CEAgentDashboard;