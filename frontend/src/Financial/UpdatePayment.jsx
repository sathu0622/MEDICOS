import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const UpdatePayment = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const { authToken } = useContext(AuthContext);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [payment, setPayment] = useState({
        Repname: '',
        email: '',
        Contactno: '',
        BookRef: '',
        payRef: '',
        cnum: '',
        type: '',
        cmonth: '',
        cyear: '',
        cvv: ''
    });

    useEffect(() => {
        const fetchPayment = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:4000/PaymentOperations/getpay/${id}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${authToken}`
                        }
                    }
                );
                setPayment(response.data);
            } catch (err) {
                console.error('Error fetching payment:', err);
                alert('Failed to load payment details');
                navigate('/PayTable');
            }
        };
        fetchPayment();
    }, [id, navigate, authToken]);

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/;

        if (!payment.Repname.trim()) newErrors.Repname = 'Representative name is required';
        if (!payment.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(payment.email)) {
            newErrors.email = 'Invalid email format';
        }
        if (!payment.Contactno.trim()) {
            newErrors.Contactno = 'Contact number is required';
        } else if (!phoneRegex.test(payment.Contactno)) {
            newErrors.Contactno = 'Invalid phone number (10 digits required)';
        }
        if (!payment.BookRef.trim()) newErrors.BookRef = 'Booking reference is required';
        if (!payment.payRef.trim()) newErrors.payRef = 'Payment reference is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setPayment(prev => ({ ...prev, [name]: value }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        try {
            await axios.put(
                `http://localhost:4000/PaymentOperations/updatepay/${id}`,
                {
                    ...payment,
                    // Never send CVV or full card number in updates
                    cvv: undefined,
                    cnum: payment.cnum.slice(-4) // Only last 4 digits
                },
                {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            alert("Payment details updated successfully!");
            navigate('/UserPayments');
        } catch (err) {
            console.error("Update error:", err);
            alert(err.response?.data?.message || "Failed to update payment details");
        } finally {
            setIsSubmitting(false);
        }
    };


        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl p-6 md:p-8">
                    <h1 className="text-2xl font-bold text-center mb-6 text-[#007bff]">
                        Update Payment Details
                    </h1>
                    
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Representative Details */}
                        <div className="border border-gray-300 rounded-lg p-6 bg-white">
                            <h3 className="text-xl font-semibold text-center mb-6 uppercase">
                                Medical Representative Details
                            </h3>
                            
                            <div className="space-y-4">
                                {['Repname', 'email', 'Contactno', 'BookRef', 'payRef'].map((field) => (
                                    <div key={field}>
                                        <label className="block text-gray-700 mb-1 capitalize">
                                            {field === 'Repname' ? 'Representative Name' : 
                                             field === 'Contactno' ? 'Contact Number' : 
                                             field === 'BookRef' ? 'Booking Reference' : 
                                             field === 'payRef' ? 'Payment Reference' : 
                                             field}
                                        </label>
                                        <input 
                                            type={
                                                field === 'email' ? 'email' : 
                                                field === 'Contactno' ? 'tel' : 'text'
                                            }
                                            name={field}
                                            value={payment[field]}
                                            onChange={handleChange}
                                            className={`w-full p-3 border rounded-md bg-white text-black ${
                                                errors[field] ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            required
                                        />
                                        {errors[field] && (
                                            <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
        
                        {/* Card Details (Read-only) */}
                        <div className="border border-gray-300 rounded-lg p-6 bg-white">
                            <h3 className="text-xl font-semibold text-center mb-6 uppercase">
                                Card Details
                            </h3>
        
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 mb-1">Card Number</label>
                                    <input
                                        type="text"
                                        value={`•••• •••• •••• ${payment.cnum?.slice(-4) || ''}`}
                                        readOnly
                                        className="w-full p-3 border border-gray-300 rounded-md bg-white text-black cursor-not-allowed"
                                    />
                                </div>
        
                                <div>
                                    <label className="block text-gray-700 mb-1">Card Type</label>
                                    <input
                                        type="text"
                                        value={payment.type || ''}
                                        readOnly
                                        className="w-full p-3 border border-gray-300 rounded-md bg-white text-black cursor-not-allowed"
                                    />
                                </div>
        
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 mb-1">Expiry Date</label>
                                        <input
                                            type="text"
                                            value={payment.cmonth && payment.cyear ? 
                                                `${payment.cmonth}/${payment.cyear}` : ''}
                                            readOnly
                                            className="w-full p-3 border border-gray-300 rounded-md bg-white text-black cursor-not-allowed"
                                        />
                                    </div>
                                </div>
        
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className={`w-full mt-6 py-3 px-4 text-white rounded-lg font-bold uppercase transition-colors ${
                                        isSubmitting ? 'bg-gray-400' : 'bg-[#007bff] hover:bg-[#0056b3]'
                                    }`}
                                >
                                    {isSubmitting ? 'Updating...' : 'Update Details'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
};

export default UpdatePayment;