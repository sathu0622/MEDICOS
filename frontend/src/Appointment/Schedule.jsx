// src/components/Schedule.js (updated)
import React, { useState, useEffect } from 'react';
import Doctorprofile from '../assets/DoctorProfile.png';
import api from '../services/api'; // Import our API service
import { useNavigate } from 'react-router-dom';
import Header from '../pages/Header';

const Schedule = () => {
    const [formData, setFormData] = useState({
        doctor: '',
        slotDate: '',
        start: '',
        end: '',
        dContact: ''
    });

    const [slots, setSlots] = useState([]);
    const [errors, setErrors] = useState({});
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Set the doctor name from logged-in user
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData?.name) {
            setFormData(prev => ({
                ...prev,
                doctor: userData.name
            }));
        }
        
        // Fetch slots using our API service
        const fetchSlots = async () => {
            try {
                const response = await api.get('/ScheduleOperations/getslot');
                setSlots(response.data);
            } catch (err) {
                console.error('Error fetching slots:', err);
            }
        };
        
        fetchSlots();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        let newErrors = {};
        const today = new Date().toISOString().split('T')[0];

        if (!formData.doctor.trim()) {
            newErrors.doctor = "Doctor's name is required.";
        }

        if (!formData.slotDate) {
            newErrors.slotDate = "Date is required.";
        } else if (formData.slotDate < today) {
            newErrors.slotDate = "Date cannot be in the past.";
        }

        if (!formData.start) {
            newErrors.start = "Start time is required.";
        }

        if (!formData.end) {
            newErrors.end = "End time is required.";
        }

        if (formData.start && formData.end) {
            const startTime = new Date(`2000-01-01T${formData.start}`);
            const endTime = new Date(`2000-01-01T${formData.end}`);
            
            if (startTime >= endTime) {
                newErrors.time = "Start time must be before end time.";
            } else {
                const diffInMinutes = (endTime - startTime) / (1000 * 60);
                if (diffInMinutes < 30) {
                    newErrors.time = "Time slot must be at least 30 minutes long.";
                }
            }
        }

        if (!formData.dContact.trim()) {
            newErrors.dContact = "Contact is required.";
        } else if (!/^\d{10}$/.test(formData.dContact)) {
            newErrors.dContact = "Invalid contact number (must be 10 digits).";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;
        
        setSubmitLoading(true);
        setError(null);

        try {
            const userData = JSON.parse(localStorage.getItem('userData'));
            console.log('User Data:', userData);
            console.log('Data:', userData?.id);
            if (!userData?.id) {
                throw new Error('User not authenticated');
            }

            const response = await api.post(
                '/ScheduleOperations/Schedule', 
                {
                    userId: userData.id,
                    ...formData
                }
            );

            if (response.status === 201) {
                alert('Slot added successfully!');
                navigate('/Slots');
                setFormData({
                    doctor: '',
                    slotDate: '',
                    start: '',
                    end: '',
                    dContact: ''
                });
            }
        } catch (err) {
            console.error('Slot added error:', err);
            setError(err.response?.data?.message || err.message || "Error adding slot!");
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white"> 
           <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md py-2">
                <Header />
            </div>
            
            <div className="container mx-auto px-4 py-8 mt-10">
                <div className="flex flex-col lg:flex-row justify-center items-start gap-8 w-full max-w-6xl mx-auto pt-16">
                    {/* Add Slot Form */}
                    <div className="bg-white p-8 rounded-xl shadow-md w-full lg:w-1/2 max-w-lg border border-gray-100">
                        <h1 className="text-center text-2xl font-bold text-[#007BFF] mb-6">Add Slot</h1>

                        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div className="space-y-5">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Doctor-Name"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF] transition-all bg-white text-black"
                                        name="doctor"
                                        value={formData.doctor}
                                        onChange={handleChange}
                                    />
                                    {errors.doctor && <p className="mt-1 text-red-500 text-sm">{errors.doctor}</p>}
                                </div>

                                <div>
                                    <input
                                        type="date"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF] transition-all bg-white text-black"
                                        name="slotDate"
                                        value={formData.slotDate}
                                        onChange={handleChange}
                                    />
                                    {errors.slotDate && <p className="mt-1 text-red-500 text-sm">{errors.slotDate}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <input
                                            type="time"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF] transition-all bg-white text-black"
                                            name="start"
                                            value={formData.start}
                                            onChange={handleChange}
                                        />
                                        {errors.start && <p className="mt-1 text-red-500 text-sm">{errors.start}</p>}
                                    </div>

                                    <div>
                                        <input
                                            type="time"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF] transition-all bg-white text-black"
                                            name="end"
                                            value={formData.end}
                                            onChange={handleChange}
                                        />
                                        {errors.end && <p className="mt-1 text-red-500 text-sm">{errors.end}</p>}
                                    </div>
                                </div>
                                {errors.time && <p className="text-red-500 text-sm">{errors.time}</p>}

                                <div>
                                    <input
                                        type="text"
                                        placeholder="Contact (10 digits)"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF] transition-all bg-white text-black"
                                        name="dContact"
                                        value={formData.dContact}
                                        onChange={handleChange}
                                        maxLength="10"
                                    />
                                    {errors.dContact && <p className="mt-1 text-red-500 text-sm">{errors.dContact}</p>}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
                                <button 
                                    type="submit" 
                                    className="w-full py-3 px-6 bg-[#007BFF] text-white rounded-lg hover:bg-[#0069d9] transition-colors font-medium"
                                    disabled={submitLoading}
                                >
                                    {submitLoading ? 'Processing...' : 'Confirm'}
                                </button>
                                <button 
                                    type="button" 
                                    className="w-full py-3 px-6 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                                    onClick={() => navigate('/Profile')}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Doctor Profile Display */}
                    <div className="bg-white p-8 rounded-xl shadow-md w-full lg:w-1/2 max-w-lg border border-gray-100">
                        <div className="flex flex-col items-center space-y-6">
                            <div className="flex justify-center mb-2">
                                <img 
                                    src={Doctorprofile} 
                                    alt="Doctor" 
                                    className="w-40 h-40 rounded-full border-4 border-[#007BFF]/20 object-cover shadow-sm"
                                />
                            </div>
                            
                            <div className="w-full space-y-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-gray-800"><span className="font-semibold text-[#007BFF]">Name:</span> {formData.doctor || 'Not specified'}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-gray-800"><span className="font-semibold text-[#007BFF]">Date:</span> {formData.slotDate || 'Not specified'}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-gray-800">
                                        <span className="font-semibold text-[#007BFF]">Time:</span> 
                                        {formData.start && formData.end 
                                            ? ` ${formData.start} to ${formData.end}`
                                            : ' Not specified'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Schedule;