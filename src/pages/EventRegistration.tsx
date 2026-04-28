import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User as UserIcon,
  Mail,
  Phone,
  CheckCircle,
  Ticket as TicketIcon,
  Users,
} from "lucide-react";
import Navbar from "../layouts/Navbar";
import Footer from "../layouts/Footer";
import { eventService } from "../features/events/services/event.service";
import { authService } from "../features/auth/services/auth.service";
import { Event, Ticket } from "../types";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";
import { generateTicketPDF } from "../utils/ticketPdf";
import ConfirmDialog from "../components/ConfirmDialog";
import { useConfirm } from "../hooks/useConfirm";

const EventRegistration: React.FC = () => {
  const { toast, showToast, hideToast } = useToast();
  const { confirmState, confirm, handleCancel } = useConfirm();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = authService.getCurrentUser();

  const [formData, setFormData] = useState({
    fullName: currentUser?.full_name || "",
    email: currentUser?.email || "",
    phone: "",
    ticketType: "",
    numberOfTickets: 1,
    specialRequests: "",
  });

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      try {
        const data = await eventService.getEventById(id);
        setEvent(data);
      } catch (error) {
        console.error("Failed to fetch event", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (isLoading) {
    return <div className="pt-32 text-center">Loading...</div>;
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Event not found
          </h2>
          <Link to="/events" className="text-indigo-600 hover:text-indigo-700">
            Browse Events
          </Link>
        </div>
      </div>
    );
  }

  // Check if event is approved
  if (event.status !== "accepted") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Navbar />
        <div className="pt-32 pb-16 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-white rounded-2xl p-12 shadow-lg border border-slate-200">
              {event.status === "pending" && (
                <>
                  <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">⏳</span>
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">
                    Event Pending Approval
                  </h2>
                  <p className="text-lg text-slate-600 mb-8">
                    This event is currently waiting for admin approval.
                    Registration will be available once the event is approved.
                  </p>
                </>
              )}
              {event.status === "rejected" && (
                <>
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">❌</span>
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">
                    Event Not Available
                  </h2>
                  <p className="text-lg text-slate-600 mb-8">
                    This event has been rejected and is not available for
                    registration.
                  </p>
                </>
              )}
              {event.status === "expired" && (
                <>
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">📅</span>
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">
                    Event Expired
                  </h2>
                  <p className="text-lg text-slate-600 mb-8">
                    This event has ended and is no longer accepting
                    registrations.
                  </p>
                </>
              )}
              <Link
                to="/events"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                Browse Other Events
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTicketSelect = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setFormData({ ...formData, ticketType: ticket.name });
  };

  const calculateTotal = () => {
    if (!selectedTicket) return 0;
    return (
      (typeof selectedTicket.price === "string"
        ? parseFloat(selectedTicket.price)
        : selectedTicket.price) * formData.numberOfTickets
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !selectedTicket
    ) {
      showToast(
        "Please fill in all required fields and select a ticket type",
        "warning",
      );
      return;
    }

    // Generate transaction ID
    const transactionId = `TRX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    setRegistrationComplete(true);

    // Ask user if they want to download the ticket PDF
    if (event) {
      confirm(
        "Would you like to download your ticket as a PDF? You can also share it with others.",
        () => {
          // Generate and download ticket PDF
          generateTicketPDF({
            transactionId: transactionId,
            eventTitle: event.title,
            eventDate: event.event_date,
            eventTime: `${event.start_time} - ${event.end_time}`,
            eventLocation: event.location,
            attendeeName: formData.fullName,
            attendeeEmail: formData.email,
            ticketType: selectedTicket.name,
            quantity: formData.numberOfTickets,
            totalAmount: calculateTotal(),
          });
          showToast("Ticket PDF downloaded successfully!", "success");
        },
        { title: "Download Ticket PDF", type: "info" },
      );
    }
  };

  return (
    <>
      <Navbar />
      <div className="pt-24 pb-12 bg-slate-50 min-h-screen">
        <div className="max-w-5xl mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <Link
              to={`/event/${id}`}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Event Details
            </Link>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Event Registration
            </h1>
            <p className="text-slate-600">{event.title}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {!registrationComplete ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">
                      Personal Information
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Full Name *
                        </label>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+94 71 234 5678"
                            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ticket Selection */}
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">
                      Select Ticket Type
                    </h2>
                    <div className="space-y-4">
                      {event.tickets?.map((ticket) => (
                        <div
                          key={ticket.id}
                          onClick={() => handleTicketSelect(ticket)}
                          className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedTicket?.id === ticket.id
                              ? "border-indigo-600 bg-indigo-50 shadow-md"
                              : "border-slate-200 hover:border-indigo-300"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-bold text-lg text-slate-900">
                                {ticket.name}
                              </h3>
                              <p className="text-3xl font-bold text-indigo-600 mt-2">
                                {ticket.price === 0 || ticket.price === "0"
                                  ? "Free"
                                  : `Rs.${ticket.price} `}
                              </p>
                            </div>
                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                selectedTicket?.id === ticket.id
                                  ? "border-indigo-600 bg-indigo-600"
                                  : "border-slate-300"
                              }`}
                            >
                              {selectedTicket?.id === ticket.id && (
                                <CheckCircle className="w-4 h-4 text-white" />
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-slate-600">
                            <Users className="w-4 h-4 inline mr-1" />
                            {ticket.total_seats} seats available
                          </p>
                        </div>
                      ))}
                    </div>

                    {selectedTicket && (
                      <div className="mt-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Number of Tickets
                        </label>
                        <input
                          type="number"
                          name="numberOfTickets"
                          value={formData.numberOfTickets}
                          onChange={handleInputChange}
                          min="1"
                          max="10"
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                        />
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                  >
                    Complete Registration
                  </button>
                </form>
              ) : (
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 text-center">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">
                    Registration Successful!
                  </h2>
                  <p className="text-slate-600 mb-8">
                    You have successfully registered for {event.title}.
                  </p>
                  <Link
                    to="/events"
                    className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    Browse More Events
                  </Link>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 sticky top-24">
                <h3 className="text-xl font-bold text-slate-900 mb-6">
                  Order Summary
                </h3>
                <div className="mb-6 pb-6 border-b border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2">
                    {event.title}
                  </h4>
                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{event.event_date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>

                {selectedTicket && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Ticket</span>
                      <span className="font-medium">{selectedTicket.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Quantity</span>
                      <span className="font-medium">
                        {formData.numberOfTickets}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-slate-200 flex justify-between">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-xl text-indigo-600">
                        {calculateTotal() === 0
                          ? "Free"
                          : `Rs.${calculateTotal()} `}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
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
        confirmText="Download PDF"
        showCancelButton={false}
      />
    </>
  );
};

export default EventRegistration;
