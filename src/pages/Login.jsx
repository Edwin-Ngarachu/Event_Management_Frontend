import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import AuthForm from '../components/AuthForm';

export default function Login() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async ({ email, password }) => {
    setIsLoading(true);
    setError('');
    
    try {
      await login({ email, password });
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background gradient elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-20 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
      
        {/* Card */}
        <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
          <div className="p-8 space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white">
                Welcome back
              </h2>
              <p className="mt-2 text-gray-400">
                Enter your credentials to access your account
              </p>
            </div>

            {error && (
              <div className="bg-red-900/20 border-l-4 border-red-500 p-4 rounded">
                <div className="flex items-center text-red-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <AuthForm 
              onSubmit={handleSubmit}
              isLoading={isLoading}
              isLogin={true}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                  Remember me
                </label>
              </div>

              <Link to="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300">
                Forgot password?
              </Link>
            </div>

            <div className="pt-4 border-t border-gray-700">
              <p className="text-center text-sm text-gray-400">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-blue-400 hover:text-blue-300">
                  Create one now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add this to your tailwind.config.js for animations */}
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