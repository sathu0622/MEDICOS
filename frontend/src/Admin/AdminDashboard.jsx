import React, { useState, useEffect } from "react";
import InventoryPage from "../Inventory/InventoryPage";
import UserTable from "../Users/UserTable";
import OrdersTable from "../Order/OrdersTable";
import PayTable from "../Financial/PayTable";
import UserBookings from "../Appointment/UserBookings";
import Profile from "../Users/Profile";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { FaUserCircle, FaEdit, FaTimes, FaCheck, FaSpinner, FaShoppingBag, FaCreditCard, FaCalendarAlt, FaCalendarCheck, FaQuestionCircle, FaSignOutAlt, FaBars, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [balance, setBalance] = useState(0);
  const [currentSection, setCurrentSection] = useState('dashboard');

  useEffect(() => {
    setTotalIncome(12500);
    setTotalExpense(8500);
    setBalance(4000);
  }, []);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };


  const [profile, setProfile] = useState({
    _id: '',
    name: '',
    email: '',
    mobile: '',
    type: 'user',
    gender: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState({
    profile: false,
    update: false
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const fetchProfile = async () => {
    setLoading(prev => ({ ...prev, profile: true }));
    setError('');
    
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Please login to view profile');
      navigate('/login');
      return;
    }

    try {
      const api = axios.create({
        baseURL: 'http://localhost:4000/UserOperations',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      const response = await api.get('/getUser');
      
      if (response.data?.success) {
        const userData = response.data.data;
        setProfile(userData);
        localStorage.setItem('userData', JSON.stringify(userData));
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
      if (err.response?.status === 401) {
        handleLogout();
        setError('Session expired. Please login again.');
      } else {
        setError(err.response?.data?.message || 'Failed to load profile.');
      }
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, update: true }));
    setError('');
    setSuccessMessage('');

    try {
      const token = localStorage.getItem('authToken');
      const api = axios.create({
        baseURL: 'http://localhost:4000/UserOperations',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      const response = await api.put(`/update/${profile._id}`, {
        name: profile.name,
        mobile: profile.mobile,
        gender: profile.gender
      });

      if (response.data.success) {
        setSuccessMessage('Profile updated successfully!');
        const updatedUser = response.data.data;
        setProfile(updatedUser);
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        setEditMode(false);
      }
    } catch (err) {
      console.error('Update error:', err);
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        handleLogout();
      } else {
        setError(err.response?.data?.message || 'Update failed. Please try again.');
      }
    } finally {
      setLoading(prev => ({ ...prev, update: false }));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    navigate('/login');
  };


  const renderSection = () => {
    switch (currentSection) {
      case 'dashboard':
        return  <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-gray-50">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                                <button
                                  onClick={handleLogout}
                                  className="flex items-center gap-2 px-4 py-2 mt-4 md:mt-0 text-red-600 hover:text-red-700 transition"
                                >
                                  <FaSignOutAlt />
                                  <span>Logout</span>
                                </button>
                              </div>
                      <div className="flex items-center mt-4 md:mt-0">
                        <FaUserCircle className="text-4xl text-blue-600 mr-3" />
                        <div>
                          <p className="text-gray-800 font-medium">{profile.name}</p>
                          <p className="text-sm text-gray-500">{profile.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
        
                  <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left Column */}
                      <div className="space-y-5">
                        <div className="flex flex-col">
                          <label className="text-sm font-medium text-gray-700 mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={profile.name || ''}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            className="w-full px-4 py-2 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-gray-800 transition"
                            required
                          />
                        </div>
        
                        <div className="flex flex-col">
                          <label className="text-sm font-medium text-gray-700 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={profile.email || ''}
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-600"
                          />
                        </div>
                      </div>
        
                      {/* Right Column */}
                      <div className="space-y-5">
                        <div className="flex flex-col">
                          <label className="text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="mobile"
                            value={profile.mobile || ''}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            className="w-full px-4 py-2 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-gray-800 transition"
                            pattern="[0-9]{10}"
                            required
                          />
                        </div>
        
                        <div className="flex flex-col">
                          <label className="text-sm font-medium text-gray-700 mb-2">
                            Gender
                          </label>
                          <select
                            name="gender"
                            value={profile.gender || ''}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            className="w-full px-4 py-2 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-gray-800 transition"
                            required
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
        
                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                      {!editMode ? (
                        <button
                          type="button"
                          onClick={() => setEditMode(true)}
                          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-md"
                        >
                          <FaEdit />
                          <span>Edit Profile</span>
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => setEditMode(false)}
                            className="px-6 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={loading.update}
                            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-md disabled:bg-blue-400 disabled:cursor-not-allowed"
                          >
                            {loading.update ? (
                              <FaSpinner className="animate-spin" />
                            ) : (
                              <FaCheck />
                            )}
                            <span>{loading.update ? 'Saving...' : 'Save Changes'}</span>
                          </button>
                        </>
                      )}
                    </div>
                  </form>
                  <div className="grid ml-15 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">
                              </div>
                              </div>;
                    case 'usermanagement':
                      return <UserTable/>;
                    case 'faq':
                      return <Profile/>;
                    case 'review':
                      return <Profile/>;
                    case 'financial':
                      return <PayTable/>
                    case 'inventory':
                      return <InventoryPage/>;
                    case 'ordermanagement':
                      return <OrdersTable/>;
                    case 'appointments':
                      return<UserBookings/>;
                    default:
                      return <div className="bg-white p-6 rounded-lg shadow-md text-blue-700">Select a section</div>;
                     }};

  const menuItems = [
    { id: 'dashboard', title: 'Overview', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { id: 'usermanagement', title: 'User Management', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { id: 'faq', title: 'FAQ', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'review', title: 'Reviews', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'financial', title: 'Financial', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'inventory', title: 'Inventory', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'ordermanagement', title: 'Order Management', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'appointments', title: 'Appointments', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar Toggle Button */}
      <button
        onClick={handleSidebarToggle}
        className="fixed top-4 left-4 z-50 bg-white text-blue-700 p-2 rounded-md shadow-lg hover:bg-gray-100 transition-colors"
      >
        {sidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
      </button>

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 bg-blue-700 text-white transform transition-transform duration-300 ease-in-out z-40 ${
          sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-blue-600">
          <h2 className="text-2xl ml-10 font-bold text-white">MEDICOS</h2>
        </div>
        <nav className="mt-6">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentSection(item.id)}
                  className={`flex items-center w-full px-6 py-3 text-left transition ${
                    currentSection === item.id 
                      ? 'bg-blue-600 border-l-4 border-white' 
                      : 'hover:bg-blue-500'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  <span className={`transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                    {item.title}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-blue-700">
            {currentSection.charAt(0).toUpperCase() + currentSection.slice(1)}
          </h1>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>
        </header>
        <div className="p-6">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
