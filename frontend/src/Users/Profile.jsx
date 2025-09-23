
// import React, { useState, useEffect } from 'react';
// import { FaUserCircle, FaEdit, FaTimes, FaCheck, FaSpinner,FaBoxes, FaShoppingBag, FaCreditCard, FaCalendarAlt, FaCalendarCheck, FaQuestionCircle, FaSignOutAlt } from 'react-icons/fa';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import Header from '../pages/Header';

// const Profile = () => {
//   const [profile, setProfile] = useState({
//     _id: '',
//     name: '',
//     email: '',
//     mobile: '',
//     type: 'user',
//     gender: ''
//   });
//   const [editMode, setEditMode] = useState(false);
//   const [loading, setLoading] = useState({
//     profile: false,
//     update: false
//   });
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const navigate = useNavigate();

//   const fetchProfile = async () => {
//     setLoading(prev => ({ ...prev, profile: true }));
//     setError('');
    
//     const token = localStorage.getItem('authToken');
//     if (!token) {
//       setError('Please login to view profile');
//       navigate('/login');
//       return;
//     }

//     try {
//       const api = axios.create({
//         baseURL: 'http://localhost:4000/UserOperations',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         withCredentials: true
//       });

//       const response = await api.get('/getUser');
      
//       if (response.data?.success) {
//         const userData = response.data.data;
//         setProfile(userData);
//         localStorage.setItem('userData', JSON.stringify(userData));
//       }
//     } catch (err) {
//       console.error('Profile fetch error:', err);
//       if (err.response?.status === 401) {
//         handleLogout();
//         setError('Session expired. Please login again.');
//       } else {
//         setError(err.response?.data?.message || 'Failed to load profile.');
//       }
//     } finally {
//       setLoading(prev => ({ ...prev, profile: false }));
//     }
//   };

//   useEffect(() => {
//     fetchProfile();
//   }, [navigate]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setProfile(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(prev => ({ ...prev, update: true }));
//     setError('');
//     setSuccessMessage('');

//     try {
//       const token = localStorage.getItem('authToken');
//       const api = axios.create({
//         baseURL: 'http://localhost:4000/UserOperations',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         withCredentials: true
//       });

//       const response = await api.put(`/update/${profile._id}`, {
//         name: profile.name,
//         mobile: profile.mobile,
//         gender: profile.gender
//       });

//       if (response.data.success) {
//         setSuccessMessage('Profile updated successfully!');
//         const updatedUser = response.data.data;
//         setProfile(updatedUser);
//         localStorage.setItem('userData', JSON.stringify(updatedUser));
//         setEditMode(false);
//       }
//     } catch (err) {
//       console.error('Update error:', err);
//       if (err.response?.status === 401) {
//         setError('Session expired. Please login again.');
//         handleLogout();
//       } else {
//         setError(err.response?.data?.message || 'Update failed. Please try again.');
//       }
//     } finally {
//       setLoading(prev => ({ ...prev, update: false }));
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('userData');
//     navigate('/login');
//   };

//   if (loading.profile && !profile.name) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center">
//         <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
//           <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
//           <p className="text-lg text-gray-700 font-medium">Loading your profile...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error && !profile.name) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center">
//         <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
//           <p className="text-red-600 mb-6 font-medium text-lg">{error}</p>
//           <button
//             onClick={() => navigate('/login')}
//             className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-md"
//           >
//             Go to Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50">
//       <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md py-3">
//         <Header />
//       </div>

//       <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
//         {/* Success and Error Messages */}
//         <div className="mb-8">
//           {successMessage && (
//             <div className="p-4 mb-4 bg-green-100 border-l-4 border-green-500 rounded-lg">
//               <p className="text-green-700 font-medium">{successMessage}</p>
//             </div>
//           )}
//           {error && (
//             <div className="p-4 mb-4 bg-red-100 border-l-4 border-red-500 rounded-lg">
//               <p className="text-red-700 font-medium">{error}</p>
//             </div>
//           )}
//         </div>

//         {/* Profile Header */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-2 px-4 py-2 mt-4 md:mt-0 text-red-600 hover:text-red-700 transition"
//           >
//             <FaSignOutAlt />
//             <span>Logout</span>
//           </button>
//         </div>

