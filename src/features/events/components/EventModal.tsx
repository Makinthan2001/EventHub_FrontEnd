import React, { useState } from "react";
import {
  X,
  Calendar,
  MapPin,
  Clock,
  Users,
  Ticket as TicketIcon,
  Phone,
  Mail,
  CreditCard,
  User,
  ShieldCheck,
} from "lucide-react";
import { Event, Ticket } from "../../../types";
import { paymentService } from "../services/payment.service";
import Toast from "../../../components/Toast";
import { useToast } from "../../../hooks/useToast";
import { generateTicketPDF } from "../../../utils/ticketPdf";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { useConfirm } from "../../../hooks/useConfirm";

interface EventModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

type Step = "details" | "tickets" | "payment";

const EventModal: React.FC<EventModalProps> = ({ event, isOpen, onClose }) => {
  const { toast, showToast, hideToast } = useToast();
  const { confirmState, confirm, handleCancel } = useConfirm();
  const [step, setStep] = useState<Step>("details");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    cardNumber: "",
    expiryDate: "",
    cvc: "",
  });

  if (!isOpen || !event) return null;

  const handleBookNow = () => {
    if (event.is_free) {
      setStep("payment");
    } else {
      setStep("tickets");
    }
  };

  const handleSelectTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setQuantity(1);
    setStep("payment");
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate quantity against available seats
    if (selectedTicket) {
      const availableSeats =
        selectedTicket.total_seats - (selectedTicket.booked_seats || 0);
      if (quantity > availableSeats) {
        showToast(
          `Only ${availableSeats} seat(s) available for this ticket type.`,
          "warning",
        );
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const unitPrice = selectedTicket
        ? parseFloat(selectedTicket.price.toString())
        : 0;
      const paymentData = {
        full_name: formData.fullName,
        email: formData.email,
        mobile_number: formData.mobileNumber,
        ticket_count: quantity,
        amount: (unitPrice * quantity).toString(),
        ticket: selectedTicket?.id || event.tickets?.[0]?.id,
        transaction_id: `TRX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      };

      await paymentService.createPayment(paymentData);

      showToast("Registration Successful!", "success");

      // Ask user if they want to download the ticket PDF
      confirm(
        "Would you like to download your ticket as a PDF? You can also share it with others.",
        () => {
          // Generate and download ticket PDF
          generateTicketPDF({
            transactionId: paymentData.transaction_id,
            eventTitle: event.title,
            eventDate: event.event_date,
            eventTime: `${event.start_time} - ${event.end_time}`,
            eventLocation: event.location,
            attendeeName: formData.fullName,
            attendeeEmail: formData.email,
            ticketType: selectedTicket?.name || "General Admission",
            quantity: quantity,
            totalAmount: unitPrice * quantity,
          });
          showToast("Ticket PDF downloaded successfully!", "success");
          setTimeout(() => onClose(), 1500);
        },
        { title: "Download Ticket PDF", type: "info" },
      );

      setTimeout(() => {
        if (confirmState.isOpen) {
          onClose();
        }
      }, 30000); // Auto close after 30 seconds if no action
      // Reset state
      setStep("details");
      setSelectedTicket(null);
      setQuantity(1);
      setFormData({
        fullName: "",
        email: "",
        mobileNumber: "",
        cardNumber: "",
        expiryDate: "",
        cvc: "",
      });
    } catch (error: any) {
      console.error("Payment failed", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to process registration. Please try again.";
      showToast(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
        {/* Left Side: Image (Visible on Desktop) */}
        <div className="hidden md:block md:w-1/3 relative">
          <img
            src={
              event.image ||
              "https://images.unsplash.com/photo-1540575467063-178a50c2df87"
            }
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 left-6 text-white">
            <h3 className="text-xl font-bold mb-2">{event.title}</h3>
            <p className="text-sm opacity-80">{event.category_name}</p>
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${step === "details" ? "bg-indigo-600" : "bg-slate-300"}`}
              />
              <div
                className={`w-2 h-2 rounded-full ${step === "tickets" ? "bg-indigo-600" : "bg-slate-300"}`}
              />
              <div
                className={`w-2 h-2 rounded-full ${step === "payment" ? "bg-indigo-600" : "bg-slate-300"}`}
              />
              <span className="text-xs font-bold text-slate-400 ml-2 uppercase tracking-widest">
                Step {step === "details" ? "1" : step === "tickets" ? "2" : "3"}{" "}
                of 3
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Space */}
          <div className="p-8 overflow-y-auto flex-1">
            {step === "details" && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <h2 className="text-3xl font-black text-slate-900">
                  {event.title}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    <span className="text-sm font-medium">
                      {event.event_date}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Clock className="w-5 h-5 text-indigo-600" />
                    <span className="text-sm font-medium">
                      {event.start_time} - {event.end_time}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <MapPin className="w-5 h-5 text-indigo-600" />
                    <span className="text-sm font-medium">
                      {event.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Users className="w-5 h-5 text-indigo-600" />
                    <span className="text-sm font-medium">
                      {event.organizer_name}
                    </span>
                  </div>
                </div>

                <div className="pt-4">
                  <h4 className="font-bold text-slate-900 mb-2">Description</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {event.description}
                  </p>
                </div>

                <div className="pt-6">
                  <button
                    onClick={handleBookNow}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center gap-2"
                  >
                    {event.is_free ? "Register for Free" : "Get Tickets"}
                    <TicketIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {step === "tickets" && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-slate-900">
                    Select Package
                  </h2>
                  <button
                    onClick={() => setStep("details")}
                    className="text-sm font-bold text-indigo-600"
                  >
                    Back
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {event.tickets?.map((ticket, idx) => {
                    const availableSeats =
                      ticket.total_seats - (ticket.booked_seats || 0);
                    const isSoldOut = availableSeats <= 0;

                    return (
                      <div
                        key={ticket.id || idx}
                        className={`bg-white rounded-3xl border border-slate-200 p-8 shadow-sm transition-all group flex flex-col items-center text-center ${!isSoldOut ? "hover:shadow-xl" : "opacity-60"}`}
                      >
                        <h3
                          className={`text-2xl font-black mb-2 ${idx === 0 ? "text-amber-500" : idx === 1 ? "text-blue-500" : "text-rose-500"}`}
                        >
                          {ticket.name}
                        </h3>

                        {isSoldOut ? (
                          <div className="mb-6">
                            <span className="inline-block px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-bold">
                              SOLD OUT
                            </span>
                          </div>
                        ) : (
                          <p className="text-slate-400 text-sm mb-6 px-4">
                            {availableSeats}{" "}
                            {availableSeats === 1 ? "seat" : "seats"} remaining
                          </p>
                        )}

                        <div className="mb-8">
                          <span className="text-slate-900 font-bold text-lg">
                            Rs.
                          </span>
                          <span className="text-5xl font-black text-slate-900">
                            {parseFloat(
                              ticket.price.toString(),
                            ).toLocaleString()}
                          </span>
                        </div>

                        <button
                          onClick={() =>
                            !isSoldOut && handleSelectTicket(ticket)
                          }
                          disabled={isSoldOut}
                          className={`w-full py-3 rounded-2xl font-bold text-white transition-all transform flex items-center justify-center gap-2
                                                        ${
                                                          isSoldOut
                                                            ? "bg-slate-300 cursor-not-allowed"
                                                            : `active:scale-95 ${idx === 0 ? "bg-amber-500 hover:bg-amber-600" : idx === 1 ? "bg-blue-500 hover:bg-blue-600" : "bg-rose-500 hover:bg-rose-600"}`
                                                        }`}
                        >
                          {isSoldOut ? "SOLD OUT" : "ADD"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {step === "payment" && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 pb-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-slate-900">
                    Payment Details
                  </h2>
                  <button
                    onClick={() =>
                      setStep(event.is_free ? "details" : "tickets")
                    }
                    className="text-sm font-bold text-indigo-600"
                  >
                    Back
                  </button>
                </div>

                <div className="bg-indigo-50 p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                      Selected Item
                    </p>
                    <p className="text-slate-900 font-bold">
                      {selectedTicket
                        ? selectedTicket.name
                        : "Free Registration"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                      Price
                    </p>
                    <p className="text-slate-900 font-black text-xl">
                      Rs.{" "}
                      {selectedTicket
                        ? parseFloat(
                            selectedTicket.price.toString(),
                          ).toLocaleString()
                        : "0"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div>
                    <p className="text-sm font-bold text-slate-700">Quantity</p>
                    <p className="text-xs text-slate-500">
                      {selectedTicket
                        ? `Max ${selectedTicket.total_seats - (selectedTicket.booked_seats || 0)} available`
                        : "How many slots do you need?"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      -
                    </button>
                    <span className="text-xl font-bold text-slate-900 w-8 text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const maxSeats = selectedTicket
                          ? selectedTicket.total_seats -
                            (selectedTicket.booked_seats || 0)
                          : 999;
                        if (quantity < maxSeats) {
                          setQuantity(quantity + 1);
                        }
                      }}
                      disabled={
                        !!(
                          selectedTicket &&
                          quantity >=
                            selectedTicket.total_seats -
                              (selectedTicket.booked_seats || 0)
                        )
                      }
                      className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-dashed border-slate-200">
                  <span className="text-slate-600 font-medium">
                    Total Amount
                  </span>
                  <span className="text-slate-900 font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                    Rs.{" "}
                    {(selectedTicket
                      ? parseFloat(selectedTicket.price.toString()) * quantity
                      : 0
                    ).toLocaleString()}
                  </span>
                </div>

                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <User className="w-3.5 h-3.5" /> Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5" /> Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5" /> Mobile
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.mobileNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            mobileNumber: e.target.value,
                          })
                        }
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  {!event.is_free && (
                    <div className="pt-4 border-t border-slate-100 space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <CreditCard className="w-3.5 h-3.5" /> Card Number
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.cardNumber}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              cardNumber: e.target.value,
                            })
                          }
                          className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                          placeholder="0000 0000 0000 0000"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.expiryDate}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                expiryDate: e.target.value,
                              })
                            }
                            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            placeholder="MM/YY"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            CVC
                          </label>
                          <input
                            type="password"
                            required
                            value={formData.cvc}
                            onChange={(e) =>
                              setFormData({ ...formData, cvc: e.target.value })
                            }
                            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            placeholder="***"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 group"
                    >
                      {isSubmitting ? (
                        "Processing..."
                      ) : (
                        <>
                          Confirm {event.is_free ? "Registration" : "Payment"}
                          <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </>
                      )}
                    </button>
                    <p className="text-center text-[10px] text-slate-400 mt-4 uppercase tracking-tighter">
                      Secure 256-bit SSL Encrypted Transaction
                    </p>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
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
    </div>
  );
};

export default EventModal;
