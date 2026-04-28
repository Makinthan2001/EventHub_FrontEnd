import React from 'react';
import Navbar from '../layouts/Navbar';
import Hero from '../components/ui/Hero';
import Category from '../features/events/components/Category';
import UpcomingEvents from '../features/events/components/UpcomingEvents';
import Footer from '../layouts/Footer';
import EventModal from '../features/events/components/EventModal';
import { Event } from '../types';
import { useState } from 'react';

const Home: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <Category />
      <UpcomingEvents onEventClick={handleEventClick} />
      <Footer />

      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Home;
