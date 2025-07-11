import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";

export default function Success() {
  const location = useLocation();
  const sessionId = new URLSearchParams(location.search).get("session_id");
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
const handleDownloadReceipt = () => {
  if (!details) return;
  
  // Use A5 size (148 x 210 mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a5'
  });

  // Set brand colors
  const primaryColor = [59, 130, 246]; // blue-500
  const secondaryColor = [168, 85, 247]; // purple-500
  const darkColor = [31, 41, 55]; // gray-800
  const lightColor = [249, 250, 251]; // gray-50
  const successColor = [34, 197, 94]; // green-500

 
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 148, 25, 'F');
  // Add logo and title
  doc.setTextColor(...lightColor);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text("EVENTNEXUS", 74, 15, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text("PAYMENT RECEIPT", 74, 22, { align: 'center' });

  // Add receipt details box
  doc.setFillColor(...darkColor);
  doc.rect(10, 35, 128, 150, 'F');
  doc.setDrawColor(75, 85, 99); // gray-600
  doc.setLineWidth(0.3);
  doc.rect(10, 35, 128, 150);

  // Customer info
  doc.setTextColor(...lightColor);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text("CUSTOMER DETAILS", 20, 45);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${details.name || 'Guest'}`, 20, 52);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 59);
  doc.text(`Time: ${new Date().toLocaleTimeString()}`, 20, 66);

  // Event info
  doc.setFont('helvetica', 'bold');
  doc.text("EVENT INFORMATION", 20, 80);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Event: ${details.event_title}`, 20, 87);
  doc.text(`Date: ${new Date(details.date).toLocaleString()}`, 20, 94);
  doc.text(`Location: ${details.location || 'Online'}`, 20, 101);

  // Ticket info
  doc.setFont('helvetica', 'bold');
  doc.text("TICKET DETAILS", 20, 115);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Type: ${details.ticket_name}`, 20, 122);
  doc.text(`Quantity: ${details.quantity}`, 20, 129);
  doc.text(`Ticket #: ${details.ticket_number}`, 20, 136);

  // Payment summary
  doc.setFont('helvetica', 'bold');
  doc.text("PAYMENT SUMMARY", 20, 150);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Unit Price: Ksh ${details.price.toFixed(2)}`, 20, 157);
  doc.text(`Quantity: ${details.quantity}`, 20, 164);
  
  // Total with highlight
  doc.setFillColor(30, 41, 59); // darker background for total
  doc.rect(10, 170, 128, 12, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...successColor);
  doc.text(`TOTAL: Ksh ${(details.price * details.quantity).toFixed(2)}`, 20, 177);

  // Payment status
  doc.setFontSize(10);
  doc.setTextColor(...lightColor);
  doc.text("Payment Method: Credit Card", 20, 190);
  doc.text("Status: Completed", 20, 197);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175); // gray-400
  doc.text("Thank you for your purchase!", 74, 200, { align: 'center' });
  doc.text("For any inquiries, please contact support@eventnexus.com", 74, 205, { align: 'center' });

  // Add decorative elements
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(10, 28, 138, 28);
  
  doc.setFillColor(...secondaryColor);
  doc.circle(130, 180, 3, 'F');

  doc.save(`EventNexus_Receipt_${new Date().getTime()}.pdf`);
};
  useEffect(() => {
    if (sessionId) {
      axios.post("https://event-management-kq5b.onrender.com/api/confirm-payment/", { session_id: sessionId })
        .then(res => {
          setDetails(res.data);
        })
        .catch(err => {
          setDetails({ error: "Could not confirm payment. Please contact support if the issue persists." });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-20 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        <div className="relative z-10 text-center">
          <svg className="animate-spin h-12 w-12 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <h2 className="text-xl font-semibold text-white mt-6 mb-2">Confirming Your Payment</h2>
          <p className="text-gray-400">Please wait while we verify your transaction...</p>
        </div>
      </div>
    );
  }

  if (details?.error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-20 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        <div className="relative z-10 max-w-md w-full">
          <div className="bg-gray-800/80 backdrop-blur-sm border border-red-500/30 rounded-xl shadow-2xl p-8 text-center">
            <div className="text-red-400 mb-6">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Payment Error</h2>
            <p className="text-gray-400 mb-6">{details.error}</p>
            <Link 
              to="/events" 
              className="inline-block px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              Browse Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-20 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-md w-full">
        <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl overflow-hidden text-center">
          <div className="p-8">
            <div className="text-green-400 mb-6">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-400 mb-6">
              Thank you{details.name ? `, ${details.name}` : ""} for your purchase.
            </p>

            <div className="bg-gray-700/50 rounded-lg p-6 text-left space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-400">Event:</span>
                <span className="font-medium text-white">{details.event_title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Ticket Type:</span>
                <span className="font-medium text-white">{details.ticket_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Quantity:</span>
                <span className="font-medium text-white">{details.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Ticket Number:</span>
                <span className="font-medium text-blue-400">{details.ticket_number}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-600">
                <span className="text-gray-400">Total Paid:</span>
                <span className="text-xl font-bold text-green-400">Ksh {details.price * details.quantity}</span>
              </div>
            </div>

            <div className="flex flex-col space-y-3">
               <button
          onClick={handleDownloadReceipt}
          className="mt-4 px-6 py-2 bg-blue-500 rounded text-white font-semibold hover:bg-blue-600"
        >
          Download Receipt
        </button>
              <Link 
                to="/events" 
                className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all font-medium"
              >
                Browse More Events
              </Link>
            </div>
          </div>
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