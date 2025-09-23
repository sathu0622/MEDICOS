// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import { FaTrash } from 'react-icons/fa';

// // const OrderList = () => {
// //     const [orders, setOrders] = useState([]);
// //     const [loading, setLoading] = useState(true);
// //     const [error, setError] = useState(null);

// //     useEffect(() => {
// //         const fetchOrders = async () => {
// //             try {
// //                 const token = localStorage.getItem('authToken');
// //                 const userData = JSON.parse(localStorage.getItem('userData'));
                
// //                 if (!userData?.email) {
// //                     throw new Error('User not authenticated');
// //                 }

// //                 const response = await axios.get(
// //                     `http://localhost:4000/OrderOperations/getorder/user/${userData.email}`,
// //                     {
// //                         headers: {
// //                             'Authorization': `Bearer ${token}`
// //                         }
// //                     }
// //                 );

// //                 setOrders(response.data.orders);
// //                 setLoading(false);
// //             } catch (err) {
// //                 console.error("Error fetching data:", err);
// //                 setError(err.response?.data?.message || err.message || "Error fetching orders");
// //                 setLoading(false);
// //             }
// //         };

// //         fetchOrders();
// //     }, []);
    
// //     const handleDelete = (id) => {
// //         if (window.confirm("Are you sure you want to cancel this order?")) {
// //             axios.delete(`http://localhost:4000/OrderOperations/deleteorder/${id}`)
// //                 .then(() => {
// //                     setOrders(orders.filter(order => order._id !== id));
// //                 })
// //                 .catch(err => console.error("Error deleting:", err));
// //         }
// //     };

// //     if (loading) {
// //         return (
// //             <div className="flex justify-center items-center h-screen">
// //                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
// //                 <span className="ml-4">Loading your orders...</span>
// //             </div>
// //         );
// //     }

// //     if (error) {
// //         return (
// //             <div className="text-center py-8 text-red-500">
// //                 {error}
// //             </div>
// //         );
// //     }

// //     return (
// //         <div className="bg-white p-8 rounded-lg shadow-sm mx-4 my-6">
// //             <div className="flex justify-between items-center mb-8">
// //                 <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
// //             </div>

// //             {orders.length === 0 ? (
// //                 <div className="text-center py-8 text-gray-500">
// //                     No orders found
// //                 </div>
// //             ) : (
// //                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //                     {orders.map((order) => (
// //                         <div key={order._id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
// //                             <div className="mb-4">
// //                                 <div className="flex justify-between mb-2">
// //                                     <span className="text-gray-600 font-medium">Name:</span>
// //                                     <span className="text-gray-800 font-semibold">{order.name}</span>
// //                                 </div>
// //                                 <div className="flex justify-between mb-2">
// //                                     <span className="text-gray-600 font-medium">Category:</span>
// //                                     <span className="text-gray-800 font-semibold">{order.medicineCategory}</span>
// //                                 </div>
// //                                 <div className="flex justify-between mb-2">
// //                                     <span className="text-gray-600 font-medium">Quantity:</span>
// //                                     <span className="text-gray-800 font-semibold">{order.qty}</span>
// //                                 </div>
// //                                 <div className="flex justify-between">
// //                                     <span className="text-gray-600 font-medium">Date:</span>
// //                                     <span className="text-gray-800 font-semibold">
// //                                         {new Date(order.orderDate).toLocaleDateString()}
// //                                     </span>
// //                                 </div>
// //                             </div>
// //                             <div className="flex justify-end">
// //                                 <button 
// //                                     className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
// //                                     onClick={() => handleDelete(order._id)}
// //                                 >
// //                                     <FaTrash /> Cancel
// //                                 </button>
// //                             </div>
// //                         </div>
// //                     ))}
// //                 </div>
// //             )}
// //         </div>
// //     );
// // };

// // export default OrderList;




// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FaTrash, FaEdit, FaFilePdf } from 'react-icons/fa';
// import { Link } from 'react-router-dom';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';

// const OrderList = () => {
//     const [orders, setOrders] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchOrders = async () => {
//             try {
//                 const token = localStorage.getItem('authToken');
//                 const userData = JSON.parse(localStorage.getItem('userData'));
                
