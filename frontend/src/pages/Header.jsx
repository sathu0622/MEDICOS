// import React, { useState, useRef, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';

// const Header = () => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const dropdownRef = useRef(null);
//   const navigate = useNavigate();
//   const userData = JSON.parse(localStorage.getItem('userData') || '{}');
//   const isDoctor = userData.type === 'doctor';
//   const isAdmin = userData.type === 'admin';

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate('/login');
//   };

//   const renderNavigationLinks = () => {
//     if (isAdmin) {
//       return (
//         <>
//           <li>
//             <Link to="/AdminDashboard" className="text-[#037bff] font-medium tracking-wide hover:text-[#0256b3] transition-colors px-3 py-1">
//               Dashboard
//             </Link>
//           </li>
//           <li>
//             <Link to="/UserTable" className="text-[#037bff] font-medium tracking-wide hover:text-[#0256b3] transition-colors px-3 py-1">
//               Users
//             </Link>
//           </li>
//           <li>
//             <Link to="/InventoryPage" className="text-[#037bff] font-medium tracking-wide hover:text-[#0256b3] transition-colors px-3 py-1">
//               Inventory
//             </Link>
//           </li>
//           <li>
//             <Link to="/OrdersTable" className="text-[#037bff] font-medium tracking-wide hover:text-[#0256b3] transition-colors px-3 py-1">
//               Orders
//             </Link>
//           </li>
//         </>
//       );
//     }

//     if (isDoctor) {
//       return (
//         <>
//           <li>
//             <Link to="/DoctorBookings" className="text-[#037bff] font-medium tracking-wide hover:text-[#0256b3] transition-colors px-3 py-1">
//              Meetings 
//             </Link>
//           </li>
//           <li>
//             <Link to="/Schedule" className="text-[#037bff] font-medium tracking-wide hover:text-[#0256b3] transition-colors px-3 py-1">
//               Schedule
//             </Link>
//           </li>
//           <li>
//           <Link to="/SalePage" className="text-[#037bff] font-medium tracking-wide hover:text-[#0256b3] transition-colors px-3 py-1">
//             Products
//           </Link>
//         </li>
//           <li>
//           <Link to="/Slots" className="text-[#037bff] font-medium tracking-wide hover:text-[#0256b3] transition-colors px-3 py-1">
//             Slots
//           </Link>
//         </li>
//         </>
//       );
//     }

//     return (
//       <>
//         <li>
//           <Link to="/Userhome" className="text-[#037bff] font-medium tracking-wide hover:text-[#0256b3] transition-colors px-3 py-1">
//             Home
//           </Link>
//         </li>
//         <li>
//           <Link to="/Available" className="text-[#037bff] font-medium tracking-wide hover:text-[#0256b3] transition-colors px-3 py-1">
//             Services
//           </Link>
//         </li>
//         <li>
//           <Link to="/SalePage" className="text-[#037bff] font-medium tracking-wide hover:text-[#0256b3] transition-colors px-3 py-1">
//             Products
//           </Link>
//         </li>
//         <li>
//           <Link to="/AppointmentsPage" className="text-[#037bff] font-medium tracking-wide hover:text-[#0256b3] transition-colors px-3 py-1">
//             My Bookings
//           </Link>
//         </li>
//         <li>
//           <Link to="/Ask" className="text-[#037bff] font-medium tracking-wide hover:text-[#0256b3] transition-colors px-3 py-1">
//             FAQ
//           </Link>
//         </li>
//       </>
//     );
//   };

//   return (
//     <nav className="flex justify-between items-center py-4 px-4 max-w-[1070px] w-full mx-auto">
//       <span className="text-[#037bff] text-2xl font-bold font-sans">MEDICOS</span>

//       {/* Desktop Menu */}
//       <div className="hidden md:flex items-center space-x-8">
//         <ul className="flex items-center space-x-6">
//           {renderNavigationLinks()}
//         </ul>

//         {/* Profile Dropdown */}
//         <div className="relative" ref={dropdownRef}>
//           <button 
//             onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//             className="flex items-center space-x-2 focus:outline-none"
//           >
//             <div className="w-10 h-10 rounded-full bg-[#037bff] flex items-center justify-center text-white font-medium">
//               {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
//             </div>
//           </button>

//           {isDropdownOpen && (
//             <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
//               <Link
//                 to="/Profile"
//                 className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                 onClick={() => setIsDropdownOpen(false)}
//               >
//                 My Profile
//               </Link>
//               <Link
//                 to="/Profile"
//                 className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                 onClick={() => setIsDropdownOpen(false)}
//               >
//                 Settings
//               </Link>
//               <button
//                 onClick={handleLogout}
//                 className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//               >
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Mobile menu button */}
//       <div className="flex items-center md:hidden">
//         <button
//           onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//           className="inline-flex items-center justify-center p-2 rounded-md text-[#037bff] focus:outline-none"
//         >
//           <svg
//             className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//           </svg>
//           <svg
//             className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         </button>
//       </div>

