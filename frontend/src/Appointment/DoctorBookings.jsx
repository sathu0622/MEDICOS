import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { MdPictureAsPdf } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../pages/Header';
import { jsPDF } from "jspdf";
import logo from '../logo.jpg';
import { AuthContext } from '../context/AuthContext';

const DoctorBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        date: '',
        status: ''
    });
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
               
                if (!user?.email) {
                    throw new Error('Please login to view bookings');
                }

                // Get all slots for this doctor
                const slotsResponse = await api.get(
                    `/ScheduleOperations/getslot/user/${user.email}`
                );

                const slotIds = slotsResponse.data.slots.map(slot => slot._id);

                // Get all bookings for these slots
                const bookingsResponse = await api.get(
                    '/AppointmentOperations/getappointment'
                );

                // Filter bookings to only include those for this doctor's slots
                const doctorBookings = bookingsResponse.data.filter(booking => 
                    slotIds.includes(booking.slotId)
                );

                setBookings(doctorBookings);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [user]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const filteredBookings = bookings.filter(booking => {
        if (filters.date && booking.date !== filters.date) return false;
        if (filters.status && booking.outcome !== filters.status) return false;
        return true;
    });

    const generatePDF = (booking) => {
        const doc = new jsPDF();
        let y = 20;
    
        // Background and border
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, 210, 297, 'F');
        doc.setDrawColor(0);
        doc.setLineWidth(1);
        doc.rect(15, 15, 180, 267);
    
        doc.setDrawColor(150);
        doc.setLineWidth(0.5);
        doc.rect(18, 18, 174, 261);
    
        doc.addImage(logo, 'JPEG', 25, 25, 30, 30);
    
        doc.setFontSize(20);
        doc.setTextColor(0);
        doc.setFont("helvetica", "bold");
        doc.text("Booking Details", 105, 35, { align: 'center' });
    
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(80);
        doc.text("Powered by MEDICOS Platform", 105, 42, { align: 'center' });
    
        doc.setFontSize(16);
        doc.setTextColor(0);
        doc.setFont("helvetica", "bold");
        doc.text("BOOKING INFORMATION", 105, 60, { align: 'center' });
    
        const date = new Date().toLocaleDateString();
        doc.setFontSize(10);
        doc.setTextColor(80);
        doc.text(`Generated on: ${date}`, 25, 75);
        doc.text(`Ref #: ${booking._id.slice(-8)}`, 150, 75);
    
        doc.setLineWidth(0.5);
        doc.setDrawColor(0);
        doc.line(25, 80, 185, 80);
    
        y = 90;
    
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0);
        doc.setFontSize(12);
        doc.text("Patient Information", 25, y);
        y += 8;
    
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(50);
        doc.text(`Name: ${booking.repname || 'N/A'}`, 30, y);
        doc.text(`Company: ${booking.company || 'N/A'}`, 110, y);
        y += 6;
        doc.text(`Contact: ${booking.contact || 'N/A'}`, 30, y);
        doc.text(`Date: ${booking.date || 'N/A'}`, 110, y);
        y += 6;
        doc.text(`Time: ${booking.atime || 'N/A'}`, 30, y);
        y += 10;

        doc.setFont("helvetica", "bold");
        doc.text("Reason for Visit", 25, y);
        y += 6;
    
        doc.setFont("helvetica", "normal");
        doc.text(booking.reason || 'No reason provided.', 30, y);
        y += 10;
    
        doc.setFont("helvetica", "italic");
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("Thank you for using MEDICOS for your medical appointments.", 105, y, { align: 'center' });
    
        doc.save(`booking_${booking._id.slice(-8)}.pdf`);
    };

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
                <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm text-center">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Session Expired</h3>
                    <p className="text-gray-600 mb-6">Please login to view your bookings</p>
                    <Link 
                        to="/login" 
                        className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-700">Loading your bookings...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-red-600 mb-3">Error Loading Bookings</h3>
                <p className="text-gray-600 mb-5">{error}</p>
                <div className="flex space-x-3">
                    <button 
                        onClick={() => window.location.reload()}
                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                    >
                        Try Again
                    </button>
                    <button 
                        onClick={() => navigate('/')}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                    <div className="mb-4 sm:mb-0">
                        <h1 className="text-2xl font-bold text-gray-900">My Meetings</h1>
                    </div>
                    <div className="flex space-x-4">
                        <select
                            name="date"
                            value={filters.date}
                            onChange={handleFilterChange}
                            className="px-3 py-2 border border-gray-300  bg-white  text-black rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">All Dates</option>
                            {[...new Set(bookings.map(b => b.date))].map(date => (
                                <option key={date} value={date}>{date}</option>
                            ))}
                        </select>
                        <select
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                            className="px-3 py-2 border border-gray-300  bg-white  text-black  rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Canceled">Canceled</option>
                        </select>
                    </div>
                </div>

                {filteredBookings.length === 0 ? (
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6 text-center">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                />
                            </svg>
                            <h3 className="mt-2 text-lg font-medium text-gray-900">No bookings found</h3>
                            <p className="mt-1 text-sm text-gray-500">You don't have any bookings yet.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredBookings.map(booking => (
                            <div key={booking._id} className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                                <div className="px-4 py-5 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">{booking.repname}</h3>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            booking.outcome === 'Confirmed' 
                                                ? 'bg-green-100 text-green-800' 
                                                : booking.outcome === 'Canceled' 
                                                    ? 'bg-red-100 text-red-800' 
                                                    : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {booking.outcome || 'Pending'}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">{booking.company}</p>
                                </div>
                                <div className="px-4 py-5 sm:p-6">
                                    <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                                        <div className="sm:col-span-2">
                                            <dt className="text-sm font-medium text-gray-500">Reason</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{booking.reason}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Contact</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{booking.contact}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Date</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{booking.date}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Time</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{booking.atime}</dd>
                                        </div>
                                    </dl>
                                </div>
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => generatePDF(booking)}
                                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                                            title="Download PDF"
                                        >
                                            <MdPictureAsPdf className="-ml-0.5 mr-2 h-4 w-4" />
                                            PDF
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default DoctorBookings; 