//                 if (!userData?.email) {
//                     throw new Error('User not authenticated');
//                 }

//                 const response = await axios.get(
//                     `http://localhost:4000/OrderOperations/getorder/user/${userData.email}`,
//                     {
//                         headers: {
//                             'Authorization': `Bearer ${token}`
//                         }
//                     }
//                 );

//                 setOrders(response.data.orders);
//                 setLoading(false);
//             } catch (err) {
//                 console.error("Error fetching data:", err);
//                 setError(err.response?.data?.message || err.message || "Error fetching orders");
//                 setLoading(false);
//             }
//         };

//         fetchOrders();
//     }, []);
    
//     const handleDelete = (id) => {
//         if (window.confirm("Are you sure you want to cancel this order?")) {
//             axios.delete(`http://localhost:4000/OrderOperations/deleteorder/${id}`)
//                 .then(() => {
//                     setOrders(orders.filter(order => order._id !== id));
//                 })
//                 .catch(err => console.error("Error deleting:", err));
//         }
//     };

//     const generatePDF = () => {
//         const doc = new jsPDF();
        
//         // Add title with MEDICOS branding
//         doc.setFontSize(24);
//         doc.setTextColor(3, 123, 255); // MEDICOS blue color
//         doc.text('MEDICOS', 14, 20);
        
//         doc.setFontSize(16);
//         doc.setTextColor(0, 0, 0); // Reset to black
//         doc.text('My Orders Report', 14, 30);
        
//         // Add generation date and user info
//         doc.setFontSize(10);
//         doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 37);
//         doc.text(`Customer: ${orders[0]?.name || ''}`, 14, 44);
//         doc.text(`Email: ${orders[0]?.email || ''}`, 14, 51);
        
//         // Add summary
//         doc.text(`Total Orders: ${orders.length}`, 14, 58);
        
//         // Prepare table data
//         const tableData = orders.map(order => [
//             order.medicineCategory,
//             new Date(order.orderDate).toLocaleDateString(),
//             order.qty,
//             order.shippingAddress,
//             order.remarks || 'N/A'
//         ]);

//         // Add table with improved styling
//         autoTable(doc, {
//             head: [['Category', 'Order Date', 'Quantity', 'Shipping Address', 'Remarks']],
//             body: tableData,
//             startY: 65,
//             styles: { 
//                 fontSize: 8,
//                 cellPadding: 2,
//                 overflow: 'linebreak'
//             },
//             headStyles: { 
//                 fillColor: [3, 123, 255], // MEDICOS blue
//                 textColor: 255,
//                 fontStyle: 'bold'
//             },
//             alternateRowStyles: { 
//                 fillColor: [245, 245, 245]
//             },
//             margin: { top: 30 },
//             columnStyles: {
//                 0: { cellWidth: 30 }, // Category
//                 1: { cellWidth: 25 }, // Order Date
//                 2: { cellWidth: 20 }, // Quantity
//                 3: { cellWidth: 60 }, // Shipping Address
//                 4: { cellWidth: 30 }  // Remarks
//             }
//         });

//         // Add footer
//         const pageCount = doc.internal.getNumberOfPages();
//         for (let i = 1; i <= pageCount; i++) {
//             doc.setPage(i);
//             doc.setFontSize(8);
//             doc.setTextColor(128);
//             doc.text(
//                 'MEDICOS - Order Management System',
//                 doc.internal.pageSize.width / 2,
//                 doc.internal.pageSize.height - 10,
//                 { align: 'center' }
//             );
//         }

//         // Save the PDF
//         doc.save('my-medicos-orders.pdf');
//     };

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-screen">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//                 <span className="ml-4">Loading your orders...</span>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="text-center py-8 text-red-500">
//                 {error}
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-50 py-8">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <div className="bg-white rounded-lg shadow-sm p-6">
//                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
//                         <div className="mb-4 sm:mb-0">
//                             <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
//                             <p className="text-gray-600 mt-1">View and manage your orders</p>
//                         </div>
//                         {orders.length > 0 && (
//                             <button
//                                 onClick={generatePDF}
//                                 className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//                             >
//                                 <FaFilePdf className="mr-2" />
//                                 Download Orders
//                             </button>
//                         )}
//                     </div>

