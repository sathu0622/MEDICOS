import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const OrderUpdateForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
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

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                // Match the backend route exactly
                const response = await axios.get(`http://localhost:4000/OrderOperations/getorder/${id}`);
                const orderData = response.data;
                
                setOrder({
                    name: orderData.name || '',
                    email: orderData.email || '',
                    contactNo: orderData.contactNo || '', // Changed from Contactno to contactNo
                    medicineCategory: orderData.medicineCategory || '',
                    orderDate: orderData.orderDate ? 
                        new Date(orderData.orderDate).toISOString().split('T')[0] : '',
                    shippingAddress: orderData.shippingAddress || '',
                    qty: orderData.qty || '',
                    remarks: orderData.remarks || ''
                });
            } catch (error) {
                console.error('Error fetching order:', error);
                alert('Failed to load order data');
                navigate('/OrdersTable');
            }
        };
        fetchOrder();
    }, [id, navigate]);

    const handleChange = (event) => {
        setOrder({ ...order, [event.target.name]: event.target.value });
    };

    const validateForm = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(order.email)) {
            alert("Invalid email address.");
            return false;
        }
        const phonePattern = /^\d{10}$/;
        if (!phonePattern.test(order.contactNo)) {
            alert("Contact number must be exactly 10 digits.");
            return false;
        }
        if (!order.qty || isNaN(order.qty) || order.qty <= 0) {
            alert("Quantity must be greater than zero.");
            return false;
        }
        if (!order.orderDate) {
            alert("Please select an order date.");
            return false;
        }
        return true;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!validateForm()) return;
        axios.put(`http://localhost:4000/OrderOperations/updateorder/${id}`, order)
            .then((response) => {
                console.log('Update success:', response.data);
                alert("Order updated successfully!");
                navigate('/OrdersTable');
            })
            .catch((error) => {
                console.error('Error updating order:', error);
                alert(error.response?.data?.message || "Error updating order!");
            });
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-black text-center mb-8">Update Order</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {['name', 'email'].map((field, idx) => (
                            <div key={idx}>
                                <label htmlFor={field} className="block text-sm font-semibold text-black mb-1">
                                    {field === 'name' ? 'Name' : 'Email'}
                                </label>
                                <input
                                    type={field === 'email' ? 'email' : 'text'}
                                    id={field}
                                    placeholder={field === 'name' ? 'Name' : 'Email'}
                                    name={field}
                                    value={order[field]}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-black bg-white focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF] transition-all"
                                    required
                                />
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="contactNo" className="block text-sm font-semibold text-black mb-1">Contact Number</label>
                            <input
                                type="text"
                                id="contactNo"
                                name="contactNo"
                                placeholder="Contact Number"
                                value={order.contactNo}
                                onChange={handleChange}
                                maxLength="10"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md text-black bg-white focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF] transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="medicineCategory" className="block text-sm font-semibold text-black mb-1">Medicine Category</label>
                            <input
                                type="text"
                                id="medicineCategory"
                                name="medicineCategory"
                                placeholder="Medicine Category"
                                value={order.medicineCategory}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md text-black bg-white focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF] transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="orderDate" className="block text-sm font-semibold text-black mb-1">Order Date</label>
                            <input
                                type="date"
                                id="orderDate"
                                name="orderDate"
                                value={order.orderDate}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md text-black bg-white focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF] transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="qty" className="block text-sm font-semibold text-black mb-1">Quantity</label>
                            <input
                                type="number"
                                id="qty"
                                name="qty"
                                placeholder="Quantity"
                                value={order.qty}
                                onChange={handleChange}
                                min="1"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md text-black bg-white focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF] transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="shippingAddress" className="block text-sm font-semibold text-black mb-1">Shipping Address</label>
                        <textarea
                            id="shippingAddress"
                            name="shippingAddress"
                            placeholder="Shipping Address"
                            value={order.shippingAddress}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md text-black bg-white focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF] transition-all min-h-[100px]"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="remarks" className="block text-sm font-semibold text-black mb-1">Remarks</label>
                        <textarea
                            id="remarks"
                            name="remarks"
                            placeholder="Any additional remarks"
                            value={order.remarks}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md text-black bg-white focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF] transition-all min-h-[100px]"
                        />
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-[#007BFF] text-white rounded-md hover:bg-blue-700 transition"
                        >
                            Update Order
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrderUpdateForm;
