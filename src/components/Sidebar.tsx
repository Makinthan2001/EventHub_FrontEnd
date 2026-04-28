import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Calendar,
  Plus,
  Clock,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  X,
} from "lucide-react";
import { authService } from "../services/auth.service";

interface SidebarProps {
  isAdmin?: boolean;
  onClose: () => void;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isAdmin = false, onClose, isOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    authService.logout();
    navigate("/");
  };

  const organizerMenuItems = [
    { label: "Dashboard", icon: Home, path: "/organizer-dashboard" },
    { label: "Create Event", icon: Plus, path: "/create-event" },
    {
      label: "My Events",
      icon: Calendar,
      path: "/organizer-dashboard?tab=my-events",
    },
    {
      label: "Registered Events",
      icon: Calendar,
      path: "/organizer-dashboard?tab=registered-events",
    },
    {
      label: "Pending Approvals",
      icon: Clock,
      path: "/organizer-dashboard?tab=pending-approvals",
    },
    {
      label: "Notifications",
      icon: Bell,
      path: "/organizer-dashboard?tab=notifications",
    },
    { label: "Settings", icon: Settings, path: "/organizer-dashboard?tab=settings" },
  ];

  const adminMenuItems = [
    { label: "Dashboard", icon: Home, path: "/admin-dashboard" },
    {
      label: "Pending Events",
      icon: Clock,
      path: "/admin-dashboard?tab=pending-events",
    },
    {
      label: "Approved Events",
      icon: Calendar,
      path: "/admin-dashboard?tab=approved-events",
    },
    { label: "Users", icon: Calendar, path: "/admin-dashboard?tab=users" },
    {
      label: "Notifications",
      icon: Bell,
      path: "/admin-dashboard?tab=notifications",
    },
    { label: "Reports", icon: Calendar, path: "/admin-dashboard?tab=reports" },
    {
      label: "Settings",
      icon: Settings,
      path: "/admin-dashboard?tab=settings",
    },
  ];

  const menuItems = isAdmin ? adminMenuItems : organizerMenuItems;

  const isActive = (path: string) => {
    if (path.includes("?")) {
      const [pathname, query] = path.split("?");
      return location.pathname === pathname && location.search === `?${query}`;
    }
    return location.pathname === path && !location.search;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white shadow-xl transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        lg:relative lg:z-auto
      `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-xl font-bold text-indigo-400">
              {isAdmin ? "Admin Panel" : "Organizer"}
            </h2>
            <button
              onClick={onClose}
              className="lg:hidden text-white hover:bg-slate-800 p-1 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium
                    ${active
                      ? "bg-indigo-600 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                  {active && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-800 space-y-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-red-600 hover:text-white rounded-lg transition-all font-medium"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
