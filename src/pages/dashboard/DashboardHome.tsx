
import React from "react";
import PowerMonitoring from "@/components/PowerMonitoring";
import DevicePriorityOverview from "@/components/power-monitoring/DevicePriorityOverview";

const DashboardHome = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <PowerMonitoring />
      <DevicePriorityOverview />
    </div>
  );
};

export default DashboardHome;
