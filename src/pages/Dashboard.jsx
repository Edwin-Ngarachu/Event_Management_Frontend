import { useAuth } from '../auth/AuthContext';
import PrivateRoute from '../auth/PrivateRoute';

export default function Dashboard() {
  const { user, logout } = useAuth();
   console.log('Dashboard user:', user);
  return (
   
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600 mr-4">Hello, {user?.first_name}</span>
                <button
                  onClick={logout}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="py-10">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Your protected content here */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Welcome to your dashboard
                </h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>This is a protected page that only authenticated users can access.</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
  );
}