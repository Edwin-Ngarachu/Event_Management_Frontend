import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

 // Replace with your Stripe public key
export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);

  // At the top of your file
  const stripePromise = loadStripe("pk_test_51RdDx6K3G9Vl7aFZNUF9ITR2olPscVpAlDgIJloffanhSqRThtJfYGCiJtbJCQTPuas3somNsJpw2fBSOyWPxdCY001PJL4sDi"); // Replace with your Stripe public key

  // ...inside your component...
  const handleCheckout = async () => {
    if (!selectedTicket) return;

    // Optionally, you can show a loading state here

    try {
      // Call your backend to create a Stripe Checkout session
      const res = await axios.post(
        "http://127.0.0.1:8000/api/create-checkout-session/",
        {
          event_id: event.id,
          ticket_id: selectedTicket.id,
          quantity: ticketQuantity,
        }
      );

      const sessionId = res.data.sessionId;

      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      // Handle error (show message to user)
      alert("Failed to start checkout. Please try again.");
    }
  };
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/events/${id}/`)
      .then((res) => setEvent(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-20 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        <div className="relative z-10 text-center">
          <svg
            className="animate-spin h-12 w-12 text-blue-500 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-4 text-lg text-gray-300">Loading event details...</p>
        </div>
      </div>
    );

  if (!event)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-20 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        <div className="relative z-10 text-center">
          <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl p-8 max-w-md mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-red-500 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-white mt-4 mb-2">
              Event Not Found
            </h2>
            <p className="text-gray-400">
              The event you're looking for doesn't exist or may have been
              removed.
            </p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 pt-20 px-4 pb-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-20 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
          {event.image && (
            <div className="h-80 w-full overflow-hidden">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  {event.title}
                </h1>
                <div className="flex items-center mt-2 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{new Date(event.date).toLocaleString()}</span>
                </div>
              </div>
              <div className="bg-gray-700 px-3 py-1 rounded-full text-sm font-medium text-blue-400">
                {event.category || "General"}
              </div>
            </div>

            <div className="prose prose-invert max-w-none text-gray-300 mb-8">
              <p className="whitespace-pre-line">{event.description}</p>
            </div>
          </div>
        </div>

        {/* Ticket Selection Section */}
        {event.tickets && event.tickets.length > 0 && (
          <div className="mt-8 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">
              Available Tickets
            </h3>
            <div className="space-y-4">
              {event.tickets.map((ticket) => (
                <div
                  key={ticket.id || ticket.name}
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    selectedTicket?.name === ticket.name
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-gray-600 hover:border-gray-500"
                  }`}
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-lg font-medium text-white">
                        {ticket.name}
                      </h4>
                      <p className="text-gray-400 text-sm">
                        Ksh {ticket.price} each
                      </p>
                    </div>
                    <div className="text-blue-400 font-medium">
                      {ticket.quantity} available
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedTicket && (
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-medium">Quantity</h4>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() =>
                        setTicketQuantity(Math.max(1, ticketQuantity - 1))
                      }
                      className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full hover:bg-gray-600"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{ticketQuantity}</span>
                    <button
                      onClick={() =>
                        setTicketQuantity(
                          Math.min(selectedTicket.quantity, ticketQuantity + 1)
                        )
                      }
                      className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full hover:bg-gray-600"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-400">Total</span>
                  <span className="text-xl font-bold text-blue-400">
                    Ksh {selectedTicket.price * ticketQuantity}
                  </span>
                </div>
                <button
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg font-medium"
                  onClick={handleCheckout}
                  disabled={!selectedTicket}
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        )}

        {/* Additional event details section */}
        <div className="mt-8 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            Event Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="text-gray-400 font-medium">Location</h4>
                <p className="text-white">{event.location || "Online Event"}</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="text-gray-400 font-medium">Duration</h4>
                <p className="text-white">{event.duration || "2 hours"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
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
