import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-900/80 backdrop-blur-md border-b border-white/10 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              EVENT<span className="font-extrabold">NEXUS</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            
            
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                    {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                  </div>
                  <span className="text-gray-200">
                    Hi, {user.first_name || 'User'}
                  </span>
                </div>
                
                <Link 
                  to="/booker-dashboard" 
                  className="hidden md:flex text-gray-300 hover:text-white items-center gap-2 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  My Dashboard
                </Link>
                
                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-gray-300 hover:text-red-400 transition px-3 py-2 rounded-lg hover:bg-white/5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                  </svg>
                  <span className="hidden md:inline">Logout</span>
                </button>
              </div>
            ) : (
               <div className="flex gap-4">
            <Link
              to="/login"
               className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:shadow-blue-500/30 transition-all"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:shadow-blue-500/30 transition-all"
            >
              Sign Up
            </Link>
          </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}