import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import DoctorProfile from '../assets/DoctorProfile.png';
import { FaPen, FaTrashAlt } from 'react-icons/fa';
import Header from '../pages/Header';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../context/AuthContext'; 

const Slots = () => {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchSlots = async () => {
            try {
                if (!user?.email) {
                    throw new Error('User not authenticated');
                }

                const response = await api.get(
                    `/ScheduleOperations/getslot/user/${user.email}`
                );

                if (Array.isArray(response.data.slots)) {
                    setSlots(response.data.slots);
                } else {
                    setSlots([]);
                    toast.warn("No slots found or unexpected server response.");
                }

            } catch (err) {
                console.error("Error fetching slots:", err);
                setError(err.response?.data?.message || err.message || "Error fetching slots");
                toast.error("Failed to load slots");
            } finally {
                setLoading(false);
            }
        };

        fetchSlots();
    }, [user]);

    const handleDelete = (id) => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure you want to delete this slot?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                        
                            await api.delete(
                                `/ScheduleOperations/deleteslot/${id}`
                            );
                            setSlots(prevSlots => prevSlots.filter(slot => slot._id !== id));
                            toast.success("Slot deleted successfully!");
                        } catch (err) {
                            console.error("Error deleting slot:", err);
                            toast.error(err.response?.data?.message || "Failed to delete slot");
                        }
                    }
                },
                { label: 'No', onClick: () => {} }
            ]
        });
    };

    

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100">
                <Header />
                <div className="pt-32 pb-8 px-4 text-center">
                    <p>Loading slots...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100">
                <Header />
                <div className="pt-32 pb-8 px-4 text-center text-red-500">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md py-2">
                <Header />
            </div>

            <div className="pt-32 pb-8 px-4">
                <div className="max-w-7xl mx-auto">
                    {slots.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-gray-600 text-lg">No slots available. Create a new slot to get started.</p>
                            <Link to="/Schedule" className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
                                Add New Slot
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {slots.map(slot => (
                                <div key={slot._id} className={`flex flex-col items-center bg-white border ${slot.isBooked ? 'border-red-200' : 'border-gray-200'} p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300`}>
                                   
                                    <img src={DoctorProfile} alt="Doctor" className="w-20 h-20 rounded-full object-cover border-2 border-blue-100 mb-4" />
                                    <p className="text-lg font-semibold text-gray-800 mb-1">Dr. {slot.doctor}</p>
                                    <p className="text-gray-600 mb-2"><span className="font-medium">Date:</span> {new Date(slot.slotDate).toLocaleDateString()}</p>
                                    <p className="text-gray-600 mb-2"><span className="font-medium">Time:</span> {slot.start} - {slot.end}</p>
                                    {slot.isBooked && <p className="text-red-500 text-sm mb-2">This slot is booked</p>}
                                    
                                    
                                    <div className="flex gap-4 mt-2">
                                       <Link to={`/updateslot/${slot._id}`}>
                                       <button className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50" title="Edit" disabled={slot.isBooked}>
                                            <FaPen size={18} />
                                        </button></Link> 

                                        <button onClick={() => handleDelete(slot._id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50" title="Delete" disabled={slot.isBooked}>
                                            <FaTrashAlt size={18} />
                                        </button>
                                        
                                    </div>

                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Slots;
