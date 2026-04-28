import React from "react";
import {
  X,
  Calendar,
  MapPin,
  Clock,
  Users,
  Ticket as TicketIcon,
  Mail,
  Phone,
  Tag,
  DollarSign,
} from "lucide-react";
import { Event } from "../../../types";

interface AdminEventViewModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

const AdminEventViewModal: React.FC<AdminEventViewModalProps> = ({
  event,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !event) return null;

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      accepted: "bg-green-100 text-green-700 border-green-200",
      rejected: "bg-red-100 text-red-700 border-red-200",
      expired: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-8 py-6 flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
            <div className="flex items-center gap-4 text-sm text-slate-300">
              <span className="flex items-center gap-1">
                <Tag className="w-4 h-4" />
                {event.category_name}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusBadge(event.status)}`}
              >
                {event.status.toUpperCase()}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Event Details */}
            <div className="space-y-6">
              {/* Event Image */}
              {event.image && (
                <div className="rounded-2xl overflow-hidden border-2 border-slate-200">
                  <img
                    src={
                      event.image.startsWith("http")
                        ? event.image
                        : `http://localhost:8000${event.image}`
                    }
                    alt={event.title}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}

              {/* Event Information */}
              <div className="bg-slate-50 rounded-2xl p-6 space-y-4 border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  Event Information
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-slate-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-bold">
                        Date
                      </p>
                      <p className="text-slate-900 font-semibold">
                        {event.event_date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-slate-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-bold">
                        Time
                      </p>
                      <p className="text-slate-900 font-semibold">
                        {event.start_time} - {event.end_time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-slate-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-bold">
                        Location
                      </p>
                      <p className="text-slate-900 font-semibold">
                        {event.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="w-4 h-4 text-slate-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-bold">
                        Organizer
                      </p>
                      <p className="text-slate-900 font-semibold">
                        {event.organizer_name || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-slate-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-bold">
                        Contact Email
                      </p>
                      <p className="text-slate-900 font-semibold">
                        {event.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-slate-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-bold">
                        Contact Phone
                      </p>
                      <p className="text-slate-900 font-semibold">
                        {event.mobile_number}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {event.description && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">
                    Description
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {event.description}
                  </p>
                </div>
              )}

              {/* Agenda */}
              {event.agenda &&
                Array.isArray(event.agenda) &&
                event.agenda.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">
                      Event Agenda
                    </h3>
                    <div className="space-y-3">
                      {event.agenda.map((item: any, index: number) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-indigo-600 font-semibold text-sm">
                              {item.time}
                            </p>
                            <p className="text-slate-900 font-medium">
                              {item.title}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {/* Right Column - Tickets & Seats */}
            <div className="space-y-6">              

              {/* Ticket Types */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <TicketIcon className="w-5 h-5 text-violet-600" />
                  Ticket Types
                </h3>

                {event.is_free ? (
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center">
                    <p className="text-green-700 font-bold text-lg">
                      FREE EVENT
                    </p>
                    <p className="text-green-600 text-sm mt-1">
                      No ticket purchase required
                    </p>
                  </div>
                ) : event.tickets && event.tickets.length > 0 ? (
                  <div className="space-y-3">
                    {event.tickets.map((ticket, index) => (
                      <div
                        key={ticket.id || index}
                        className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-indigo-300 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-900 text-lg">
                              {ticket.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-2">
                              <DollarSign className="w-4 h-4 text-indigo-600" />
                              <span className="text-2xl font-bold text-indigo-600">
                                Rs. {ticket.price}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-200">
                          <div>
                            <p className="text-xs text-slate-500 uppercase font-bold">
                              Total Seats
                            </p>
                            <p className="text-lg font-bold text-slate-900">
                              {ticket.total_seats}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 uppercase font-bold">
                              Booked
                            </p>
                            <p className="text-lg font-bold text-indigo-600">
                              {ticket.booked_seats || 0}
                            </p>
                          </div>
                        </div>

                        {/* Progress bar for this ticket */}
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-slate-500 mb-1">
                            <span>
                              Available:{" "}
                              {ticket.total_seats - (ticket.booked_seats || 0)}
                            </span>
                            <span>
                              {Math.round(
                                ((ticket.booked_seats || 0) /
                                  ticket.total_seats) *
                                  100,
                              )}
                              % Sold
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-indigo-600 to-violet-600 h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${((ticket.booked_seats || 0) / ticket.total_seats) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
                    <TicketIcon className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-500 font-medium">
                      No ticket types defined
                    </p>
                  </div>
                )}
              </div>

              {/* Event Type Badge */}
              <div
                className={`rounded-xl p-4 border-2 text-center ${
                  event.is_free
                    ? "bg-green-50 border-green-200"
                    : "bg-indigo-50 border-indigo-200"
                }`}
              >
                <p
                  className={`font-bold text-sm ${
                    event.is_free ? "text-green-700" : "text-indigo-700"
                  }`}
                >
                  {event.is_free ? "🎉 FREE EVENT" : "💳 PAID EVENT"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-8 py-4 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminEventViewModal;
