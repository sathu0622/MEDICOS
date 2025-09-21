import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Head from "../pages/WelcomeHeader";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:4000/UserOperations/login',
        { email, password },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (response.data && response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        if (response.data.user) {
          localStorage.setItem('userData', JSON.stringify(response.data.user));
        }
        if (response.data.user.type === 'admin') {
          navigate('/AdminDashboard'); // Change this to your admin route
        } else {
          navigate('/Userhome');
        }
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid login credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <div className="w-full fixed top-0 left-0 z-50 bg-white shadow-md">
        <Head />
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md mt-40 mb-8 border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#007BFF]">LOG IN</h2>
        </div>

        {error && (
          <div className="mb-4 text-red-600 text-sm text-center">{error}</div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007BFF] bg-white text-black"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007BFF] bg-white text-black"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#007BFF] text-white py-3 rounded-lg hover:bg-[#0056b3] transition"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          <div className="text-center mt-4">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link 
                to="/Registration" 
                className="text-[#007BFF] hover:text-[#0056b3] font-medium"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;