import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  User as UserIcon,
  Info,
  Target,
  Users,
  Ticket as TicketIcon,
  Check,
  Edit,
  Mail,
  Phone,
} from "lucide-react";
import Navbar from "../layouts/Navbar";
import Footer from "../layouts/Footer";
import { eventService } from "../features/events/services/event.service";
import { authService } from "../features/auth/services/auth.service";
import { Event } from "../types";

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = authService.getCurrentUser();

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
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Navbar />
        <div className="pt-32 pb-16 px-6 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Event Not Found
          </h1>
          <p className="text-slate-600 mb-8">
            The event you're looking for doesn't exist.
          </p>
          <Link
            to="/events"
            className="text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            Back to Events
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isEventOwner = currentUser && event.auth_id === currentUser.id;
  const canRegister = event.status === "accepted";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />

      {/* Back to Events Link */}
      <div className="pt-24 pb-4 px-6">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Events</span>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="relative h-96 rounded-3xl overflow-hidden shadow-xl">
            <img
              src={
                event.image ||
                "https://images.unsplash.com/photo-1540575467063-178a50c2df87"
              }
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-4xl md:text-5xl font-bold">
                  {event.title}
                </h1>
                {event.status === "pending" && (
                  <span className="px-4 py-2 bg-yellow-500 text-white rounded-full text-sm font-bold">
                    Pending Approval
                  </span>
                )}
                {event.status === "rejected" && (
                  <span className="px-4 py-2 bg-red-500 text-white rounded-full text-sm font-bold">
                    Rejected
                  </span>
                )}
                {event.status === "expired" && (
                  <span className="px-4 py-2 bg-gray-500 text-white rounded-full text-sm font-bold">
                    Expired
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-6 text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>
                    {event.event_date} • {event.start_time} - {event.end_time}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <UserIcon className="w-5 h-5" />
                  <span>{event.organizer_name || "Organizer"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-6 pb-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {isEventOwner && (
              <button
                onClick={() => navigate(`/ edit - event / ${id} `)}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
              >
                <Edit className="w-5 h-5" />
                Edit Event Details
              </button>
            )}

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Info className="w-6 h-6 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  About This Event
                </h2>
              </div>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>{event.description}</p>
              </div>
            </div>

            {event.agenda &&
              Array.isArray(event.agenda) &&
              event.agenda.length > 0 && (
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Target className="w-6 h-6 text-purple-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Event Agenda
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {event.agenda.map((item: any, index: number) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1 pt-1">
                          <p className="text-slate-900 font-medium">
                            <span className="text-indigo-600 font-semibold">
                              {item.time}
                            </span>{" "}
                            - {item.title}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TicketIcon className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Tickets & Registration
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {event.tickets?.map((ticket) => (
                  <div
                    key={ticket.id}
                    onClick={() =>
                      ticket.id !== undefined && setSelectedTicket(ticket.id)
                    }
                    className={`p - 6 rounded - xl border - 2 cursor - pointer transition - all ${
                      selectedTicket === ticket.id
                        ? "border-indigo-600 bg-indigo-50 shadow-md"
                        : "border-slate-200 hover:border-indigo-300 hover:shadow-sm"
                    } `}
                  >
                    <h3 className="font-bold text-lg text-slate-900 mb-2">
                      {ticket.name}
                    </h3>
                    <p className="text-3xl font-bold text-indigo-600 mb-3">
                      {ticket.price === 0 || ticket.price === "0"
                        ? "Free"
                        : `Rs.${ticket.price} `}
                    </p>
                    <p className="text-sm text-slate-600 mb-4">
                      <Users className="w-4 h-4 inline mr-1" />
                      {ticket.total_seats} seats available
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 sticky top-24">
              <h3 className="text-xl font-bold text-slate-900 mb-6">
                Event Summary
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Date</p>
                    <p className="font-semibold text-slate-900">
                      {event.event_date}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Time</p>
                    <p className="font-semibold text-slate-900">
                      {event.start_time} - {event.end_time}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Location</p>
                    <p className="font-semibold text-slate-900">
                      {event.location}
                    </p>
                  </div>
                </div>
              </div>

              {canRegister ? (
                <Link
                  to={`/register-event/${id}`}
                  className="w-full mt-8 bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  Register Now
                  <ArrowLeft className="w-5 h-5 rotate-180" />
                </Link>
              ) : (
                <div className="mt-8">
                  {event.status === "pending" && (
                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 text-center">
                      <p className="text-yellow-800 font-semibold">
                        ⏳ Awaiting Admin Approval
                      </p>
                      <p className="text-yellow-600 text-sm mt-2">
                        This event is pending approval. Registration will be
                        available once approved.
                      </p>
                    </div>
                  )}
                  {event.status === "rejected" && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center">
                      <p className="text-red-800 font-semibold">
                        ❌ Event Rejected
                      </p>
                      <p className="text-red-600 text-sm mt-2">
                        This event has been rejected and is not available for
                        registration.
                      </p>
                    </div>
                  )}
                  {event.status === "expired" && (
                    <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 text-center">
                      <p className="text-gray-800 font-semibold">
                        📅 Event Expired
                      </p>
                      <p className="text-gray-600 text-sm mt-2">
                        This event has ended and is no longer accepting
                        registrations.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EventDetails;
