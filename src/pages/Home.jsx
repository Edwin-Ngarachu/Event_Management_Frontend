import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden pt-16 ">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
          alt="Futuristic event background"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        
        

        {/* Hero Section */}
        <main className="flex-grow flex flex-col items-center justify-center px-6 text-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Redefining
              </span>{" "}
              Event Experiences
            </h1>
            <p className="text-xl text-gray-300 mb-10">
              The next-generation platform for creators and attendees. Powered by secured-ticketing and Stripe payments.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/events"
                className="px-8 py-3 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Explore Events
              </Link>
              <Link
                to="/register"
                className="px-8 py-3 border border-white/20 rounded-full hover:bg-white/10 transition-all"
              >
                Become a Creator
              </Link>
            </div>
          </div>
        </main>

        {/* Floating Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 pb-20">
          {[
            { icon: "⚡", title: "Instant Booking" },
            { icon: "🔒", title: "multi Ticketing" },
            { icon: "🤖", title: "Stripe Payments" },
            { icon: "🌐", title: "Trusted Platform" }
          ].map((item, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="font-medium">{item.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}