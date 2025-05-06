
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import DashboardSidebarLayout from "./components/layouts/DashboardSidebarLayout";
import Devices from "./pages/dashboard/Devices";
import Analytics from "./pages/dashboard/Analytics";
import Reports from "./pages/dashboard/Reports";
import Admin from "./pages/dashboard/Admin";
import Settings from "./pages/dashboard/Settings";
import DashboardHome from "./pages/dashboard/DashboardHome";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public route */}
          <Route path="/" element={<Home />} />

          {/* Protected Dashboard routes with Sidebar Layout */}
          <Route path="/dashboard" element={<DashboardSidebarLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="devices" element={<Devices />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="reports" element={<Reports />} />
            <Route path="admin" element={<Admin />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
