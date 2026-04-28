import React, { useState, useEffect } from "react";
import {
  Menu,
  Bell,
  Home,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Filter,
  Ticket,
  DollarSign,
  MapPin,
  Lock,
} from "lucide-react";
import { useSearchParams, Link } from "react-router-dom";
import Sidebar from "../layouts/Sidebar";
import NotificationCenter from "../features/dashboard/components/NotificationCenter";
import { authService } from "../features/auth/services/auth.service";
import { eventService } from "../features/events/services/event.service";
import { Event } from "../types";
import CreateEventModal from "../features/events/components/CreateEventModal";
import AdminEventViewModal from "../features/admin/components/AdminEventViewModal";
import api from "../services/api";
import {
  paymentService,
  Payment,
  PaymentSummary,
} from "../features/events/services/payment.service";
import { useToast } from "../hooks/useToast";
import { useConfirm } from "../hooks/useConfirm";
import Toast from "../components/Toast";
import ConfirmDialog from "../components/ConfirmDialog";

const OrganizerDashboard: React.FC = () => {
  const { toast, showToast, hideToast } = useToast();
  const { confirmState, confirm, handleCancel } = useConfirm();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const activeTab = searchParams.get("tab") || "overview";

  const setActiveTab = (newTab: string) => {
    setSearchParams({ tab: newTab });
  };
  const [eventsTab, setEventsTab] = useState("pending"); // "pending", "accepted", "expired"
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
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

  // activeTab is now derived from searchParams directly

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await eventService.getOrganizerEvents();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("categories/");
      const data = response.data;
      setCategories(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
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
    fetchEvents();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (activeTab === "tickets" || activeTab === "transactions") {
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

  const handleDelete = async (id: number) => {
    confirm(
      "Are you sure you want to delete this event? This is a soft delete.",
      async () => {
        try {
          await eventService.softDeleteEvent(id);
          fetchEvents();
          showToast("Event deleted successfully!", "success");
        } catch (error) {
          showToast("Failed to delete event", "error");
        }
      },
      { type: "danger" },
    );
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleCreateSuccess = () => {
    fetchEvents();
    setEditingEvent(null);
  };

  // Stats Logic
  const stats = {
    total: events.length,
    accepted: events.filter((e) => e.status === "accepted").length,
    pending: events.filter((e) => e.status === "pending").length,
    rejected: events.filter((e) => e.status === "rejected").length,
  };

  // Auth User
  const authUser = authService.getCurrentUser();
  const user = {
    name: authUser?.full_name || "Organizer",
    joinDate: authUser?.date_joined
      ? new Date(authUser.date_joined).toLocaleDateString()
      : "N/A",
  };

  const filteredEvents = events.filter((event) => {
    const matchesTab =
      eventsTab === "all" ||
      (eventsTab === "pending" && event.status === "pending") ||
      (eventsTab === "accepted" && event.status === "accepted") ||
      (eventsTab === "expired" && new Date(event.event_date) < new Date());

    const matchesSearch =
      (event.title?.toLowerCase() || "").includes(
        eventSearchQuery.toLowerCase(),
      ) ||
      (event.location?.toLowerCase() || "").includes(
        eventSearchQuery.toLowerCase(),
      );

    const matchesCategory =
      eventFilterCategory === "all" ||
      event.category_name === eventFilterCategory;

    return matchesTab && matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    const styles: any = {
      accepted: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      rejected: "bg-red-100 text-red-800",
      expired: "bg-gray-100 text-gray-800",
      deleted: "bg-gray-100 text-gray-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${styles[status]}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar
        isAdmin={false}
        onClose={() => setSidebarOpen(false)}
        isOpen={sidebarOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-slate-600 hover:text-slate-900"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-slate-900">
              {activeTab === "overview"
                ? "Organizer Dashboard"
                : "Event Management"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-slate-600 hover:text-slate-900 transition-colors p-2 rounded-lg hover:bg-slate-100"
            >
              <Home className="w-6 h-6" />
            </Link>
            <div className="h-8 w-px bg-slate-200 mx-2" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                {authUser?.full_name?.charAt(0) || "O"}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-bold text-slate-900">
                  {authUser?.full_name}
                </p>
                <p className="text-xs text-slate-500 capitalize">
                  {authUser?.role}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-6 space-y-6">
            {activeTab === "overview" && (
              <>
                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl p-8 shadow-lg">
                  <h2 className="text-3xl font-bold mb-2">
                    Welcome back, {user.name}!
                  </h2>
                  <p className="text-indigo-100">
                    You have {stats.pending} events awaiting approval.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    {
                      label: "Total Events",
                      value: stats.total,
                      icon: Calendar,
                      color: "text-blue-600",
                      bg: "bg-blue-50",
                    },
                    {
                      label: "Accepted",
                      value: stats.accepted,
                      icon: CheckCircle,
                      color: "text-green-600",
                      bg: "bg-green-50",
                    },
                    {
                      label: "Pending",
                      value: stats.pending,
                      icon: Clock,
                      color: "text-yellow-600",
                      bg: "bg-yellow-50",
                    },
                    {
                      label: "Rejected",
                      value: stats.rejected,
                      icon: AlertTriangle,
                      color: "text-red-600",
                      bg: "bg-red-50",
                    },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}
                        >
                          <stat.icon className="w-6 h-6" />
                        </div>
                      </div>
                      <p className="text-slate-600 text-sm font-medium">
                        {stat.label}
                      </p>
                      <p className="text-3xl font-bold text-slate-900 mt-1">
                        {loading ? "..." : stat.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-6">
                    Recent Activity
                  </h3>
                  {loading ? (
                    <p>Loading...</p>
                  ) : events.length === 0 ? (
                    <p className="text-slate-500 italic">
                      No events created yet.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {events.slice(0, 5).map((event) => (
                        <div
                          key={event.id}
                          className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                              {event.title[0]}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">
                                {event.title}
                              </p>
                              <p className="text-sm text-slate-500">
                                {event.event_date}
                              </p>
                            </div>
                          </div>
                          {getStatusBadge(event.status)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === "profile" && (
              <div className="space-y-6 max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="h-32 bg-gradient-to-r from-indigo-600 to-violet-600 relative">
                    <div className="absolute -bottom-16 left-8 flex items-end gap-6">
                      <div className="w-32 h-32 bg-white rounded-2xl p-1 shadow-xl">
                        <div className="w-full h-full bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 text-4xl font-bold">
                          {authUser?.full_name?.charAt(0)}
                        </div>
                      </div>
                      <div className="pb-4">
                        <h2 className="text-2xl font-bold text-slate-900">
                          {authUser?.full_name}
                        </h2>
                        <p className="text-slate-500 capitalize">
                          {authUser?.role}
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
                              {authUser?.email}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Joined Date</span>
                            <span className="text-slate-900 font-medium">
                              {authUser?.date_joined
                                ? new Date(
                                    authUser.date_joined,
                                  ).toLocaleDateString()
                                : "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Account Type</span>
                            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs font-bold uppercase">
                              {authUser?.role}
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
                            alert("Password updated successfully!");
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
            {activeTab === "tickets" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Registered Tickets
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
                          {event.title}
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
                    Transaction Overview
                  </h2>
                  <select
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm min-w-[200px]"
                  >
                    <option value="all">All Events</option>
                    {events.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                        <DollarSign className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs font-bold uppercase">
                          Total Revenue
                        </p>
                        <p className="text-3xl font-black text-slate-900">
                          LKR{" "}
                          {paymentSummary?.total_revenue?.toLocaleString() ||
                            "0.00"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <Ticket className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs font-bold uppercase">
                          Total Transactions
                        </p>
                        <p className="text-3xl font-black text-slate-900">
                          {paymentSummary?.total_transactions || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="p-6 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900">
                      Recent Transactions
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

                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                          Status
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
                            colSpan={5}
                            className="px-6 py-12 text-center text-slate-500"
                          >
                            Loading...
                          </td>
                        </tr>
                      ) : (
                        payments.slice(0, 10).map((payment) => (
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
                            <td className="px-6 py-4">
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase">
                                Completed
                              </span>
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-500">
                              {new Date(
                                payment.created_at,
                              ).toLocaleDateString()}
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
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activeTab === "events" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex bg-white p-1 rounded-xl border border-slate-200 w-fit">
                      {["pending", "accepted", "expired", "all"].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setEventsTab(tab)}
                          className={`px-6 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                            eventsTab === tab
                              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
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
                  <button
                    onClick={() => {
                      setEditingEvent(null);
                      setIsModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
                  >
                    <Plus className="w-5 h-5" /> Create Event
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                          Event Details
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                          Date & Time
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                          Status
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {loading ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-6 py-12 text-center text-slate-500"
                          >
                            Loading events...
                          </td>
                        </tr>
                      ) : filteredEvents.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-6 py-12 text-center text-slate-500 italic"
                          >
                            No {eventsTab} events found.
                          </td>
                        </tr>
                      ) : (
                        filteredEvents.map((event) => (
                          <tr
                            key={event.id}
                            className="hover:bg-slate-50/50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                <img
                                  src={
                                    event.image ||
                                    "https://via.placeholder.com/150"
                                  }
                                  alt=""
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                                <div>
                                  <p className="font-bold text-slate-900">
                                    {event.title}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {event.category_name} • {event.location}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm font-medium text-slate-700">
                                {event.event_date}
                              </p>
                              <p className="text-xs text-slate-500">
                                {event.start_time} - {event.end_time}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              {getStatusBadge(event.status)}
                            </td>
                            <td className="px-6 py-4">
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
                                <button
                                  onClick={() => handleEdit(event)}
                                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                  title="Edit Event"
                                >
                                  <Edit2 className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => handleDelete(event.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete Event"
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

      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreateSuccess}
        initialData={editingEvent}
      />

      {showNotifications && (
        <NotificationCenter
          notifications={[]} // You can fetch real notifications here
          onClose={() => setShowNotifications(false)}
        />
      )}

      <AdminEventViewModal
        event={selectedEventForModal}
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
      />

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
                <Eye className="w-6 h-6" />
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
      {toast.isVisible && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title={confirmState.title || "Confirm Action"}
        message={confirmState.message}
        type={confirmState.type || "info"}
        onConfirm={confirmState.onConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default OrganizerDashboard;