//         {/* Navigation Cards */}
     

//         {/* Profile Information Card */}
//         <div className="bg-white rounded-xl shadow-md overflow-hidden">
//           <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-gray-50">
//             <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
//               <div className="flex items-center mt-4 md:mt-0">
//                 <FaUserCircle className="text-4xl text-blue-600 mr-3" />
//                 <div>
//                   <p className="text-gray-800 font-medium">{profile.name}</p>
//                   <p className="text-sm text-gray-500">{profile.email}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit} className="p-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Left Column */}
//               <div className="space-y-5">
//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Full Name
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={profile.name || ''}
//                     onChange={handleInputChange}
//                     disabled={!editMode}
//                     className="w-full px-4 py-2 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-gray-800 transition"
//                     required
//                   />
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Email Address
//                   </label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={profile.email || ''}
//                     disabled
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-600"
//                   />
//                 </div>
//               </div>

//               {/* Right Column */}
//               <div className="space-y-5">
//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Phone Number
//                   </label>
//                   <input
//                     type="tel"
//                     name="mobile"
//                     value={profile.mobile || ''}
//                     onChange={handleInputChange}
//                     disabled={!editMode}
//                     className="w-full px-4 py-2 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-gray-800 transition"
//                     pattern="[0-9]{10}"
//                     required
//                   />
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Gender
//                   </label>
//                   <select
//                     name="gender"
//                     value={profile.gender || ''}
//                     onChange={handleInputChange}
//                     disabled={!editMode}
//                     className="w-full px-4 py-2 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-gray-800 transition"
//                     required
//                   >
//                     <option value="">Select Gender</option>
//                     <option value="male">Male</option>
//                     <option value="female">Female</option>
//                     <option value="other">Other</option>
//                   </select>
//                 </div>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
//               {!editMode ? (
//                 <button
//                   type="button"
//                   onClick={() => setEditMode(true)}
//                   className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-md"
//                 >
//                   <FaEdit />
//                   <span>Edit Profile</span>
//                 </button>
//               ) : (
//                 <>
//                   <button
//                     type="button"
//                     onClick={() => setEditMode(false)}
//                     className="px-6 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={loading.update}
//                     className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-md disabled:bg-blue-400 disabled:cursor-not-allowed"
//                   >
//                     {loading.update ? (
//                       <FaSpinner className="animate-spin" />
//                     ) : (
//                       <FaCheck />
//                     )}
//                     <span>{loading.update ? 'Saving...' : 'Save Changes'}</span>
//                   </button>
//                 </>
//               )}
//             </div>
//           </form>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">
//           <button 
//             onClick={() => navigate('/OrderList')}
//             className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
//           >
//             <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
//               <FaShoppingBag className="text-xl" />
//             </div>
//             <span className="font-medium text-gray-700">My Orders</span>
//           </button>

//           <button 
//             onClick={() => navigate('/UserPayments')}
//             className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
//           >
//             <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
//               <FaCreditCard className="text-xl" />
//             </div>
//             <span className="font-medium text-gray-700">My Payments</span>
//           </button>

//           <button 
//             onClick={() => navigate('/AppointmentsPage')}
//             className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
//           >
//             <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
//               <FaCalendarAlt className="text-xl" />
//             </div>
//             <span className="font-medium text-gray-700">My Appointments</span>
//           </button>

//           {profile.type === 'doctor' && (
//             <>
//               <button 
//                 onClick={() => navigate('/Schedule')}
//                 className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
//               >
//                 <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
//                   <FaCalendarCheck className="text-xl" />
//                 </div>
//                 <span className="font-medium text-gray-700">Add Schedule</span>
//               </button>

//               <button 
//                 onClick={() => navigate('/Slots')}
//                 className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
//               >
//                 <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
//                   <FaCalendarCheck className="text-xl" />
//                 </div>
//                 <span className="font-medium text-gray-700">My Slots</span>
//               </button>
//             </>
//           )}

//             {profile.type === 'company' && (
//             <button 
//               onClick={() => navigate('/InventoryPage')}
//               className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
//             >
//               <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
//                 <FaBoxes className="text-xl" />
//               </div>
//               <span className="font-medium text-gray-700">Stock Management</span>
//             </button>)}

