import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from "../layouts/Navbar";
import Footer from "../layouts/Footer";
import AgendaBuilder from "../features/events/components/AgendaBuilder";
import TicketBuilder from "../features/events/components/TicketBuilder";
import { ArrowLeft } from 'lucide-react';
import { eventService } from "../features/events/services/event.service";
import { categoryService, Category } from "../features/events/services/category.service";
import { Event, AgendaItem, Ticket } from '../types';

const EditEvent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    image: '',
    event_date: '',
    start_time: '',
    end_time: '',
    location: '',
    description: '',
    is_free: false,
    mobile_number: '',
    email: '',
  });

  const [agenda, setAgenda] = useState<AgendaItem[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [audience, setAudience] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      try {
        const data = await eventService.getEventById(id);
        setEvent(data);
        setFormData({
          title: data.title,
          category: data.category.toString(),
          image: data.image || '',
          event_date: data.event_date,
          start_time: data.start_time,
          end_time: data.end_time || '',
          location: data.location,
          description: data.description || '',
          is_free: data.is_free || false,
          mobile_number: data.mobile_number || '',
          email: data.email || '',
        });
        setAgenda(data.agenda || []);
        setTickets(data.tickets || []);
      } catch (error) {
        console.error("Failed to fetch event", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;

    // Validate required fields
    if (!formData.title || !formData.event_date || !formData.start_time || !formData.location) {
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
            total_seats: (t as any).available_seats || t.total_seats
          }))
      };
      await eventService.updateEvent(id, payload);
      setSubmitMessage('Event updated successfully!');
      setTimeout(() => navigate('/organizer-dashboard'), 2000);
    } catch (error) {
      setSubmitMessage('Failed to update event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="pt-32 text-center">Loading...</div>;
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Event not found</h2>
          <Link to="/organizer-dashboard" className="text-indigo-600 hover:text-indigo-700">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="pt-24 pb-12 bg-slate-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <h1 className="text-4xl font-bold text-slate-900 text-center">Edit Event</h1>
            <p className="text-center text-slate-600 mt-2">Update your event details</p>
          </div>

          {submitMessage && (
            <div className={`mb-6 p-4 rounded-lg ${submitMessage.includes('successfully') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {submitMessage}
            </div>
          )}

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

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-8 py-4 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] disabled:opacity-50"
              >
                {isLoading ? 'Updating...' : 'Update Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EditEvent;
