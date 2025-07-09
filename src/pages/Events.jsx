import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [dateFilter, setDateFilter] = useState("all"); // New filter state

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/events/")
      .then((res) => setEvents(res.data))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  // Filter events based on search, price and date
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      (event.location && 
       event.location.toLowerCase().includes(search.toLowerCase()));
    
    const matchesPrice =
      !maxPrice ||
      (event.tickets && 
       event.tickets.some((t) => Number(t.price) <= Number(maxPrice)));
    
    const matchesDate = () => {
      const eventDate = new Date(event.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      switch(dateFilter) {
        case "today":
          return eventDate.toDateString() === today.toDateString();
        case "week":
          const nextWeek = new Date(today);
          nextWeek.setDate(nextWeek.getDate() + 7);
          return eventDate >= today && eventDate <= nextWeek;
        case "month":
          const nextMonth = new Date(today);
          nextMonth.setMonth(nextMonth.getMonth() + 1);
          return eventDate >= today && eventDate <= nextMonth;
        default:
          return true;
      }
    };

    return matchesSearch && matchesPrice && matchesDate();
  });

  return (
    <div className="min-h-screen bg-gray-900 pt-20 px-4 pb-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-20 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
            Discover Events
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Find your next unforgettable experience from our curated collection
          </p>
        </div>

        {/* Enhanced Search and Filter Section */}
        <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="flex-1 w-full">
              <label htmlFor="search" className="sr-only">Search events</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="search"
                  type="text"
                  placeholder="Search events by title, location..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* Price Filter */}
              <div className="relative flex-1">
                <label htmlFor="price" className="sr-only">Max price</label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">Ksh</span>
                </div>
                <input
                  id="price"
                  type="number"
                  placeholder="Max price"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="block w-full pl-12 pr-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
              </div>

              {/* Date Filter */}
              <div className="flex-1">
                <label htmlFor="date" className="sr-only">Date range</label>
                <select
                  id="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Dates</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {(search || maxPrice || dateFilter !== "all") && (
            <div className="mt-4 flex flex-wrap gap-2">
              {search && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-100">
                  Search: "{search}"
                  <button 
                    onClick={() => setSearch("")}
                    className="ml-1.5 inline-flex text-blue-300 hover:text-blue-100"
                  >
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              )}
              {maxPrice && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900 text-purple-100">
                  Max Price: Ksh{maxPrice}
                  <button 
                    onClick={() => setMaxPrice("")}
                    className="ml-1.5 inline-flex text-purple-300 hover:text-purple-100"
                  >
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              )}
              {dateFilter !== "all" && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-900 text-indigo-100">
                  Date: {dateFilter.charAt(0).toUpperCase() + dateFilter.slice(1)}
                  <button 
                    onClick={() => setDateFilter("all")}
                    className="ml-1.5 inline-flex text-indigo-300 hover:text-indigo-100"
                  >
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Rest of your events grid remains the same */}
        {/* Events Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <svg className="animate-spin h-12 w-12 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-4 text-gray-400">Loading events...</p>
            </div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl p-8 max-w-md mx-auto text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-white mt-4 mb-2">No Events Found</h3>
            <p className="text-gray-400">Try adjusting your search or filters</p>
            <button 
              onClick={() => {
                setSearch("");
                setMaxPrice("");
                setDateFilter("all");
              }}
              className="mt-4 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
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

// Extracted Event Card Component for better readability
function EventCard({ event }) {
  return (
    <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden hover:shadow-lg transition-all hover:border-gray-500 group flex flex-col h-full">
      {event.image && (
        <div className="h-56 w-full overflow-hidden relative">
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
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-white line-clamp-1">{event.title}</h3>
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
          <Link 
            to={`/events/${event.id}`} 
            className="w-full text-center block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}