//       {/* Mobile menu */}
//       <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden absolute top-16 left-0 right-0 bg-white shadow-md z-40`}>
//         <ul className="px-2 pt-2 pb-3 space-y-1">
//           {renderNavigationLinks()}
//           <li className="border-t border-gray-200 pt-2">
//             <Link
//               to="/Profile"
//               className="block px-3 py-2 text-[#037bff] font-medium tracking-wide hover:text-[#0256b3]"
//               onClick={() => setIsMobileMenuOpen(false)}
//             >
//               My Profile
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/Profile"
//               className="block px-3 py-2 text-[#037bff] font-medium tracking-wide hover:text-[#0256b3]"
//               onClick={() => setIsMobileMenuOpen(false)}
//             >
//               Settings
//             </Link>
//           </li>
//           <li>
//             <button
//               onClick={() => {
//                 handleLogout();
//                 setIsMobileMenuOpen(false);
//               }}
//               className="block w-full text-left px-3 py-2 text-[#037bff] font-medium tracking-wide hover:text-[#0256b3]"
//             >
//               Logout
//             </button>
//           </li>
//         </ul>
//       </div>
//     </nav>
//   );
// };

// export default Header;
import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { user, logout } = useContext(AuthContext);
  const isDoctor = user?.type === 'doctor';
  const isAdmin = user?.type === 'admin';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout(); // call AuthContext logout
    navigate('/login');
  };

  const renderNavigationLinks = () => {
    if (isAdmin) {
      return (
        <>
          <li><Link to="/AdminDashboard" className="text-[#037bff] font-medium hover:text-[#0256b3] px-3 py-1">Dashboard</Link></li>
          <li><Link to="/UserTable" className="text-[#037bff] font-medium hover:text-[#0256b3] px-3 py-1">Users</Link></li>
          <li><Link to="/InventoryPage" className="text-[#037bff] font-medium hover:text-[#0256b3] px-3 py-1">Inventory</Link></li>
          <li><Link to="/OrdersTable" className="text-[#037bff] font-medium hover:text-[#0256b3] px-3 py-1">Orders</Link></li>
        </>
      );
    }

    if (isDoctor) {
      return (
        <>
          <li><Link to="/DoctorBookings" className="text-[#037bff] font-medium hover:text-[#0256b3] px-3 py-1">Meetings</Link></li>
          <li><Link to="/Schedule" className="text-[#037bff] font-medium hover:text-[#0256b3] px-3 py-1">Schedule</Link></li>
          <li><Link to="/SalePage" className="text-[#037bff] font-medium hover:text-[#0256b3] px-3 py-1">Products</Link></li>
          <li><Link to="/Slots" className="text-[#037bff] font-medium hover:text-[#0256b3] px-3 py-1">Slots</Link></li>
        </>
      );
    }

    return (
      <>
        <li><Link to="/Userhome" className="text-[#037bff] font-medium hover:text-[#0256b3] px-3 py-1">Home</Link></li>
        <li><Link to="/Available" className="text-[#037bff] font-medium hover:text-[#0256b3] px-3 py-1">Services</Link></li>
        <li><Link to="/SalePage" className="text-[#037bff] font-medium hover:text-[#0256b3] px-3 py-1">Products</Link></li>
        <li><Link to="/AppointmentsPage" className="text-[#037bff] font-medium hover:text-[#0256b3] px-3 py-1">My Bookings</Link></li>
        <li><Link to="/Ask" className="text-[#037bff] font-medium hover:text-[#0256b3] px-3 py-1">FAQ</Link></li>
      </>
    );
  };

  return (
    <nav className="flex justify-between items-center py-4 px-4 max-w-[1070px] w-full mx-auto">
      <span className="text-[#037bff] text-2xl font-bold font-sans">MEDICOS</span>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-8">
        <ul className="flex items-center space-x-6">{renderNavigationLinks()}</ul>

        {/* Profile Dropdown */}
        {user && (
          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-[#037bff] flex items-center justify-center text-white font-medium">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <Link to="/Profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>My Profile</Link>
                <Link to="/Profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>Settings</Link>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile menu */}
      <div className="flex items-center md:hidden">
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-[#037bff] focus:outline-none">
          <svg className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
          <svg className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-md z-40">
          <ul className="px-2 pt-2 pb-3 space-y-1">
            {renderNavigationLinks()}
            {user && (
              <>
                <li className="border-t border-gray-200 pt-2"><Link to="/Profile" className="block px-3 py-2 text-[#037bff] font-medium hover:text-[#0256b3]" onClick={() => setIsMobileMenuOpen(false)}>My Profile</Link></li>
                <li><Link to="/Profile" className="block px-3 py-2 text-[#037bff] font-medium hover:text-[#0256b3]" onClick={() => setIsMobileMenuOpen(false)}>Settings</Link></li>
                <li><button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-[#037bff] font-medium hover:text-[#0256b3]">Logout</button></li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Header;
