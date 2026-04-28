import React, { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { eventService } from "../services/event.service";
import { categoryService, Category } from "../services/category.service";
import Toast from "../../../components/Toast";
import { useToast } from "../../../hooks/useToast";

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}) => {
  const { toast, showToast, hideToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formData, setFormData] = useState(
    initialData || {
      title: "",
      category: "",
      event_date: "",
      start_time: "09:00",
      end_time: "17:00",
      location: "",
      image: "",
      is_free: false,
      mobile_number: "",
      email: "",
      description: "",
      agenda: [],
      tickets: [],
    },
  );

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data);
        if (data.length > 0 && !formData.category) {
          setFormData((prev: any) => ({
            ...prev,
            category: data[0]?.id?.toString() || "",
          }));
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (
      !formData.title ||
      !formData.event_date ||
      !formData.start_time ||
      !formData.end_time ||
      !formData.location ||
      !formData.description ||
      !formData.category
    ) {
      showToast("Please fill in all required fields.", "warning");
      return;
    }

    if (!formData.is_free && formData.tickets.length === 0) {
      showToast("Paid events must have at least one ticket type.", "warning");
      return;
    }

    setLoading(true);
    try {
      // Prepare FormData for file upload
      const formDataToSend = new FormData();

      // Add basic fields
      formDataToSend.append("title", formData.title);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("event_date", formData.event_date);
      formDataToSend.append("start_time", formData.start_time);
      formDataToSend.append("end_time", formData.end_time);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("is_free", formData.is_free.toString());
      formDataToSend.append("mobile_number", formData.mobile_number);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("description", formData.description);

      // Add image file if selected
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      // Add agenda as JSON string
      formDataToSend.append("agenda", JSON.stringify(formData.agenda));

      // Add tickets
      const ticketsData = formData.is_free
        ? [{ name: "General Admission", price: 0, total_seats: 1000 }]
        : formData.tickets.map((t: any) => ({
            name: t.name,
            price: t.price,
            total_seats: t.total_seats || t.available_seats || 100,
          }));
      formDataToSend.append("tickets", JSON.stringify(ticketsData));

      if (initialData?.id) {
        await eventService.updateEvent(initialData.id, formDataToSend);
      } else {
        await eventService.createEvent(formDataToSend);
      }
      showToast(
        initialData?.id
          ? "Event updated successfully!"
          : "Event created successfully!",
        "success",
      );
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (error: any) {
      console.error("Error saving event:", error);
      const msg = error.response?.data
        ? JSON.stringify(error.response.data)
        : "Failed to save event.";
      showToast("Failed to save event: " + msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const addAgendaItem = () => {
    setFormData({
      ...formData,
      agenda: [...formData.agenda, { time: "", title: "" }],
    });
  };

  const removeAgendaItem = (index: number) => {
    const newAgenda = [...formData.agenda];
    newAgenda.splice(index, 1);
    setFormData({ ...formData, agenda: newAgenda });
  };

  const addTicket = () => {
    setFormData({
      ...formData,
      tickets: [
        ...formData.tickets,
        { name: "", price: 0, available_seats: 0, benefits: [] },
      ],
    });
  };

  const removeTicket = (index: number) => {
    const newTickets = [...formData.tickets];
    newTickets.splice(index, 1);
    setFormData({ ...formData, tickets: newTickets });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h2 className="text-2xl font-bold text-slate-900">
            {initialData ? "Edit Event" : "Create New Event"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-8 space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Event Title
              </label>
              <input
                required
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter an catchy title"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Category
              </label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Date
              </label>
              <input
                required
                type="date"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                value={formData.event_date}
                onChange={(e) =>
                  setFormData({ ...formData, event_date: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Start Time
              </label>
              <input
                required
                type="time"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                value={formData.start_time}
                onChange={(e) =>
                  setFormData({ ...formData, start_time: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                End Time
              </label>
              <input
                required
                type="time"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                value={formData.end_time}
                onChange={(e) =>
                  setFormData({ ...formData, end_time: e.target.value })
                }
              />
            </div>
            <div className="space-y-4 md:col-span-2 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData.is_free}
                    onChange={(e) =>
                      setFormData({ ...formData, is_free: e.target.checked })
                    }
                  />
                  <div className="w-11 h-6 bg-slate-100 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </div>
                <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  This is a Free Event (No payment required)
                </span>
              </label>
              <p className="text-xs text-slate-500 ml-14">
                Free events will automatically have one 'General Admission'
                ticket type.
              </p>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">
                Location
              </label>
              <input
                required
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Venue name or city"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Email Address
              </label>
              <input
                required
                type="email"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="contact@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Mobile Number
              </label>
              <input
                required
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                value={formData.mobile_number}
                onChange={(e) =>
                  setFormData({ ...formData, mobile_number: e.target.value })
                }
                placeholder="+1234567890"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">
                Event Image
              </label>
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                {imagePreview && (
                  <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-slate-200">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview("");
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">
                Description
              </label>
              <textarea
                required
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="What is this event about?"
              />
            </div>
          </div>

          {/* Agenda Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Agenda</h3>
              <button
                type="button"
                onClick={addAgendaItem}
                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                <Plus className="w-4 h-4" /> Add Item
              </button>
            </div>
            {formData.agenda.map((item: any, index: number) => (
              <div key={index} className="flex gap-4 items-start">
                <input
                  type="text"
                  placeholder="Time (e.g. 10:00 AM)"
                  className="w-32 px-4 py-2 rounded-lg border border-slate-200"
                  value={item.time}
                  onChange={(e) => {
                    const newAgenda = [...formData.agenda];
                    newAgenda[index].time = e.target.value;
                    setFormData({ ...formData, agenda: newAgenda });
                  }}
                />
                <input
                  type="text"
                  placeholder="Topic"
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-200"
                  value={item.title}
                  onChange={(e) => {
                    const newAgenda = [...formData.agenda];
                    newAgenda[index].title = e.target.value;
                    setFormData({ ...formData, agenda: newAgenda });
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeAgendaItem(index)}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Tickets Section */}
          {!formData.is_free && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Tickets</h3>
                <button
                  type="button"
                  onClick={addTicket}
                  className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold"
                >
                  <Plus className="w-4 h-4" /> Add Ticket
                </button>
              </div>
              {formData.tickets.map((ticket: any, index: number) => (
                <div
                  key={index}
                  className="p-4 border border-slate-200 rounded-xl space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        Name
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 rounded-lg border border-slate-200"
                        value={ticket.name}
                        onChange={(e) => {
                          const newTickets = [...formData.tickets];
                          newTickets[index].name = e.target.value;
                          setFormData({ ...formData, tickets: newTickets });
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        Price
                      </label>
                      <input
                        type="number"
                        required
                        min="0.01"
                        step="0.01"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200"
                        value={ticket.price}
                        onChange={(e) => {
                          const newTickets = [...formData.tickets];
                          newTickets[index].price = parseFloat(e.target.value);
                          setFormData({ ...formData, tickets: newTickets });
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">
                        Seats
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          required
                          min="1"
                          className="flex-1 px-3 py-2 rounded-lg border border-slate-200"
                          value={ticket.available_seats}
                          onChange={(e) => {
                            const newTickets = [...formData.tickets];
                            newTickets[index].available_seats = parseInt(
                              e.target.value,
                            );
                            setFormData({ ...formData, tickets: newTickets });
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeTicket(index)}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-3 text-slate-700 hover:text-slate-900 font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={(e) => handleSubmit(e as any)}
            disabled={loading}
            className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 shadow-lg shadow-indigo-600/20 transition-all transform active:scale-95"
          >
            {loading
              ? "Saving..."
              : initialData
                ? "Update Event"
                : "Create Event"}
          </button>
        </div>
      </div>
      {toast.isVisible && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
};

export default CreateEventModal;