//                     {/* {orders.length === 0 ? (
//                         <div className="text-center py-12">
//                             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
//                                 <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
//                                 </svg>
//                             </div>
//                             <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
//                             <p className="text-gray-500">You haven't placed any orders yet.</p>
//                         </div>
//                     ) : (
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                             {orders.map((order) => (
//                                 <div key={order._id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
//                                     <div className="space-y-4">
//                                         <div className="flex justify-between items-start">
//                                             <div>
//                                                 <h3 className="text-lg font-semibold text-gray-900 truncate">{order.name}</h3>
//                                                 <p className="text-sm text-gray-500">{order.email}</p>
//                                             </div>
//                                             <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
//                                                 {new Date(order.orderDate).toLocaleDateString()}
//                                             </span>
//                                         </div>

//                                         <div className="space-y-2">
//                                             <div className="flex justify-between">
//                                                 <span className="text-gray-600">Category:</span>
//                                                 <span className="text-gray-900 font-medium">{order.medicineCategory}</span>
//                                             </div>
//                                             <div className="flex justify-between">
//                                                 <span className="text-gray-600">Quantity:</span>
//                                                 <span className="text-gray-900 font-medium">{order.qty}</span>
//                                             </div>
//                                             <div className="flex justify-between">
//                                                 <span className="text-gray-600">Contact:</span>
//                                                 <span className="text-gray-900 font-medium">{order.contactNo}</span>
//                                             </div>
//                                         </div>

//                                         <div className="pt-4 border-t border-gray-100">
//                                             <div className="flex flex-wrap gap-2 justify-end">
//                                                 <Link 
//                                                     to={`/OrderUpdateForm/${order._id}`}
//                                                     className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
//                                                 >
//                                                     <FaEdit className="mr-2" />
//                                                     Edit
//                                                 </Link>
//                                                 <button 
//                                                     onClick={() => handleDelete(order._id)}
//                                                     className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//                                                 >
//                                                     <FaTrash className="mr-2" />
//                                                     Cancel
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )} */}


//                     {orders.length === 0 ? (
//     <div className="text-center py-12">
//         <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
//             <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
//             </svg>
//         </div>
//         <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
//         <p className="text-gray-500">You haven't placed any orders yet.</p>
//     </div>
// ) : (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {orders.map((order) => (
//             <div key={order._id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
//                 <div className="p-6">
//                     <div className="flex justify-between items-start mb-4">
//                         <div>
//                             <h3 className="text-xl font-bold text-gray-800">{order.medicineCategory}</h3>
//                             <p className="text-sm text-gray-500 mt-1">Order #{order._id.slice(-6).toUpperCase()}</p>
//                         </div>
//                         <span className="bg-blue-50 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
//                             {new Date(order.orderDate).toLocaleDateString()}
//                         </span>
//                     </div>

//                     <div className="space-y-3 mb-6">
//                         <div className="flex items-center">
//                             <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                             </svg>
//                             <span className="text-gray-700">{order.name}</span>
//                         </div>
//                         <div className="flex items-center">
//                             <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                             </svg>
//                             <span className="text-gray-700">{order.email}</span>
//                         </div>
//                         <div className="flex items-center">
//                             <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                             </svg>
//                             <span className="text-gray-700">{order.contactNo}</span>
//                         </div>
//                         <div className="flex items-start">
//                             <svg className="w-5 h-5 text-gray-400 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                             </svg>
//                             <div>
//                                 <p className="text-gray-700 font-medium">Shipping Address</p>
//                                 <p className="text-gray-600 text-sm">{order.shippingAddress}</p>
//                             </div>
//                         </div>
//                         <div className="flex items-start">
//                             <svg className="w-5 h-5 text-gray-400 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
//                             </svg>
//                             <div>
//                                 <p className="text-gray-700 font-medium">Remarks</p>
//                                 <p className="text-gray-600 text-sm">{order.remarks || 'No remarks provided'}</p>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="flex justify-between items-center pt-4 border-t border-gray-100">
//                         <div className="bg-gray-100 px-3 py-1 rounded-full">
//                             <span className="text-gray-800 font-medium">Qty: {order.qty}</span>
//                         </div>
//                         <div className="flex space-x-2">
//                             <Link 
//                                 to={`/OrderUpdateForm/${order._id}`}
//                                 className="p-2 text-gray-700 hover:text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors duration-200"
//                                 title="Edit"
//                             >
//                                 <FaEdit />
//                             </Link>
//                             <button 
//                                 onClick={() => handleDelete(order._id)}
//                                 className="p-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
//                                 title="Cancel"
//                             >
//                                 <FaTrash />
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         ))}
//     </div>
// )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default OrderList;




import React, { useState, useEffect, useContext } from 'react';
import { FaTrash, FaEdit, FaFilePdf } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const OrderList = () => {
    const { user } = useContext(AuthContext); // only user info
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingOrder, setEditingOrder] = useState(null);
    const [editFormData, setEditFormData] = useState({
        medicineCategory: '',
        qty: '',
        shippingAddress: '',
        contactNo: '',
        remarks: ''
    });

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                if (!user?.email) {
                    throw new Error('User not authenticated');
                }

                const response = await api.get(`/OrderOperations/getorder/user/${user.email}`);
                setOrders(response.data.orders || []);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err.response?.data?.message || err.message || "Error fetching orders");
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to cancel this order?")) {
            try {
                await api.delete(`/OrderOperations/deleteorder/${id}`);
                setOrders(orders.filter(order => order._id !== id));
            } catch (err) {
                console.error("Error deleting order:", err);
                setError(err.response?.data?.message || "Error deleting order");
            }
        }
    };

    const handleEditClick = (order) => {
        setEditingOrder(order._id);
        setEditFormData({
            medicineCategory: order.medicineCategory,
            qty: order.qty,
            shippingAddress: order.shippingAddress,
            contactNo: order.contactNo,
            remarks: order.remarks || ''
        });
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditFormSubmit = async (orderId) => {
        try {
            await api.put(`/OrderOperations/updateorder/${orderId}`, editFormData);
            setOrders(orders.map(order =>
                order._id === orderId ? { ...order, ...editFormData } : order
            ));
            setEditingOrder(null);
        } catch (err) {
            console.error("Error updating order:", err);
            setError(err.response?.data?.message || "Error updating order");
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(24);
        doc.setTextColor(3, 123, 255);
        doc.text('MEDICOS', 14, 20);

        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('My Orders Report', 14, 30);

        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 37);
        doc.text(`Customer: ${orders[0]?.name || ''}`, 14, 44);
        doc.text(`Email: ${orders[0]?.email || ''}`, 14, 51);
        doc.text(`Total Orders: ${orders.length}`, 14, 58);

        const tableData = orders.map(order => [
            order.medicineCategory,
            new Date(order.orderDate).toLocaleDateString(),
            order.qty,
            order.shippingAddress,
            order.remarks || 'N/A'
        ]);

        autoTable(doc, {
            head: [['Category', 'Order Date', 'Quantity', 'Shipping Address', 'Remarks']],
            body: tableData,
            startY: 65,
            styles: { fontSize: 8, cellPadding: 2, overflow: 'linebreak' },
            headStyles: { fillColor: [3, 123, 255], textColor: 255, fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [245, 245, 245] },
            margin: { top: 30 },
            columnStyles: {
                0: { cellWidth: 30 },
                1: { cellWidth: 25 },
                2: { cellWidth: 20 },
                3: { cellWidth: 60 },
                4: { cellWidth: 30 }
            }
        });

        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(128);
            doc.text(
                'MEDICOS - Order Management System',
                doc.internal.pageSize.width / 2,
                doc.internal.pageSize.height - 10,
                { align: 'center' }
            );
        }

        doc.save('my-medicos-orders.pdf');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <span className="ml-4">Loading your orders...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8 text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                        <div className="mb-4 sm:mb-0">
                            <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
                            <p className="text-gray-600 mt-1">View and manage your orders</p>
                        </div>
                        {orders.length > 0 && (
                            <button
                                onClick={generatePDF}
                                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                <FaFilePdf className="mr-2" />
                                Download Orders
                            </button>
                        )}
                    </div>

                    {orders.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                            <p className="text-gray-500">You haven't placed any orders yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {orders.map((order) => (
                                <div key={order._id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                                    {editingOrder === order._id ? (
                                        <div className="p-6">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-lg font-bold text-gray-800">Edit Order</h3>
                                                <button 
                                                    onClick={() => setEditingOrder(null)}
                                                    className="text-gray-400 hover:text-gray-600"
                                                >
                                                    <FaTimes />
                                                </button>
                                            </div>
                                            
                                            <form onSubmit={(e) => {
                                                e.preventDefault();
                                                handleEditFormSubmit(order._id);
                                            }}>
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Category</label>
                                                        <select
                                                            name="medicineCategory"
                                                            value={editFormData.medicineCategory}
                                                            onChange={handleEditFormChange}
                                                            className="w-full px-3 py-2 border bg-white text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                            required
                                                        >
                                                            <option value="">Select Category</option>
                                                            <option value="Tablet">Tablet</option>
                                                            <option value="Capsule">Capsule</option>
                                                            <option value="Syrup">Syrup</option>
                                                            <option value="Injection">Injection</option>
                                                            <option value="Ointment">Ointment</option>
                                                        </select>
                                                    </div>
                                                    
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                                        <input
                                                            type="number"
                                                            name="qty"
                                                            value={editFormData.qty}
                                                            onChange={handleEditFormChange}
                                                            className="w-full px-3 py-2 border bg-white text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                            min="1"
                                                            required
                                                        />
                                                    </div>
                                                    
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
                                                        <textarea
                                                            name="shippingAddress"
                                                            value={editFormData.shippingAddress}
                                                            onChange={handleEditFormChange}
                                                            rows="3"
                                                            className="w-full px-3 py-2 borde bg-white text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                            required
                                                        />
                                                    </div>
                                                    
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                                                        <input
                                                            type="tel"
                                                            name="contactNo"
                                                            value={editFormData.contactNo}
                                                            onChange={handleEditFormChange}
                                                            className="w-full px-3 py-2 border bg-white text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                            required
                                                        />
                                                    </div>
                                                    
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                                                        <textarea
                                                            name="remarks"
                                                            value={editFormData.remarks}
                                                            onChange={handleEditFormChange}
                                                            rows="2"
                                                            className="w-full px-3 py-2 border bg-white text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    </div>
                                                </div>
                                                
                                                <div className="mt-6 flex justify-end space-x-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditingOrder(null)}
                                                        className="px-4 py-2 border  border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    >
                                                        Save Changes
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    ) : (
                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-800">{order.medicineCategory}</h3>
                                                    <p className="text-sm text-gray-500 mt-1">Order #{order._id.slice(-6).toUpperCase()}</p>
                                                </div>
                                                <span className="bg-blue-50 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                    {new Date(order.orderDate).toLocaleDateString()}
                                                </span>
                                            </div>

                                            <div className="space-y-3 mb-6">
                                                <div className="flex items-center">
                                                    <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    <span className="text-gray-700">{order.name}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                    <span className="text-gray-700">{order.email}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                    <span className="text-gray-700">{order.contactNo}</span>
                                                </div>
                                                <div className="flex items-start">
                                                    <svg className="w-5 h-5 text-gray-400 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                    </svg>
                                                    <div>
                                                        <p className="text-gray-700 font-medium">Shipping Address</p>
                                                        <p className="text-gray-600 text-sm">{order.shippingAddress}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start">
                                                    <svg className="w-5 h-5 text-gray-400 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                                    </svg>
                                                    <div>
                                                        <p className="text-gray-700 font-medium">Remarks</p>
                                                        <p className="text-gray-600 text-sm">{order.remarks || 'No remarks provided'}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                                <div className="bg-gray-100 px-3 py-1 rounded-full">
                                                    <span className="text-gray-800 font-medium">Qty: {order.qty}</span>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button 
                                                        onClick={() => handleEditClick(order)}
                                                        className="p-2 text-gray-700 hover:text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors duration-200"
                                                        title="Edit"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(order._id)}
                                                        className="p-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                                                        title="Cancel"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderList;