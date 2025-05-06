import { NavLink } from "react-router-dom";
import { Home, BarChart2, FileText, Settings, User, LayoutDashboard } from "lucide-react";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Devices", to: "/dashboard/devices", icon: User },
  { label: "Analytics", to: "/dashboard/analytics", icon: BarChart2 },
  { label: "Reports", to: "/dashboard/reports", icon: FileText },
  { label: "Admin", to: "/dashboard/admin", icon: User },
  { label: "Settings", to: "/dashboard/settings", icon: Settings },
  { label: "Home", to: "/", icon: Home },
];

const NavSidebar = () => (
  <aside className="w-56 bg-white border-r shadow-lg min-h-screen flex flex-col">
    <div className="h-16 flex items-center justify-center border-b">
      <span className="text-xl font-bold text-blue-600 tracking-tight">Optimizer SaaS</span>
    </div>
    <nav className="flex-1 py-4">
      <ul className="space-y-1">
        {navItems.map((item) => (
          <li key={item.label}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                (isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100 hover:text-blue-700") +
                " flex items-center gap-3 px-6 py-2 rounded transition-colors"
              }
              end={item.to === "/dashboard"}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
    <div className="border-t p-4 text-sm text-gray-500">
      <div>user@example.com</div>
      <div className="text-xs text-gray-400">Demo User</div>
    </div>
  </aside>
);

export default NavSidebar;
