import React, { useState } from 'react';
import Navbar from "../layouts/Navbar";
import Footer from "../layouts/Footer";
import AgendaBuilder from "../features/events/components/AgendaBuilder";
import TicketBuilder from "../features/events/components/TicketBuilder";
import { eventService } from "../features/events/services/event.service";
import { categoryService, Category } from "../features/events/services/category.service";
import { authService } from "../features/auth/services/auth.service";
import { useNavigate } from 'react-router-dom';
import { AgendaItem, Ticket } from '../types';
import { useEffect } from 'react';

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    image: '',
    event_date: '',
    start_time: '09:00',
    end_time: '17:00',
    location: '',
    description: '',
    is_free: false,
    mobile_number: '',
    email: '',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, category: data[0]?.id?.toString() || "" }));
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  const [agenda, setAgenda] = useState<AgendaItem[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [audience, setAudience] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.event_date || !formData.start_time || !formData.end_time || !formData.location || !formData.category) {
      setSubmitMessage('Please fill in all required fields');
      return;
    }

    if (!formData.is_free && tickets.length === 0) {
      setSubmitMessage('Paid events must have at least one ticket type');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        is_free: formData.is_free,
        category: parseInt(formData.category),
        agenda: agenda,
        tickets: formData.is_free
          ? [{ name: "General Admission", price: 0, total_seats: 1000 }]
          : tickets.map(t => ({
            ...t,
            total_seats: (t as any).available_seats || (t as any).total_seats || 100
          }))
      };
      await eventService.createEvent(payload);
      setSubmitMessage('Event created successfully!');
      setTimeout(() => navigate('/organizer-dashboard'), 2000);
    } catch (error) {
      setSubmitMessage('Failed to create event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />

      <section className="pt-32 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Create Event</h1>
          <p className="text-lg text-slate-600">Fill out the form below to create a new event.</p>
        </div>
      </section>

      <section className="pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Basic Information</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Event Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Summer Music Festival 2025"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.category_name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Event Date *</label>
                    <input
                      type="date"
                      name="event_date"
                      value={formData.event_date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Start Time *</label>
                    <input
                      type="time"
                      name="start_time"
                      value={formData.start_time}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">End Time *</label>
                    <input
                      type="time"
                      name="end_time"
                      value={formData.end_time}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-4 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="is_free"
                      checked={formData.is_free}
                      onChange={(e) => setFormData({ ...formData, is_free: e.target.checked })}
                      className="w-5 h-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">This is a Free Event (No payment required)</span>
                  </label>
                  <p className="text-xs text-slate-500 ml-8">Free events will automatically have one 'General Admission' ticket type.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., Convention Center, San Francisco"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Description</h2>
              <div className="space-y-6">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Tell us about your event..."
                  rows={5}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <AgendaBuilder agenda={agenda} setAgenda={setAgenda} />
            </div>

            {!formData.is_free && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                <TicketBuilder tickets={tickets} setTickets={setTickets} />
              </div>
            )}

            {submitMessage && (
              <div className={`p-4 rounded-lg ${submitMessage.includes('successfully') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                {submitMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Event'}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CreateEvent;
