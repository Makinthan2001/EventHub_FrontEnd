import React, { useState, useEffect } from "react";
import {
  Menu,
  Bell,
  Check,
  X,
  Home,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Filter,
  Ticket,
  DollarSign,
  MapPin,
  Calendar,
  Lock,
  CheckCircle,
} from "lucide-react";
import { useSearchParams, Link } from "react-router-dom";
import Sidebar from "../layouts/Sidebar";
import NotificationCenter from "../features/dashboard/components/NotificationCenter";
import { userService } from "../features/dashboard/services/user.service";
import { eventService } from "../features/events/services/event.service";
import { User, UserRole, Event } from "../types";
import CategoryManagement from "../features/admin/components/CategoryManagement";
import AdminEventViewModal from "../features/admin/components/AdminEventViewModal";
import { authService } from "../features/auth/services/auth.service";
import api from "../services/api";
import {
  paymentService,
  Payment,
  PaymentSummary,
} from "../features/events/services/payment.service";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";
import ConfirmDialog from "../components/ConfirmDialog";
import { useConfirm } from "../hooks/useConfirm";

const AdminDashboard: React.FC = () => {
  const { toast, showToast, hideToast } = useToast();
  const { confirmState, confirm, handleCancel } = useConfirm();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const activeTab =
    searchParams.get("tab") === "users"
      ? "staff"
      : searchParams.get("tab") || "overview";

  const setActiveTab = (newTab: string) => {
    setSearchParams({ tab: newTab });
  };

  const [eventTab, setEventTab] = useState("pending");
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<User>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [eventSearchQuery, setEventSearchQuery] = useState("");
  const [eventFilterCategory, setEventFilterCategory] = useState("all");
  const [categories, setCategories] = useState<any[]>([]);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    old: "",
    new: "",
    confirm: "",
  });
  const [selectedEventId, setSelectedEventId] = useState<string>("all");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary | null>(
    null,
  );
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [selectedEventForModal, setSelectedEventForModal] =
    useState<Event | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Payment | null>(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "notifications") {
      setShowNotifications(true);
    }
  }, [searchParams]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await userService.getAllUsers();
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const data = await eventService.getAllEvents();
      setEvents(data);
    } catch (error) {
      console.error("Failed to fetch events", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("categories/");
      const data = response.data;
      setCategories(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error("Failed to fetch categories", error);
      setCategories([]);
    }
  };

  const fetchPayments = async () => {
    setPaymentLoading(true);
    try {
      const params: any = {};
      if (selectedEventId !== "all") {
        params.ticket__event = selectedEventId;
      }
      const data = await paymentService.getAllPayments(params);
      setPayments(data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setPaymentLoading(false);
    }
  };

  const fetchPaymentSummary = async () => {
    try {
      const params: any = {};
      if (selectedEventId !== "all") {
        params.ticket__event = selectedEventId;
      }
      const data = await paymentService.getPaymentSummary(params);
      setPaymentSummary(data);
    } catch (error) {
      console.error("Error fetching payment summary:", error);
    }
  };

  useEffect(() => {
    if (activeTab === "staff") {
      fetchUsers();
    } else if (activeTab === "event-management" || activeTab === "overview") {
      fetchEvents();
      if (activeTab === "overview") fetchUsers();
      fetchCategories();
    } else if (activeTab === "tickets" || activeTab === "transactions") {
      fetchEvents(); // Need events for the dropdown
      fetchPayments();
      fetchPaymentSummary();
    }
  }, [activeTab, selectedEventId]);

  const handleDeletePayment = async (id: number) => {
    confirm(
      "Are you sure you want to delete this registration?",
      async () => {
        try {
          await paymentService.deletePayment(id);
          fetchPayments();
          fetchPaymentSummary();
          showToast("Registration deleted successfully!", "success");
        } catch (error) {
          showToast("Failed to delete registration", "error");
        }
      },
      { type: "danger" },
    );
  };

  const handleToggleStatus = async (user: User) => {
    try {
      const result = await userService.toggleUserStatus(
        user.id,
        user.is_active,
      );
      setUsers(users.map((u) => (u.id === user.id ? result : u)));
    } catch (error) {
      console.error("Failed to toggle user status", error);
    }
  };

  const handleRoleChange = async (id: number, newRole: UserRole) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;

    const confirmMessage = `Are you sure you want to change ${user.full_name}'s role from ${user.role} to ${newRole}?`;
    confirm(
      confirmMessage,
      async () => {
        try {
          const result = await userService.updateUserRole(id, newRole);
          setUsers(users.map((u) => (u.id === id ? result : u)));
          showToast("Role updated successfully!", "success");
        } catch (error) {
          console.error("Failed to update user role", error);
          showToast("Failed to update role", "error");
        }
      },
      { type: "warning" },
    );
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditFormData({
      full_name: user.full_name,
      email: user.email,
      mobile_number: user.mobile_number || "",
      role: user.role,
    });
    setIsEditModalOpen(true);
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const result = await userService.updateUser(
        selectedUser.id,
        editFormData,
      );
      setUsers(users.map((u) => (u.id === selectedUser.id ? result : u)));
      setIsEditModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Failed to update user", error);
    }
  };

  const handleDeleteEvent = async (id: number) => {
    confirm(
      "Are you sure you want to delete this event?",
      async () => {
        try {
          await eventService.softDeleteEvent(id);
          fetchEvents();
          showToast("Event deleted successfully!", "success");
        } catch (error) {
          console.error("Failed to delete event", error);
          showToast("Failed to delete event", "error");
        }
      },
      { type: "danger" },
    );
  };

  // Auth & Derived State
  const currentUser = authService.getCurrentUser();
  const displayUsers = users.filter((u) => u.id !== currentUser?.id);

  const stats = {
    totalUsers: users.length,
    totalEvents: events.length,
    pendingApprovals: events.filter((e) => e.status === "pending").length,
    approvedToday: events.filter(
      (e) =>
        e.status === "accepted" &&
        new Date(e.updated_at).toDateString() === new Date().toDateString(),
    ).length,
  };

  const filteredEvents = events.filter((e) => {
    const matchesTab =
      eventTab === "all" ||
      (eventTab === "pending" && e.status === "pending") ||
      (eventTab === "published" && e.status === "accepted") ||
      (eventTab === "rejected" && e.status === "rejected");
    const matchesSearch =
      (e.title?.toLowerCase() || "").includes(eventSearchQuery.toLowerCase()) ||
      (e.organizer_name?.toLowerCase() || "").includes(
        eventSearchQuery.toLowerCase(),
      );
    const matchesCategory =
      eventFilterCategory === "all" || e.category_name === eventFilterCategory;
    return matchesTab && matchesSearch && matchesCategory;
  });

  const filteredUsers = displayUsers.filter((u) => {
    const matchesSearch =
      (u.full_name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (u.email?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // Mock notifications
  const notifications = [
    {
      id: 1,
      type: "error",
      title: "🚨 URGENT: Event Edit Request",
      message:
        '"Tech Workshop 2025" has been modified and needs immediate review!',
      time: "5 minutes ago",
      read: false,
      urgent: true,
    },
  ];

  return (
    <div className="flex h-screen bg-[#f8fafc]">
      <Sidebar
        isAdmin={true}
        onClose={() => setSidebarOpen(false)}
        isOpen={sidebarOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Modern Top Bar */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-slate-900">
              Admin Control Portal
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="p-2.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-300"
            >
              <Home className="w-5 h-5" />
            </Link>
            <div className="h-8 w-px bg-slate-200 mx-2" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                {currentUser?.full_name?.charAt(0) || "A"}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-bold text-slate-900">
                  {currentUser?.full_name}
                </p>
                <p className="text-xs text-slate-500 capitalize">
                  {currentUser?.role}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Portal Header & Quick Stats */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1 bg-indigo-600 text-white rounded-2xl p-6 shadow-indigo-100 shadow-xl flex flex-col justify-center">
                  <h3 className="text-lg font-bold opacity-80 uppercase tracking-wider text-xs">
                    Platform Status
                  </h3>
                  <p className="text-3xl font-black mt-1">Operational</p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <Menu className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs font-bold uppercase">
                      Total Staff
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      {stats.totalUsers}
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex items-center gap-4">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                    <Filter className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs font-bold uppercase">
                      Active Events
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      {stats.totalEvents}
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex items-center gap-4">
                  <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                    <Bell className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs font-bold uppercase">
                      Pending
                    </p>
                    <p className="text-2xl font-bold text-rose-600">
                      {stats.pendingApprovals}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Overview Content */}
            {activeTab === "overview" && (
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-8 shadow-lg">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">
                      Welcome Back, Admin
                    </h2>
                    <p className="text-slate-300 max-w-lg">
                      Platform activity is looking good today. You have{" "}
                      {stats.pendingApprovals} events awaiting your review.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setActiveTab("event-management")}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold transition-all shadow-lg"
                    >
                      Review Events
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Staff Tab */}
            {(activeTab === "staff" || activeTab === "users") && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Staff Management ({filteredUsers.length})
                  </h2>
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="relative">
                      <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search staff..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64 shadow-sm"
                      />
                    </div>
                    {/* <select
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
                    >
                      <option value="all">All Roles</option>
                      <option value="organizer">Organizer</option>
                      <option value="admin">Admin</option>
                    </select> */}
                  </div>
                </div>
                <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-slate-200">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                          Name
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                          Email
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                          Role
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-6 py-4 text-slate-900 font-medium">
                            {user.full_name}
                          </td>
                          <td className="px-6 py-4 text-slate-600">
                            {user.email}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => {
                                const newRole =
                                  user.role === "organizer"
                                    ? "admin"
                                    : "organizer";
                                handleRoleChange(user.id, newRole);
                              }}
                              className={`relative inline-flex h-9 w-20 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                                user.role === "admin"
                                  ? "bg-indigo-600"
                                  : "bg-slate-300"
                              }`}
                            >
                              <span
                                className={`inline-block h-7 w-7 transform rounded-full bg-white transition-transform ${
                                  user.role === "admin"
                                    ? "translate-x-11"
                                    : "translate-x-1"
                                }`}
                              />
                              <span
                                className={`absolute text-xs font-bold ${
                                  user.role === "admin"
                                    ? "left-2 text-white"
                                    : "right-2 text-slate-600"
                                }`}
                              >
                                {user.role === "admin" ? "Admin" : "Org"}
                              </span>
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleToggleStatus(user)}
                              className={`relative inline-flex h-9 w-20 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                user.is_active
                                  ? "bg-green-500 focus:ring-green-500"
                                  : "bg-slate-300 focus:ring-slate-400"
                              }`}
                            >
                              <span
                                className={`inline-block h-7 w-7 transform rounded-full bg-white transition-transform ${
                                  user.is_active
                                    ? "translate-x-11"
                                    : "translate-x-1"
                                }`}
                              />
                              <span
                                className={`absolute text-xs font-bold ${
                                  user.is_active
                                    ? "left-2 text-white"
                                    : "right-2 text-slate-600"
                                }`}
                              >
                                {user.is_active ? "Active" : "Disabled"}
                              </span>
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleViewDetails(user)}
                                className="text-indigo-600 hover:text-indigo-800 font-medium text-sm px-3 py-1 bg-indigo-50 rounded-lg transition-colors"
                              >
                                Details
                              </button>
                              <button
                                onClick={() => handleEditUser(user)}
                                className="text-slate-600 hover:text-slate-800 font-medium text-sm px-3 py-1 bg-slate-100 rounded-lg transition-colors"
                              >
                                Edit
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Events Tab */}
            {(activeTab === "event-management" || activeTab === "events") && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Event Management
                  </h2>
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                      {["pending", "published", "rejected", "all"].map(
                        (tab) => (
                          <button
                            key={tab}
                            onClick={() => setEventTab(tab)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                              eventTab === tab
                                ? "bg-slate-900 text-white shadow-md"
                                : "text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            {tab}
                          </button>
                        ),
                      )}
                    </div>
                    <div className="relative">
                      <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search events..."
                        value={eventSearchQuery}
                        onChange={(e) => setEventSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64 shadow-sm"
                      />
                    </div>
                    <select
                      value={eventFilterCategory}
                      onChange={(e) => setEventFilterCategory(e.target.value)}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
                    >
                      <option value="all">All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.category_name}>
                          {cat.category_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-slate-200">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                          Event Info
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                          Organizer
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                          Date & Time
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                          Status
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredEvents.map((event) => (
                        <tr
                          key={event.id}
                          className="hover:bg-slate-50/50 transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {event.image ? (
                                <img
                                  src={event.image}
                                  alt=""
                                  className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                                  <Filter className="w-5 h-5" />
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-bold text-slate-900">
                                  {event.title}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {event.category_name}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-slate-600">
                              {event.organizer_name}
                            </p>
                            <p className="text-xs text-slate-400">
                              {event.email}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-slate-600">
                              {new Date(event.event_date).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-slate-400">
                              {event.start_time} - {event.end_time}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                event.status === "accepted"
                                  ? "bg-green-100 text-green-700"
                                  : event.status === "pending"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                              }`}
                            >
                              {event.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setSelectedEventForModal(event);
                                  setIsEventModalOpen(true);
                                }}
                                className="px-3 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors text-xs font-bold flex items-center gap-1"
                                title="View Event"
                              >
                                <Eye className="w-3.5 h-3.5" /> View
                              </button>

                              {event.status === "pending" && (
                                <>
                                  <button
                                    onClick={async () => {
                                      await eventService.approveEvent(event.id);
                                      fetchEvents();
                                    }}
                                    className="px-3 py-1 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition-colors text-xs font-bold flex items-center gap-1"
                                    title="Approve"
                                  >
                                    <Check className="w-3.5 h-3.5" /> Accept
                                  </button>
                                  <button
                                    onClick={async () => {
                                      await eventService.rejectEvent(event.id);
                                      fetchEvents();
                                    }}
                                    className="px-3 py-1 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg transition-colors text-xs font-bold flex items-center gap-1"
                                    title="Reject"
                                  >
                                    <X className="w-3.5 h-3.5" /> Reject
                                  </button>
                                </>
                              )}

                              <Link
                                to={`/edit-event/${event.id}`}
                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                title="Edit Event"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Link>

                              <button
                                onClick={() => handleDeleteEvent(event.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete Event"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredEvents.length === 0 && (
                    <div className="p-12 text-center">
                      <p className="text-slate-500 font-medium">
                        No events found in this category.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6 max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="h-32 bg-indigo-600 relative">
                    <div className="absolute -bottom-16 left-8 flex items-end gap-6">
                      <div className="w-32 h-32 bg-white rounded-2xl p-1 shadow-xl">
                        <div className="w-full h-full bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 text-4xl font-bold">
                          {currentUser?.full_name?.charAt(0)}
                        </div>
                      </div>
                      <div className="pb-4">
                        <h2 className="text-2xl font-bold text-slate-900">
                          {currentUser?.full_name}
                        </h2>
                        <p className="text-slate-500 capitalize">
                          {currentUser?.role}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-20 px-8 pb-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h3 className="font-bold text-slate-900 border-b pb-2">
                          Account Information
                        </h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Email</span>
                            <span className="text-slate-900 font-medium">
                              {currentUser?.email}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Joined Date</span>
                            <span className="text-slate-900 font-medium">
                              {currentUser?.date_joined
                                ? new Date(
                                    currentUser.date_joined,
                                  ).toLocaleDateString()
                                : "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Account Type</span>
                            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs font-bold uppercase">
                              {currentUser?.role}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t">
                      
                      {showPasswordChange && (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            // Mock password change
                            showToast(
                              "Password updated successfully!",
                              "success",
                            );
                            setShowPasswordChange(false);
                            setPasswordData({ old: "", new: "", confirm: "" });
                          }}
                          className="space-y-4 max-w-sm"
                        >
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                              Old Password
                            </label>
                            <input
                              type="password"
                              value={passwordData.old}
                              onChange={(e) =>
                                setPasswordData({
                                  ...passwordData,
                                  old: e.target.value,
                                })
                              }
                              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                              New Password
                            </label>
                            <input
                              type="password"
                              value={passwordData.new}
                              onChange={(e) =>
                                setPasswordData({
                                  ...passwordData,
                                  new: e.target.value,
                                })
                              }
                              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                              required
                            />
                          </div>
                          <div className="flex gap-3 pt-2">
                            <button
                              type="submit"
                              className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors"
                            >
                              Update
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowPasswordChange(false)}
                              className="px-6 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Categories Tab */}
            {activeTab === "categories" && <CategoryManagement />}

            {activeTab === "tickets" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Global Ticket Registrations
                  </h2>
                  <div className="flex items-center gap-4">
                    <select
                      value={selectedEventId}
                      onChange={(e) => setSelectedEventId(e.target.value)}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm min-w-[200px]"
                    >
                      <option value="all">All Events</option>
                      {events.map((event) => (
                        <option key={event.id} value={event.id}>
                          {event.title} ({event.organizer_name})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                          Attendee
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                          Ticket Info
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                          Date
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paymentLoading ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-6 py-12 text-center text-slate-500"
                          >
                            Loading registrations...
                          </td>
                        </tr>
                      ) : payments.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-6 py-12 text-center text-slate-500 italic"
                          >
                            No registrations found.
                          </td>
                        </tr>
                      ) : (
                        payments.map((payment) => (
                          <tr
                            key={payment.id}
                            className="hover:bg-slate-50/50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <p className="font-bold text-slate-900">
                                {payment.full_name}
                              </p>
                              <p className="text-xs text-slate-500">
                                {payment.email}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm font-medium text-slate-700">
                                Qty: {payment.ticket_count}
                              </p>
                              <p className="text-xs text-slate-500">
                                Amt: LKR {payment.amount}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-xs text-slate-500">
                                {new Date(
                                  payment.created_at,
                                ).toLocaleDateString()}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setSelectedTransaction(payment);
                                    setShowTransactionModal(true);
                                  }}
                                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                  title="View Details"
                                >
                                  <Eye className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeletePayment(payment.id)
                                  }
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete Registration"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "transactions" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Platform Financials
                  </h2>
                  <select
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm min-w-[200px]"
                  >
                    <option value="all">All Events / Organizers</option>
                    {events.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-xl">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-indigo-500 text-white rounded-xl">
                        <DollarSign className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest">
                          Total Platform Revenue
                        </p>
                        <p className="text-4xl font-black">
                          LKR{" "}
                          {paymentSummary?.total_revenue?.toLocaleString() ||
                            "0.00"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                        <Ticket className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                          Global Transactions
                        </p>
                        <p className="text-4xl font-black text-slate-900">
                          {paymentSummary?.total_transactions || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900">
                      Latest Platform Transactions
                    </h3>
                  </div>
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                          Transaction ID
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                          Amount
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase"></th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                          Status
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paymentLoading ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-6 py-12 text-center text-slate-500"
                          >
                            Loading...
                          </td>
                        </tr>
                      ) : (
                        payments.slice(0, 15).map((payment) => (
                          <tr
                            key={payment.id}
                            className="hover:bg-slate-50/50 transition-colors"
                          >
                            <td className="px-6 py-4 font-mono text-xs text-slate-600">
                              {payment.transaction_id}
                            </td>
                            <td className="px-6 py-4 font-bold text-slate-900">
                              LKR {payment.amount}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => {
                                  setSelectedTransaction(payment);
                                  setShowTransactionModal(true);
                                }}
                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase">
                                Settled
                              </span>
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-500">
                              {new Date(
                                payment.created_at,
                              ).toLocaleDateString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
                    <Lock className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Security Settings
                    </h2>
                    <p className="text-slate-500">
                      Manage your account security and password
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        Change Password
                      </h3>
                      <p className="text-slate-500 text-sm mt-1">
                        Ensure your account is using a long, random password to
                        stay secure.
                      </p>
                    </div>
                  </div>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (passwordData.new !== passwordData.confirm) {
                        showToast("New passwords don't match!", "warning");
                        return;
                      }
                      try {
                        await authService.changePassword(
                          passwordData.old,
                          passwordData.new,
                        );
                        showToast("Password changed successfully!", "success");
                        setPasswordData({ old: "", new: "", confirm: "" });
                      } catch (error: any) {
                        showToast(
                          error.response?.data?.error ||
                            "Failed to change password",
                          "error",
                        );
                      }
                    }}
                    className="space-y-6 max-w-lg"
                  >
                    <div className="space-y-4">
                      <div className="relative">
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          Current Password
                        </label>
                        <input
                          type={showPasswords.old ? "text" : "password"}
                          value={passwordData.old}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              old: e.target.value,
                            })
                          }
                          required
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords({
                              ...showPasswords,
                              old: !showPasswords.old,
                            })
                          }
                          className="absolute right-4 top-[38px] text-slate-400 hover:text-indigo-600 transition-colors"
                        >
                          {showPasswords.old ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>

                      <div className="relative">
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          New Password
                        </label>
                        <input
                          type={showPasswords.new ? "text" : "password"}
                          value={passwordData.new}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              new: e.target.value,
                            })
                          }
                          required
                          minLength={6}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords({
                              ...showPasswords,
                              new: !showPasswords.new,
                            })
                          }
                          className="absolute right-4 top-[38px] text-slate-400 hover:text-indigo-600 transition-colors"
                        >
                          {showPasswords.new ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>

                      <div className="relative">
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwordData.confirm}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              confirm: e.target.value,
                            })
                          }
                          required
                          minLength={6}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords({
                              ...showPasswords,
                              confirm: !showPasswords.confirm,
                            })
                          }
                          className="absolute right-4 top-[38px] text-slate-400 hover:text-indigo-600 transition-colors"
                        >
                          {showPasswords.confirm ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                      <button
                        type="submit"
                        className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30 flex items-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                  <Check className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Edit User Details
                </h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editFormData.full_name || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      full_name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editFormData.email || ""}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Mobile Number
                </label>
                <input
                  type="text"
                  value={editFormData.mobile_number || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      mobile_number: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  User Role
                </label>
                <select
                  value={editFormData.role || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      role: e.target.value as UserRole,
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                >
                  <option value="organizer">Organizer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {isDetailsModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-900">
                User Profile Details
              </h3>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-md">
                  {selectedUser.full_name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 leading-tight">
                    {selectedUser.full_name}
                  </h4>
                  <p className="text-slate-500 text-sm">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-y-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Role Type
                  </p>
                  <p className="text-slate-900 font-semibold capitalize">
                    {selectedUser.role}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Contact Number
                  </p>
                  <p className="text-slate-900 font-semibold">
                    {selectedUser.mobile_number || "Not provided"}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Account Status
                  </p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold mt-1 ${selectedUser.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
                    {selectedUser.is_active
                      ? "Active & Verified"
                      : "Currently Inactive"}
                  </span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Joined Date
                  </p>
                  <p className="text-slate-900 font-semibold">
                    {new Date(selectedUser.date_joined).toLocaleDateString(
                      "en-US",
                      { year: "numeric", month: "long", day: "numeric" },
                    )}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {showNotifications && (
        <NotificationCenter
          notifications={notifications || []}
          onClose={() => setShowNotifications(false)}
        />
      )}

      {/* Transaction Details Modal */}
      {showTransactionModal && selectedTransaction && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-indigo-600 text-white">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Ticket className="w-6 h-6" /> Booking Details
              </h3>
              <button
                onClick={() => setShowTransactionModal(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 space-y-8 overflow-y-auto">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Attendee
                  </p>
                  <p className="text-lg font-bold text-slate-900">
                    {selectedTransaction.full_name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {selectedTransaction.email}
                  </p>
                  <p className="text-sm text-slate-500">
                    {selectedTransaction.mobile_number}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Transaction
                  </p>
                  <p className="text-lg font-mono font-bold text-indigo-600">
                    {selectedTransaction.transaction_id}
                  </p>
                  <p className="text-sm text-slate-500">
                    {new Date(selectedTransaction.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                  Event Details
                </p>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-900">
                      {selectedTransaction.event_title || "N/A"}
                    </h4>
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />{" "}
                        {selectedTransaction.event_date || "N/A"}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />{" "}
                        {selectedTransaction.location || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Ticket Type
                      </p>
                      <p className="font-bold text-slate-900">
                        {selectedTransaction.ticket_name || "Generic"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Quantity
                      </p>
                      <p className="font-bold text-slate-900">
                        x{selectedTransaction.ticket_count}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-6 bg-indigo-50 rounded-2xl border-2 border-indigo-100 border-dashed">
                <span className="text-indigo-600 font-bold uppercase tracking-widest text-xs">
                  Total Amount Paid
                </span>
                <span className="text-indigo-600 font-black text-3xl">
                  LKR {selectedTransaction.amount}
                </span>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowTransactionModal(false)}
                className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      <AdminEventViewModal
        event={selectedEventForModal}
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
      />
      {toast.isVisible && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        {...(confirmState.title && { title: confirmState.title })}
        message={confirmState.message}
        {...(confirmState.type && { type: confirmState.type })}
        onConfirm={confirmState.onConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default AdminDashboard;
