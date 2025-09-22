import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const UpdateSlot = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [slotData, setSlotData] = useState({
        doctor: '',
        slotDate: '',
        start: '',
        end: '',
        dContact: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!id) return;

        api.get(`/ScheduleOperations/getslot/${id}`)
            .then(response => {
                const data = response.data;
                
             
                const formattedDate = data.slotDate ? new Date(data.slotDate).toISOString().split('T')[0] : '';
                
                // Format time for time inputs (HH:MM)
                const formatTime = (timeString) => {
                    if (!timeString) return '';
                    // If time is in format "HH:MM:SS" or similar
                    return timeString.substring(0, 5);
                };

                setSlotData({
                    doctor: data.doctor || '',
                    slotDate: formattedDate,
                    start: formatTime(data.start),
                    end: formatTime(data.end),
                    dContact: data.dContact || ''
                });
            })
            .catch(error => {
                console.error('Error fetching slot:', error);
                alert('Failed to load slot data. Check console for more details.');
            });
    }, [id]);

    const validateForm = () => {
       

        let newErrors = {};
        const today = new Date().toISOString().split('T')[0];

        if (!slotData.doctor.trim()) {
            newErrors.doctor = "Doctor's name is required.";
        }

        if (!slotData.slotDate) {
            newErrors.slotDate = "Date is required.";
        } else if (slotData.slotDate < today) {
            newErrors.slotDate = "Date cannot be in the past.";
        }

        if (!slotData.start) {
            newErrors.start = "Start time is required.";
        }

        if (!slotData.end) {
            newErrors.end = "End time is required.";
        }

        if (slotData.start && slotData.end) {
            const startTime = new Date(`2000-01-01T${slotData.start}`);
            const endTime = new Date(`2000-01-01T${slotData.end}`);
            
            if (startTime >= endTime) {
                newErrors.time = "Start time must be before end time.";
            } else {
                const diffInMinutes = (endTime - startTime) / (1000 * 60);
                if (diffInMinutes < 30) {
                    newErrors.time = "Time slot must be at least 30 minutes long.";
                }
            }
        }

        if (!slotData.dContact.trim()) {
            newErrors.dContact = "Contact is required.";
        } else if (!/^\d{10}$/.test(slotData.dContact)) {
            newErrors.dContact = "Invalid contact number (must be 10 digits).";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (event) => {
        setSlotData({ ...slotData, [event.target.name]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!validateForm()) return;

        api.put(`/ScheduleOperations/updateslot/${id}`, slotData)
            .then(() => {
                alert("Slot Updated Successfully!");
                navigate('/slots');
            })
            .catch(error => alert(error.response?.data?.message || "Error updating slot!"));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 pt-24 pb-8">
                <div className="flex justify-center">
                    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl border border-gray-100">
                        <h1 className="text-center text-2xl font-bold text-[#007BFF] mb-6">Update Slot</h1>
                        
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Doctor's Name"
                                    name="doctor"
                                    value={slotData.doctor}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-[#007BFF] rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF] bg-white text-gray-800"
                                />
                                {errors.doctor && <p className="mt-1 text-red-500 text-sm">{errors.doctor}</p>}
                            </div>
                            
                            <div>
                                <input
                                    type="date"
                                    name="slotDate"
                                    value={slotData.slotDate}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-[#007BFF] rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF] bg-white text-gray-800"
                                />
                                {errors.slotDate && <p className="mt-1 text-red-500 text-sm">{errors.slotDate}</p>}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <input
                                        type="time"
                                        name="start"
                                        value={slotData.start}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-[#007BFF] rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF] bg-white text-gray-800"
                                    />
                                    {errors.start && <p className="mt-1 text-red-500 text-sm">{errors.start}</p>}
                                </div>
                                <div>
                                    <input
                                        type="time"
                                        name="end"
                                        value={slotData.end}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-[#007BFF] rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF] bg-white text-gray-800"
                                    />
                                    {errors.end && <p className="mt-1 text-red-500 text-sm">{errors.end}</p>}
                                </div>
                            </div>
                            {errors.time && <p className="text-red-500 text-sm">{errors.time}</p>}
                            
                            <div>
                                <input
                                    type="text"
                                    placeholder="Contact (10 digits)"
                                    name="dContact"
                                    value={slotData.dContact}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-[#007BFF] rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF] bg-white text-gray-800"
                                />
                                {errors.dContact && <p className="mt-1 text-red-500 text-sm">{errors.dContact}</p>}
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-4 pt-2">
                                <button
                                    type="submit"
                                    className="w-full py-3 px-6 bg-[#007BFF] text-white rounded-lg hover:bg-[#0069d9] transition-colors font-medium"
                                >
                                    Update
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate('/Slots')}
                                    className="w-full py-3 px-6 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateSlot;