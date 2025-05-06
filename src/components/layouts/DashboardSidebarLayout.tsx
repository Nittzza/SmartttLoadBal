
import React from "react";
import { Outlet } from "react-router-dom";
import NavSidebar from "../sidebar/NavSidebar";

const DashboardSidebarLayout = () => {
  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <NavSidebar />
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardSidebarLayout;
