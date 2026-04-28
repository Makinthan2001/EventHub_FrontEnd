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
  Layers,
  Ticket,
  DollarSign,
} from "lucide-react";
import { authService } from "../features/auth/services/auth.service";
import { useConfirm } from "../hooks/useConfirm";
import ConfirmDialog from "../components/ConfirmDialog";

interface SidebarProps {
  isAdmin?: boolean;
  onClose: () => void;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  isAdmin = false,
  onClose,
  isOpen,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { confirmState, confirm, handleCancel } = useConfirm();

  const handleLogout = async () => {
    confirm(
      "Are you sure you want to logout?",
      () => {
        authService.logout();
        navigate("/");
      },
      { type: "warning" },
    );
  };

  const organizerMenuItems = [
    {
      label: "Dashboard",
      icon: Home,
      path: "/organizer-dashboard?tab=overview",
    },
    {
      label: "Events",
      icon: Calendar,
      path: "/organizer-dashboard?tab=events",
    },
    {
      label: "Tickets",
      icon: Ticket,
      path: "/organizer-dashboard?tab=tickets",
    },
    {
      label: "Transactions",
      icon: DollarSign,
      path: "/organizer-dashboard?tab=transactions",
    },
    {
      label: "My Profile",
      icon: Settings,
      path: "/organizer-dashboard?tab=profile",
    },
  ];

  const adminMenuItems = [
    { label: "Dashboard", icon: Home, path: "/admin-dashboard?tab=overview" },
    {
      label: "Staff Management",
      icon: Plus,
      path: "/admin-dashboard?tab=staff",
    },
    {
      label: "Event Portal",
      icon: Calendar,
      path: "/admin-dashboard?tab=event-management",
    },
    {
      label: "Categories",
      icon: Layers,
      path: "/admin-dashboard?tab=categories",
    },
    { label: "Tickets", icon: Ticket, path: "/admin-dashboard?tab=tickets" },
    {
      label: "Transactions",
      icon: DollarSign,
      path: "/admin-dashboard?tab=transactions",
    },
    {
      label: "My Profile",
      icon: Settings,
      path: "/admin-dashboard?tab=profile",
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
                    ${
                      active
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

      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        type={confirmState.type}
        onConfirm={confirmState.onConfirm}
        onCancel={handleCancel}
      />
    </>
  );
};

export default Sidebar;
