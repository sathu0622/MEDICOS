// import React from 'react';
// import { Link } from 'react-router-dom';

// const Admin = () => {
//   return (
//     <nav className="flex justify-between items-center mx-auto my-5 py-4 px-6 bg-white shadow-sm rounded-full w-[92%] max-w-5xl h-18">
//       {/* Left side - Logo */}
//       <div className="flex-1 min-w-[100px]">
//         <Link to="/" className="text-[#037bff] text-xl md:text-2xl font-bold ml-3">MEDICOS</Link>
//       </div>

     
// <div className="flex items-center space-x-1 md:space-x-3 overflow-x-auto scrollbar-hide">
//   <Link 
//     to='/AppointmentsPage'
//     className="text-black text-sm md:text-base font-medium hover:text-[#037bff] transition-colors px-2 py-1 whitespace-nowrap"
//   >
//     Appointments
//   </Link>
  
//   <Link 
//     to='/slots'
//     className="text-black text-sm md:text-base font-medium hover:text-[#037bff] transition-colors px-2 py-1 whitespace-nowrap"
//   >
//     Slots
//   </Link>
  
//   <Link 
//     to='/InventoryPage'
//     className="text-black text-sm md:text-base font-medium hover:text-[#037bff] transition-colors px-2 py-1 whitespace-nowrap"
//   >
//     Inventory
//   </Link>
  
//   <Link 
//     to='/OrdersTable'
//     className="text-black text-sm md:text-base font-medium hover:text-[#037bff] transition-colors px-2 py-1 whitespace-nowrap"
//   >
//     Orders
//   </Link>
  
//   <Link 
//     to='/PayTable'
//     className="text-black text-sm md:text-base font-medium hover:text-[#037bff] transition-colors px-2 py-1 whitespace-nowrap"
//   >
//     Payments
//   </Link>
// </div>

//       {/* Right side - User Dropdown */}
//       <div className="flex-1 flex justify-end min-w-[50px]">
//         <div className="dropdown dropdown-end">
//           <div tabIndex={0} className="flex items-center gap-2 cursor-pointer">
//             <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-[#037bff]">
//               <img
//                 alt="User profile"
//                 src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           </div>
//           <ul
//             tabIndex={0}
//             className="dropdown-content menu p-2 shadow bg-white rounded-box w-52 mt-2 border border-gray-100"
//           >
//             <li>
//               <Link to="/profile" className="text-[#037bff] hover:bg-blue-50">
//                 Profile
//                 <span className="badge bg-[#037bff] text-white">New</span>
//               </Link>
//             </li>
//             <li>
//               <Link to="/settings" className="text-[#037bff] hover:bg-blue-50">Settings</Link>
//             </li>
//             <li>
//               <Link to="/logout" className="text-[#037bff] hover:bg-blue-50">Logout</Link>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Admin;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Admin = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="flex flex-wrap justify-between items-center mx-auto my-5 py-4 px-6 bg-white shadow-sm rounded-xl w-[92%] max-w-6xl">
      {/* Left side - Logo */}
      <div className="flex-1 min-w-[100px]">
        <Link to="/" className="text-[#037bff] text-xl md:text-2xl font-bold ml-3">MEDICOS</Link>
      </div>

      {/* Hamburger Menu for Mobile */}
      <div className="block md:hidden">
        <button onClick={toggleMenu} className="text-[#037bff] text-2xl">
          {isMenuOpen ? 'X' : '☰'}
        </button>
      </div>

      {/* Links for Desktop */}
      <div className={`flex items-center space-x-1 md:space-x-3 overflow-x-auto scrollbar-hide md:flex ${isMenuOpen ? 'block' : 'hidden'}`}>
        <Link
          to='/AppointmentsPage'
          className="text-black text-sm md:text-base font-medium hover:text-[#037bff] transition-colors px-2 py-1 whitespace-nowrap"
        >
          Appointments
        </Link>
        <Link
          to='/slots'
          className="text-black text-sm md:text-base font-medium hover:text-[#037bff] transition-colors px-2 py-1 whitespace-nowrap"
        >
          Slots
        </Link>
        <Link
          to='/InventoryPage'
          className="text-black text-sm md:text-base font-medium hover:text-[#037bff] transition-colors px-2 py-1 whitespace-nowrap"
        >
          Inventory
        </Link>
        <Link
          to='/OrdersTable'
          className="text-black text-sm md:text-base font-medium hover:text-[#037bff] transition-colors px-2 py-1 whitespace-nowrap"
        >
          Orders
        </Link>
        <Link
          to='/PayTable'
          className="text-black text-sm md:text-base font-medium hover:text-[#037bff] transition-colors px-2 py-1 whitespace-nowrap"
        >
          Payments
        </Link>
      </div>

      {/* Right side - User Dropdown */}
      <div className="flex-1 flex justify-end min-w-[50px]">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-[#037bff]">
              <img
                alt="User profile"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-white rounded-box w-52 mt-2 border border-gray-100"
          >
            <li>
              <Link to="/profile" className="text-[#037bff] hover:bg-blue-50">
                Profile
                <span className="badge bg-[#037bff] text-white">New</span>
              </Link>
            </li>
            <li>
              <Link to="/settings" className="text-[#037bff] hover:bg-blue-50">Settings</Link>
            </li>
            <li>
              <Link to="/logout" className="text-[#037bff] hover:bg-blue-50">Logout</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Admin;
