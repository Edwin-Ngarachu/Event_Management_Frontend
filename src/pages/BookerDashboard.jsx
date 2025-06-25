import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { jsPDF } from "jspdf";

function BookerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    axios
      .get("http://127.0.0.1:8000/api/bookings/mine/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setBookings(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleDownloadReceipt = (booking) => {
    // Use A5 size (148 x 210 mm)
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a5",
    });

    // Set brand colors
    const primaryColor = [59, 130, 246];
    const secondaryColor = [168, 85, 247];
    const darkColor = [31, 41, 55];
    const lightColor = [249, 250, 251];
    const successColor = [34, 197, 94];

    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 148, 25, "F");
    doc.setTextColor(...lightColor);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("EVENTNEXUS", 74, 15, { align: "center" });

    doc.setFontSize(12);
    doc.text("TICKET RECEIPT", 74, 22, { align: "center" });

    doc.setFillColor(...darkColor);
    doc.rect(10, 35, 128, 150, "F");
    doc.setDrawColor(75, 85, 99);
    doc.setLineWidth(0.3);
    doc.rect(10, 35, 128, 150);

    doc.setTextColor(...lightColor);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("CUSTOMER DETAILS", 20, 45);

    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${booking.name || "Guest"}`, 20, 52);
    doc.text(
      `Date: ${new Date(booking.booked_at).toLocaleDateString()}`,
      20,
      59
    );
    doc.text(
      `Time: ${new Date(booking.booked_at).toLocaleTimeString()}`,
      20,
      66
    );

    doc.setFont("helvetica", "bold");
    doc.text("EVENT INFORMATION", 20, 80);

    doc.setFont("helvetica", "normal");
    doc.text(`Event: ${booking.event_title}`, 20, 87);
    doc.text(
      `Date: ${
        booking.event_date ? new Date(booking.event_date).toLocaleString() : "-"
      }`,
      20,
      94
    );
    doc.text(`Location: ${booking.event_location || "Online"}`, 20, 101);

    doc.setFont("helvetica", "bold");
    doc.text("TICKET DETAILS", 20, 115);

    doc.setFont("helvetica", "normal");
    doc.text(`Type: ${booking.ticket_type}`, 20, 122);
    doc.text(`Quantity: ${booking.quantity}`, 20, 129);
    doc.text(`Ticket #: ${booking.ticket_number}`, 20, 136);

    doc.setFont("helvetica", "bold");
    doc.text("PAYMENT SUMMARY", 20, 150);

    doc.setFont("helvetica", "normal");
    doc.text(
      `Unit Price: Ksh ${booking.price ? booking.price.toFixed(2) : "-"}`,
      20,
      157
    );
    doc.text(`Quantity: ${booking.quantity}`, 20, 164);

    doc.setFillColor(30, 41, 59);
    doc.rect(10, 170, 128, 12, "F");
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...successColor);
    doc.text(
      `TOTAL: Ksh ${
        booking.price && booking.quantity
          ? (booking.price * booking.quantity).toFixed(2)
          : "-"
      }`,
      20,
      177
    );

    doc.setFontSize(10);
    doc.setTextColor(...lightColor);
    doc.text("Status: Completed", 20, 197);

    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text("Thank you for your purchase!", 74, 200, { align: "center" });
    doc.text(
      "For any inquiries, please contact support@eventnexus.com",
      74,
      205,
      { align: "center" }
    );

    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(10, 28, 138, 28);

    doc.setFillColor(...secondaryColor);
    doc.circle(130, 180, 3, "F");

    doc.save(`EventNexus_Ticket_${booking.ticket_number}.pdf`);
  };
  if (loading)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Animated background elements */}
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
          <h2 className="text-xl font-semibold text-white mt-6 mb-2">
            Loading Your Bookings
          </h2>
          <p className="text-gray-400">
            Please wait while we fetch your event details...
          </p>
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
        <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
            My Event Bookings
          </h2>
          <p className="text-gray-400">
            Here are all the events you've booked tickets for
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl p-8 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-500 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-white mt-4 mb-2">
              No Bookings Yet
            </h3>
            <p className="text-gray-400 mb-6">
              You haven't booked any events yet.
            </p>
            <Link
              to="/events"
              className="inline-block px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {booking.event_title}
                      </h3>
                      <div className="flex items-center mt-2 text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
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
                        <span>
                          Booked on{" "}
                          {new Date(booking.booked_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <span className="bg-blue-500/10 text-blue-400 text-xs px-3 py-1 rounded-full">
                      {booking.ticket_type}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <h4 className="text-gray-400 text-sm font-medium mb-1">
                        Ticket Details
                      </h4>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Quantity:</span>
                        <span className="font-medium text-white">
                          {booking.quantity}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Ticket #:</span>
                        <span className="font-medium text-blue-400">
                          {booking.ticket_number}
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <h4 className="text-gray-400 text-sm font-medium mb-1">
                        Event Details
                      </h4>
                      <div className="flex items-center text-gray-300 mb-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
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
                        <span>{booking.event_location || "Online"}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
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
                        <span>{booking.event_duration || "2 hours"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                    {/* <Link
                      to={`/events/${booking.event_id}`}
                      className="text-sm text-blue-400 hover:text-blue-300 flex items-center"
                    >
                      View Event Details
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link> */}
                    <button
                      className="text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
                      onClick={() => handleDownloadReceipt(booking)}
                    >
                      Download Ticket
                    </button>
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

export default BookerDashboard;
