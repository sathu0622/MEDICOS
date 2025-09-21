// import React, { useState, useEffect } from 'react';
// import { FaUserCircle, FaEdit, FaTimes, FaCheck, FaSpinner, FaShoppingBag, FaCreditCard, FaCalendarAlt,FaCalendarCheck } from 'react-icons/fa';
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
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto" />
//           <p className="mt-4 text-lg text-gray-700">Loading your profile...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error && !profile.name) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
//           <p className="text-red-600 mb-4 font-medium">{error}</p>
//           <button
//             onClick={() => navigate('/login')}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
//           >
//             Go to Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md py-3">
//         <Header />
//       </div>

//       <main className="max-w-4xl mx-auto p-6 mt-24 relative">
    
        

//         {/* Navigation options */}
//         <div className="mb-8 flex flex-wrap gap-4">
//         <button 
//         onClick={() => navigate('/OrderList')}
//        className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-blue-200 hover:bg-gray-50 transition"
//          >
//        <FaShoppingBag className="text-blue-600" />
//          <span className="text-blue-600">My Orders</span>
//          </button>

//           <button 
//             onClick={() => navigate('/UserPayments')}
//             className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition"
//           >
//             <FaCreditCard className="text-blue-600" />
//             <span className="text-blue-600">My Payments</span>
//           </button>

//           <button 
//             onClick={() => navigate('/AppointmentsPage')}
//             className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition"
//           >
//             <FaCalendarAlt className="text-blue-600" />
//             <span className="text-blue-600">My Appointments</span>
//           </button>

//           <button 
//             onClick={() => navigate('/Schedule')}
//             className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition"
//           >
//             <FaCalendarCheck className="text-blue-600" />
//             <span className="text-blue-600">ADD Schedule</span>
//           </button>


//           <button 
//             onClick={() => navigate('/Slots')}
//             className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition"
//           >
//             <FaCalendarCheck className="text-blue-600" />
//             <span className="text-blue-600">MY Slots</span>
//           </button>


//           <button 
//             onClick={() => navigate('/FAQs')}
//             className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition"
//           >
//             <FaCalendarCheck className="text-blue-600" />
//             <span className="text-blue-600">inquaries</span>
//           </button>
//         </div>

      
//         {successMessage && (
//           <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
//             <p className="text-green-700 font-medium">{successMessage}</p>
//           </div>
//         )}

//         {error && (
//           <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
//             <p className="text-red-700 font-medium">{error}</p>
//           </div>
//         )}

//         <div className="bg-white rounded-xl shadow-md p-8">

//           <h2 className="text-2xl font-bold text-gray-800 mb-8 pb-4 border-b border-gray-200 relative">
//           Profile Information
//           <div className="absolute top-6 bottom-11 right-6  flex items-center space-x-3">
//           <FaUserCircle className="text-4xl text-blue-600" />
//           <div >
//           <p className="text-gray-800 font-medium">{profile.name}</p>
//           <p className="text-sm text-gray-500">{profile.email}</p>
//           </div>
//             </div>
//           </h2>


          

//           <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Left column */}
//             <div className="space-y-5">
//               <div className="flex flex-col">
//                 <label className="text-sm font-medium text-gray-700 mb-1">
//                   Full Name
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={profile.name || ''}
//                   onChange={handleInputChange}
//                   disabled={!editMode}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-gray-800"
//                   required
//                 />
//               </div>

//               <div className="flex flex-col">
//                 <label className="text-sm font-medium text-gray-700 mb-1">
//                   Email Address
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={profile.email || ''}
//                   disabled
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
//                 />
//               </div>
//             </div>

//             {/* Right column */}
//             <div className="space-y-5">
//               <div className="flex flex-col">
//                 <label className="text-sm font-medium text-gray-700 mb-1">
//                   Phone Number
//                 </label>
//                 <input
//                   type="tel"
//                   name="mobile"
//                   value={profile.mobile || ''}
//                   onChange={handleInputChange}
//                   disabled={!editMode}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-gray-800"
//                   pattern="[0-9]{10}"
//                   required
//                 />
//               </div>