//           <button 
//             onClick={() => navigate('/FAQs')}
//             className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
//           >
//             <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
//               <FaQuestionCircle className="text-xl" />
//             </div>
//             <span className="font-medium text-gray-700">Inquiries</span>
//           </button>
//         </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Profile;



import React, { useState, useEffect, useContext } from "react";
import {
  FaUserCircle, FaEdit, FaTimes, FaCheck, FaSpinner, FaBoxes,
  FaShoppingBag, FaCreditCard, FaCalendarAlt, FaCalendarCheck,
  FaQuestionCircle, FaSignOutAlt
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import Header from "../pages/Header";

const Profile = () => {
  const { user, logout, isAuthenticated, loading: authLoading } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState({ profile: false, update: false });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const fetchProfile = async () => {
    setLoading(prev => ({ ...prev, profile: true }));
    setError("");

    if (!isAuthenticated) {
      setError("Please login to view profile");
      navigate("/login");
      return;
    }

    try {
      const res = await api.get("/UserOperations/getUser");
      if (res.data?.success) {
        setProfile(res.data.data);
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      if (err.response?.status === 401) {
        logout();
        setError("Session expired. Please login again.");
      } else {
        setError(err.response?.data?.message || "Failed to load profile.");
      }
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [isAuthenticated]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, update: true }));
    setError("");
    setSuccessMessage("");

    try {
      const res = await api.put(`/UserOperations/update/${profile._id}`, {
        name: profile.name,
        mobile: profile.mobile,
        gender: profile.gender,
      });

      if (res.data.success) {
        setSuccessMessage("Profile updated successfully!");
        setProfile(res.data.data);
        setEditMode(false);
      }
    } catch (err) {
      console.error("Update error:", err);
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
        logout();
      } else {
        setError(err.response?.data?.message || "Update failed. Please try again.");
      }
    } finally {
      setLoading(prev => ({ ...prev, update: false }));
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (authLoading || (loading.profile && !profile)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-50">
        <div className="p-8 bg-white rounded-xl shadow-lg text-center max-w-md">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-50">
        <div className="p-8 bg-white rounded-xl shadow-lg text-center max-w-md">
          <p className="text-lg text-red-600 font-medium mb-6">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50">
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md py-3">
        <Header />
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        {/* Messages */}
        <div className="mb-8">
          {successMessage && (
            <div className="p-4 bg-green-100 border-l-4 border-green-500 rounded-lg mb-4">
              <p className="text-green-700 font-medium">{successMessage}</p>
            </div>
          )}
          {error && (
            <div className="p-4 bg-red-100 border-l-4 border-red-500 rounded-lg mb-4">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>

        {/* Profile Card */}
        {profile && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-gray-50">
              <div className="flex items-center">
                <FaUserCircle className="text-4xl text-blue-600 mr-3" />
                <div>
                  <p className="text-gray-800 font-medium">{profile.name}</p>
                  <p className="text-sm text-gray-500">{profile.email}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {/* form fields ... same as your version */}
            </form>

            {/* Navigation Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">
              <button onClick={() => navigate("/OrderList")} className="nav-card">
                <FaShoppingBag className="icon" /> My Orders
              </button>
              <button onClick={() => navigate("/UserPayments")} className="nav-card">
                <FaCreditCard className="icon" /> My Payments
              </button>
              <button onClick={() => navigate("/AppointmentsPage")} className="nav-card">
                <FaCalendarAlt className="icon" /> My Appointments
              </button>
              {profile.type === "doctor" && (
                <>
                  <button onClick={() => navigate("/Schedule")} className="nav-card">
                    <FaCalendarCheck className="icon" /> Add Schedule
                  </button>
                  <button onClick={() => navigate("/Slots")} className="nav-card">
                    <FaCalendarCheck className="icon" /> My Slots
                  </button>
                </>
              )}
              {profile.type === "company" && (
                <button onClick={() => navigate("/InventoryPage")} className="nav-card">
                  <FaBoxes className="icon" /> Stock Management
                </button>
              )}
              <button onClick={() => navigate("/FAQs")} className="nav-card">
                <FaQuestionCircle className="icon" /> Inquiries
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
