import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateAppointmentPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [appointment, setAppointment] = useState({
        repname: '',
        contact: '',
        dname: '',
        reason: '',
        address: '',
        company: '',
        outcome: ''
    });

    useEffect(() => {
        axios.get(`http://localhost:4000/AppointmentOperations/get/${id}`)
            .then(result => {
                setAppointment(result.data);
            })
            .catch(err => console.log(err));
    }, [id]);

    const handleChange = (e) => {
        setAppointment({
            ...appointment,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:4000/AppointmentOperations/update/${id}`, appointment)
            .then(() => {
                alert('Appointment Updated!');
                navigate('/AppointmentsPage');
            })
            .catch(err => console.log(err));
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="w-full max-w-md mx-3"> {/* Reduced max width */}
                <div className="bg-white p-5 sm:p-6 rounded-lg shadow-md border border-gray-100"> {/* Reduced padding */}
                    <h2 className="text-xl font-bold text-[#007BFF] mb-4 text-center">Update Appointment</h2> {/* Smaller text */}
                    <form onSubmit={handleSubmit} className="space-y-4"> {/* Reduced spacing */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"> {/* Reduced gap */}
                            <div className="space-y-1"> {/* Reduced spacing */}
                                <label className="block text-sm font-medium text-gray-700">Representative Name:</label>
                                <input
                                    type="text"
                                    name="repname"
                                    value={appointment.repname}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BFF] bg-white" /* Reduced padding, black text */
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Contact Email:</label>
                                <input
                                    type="email"
                                    name="contact"
                                    value={appointment.contact}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BFF] bg-white"
                                />
                            </div>
                            <div className="space-y-1 sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Purpose:</label>
                                <input
                                    type="text"
                                    name="reason"
                                    value={appointment.reason}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BFF] bg-white"
                                />
                            </div>
                            <div className="space-y-1 sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Address:</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={appointment.address}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BFF] bg-white"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Company Name:</label>
                                <input
                                    type="text"
                                    name="company"
                                    value={appointment.company}
                                    onChange={handleChange}
                                    className="w-full p-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BFF] bg-white"
                                />
                            </div>
                            <div className="space-y-1 sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Appointment Status:</label>
                                <input
                                    name="outcome"
                                    value={appointment.outcome}
                                    onChange={handleChange}
                                    readOnly
                                    className="w-50 p-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BFF] bg-white min-h-[10px]" /* Reduced min-height */
                                />
                            </div>
                        </div>
                        <div className="pt-2"> {/* Reduced padding */}
                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-[#007BFF] text-white font-medium rounded-md hover:bg-[#0056b3] transition-colors focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-[#007BFF]" /* Reduced padding */
                            >
                                Update Appointment
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateAppointmentPage;