import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import AuthForm from '../components/AuthForm';

export default function Register() {
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [role, setRole] = useState('booker');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError({});
    try {
      await register({ ...formData, role });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data || {});
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        <div className="relative z-10 w-full max-w-md">
          <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl overflow-hidden text-center p-8">
            <div className="text-green-400 mb-6">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Account Created!</h2>
            <p className="text-gray-400 mb-6">Your registration was successful.</p>
            <div className="animate-pulse text-blue-400">
              Redirecting to login...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12 relative overflow-hidden pt-16 ">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-20 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        

        {/* Registration Card */}
        <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
          <div className="p-8 space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white">
                Join EVENTNEXUS
              </h2>
              <p className="mt-2 text-gray-400">
                Create your account in 30 seconds
              </p>
            </div>

            {Object.keys(error).length > 0 && (
              <div className="bg-red-900/20 border-l-4 border-red-500 p-4 rounded">
                <div className="space-y-2">
                  {Object.entries(error).map(([field, messages]) => (
                    <div key={field} className="flex items-start text-red-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>{Array.isArray(messages) ? messages.join(' ') : messages}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Role Selection */}
            <div className="space-y-4">
              <label className="block text-gray-400 font-medium">
                I want to:
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('booker')}
                  className={`p-4 rounded-lg border-2 transition-all ${role === 'booker' ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500'}`}
                >
                  <div className="flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-medium">Book Events</span>
                    <span className="text-xs text-gray-500 mt-1">As Attendee</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('poster')}
                  className={`p-4 rounded-lg border-2 transition-all ${role === 'poster' ? 'border-purple-500 bg-purple-500/10' : 'border-gray-600 hover:border-gray-500'}`}
                >
                  <div className="flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span className="font-medium">Post Events</span>
                    <span className="text-xs text-gray-500 mt-1">As Organizer</span>
                  </div>
                </button>
              </div>
            </div>

            <AuthForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              isLogin={false}
              errors={error}
            />

            <div className="pt-4 border-t border-gray-700">
              <p className="text-center text-sm text-gray-400">
                Already registered?{' '}
                <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Animation styles (same as login) */}
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