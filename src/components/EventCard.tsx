import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Event } from '../types';

interface EventCardProps {
  event: Event;
  onClick?: ((event: Event) => void) | undefined;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const CardWrapper = onClick ? 'div' : Link;
  const wrapperProps = onClick ? { onClick: () => onClick(event) } : { to: `/event/${event.id}` };

  return (
    <CardWrapper {...(wrapperProps as any)} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col cursor-pointer">
      {/* Event Image with Category Badge */}
      <div className="relative h-64 overflow-hidden bg-gray-200">
        <img
          src={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87"}
          alt={event.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-semibold bg-white/90 text-slate-800 border border-slate-200 shadow-sm">
          {event.category_name}
        </div>
      </div>

      {/* Event Details */}
      <div className="p-6 flex flex-col flex-1">
        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 mb-4 line-clamp-2 hover:text-indigo-600 transition-colors cursor-pointer">
          {event.title}
        </h3>

        {/* Date and Time */}
        <div className="flex items-center gap-2 text-slate-600 mb-3">
          <Calendar className="w-5 h-5 text-indigo-600" />
          <span className="text-sm font-medium">{event.event_date} • {event.start_time}</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-slate-600 mb-6 pb-4 border-b border-slate-200">
          <MapPin className="w-5 h-5 text-indigo-600" />
          <span className="text-sm font-medium">{event.location}</span>
        </div>

        {/* View Details Link */}
        <div className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-800 transition-colors mt-auto">
          View Details
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </CardWrapper>
  );
};

export default EventCard;