//               <div className="flex flex-col">
//                 <label className="text-sm font-medium text-gray-700 mb-1">
//                   Gender
//                 </label>
//                 <select
//                   name="gender"
//                   value={profile.gender || ''}
//                   onChange={handleInputChange}
//                   disabled={!editMode}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 text-gray-800"
//                   required
//                 >
//                   <option value="">Select Gender</option>
//                   <option value="male">Male</option>
//                   <option value="female">Female</option>
//                   <option value="other">Other</option>
//                 </select>
//               </div>
//             </div>

//             {/* Action buttons */}
//             <div className="md:col-span-2 flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
//               {!editMode ? (
//                 <button
//                   type="button"
//                   onClick={() => setEditMode(true)}
//                   className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2 font-medium"
//                 >
//                   <FaEdit className="text-lg" />
//                   <span>Edit Profile</span>
//                 </button>
//               ) : (
//                 <>
//                   <button
//                     type="button"
//                     onClick={() => setEditMode(false)}
//                     className="px-5 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={loading.update}
//                     className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2 disabled:bg-blue-400 font-medium"
//                   >
//                     {loading.update ? (
//                       <>
//                         <FaSpinner className="animate-spin text-lg" />
//                         <span>Saving...</span>
//                       </>
//                     ) : (
//                       <>
//                         <FaCheck className="text-lg" />
//                         <span>Save Changes</span>
//                       </>
//                     )}
//                   </button>
//                 </>
//               )}
//             </div>
//           </form>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Profile;

import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaEdit, FaTimes, FaCheck, FaSpinner,FaBoxes, FaShoppingBag, FaCreditCard, FaCalendarAlt, FaCalendarCheck, FaQuestionCircle, FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../pages/Header';

const Profile = () => {
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

  if (loading.profile && !profile.name) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-gray-700 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error && !profile.name) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <p className="text-red-600 mb-6 font-medium text-lg">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-md"
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
        {/* Success and Error Messages */}
        <div className="mb-8">
          {successMessage && (
            <div className="p-4 mb-4 bg-green-100 border-l-4 border-green-500 rounded-lg">
              <p className="text-green-700 font-medium">{successMessage}</p>
            </div>
          )}
          {error && (
            <div className="p-4 mb-4 bg-red-100 border-l-4 border-red-500 rounded-lg">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* Profile Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 mt-4 md:mt-0 text-red-600 hover:text-red-700 transition"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>

        {/* Navigation Cards */}
     

        {/* Profile Information Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-gray-50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">
          <button 
            onClick={() => navigate('/OrderList')}
            className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
          >
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
              <FaShoppingBag className="text-xl" />
            </div>
            <span className="font-medium text-gray-700">My Orders</span>
          </button>

          <button 
            onClick={() => navigate('/UserPayments')}
            className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
          >
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
              <FaCreditCard className="text-xl" />
            </div>
            <span className="font-medium text-gray-700">My Payments</span>
          </button>

          <button 
            onClick={() => navigate('/AppointmentsPage')}
            className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
          >
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
              <FaCalendarAlt className="text-xl" />
            </div>
            <span className="font-medium text-gray-700">My Appointments</span>
          </button>

          {profile.type === 'doctor' && (
            <>
              <button 
                onClick={() => navigate('/Schedule')}
                className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
              >
                <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                  <FaCalendarCheck className="text-xl" />
                </div>
                <span className="font-medium text-gray-700">Add Schedule</span>
              </button>

              <button 
                onClick={() => navigate('/Slots')}
                className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
              >
                <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                  <FaCalendarCheck className="text-xl" />
                </div>
                <span className="font-medium text-gray-700">My Slots</span>
              </button>
            </>
          )}

            {profile.type === 'company' && (
            <button 
              onClick={() => navigate('/InventoryPage')}
              className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
            >
              <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                <FaBoxes className="text-xl" />
              </div>
              <span className="font-medium text-gray-700">Stock Management</span>
            </button>)}

          <button 
            onClick={() => navigate('/FAQs')}
            className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
          >
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
              <FaQuestionCircle className="text-xl" />
            </div>
            <span className="font-medium text-gray-700">Inquiries</span>
          </button>
        </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;