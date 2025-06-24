import { useState, useEffect } from "react";
import { createEvent, getMyEvents, deleteEvent, updateEvent } from "../api/events";
import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";

export default function PosterDashboard() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    image: null,
    location: "",
    duration: "",
    tickets: [{ name: "", price: "", quantity: "" }],
  });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const { accessToken } = useAuth();

  // Fetch poster's events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await getMyEvents(accessToken);
        setEvents(res.data);
      } catch (err) {
        setError("Failed to load events.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [accessToken]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Handle ticket changes
  const handleTicketChange = (idx, field, value) => {
    setForm((prev) => {
      const tickets = [...prev.tickets];
      tickets[idx][field] = value;
      return { ...prev, tickets };
    });
  };

  const addTicketType = () => {
    setForm((prev) => ({
      ...prev,
      tickets: [...prev.tickets, { name: "", price: "", quantity: "" }],
    }));
  };

  const removeTicketType = (idx) => {
    setForm((prev) => ({
      ...prev,
      tickets: prev.tickets.filter((_, i) => i !== idx),
    }));
  };

  // Handle form submit (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("date", form.date);
    formData.append("location", form.location);
    formData.append("duration", form.duration);
    if (form.image) {
      formData.append("image", form.image);
    }
    formData.append("tickets", JSON.stringify(form.tickets));
    try {
      if (editId) {
        await updateEvent(editId, formData, accessToken);
      } else {
        await createEvent(formData, accessToken);
      }
      setShowForm(false);
      setForm({
        title: "",
        description: "",
        date: "",
        image: null,
        location: "",
        duration: "",
        tickets: [{ name: "", price: "", quantity: "" }],
      });
      setEditId(null);
      const res = await getMyEvents(accessToken);
      setEvents(res.data);
    } catch (err) {
      setError("Failed to save event.");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteEvent(id, accessToken);
      setEvents(events.filter((event) => event.id !== id));
    } catch (err) {
      alert("Failed to delete event.");
    }
  };

  // Handle edit
  const handleEdit = (event) => {
    setForm({
      title: event.title,
      description: event.description,
      date: event.date.slice(0, 16),
      image: null,
      location: event.location || "",
      duration: event.duration || "",
      tickets:
        event.tickets && event.tickets.length > 0
          ? event.tickets.map((t) => ({
              name: t.name,
              price: t.price,
              quantity: t.quantity,
            }))
          : [{ name: "", price: "", quantity: "" }],
    });
    setEditId(event.id);
    setShowForm(true);
  };

  // Cancel edit
  const handleCancel = () => {
    setShowForm(false);
    setForm({
      title: "",
      description: "",
      date: "",
      image: null,
      location: "",
      duration: "",
      tickets: [{ name: "", price: "", quantity: "" }],
    });
    setEditId(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gray-900 py-10 px-4 pt-16 relative overflow-hidden pt-16">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-20 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Poster Dashboard
          </h1>
          <button
            onClick={() => {
              setShowForm(true);
              setEditId(null);
              setForm({
                title: "",
                description: "",
                date: "",
                image: null,
                location: "",
                duration: "",
                tickets: [{ name: "", price: "", quantity: "" }],
              });
            }}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
          >
            + Add New Event
          </button>
        </div>

        {/* Add/Edit Event Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl p-6 mb-8 space-y-4"
            encType="multipart/form-data"
          >
            {error && (
              <div className="bg-red-900/20 border-l-4 border-red-500 p-4 rounded">
                <div className="flex items-start text-red-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}
            <div>
              <label className="block text-gray-400 font-medium mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="4"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 font-medium mb-1">Date & Time</label>
              <input
                type="datetime-local"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 font-medium mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. Nairobi, Online, etc."
              />
            </div>
            <div>
              <label className="block text-gray-400 font-medium mb-1">Duration</label>
              <input
                type="text"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. 2 hours"
              />
            </div>
            {/* Ticket Types Section */}
            <div>
              <label className="block text-gray-400 font-medium mb-1">Ticket Types</label>
              {form.tickets.map((ticket, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Type (e.g. Regular, VIP)"
                    value={ticket.name}
                    onChange={e => handleTicketChange(idx, "name", e.target.value)}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-2 py-1 text-white w-1/3"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={ticket.price}
                    onChange={e => handleTicketChange(idx, "price", e.target.value)}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-2 py-1 text-white w-1/3"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={ticket.quantity}
                    onChange={e => handleTicketChange(idx, "quantity", e.target.value)}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-2 py-1 text-white w-1/3"
                    required
                  />
                  {form.tickets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTicketType(idx)}
                      className="text-red-400 hover:text-red-300 ml-2"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addTicketType}
                className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                + Add Ticket Type
              </button>
            </div>
            <div>
              <label className="block text-gray-400 font-medium mb-1">Image (optional)</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col w-full h-32 border-2 border-dashed border-gray-600 hover:border-gray-500 rounded-lg cursor-pointer bg-gray-700/50 hover:bg-gray-700/70 transition-all">
                  <div className="flex flex-col items-center justify-center pt-7">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-400 group-hover:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="pt-1 text-sm tracking-wider text-gray-400">
                      {form.image ? form.image.name : 'Select an image'}
                    </p>
                  </div>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    className="opacity-0"
                  />
                </label>
              </div>
            </div>
            <div className="flex gap-4 pt-2">
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all flex items-center justify-center"
                disabled={submitLoading}
              >
                {submitLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {editId ? "Updating..." : "Submitting..."}
                  </>
                ) : editId ? "Update" : "Submit"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-600 text-gray-200 rounded-lg hover:bg-gray-500 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* List of events posted by this user */}
        <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Your Events</h2>
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-2">No events posted yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
  <div key={event.id} className="bg-gray-700/50 border border-gray-600 rounded-xl overflow-hidden hover:shadow-lg transition-all hover:border-gray-500 group flex flex-col h-full">
    {event.image && (
      <div className="h-48 w-full overflow-hidden relative">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Ticket summary overlay */}
        {event.tickets && event.tickets.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
            <div className="flex items-center justify-between">
              <span className="text-white text-sm font-medium">
                Tickets from Ksh {Math.min(...event.tickets.map(t => t.price))}
              </span>
              <span className="text-xs bg-blue-500/90 text-white px-2 py-1 rounded-full">
                {event.tickets.length} type{event.tickets.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}
      </div>
    )}
    
    <div className="p-4 flex flex-col flex-grow">
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{event.title}</h3>
          <div className="text-xs text-gray-400 bg-gray-600/50 px-2 py-1 rounded-full">
            {new Date(event.date).toLocaleDateString()}
          </div>
        </div>
        
        <div className="flex items-center text-gray-400 text-sm mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="line-clamp-1">{event.location || 'Online'}</span>
        </div>
        
        {/* Compact ticket display */}
        {event.tickets && event.tickets.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center text-xs text-gray-400 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              Tickets available
            </div>
            <div className="flex flex-wrap gap-1">
              {event.tickets.slice(0, 3).map((ticket, idx) => (
                <div 
                  key={idx} 
                  className="text-xs bg-gray-600/50 text-gray-300 px-2 py-1 rounded-full border border-gray-500 flex items-center"
                  title={`${ticket.name}: Ksh ${ticket.price} (${ticket.quantity} left)`}
                >
                  <span className="truncate max-w-[60px]">{ticket.name}</span>
                  <span className="text-blue-300 ml-1">Ksh{ticket.price}</span>
                </div>
              ))}
              {event.tickets.length > 3 && (
                <div className="text-xs bg-gray-600/50 text-gray-300 px-2 py-1 rounded-full">
                  +{event.tickets.length - 3} more
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* This section will always stay at the bottom */}
      <div className="mt-auto pt-3 border-t border-gray-600">
        <div className="flex justify-between items-center">
          <Link 
            to={`/events/${event.id}`} 
            className="text-sm text-blue-400 hover:text-blue-300 flex items-center"
          >
            View Details
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(event)}
              className="text-yellow-400 hover:text-yellow-300"
              title="Edit"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => handleDelete(event.id)}
              className="text-red-400 hover:text-red-300"
              title="Delete"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
))}
            </div>
          )}
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}