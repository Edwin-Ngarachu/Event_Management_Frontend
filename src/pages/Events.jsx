import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/events/")
      .then(res => setEvents(res.data))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

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
            Browse through our collection of upcoming events and find something that excites you!
          </p>
        </div>

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
        ) : events.length === 0 ? (
          <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl p-8 max-w-md mx-auto text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-white mt-4 mb-2">No Events Found</h3>
            <p className="text-gray-400">There are currently no events available. Check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map(event => (
              <div 
                key={event.id} 
                className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden hover:shadow-lg transition-all hover:border-gray-500 group flex flex-col h-full"
              >
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
                          Tickets  available
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