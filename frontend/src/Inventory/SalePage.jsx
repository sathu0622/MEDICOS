// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Header from '../pages/Header'
// import { Link } from 'react-router-dom';
// import { CiSearch } from "react-icons/ci";

// const SalePage = () => {
//   const [stock, setStock] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');

//   useEffect(() => {
//     axios.get(`http://localhost:4000/InventoryOperations/getstock`)
//         .then(result => {
//             console.log("Fetched Data:", result.data);
//             setStock(result.data);
//         })
//         .catch(err => console.error("Error fetching data:", err));
//   }, []);

//   const handleAddToCart = (product) => {
//     console.log("Added to cart:", product);
//   };

//   const handleSearchChange = (event) => {
//     setSearchQuery(event.target.value);
//   };

//   const filteredStock = stock.filter(item => 
//     item.Product.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     item.Category.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-gray-50">

//       <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md py-3">
//         <Header />
//       </div>
      

//            <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
           
//              {/* Search Bar */}
//              <div className="max-w-md mx-auto mt-10 flex items-center border border-[#007BFF] rounded-lg bg-white px-4 py-3 focus-within:ring-2 focus-within:ring-[#007BFF] focus-within:border-[#007BFF]">
//              <input
//              type="text"
//              placeholder="Search by product name or category"
//              value={searchQuery}
//              onChange={handleSearchChange}
//              className="flex-1 bg-white text-black focus:outline-none"
//              />
//              <CiSearch className="text-[#007BFF] text-2xl ml-2" />
//             </div>



//         {/* Products Grid */}
//         <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
//           {filteredStock.length > 0 ? (
//             filteredStock.map((item, index) => (
//               <div 
//                 key={index}
//                 className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
//               >
//                 <div className="h-48 w-full flex items-center justify-center bg-gray-100 overflow-hidden">
//                   <img 
//                     src={`http://localhost:4000/${item.Img}`} 
//                     alt={item.ProductName}
//                     className="h-full w-full object-contain p-4"
//                   />
//                 </div>
//                 <div className="p-5 text-center">
//                   <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.Product}</h3>
//                   <p className="text-blue-600 font-medium mb-3">{item.Category}</p>
//                   <p className="text-gray-600 text-sm mb-4">
//                     <span className="font-semibold text-gray-700">Description:</span> {item.Description}
//                   </p>
//                   <div className="mt-4">
//                     <Link to='/Order'>
//                       <button
//                         onClick={() => handleAddToCart(item)}
//                         className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
//                       >
//                         Place Order
//                       </button>
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="col-span-full text-center py-12">
//               <p className="text-red-500 text-lg font-medium">No products found matching your search.</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SalePage;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CiSearch } from "react-icons/ci";
import Header from '../pages/Header';
import api from '../services/api';

const SalePage = () => {
  const [stock, setStock] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await api.get('/InventoryOperations/getstock');
        setStock(response.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.message || err.message || "Failed to fetch stock");
      } finally {
        setLoading(false);
      }
    };

    fetchStock();
  }, []);

  const handleAddToCart = (product) => {
    console.log("Added to cart:", product);
    // Here you could also update a cart state or localStorage
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredStock = stock.filter(item => {
    const productName = item.Product ? item.Product.toLowerCase() : '';
    const category = item.category ? item.category.toLowerCase() : '';
    const searchTerm = searchQuery.toLowerCase();
    return productName.includes(searchTerm) || category.includes(searchTerm);
  });

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
      <p className="font-bold">Error</p>
      <p>{error}</p>
    </div>
  );
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md py-3">
        <Header />
      </div>
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="max-w-md mx-auto mt-10 flex items-center border border-[#007BFF] rounded-lg bg-white px-4 py-3 focus-within:ring-2 focus-within:ring-[#007BFF] focus-within:border-[#007BFF]">
          <input
            type="text"
            placeholder="Search by product name or category"
            value={searchQuery}
            onChange={handleSearchChange}
            className="flex-1 bg-white text-black focus:outline-none"
          />
          <CiSearch className="text-[#007BFF] text-2xl ml-2" />
        </div>
        <br />
        <br />

        {/* Products Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
          {filteredStock.length > 0 ? (
            filteredStock.map((item, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="h-48 w-full flex items-center justify-center bg-gray-100 overflow-hidden">
                  <img 
                    src={`http://localhost:4000/${item.Img}`} 
                    alt={item.Product || 'Product image'}
                    className="h-full w-full object-contain p-4"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                    }}
                  />
                </div>
                <div className="p-5 text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.Product || 'No Name'}</h3>
                  <p className="text-blue-600 font-medium mb-3">{item.Category || 'Uncategorized'}</p>
                  <p className="text-gray-600 text-sm mb-4">
                    <span className="font-semibold text-gray-700">Description:</span> {item.Description || 'No description available'}
                  </p>
                  <div className="mt-4">
                    <Link to='/Order'>
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                      >
                        Place Order
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-red-500 text-lg font-medium">No products found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalePage;