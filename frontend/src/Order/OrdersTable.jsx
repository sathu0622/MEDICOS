import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaTrash, FaBoxOpen, FaInfoCircle } from 'react-icons/fa';

const OrdersTable = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:4000/OrderOperations/getorder`)
            .then(result => {
                console.log("Fetched Data:", result.data);
                setOrders(result.data);
            })
            .catch(err => console.error("Error fetching data:", err));
    }, []);
    
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this order?")) {
            axios.delete(`http://localhost:4000/OrderOperations/deleteorder/${id}`)
                .then(() => {
                    setOrders(orders.filter(order => order._id !== id));
                })
                .catch(err => console.error("Error deleting order:", err));
        }
    };

    return (
        <div className="p-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Order Management</h2>
                    <div className="text-sm text-gray-500">
                        {orders.length} {orders.length === 1 ? 'order' : 'orders'} found
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-blue-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">Medicine</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">Qty</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.length > 0 ? orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{order.name}</div>
                                                <div className="text-sm text-gray-500">{order.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{order.contactNo}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{order.medicineCategory}</div>
                                        <div className="text-sm text-gray-500 truncate max-w-xs">{order.shippingAddress}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {new Date(order.orderDate).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            {order.qty}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <Link
                                                to={`/OrderUpdateForm/${order._id}`}
                                                className="text-blue-600 hover:text-blue-900 flex items-center"
                                            >
                                                <FaEdit className="mr-1" /> Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(order._id)}
                                                className="text-red-600 hover:text-red-900 flex items-center"
                                            >
                                                <FaTrash className="mr-1" /> Delete
                                            </button>
                                        </div>
                                        {order.remarks && (
                                            <div className="mt-1 text-xs text-gray-500 truncate max-w-xs">
                                                <FaInfoCircle className="inline mr-1" /> {order.remarks}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-500">
                                            <FaBoxOpen className="text-4xl mb-2" />
                                            <p className="text-lg">No orders found</p>
                                            <p className="text-sm mt-1">There are currently no orders in the system</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrdersTable;