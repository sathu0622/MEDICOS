import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpinner, FaShoppingBag } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Order = () => {
    const { user } = useContext(AuthContext); // only user
    const navigate = useNavigate();

    const [order, setOrder] = useState({
        name: '',
        email: '',
        contactNo: '',
        medicineCategory: '',
        orderDate: '',
        shippingAddress: '',
        qty: '',
        remarks: ''
    });

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        const fetchStock = async () => {
            try {
                const response = await api.get('/InventoryOperations/getstock');
                setCategories(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching stock:", err);
                setError("Failed to load stock data. Please try again later.");
                setLoading(false);
            }
        };

        fetchStock();

        // Set default order date to today
        const today = new Date().toISOString().split('T')[0];
        setOrder(prev => ({ ...prev, orderDate: today }));

        // Pre-fill user details from AuthContext
        if (user) {
            setOrder(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                contactNo: user.contactNo || ''
            }));
        }
    }, [user]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setOrder(prev => ({ ...prev, [name]: value }));

        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const errors = {};
        let isValid = true;

        if (!order.name.trim()) {
            errors.name = 'Name is required';
            isValid = false;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!order.email) {
            errors.email = 'Email is required';
            isValid = false;
        } else if (!emailPattern.test(order.email)) {
            errors.email = 'Invalid email address';
            isValid = false;
        }

        const phonePattern = /^\d{10}$/;
        if (!order.contactNo) {
            errors.contactNo = 'Contact number is required';
            isValid = false;
        } else if (!phonePattern.test(order.contactNo)) {
            errors.contactNo = 'Must be exactly 10 digits';
            isValid = false;
        }

        if (!order.medicineCategory) {
            errors.medicineCategory = 'Please select a category';
            isValid = false;
        }

        if (!order.qty) {
            errors.qty = 'Quantity is required';
            isValid = false;
        } else if (isNaN(order.qty)) {
            errors.qty = 'Must be a number';
            isValid = false;
        } else if (order.qty <= 0) {
            errors.qty = 'Must be greater than zero';
            isValid = false;
        }

        if (!order.shippingAddress.trim()) {
            errors.shippingAddress = 'Shipping address is required';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;

        setSubmitLoading(true);
        setError(null);

        try {
            if (!user?._id) throw new Error('User not authenticated');

            const orderData = {
                userId: user._id,
                name: order.name,
                email: order.email,
                contactNo: order.contactNo,
                medicineCategory: order.medicineCategory,
                orderDate: order.orderDate,
                shippingAddress: order.shippingAddress,
                qty: Number(order.qty),
                remarks: order.remarks
            };

            const response = await api.post('/OrderOperations/order', orderData);

            if (response.data.success) {
                navigate('/Profile', {
                    state: {
                        successMessage: 'Order placed successfully!',
                        orderId: response.data.orderId
                    }
                });
            } else {
                throw new Error(response.data.message || 'Failed to place order');
            }
        } catch (err) {
            console.error('Order submission error:', err);
            setError(err.response?.data?.message || err.message || "Error placing order!");
        } finally {
            setSubmitLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <FaSpinner className="animate-spin text-4xl text-blue-600 mr-3" />
                <span>Loading medicine categories...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="bg-blue-600 px-6 py-4">
                        <h1 className="text-2xl font-bold text-white flex items-center">
                            <FaShoppingBag className="mr-2" />
                            Place Your Order
                        </h1>
                    </div>
                    
                    <div className="p-6">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-700 font-medium">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name 
                                    </label>
                                    <input 
                                        type="text" 
                                        id="name" 
                                        placeholder="Your full name" 
                                        className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white ${
                                            formErrors.name ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        name="name" 
                                        value={order.name} 
                                        onChange={handleChange} 
                                    />
                                    {formErrors.name && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                                    )}
                                </div>
                                
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email 
                                    </label>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        placeholder="your.email@example.com" 
                                        className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white ${
                                            formErrors.email ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        name="email" 
                                        value={order.email} 
                                        onChange={handleChange} 
                                    />
                                    {formErrors.email && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="contactNo" className="block text-sm font-medium text-gray-700 mb-1">
                                        Contact Number 
                                    </label>
                                    <input 
                                        type="tel" 
                                        id="contactNo" 
                                        placeholder="07XXXXXXXX" 
                                        className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white ${
                                            formErrors.contactNo ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        name="contactNo" 
                                        value={order.contactNo} 
                                        onChange={handleChange} 
                                        maxLength="10"
                                    />
                                    {formErrors.contactNo && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors.contactNo}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="medicineCategory" className="block text-sm font-medium text-gray-700 mb-1">
                                        Medicine Category 
                                    </label>
                                    <select
                                        id="medicineCategory"
                                        className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white ${
                                            formErrors.medicineCategory ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        name="medicineCategory"
                                        value={order.medicineCategory}
                                        onChange={handleChange}
                                    >
                                        <option value="" className="text-gray-500">Select a category</option>
                                        {categories.map((category) => (
                                            <option key={category._id} value={category._id} className="text-gray-900">
                                                {category.category}
                                            </option>
                                        ))}
                                    </select>
                                    {formErrors.medicineCategory && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors.medicineCategory}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="orderDate" className="block text-sm font-medium text-gray-700 mb-1">
                                        Order Date 
                                    </label>
                                    <input 
                                        type="date" 
                                        id="orderDate" 
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                                        name="orderDate" 
                                        value={order.orderDate} 
                                        onChange={handleChange} 
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                                
                                <div>
                                    <label htmlFor="qty" className="block text-sm font-medium text-gray-700 mb-1">
                                        Quantity <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="number" 
                                        id="qty" 
                                        placeholder="Number of items" 
                                        className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white ${
                                            formErrors.qty ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        name="qty" 
                                        value={order.qty} 
                                        onChange={handleChange} 
                                        min="1"
                                    />
                                    {formErrors.qty && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors.qty}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700 mb-1">
                                    Shipping Address <span className="text-red-500">*</span>
                                </label>
                                <textarea 
                                    id="shippingAddress" 
                                    placeholder="Full shipping address including postal code" 
                                    className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 min-h-[100px] text-gray-900 bg-white ${
                                        formErrors.shippingAddress ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    name="shippingAddress" 
                                    value={order.shippingAddress} 
                                    onChange={handleChange} 
                                />
                                {formErrors.shippingAddress && (
                                    <p className="mt-1 text-sm text-red-600">{formErrors.shippingAddress}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-1">
                                    Remarks
                                </label>
                                <textarea 
                                    id="remarks" 
                                    placeholder="Any special instructions or notes" 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 min-h-[80px] text-gray-900 bg-white"
                                    name="remarks" 
                                    value={order.remarks} 
                                    onChange={handleChange} 
                                />
                            </div>

                            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                                <button 
                                    type="button" 
                                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors font-medium"
                                    onClick={() => navigate(-1)}
                                    disabled={submitLoading}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-70 flex items-center justify-center min-w-[120px]"
                                    disabled={submitLoading}
                                >
                                    {submitLoading ? (
                                        <>
                                            <FaSpinner className="animate-spin mr-2" />
                                            Processing...
                                        </>
                                    ) : 'Place Order'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Order;