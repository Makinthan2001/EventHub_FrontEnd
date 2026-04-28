import React, { useState, useEffect } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import EventCard from "../../../components/EventCard";
import { eventService } from "../services/event.service";
import { Event } from "../../../types";

interface UpcomingEventsProps {
  onEventClick?: (event: Event) => void;
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ onEventClick }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventService.getAllEvents();
        // Show only accepted events
        const acceptedEvents = data.filter(
          (event) => event.status === "accepted",
        );
        // Show only the 3 most recent accepted events
        setEvents(acceptedEvents.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch events", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (isLoading) {
    return <div className="py-24 text-center">Loading...</div>;
  }

  return (
    <section className="py-24 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Don't Miss Out</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Upcoming{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                Events
              </span>
            </h2>
            <p className="text-slate-600 text-lg max-w-xl">
              Be the first to join the most anticipated events of the season.
            </p>
          </div>
          <Link
            to="/events"
            className="group flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-800 transition-colors"
          >
            Explore All Events
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <EventCard key={event.id} event={event} onClick={onEventClick} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
