
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Settings, 
  FileText, 
  ChartBar, 
  Bell, 
  User, 
  Users
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar = ({ open, setOpen }: SidebarProps) => {
  const location = useLocation();

  // Navigation items for the sidebar
  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      name: "Devices",
      href: "/dashboard/devices",
      icon: Bell,
    },
    {
      name: "Reports",
      href: "/dashboard/reports",
      icon: FileText,
    },
    {
      name: "Analytics",
      href: "/dashboard/analytics",
      icon: ChartBar,
    },
    {
      name: "Admin",
      href: "/dashboard/admin",
      icon: Users,
      admin: true, // Optional: used to show only for admin users
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-sidebar transition-all duration-300 md:relative",
        open ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-16"
      )}
    >
      {/* Sidebar Header */}
      <div className="flex h-16 items-center justify-between px-4 py-2">
        <Link to="/dashboard" className="flex items-center gap-2">
          {open ? (
            <>
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white">
                <Bell size={18} />
              </div>
              <span className="text-lg font-semibold text-sidebar-foreground">
                SmartLoad
              </span>
            </>
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white">
              <Bell size={18} />
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  location.pathname === item.href
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                  !open && "justify-center px-0"
                )}
              >
                <item.icon size={20} />
                {open && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Section */}
      <div className="border-t p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent">
            <User size={18} className="text-sidebar-accent-foreground" />
          </div>
          {open && (
            <div className="flex flex-col">
              <span className="text-sm font-medium text-sidebar-foreground">
                Demo User
              </span>
              <span className="text-xs text-sidebar-foreground/70">
                user@example.com
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
