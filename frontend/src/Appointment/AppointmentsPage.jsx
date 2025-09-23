import React, { useState, useEffect, useContext } from "react";
import api from "../services/api";
import { MdDelete, MdPictureAsPdf, MdEdit, MdPayment, MdFilterList } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import Header from "../pages/Header";
import { jsPDF } from "jspdf";
import logo from "../logo.jpg";
import { AuthContext } from "../context/AuthContext";

const AppointmentsPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        date: '',
        outcome: ''
    });
    const [showFilters, setShowFilters] = useState(false);
    const navigate = useNavigate();

    const { user, loading: authLoading } = useContext(AuthContext);

    useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (!user) return;

        const res = await api.get(`/AppointmentOperations/getappointment/user/${user._id}`);
        setAppointments(res.data.appointments || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchAppointments();
  }, [user]);

    // useEffect(() => {
    //     const fetchAppointments = async () => {
    //         try {
    //             const token = localStorage.getItem('authToken');
    //             const userData = JSON.parse(localStorage.getItem('userData'));
                
    //             if (!token || !userData) {
    //                 throw new Error('Please login to view appointments');
    //             }

    //             const userId = userData.userId || userData._id;
    //             if (!userId) throw new Error('User ID not found');

    //             const response = await api.get(
    //                 `/AppointmentOperations/getappointment/user/${userId}`
    //             )

    //             setAppointments(response.data.appointments || []);
    //         } catch (err) {
    //             setError(err.response?.data?.message || err.message);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchAppointments();
    // }, []);

    // useEffect(() => {
    //     // Apply filters whenever appointments or filters change
    //     let filtered = [...appointments];
        
    //     if (filters.date) {
    //         filtered = filtered.filter(appt => appt.date === filters.date);
    //     }
        
    //     if (filters.outcome) {
    //         filtered = filtered.filter(appt => appt.outcome === filters.outcome);
    //     }
        
    //     setFilteredAppointments(filtered);
    // }, [appointments, filters]);

    // const handleFilterChange = (e) => {
    //     const { name, value } = e.target;
    //     setFilters(prev => ({
    //         ...prev,
    //         [name]: value
    //     }));
    // };

    // const resetFilters = () => {
    //     setFilters({
    //         date: '',
    //         outcome: ''
    //     });
    // };

    // const handleDelete = async (id) => {
    //     if (!window.confirm('Are you sure you want to delete this appointment?')) return;
        
    //     try {
    //         const token = localStorage.getItem('authToken');
    //         await api.delete(
    //             `/AppointmentOperations/deleteappointment/${id}`
    //         );
    //         setAppointments(appointments.filter(appt => appt._id !== id));
    //     } catch (err) {
    //         alert(err.response?.data?.message || 'Failed to delete appointment');
    //     }
    // };

    useEffect(() => {
    // Filter appointments
    let filtered = [...appointments];
    if (filters.date) filtered = filtered.filter(a => a.date === filters.date);
    if (filters.outcome) filtered = filtered.filter(a => a.outcome === filters.outcome);
    setFilteredAppointments(filtered);
  }, [appointments, filters]);

  const handleFilterChange = e => setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const resetFilters = () => setFilters({ date: "", outcome: "" });

  const handleDelete = async id => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    try {
      await api.delete(`/AppointmentOperations/deleteappointment/${id}`);
      setAppointments(prev => prev.filter(a => a._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete appointment");
    }
  };

    const generatePDF = (appointment) => {
        const doc = new jsPDF();
        let y = 20;
    
        // Background and border
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, 210, 297, 'F');
        doc.setDrawColor(0); // Black border
        doc.setLineWidth(1);
        doc.rect(15, 15, 180, 267);
    
        doc.setDrawColor(150); // Inner light gray
        doc.setLineWidth(0.5);
        doc.rect(18, 18, 174, 261);
    
        // Add logo with correct format
        doc.addImage(logo, 'JPEG', 25, 25, 30, 30);
    
        doc.setFontSize(20);
        doc.setTextColor(0);
        doc.setFont("helvetica", "bold");
        doc.text("Appointment Summary", 105, 35, { align: 'center' });
    
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(80);
        doc.text("Powered by MEDICOS Platform", 105, 42, { align: 'center' });
    
        doc.setFontSize(16);
        doc.setTextColor(0);
        doc.setFont("helvetica", "bold");
        doc.text("APPOINTMENT DETAILS", 105, 60, { align: 'center' });
    
        const date = new Date().toLocaleDateString();
        doc.setFontSize(10);
        doc.setTextColor(80);
        doc.text(`Generated on: ${date}`, 25, 75);
        doc.text(`Ref #: ${appointment._id.slice(-8)}`, 150, 75);
    
        doc.setLineWidth(0.5);
        doc.setDrawColor(0);
        doc.line(25, 80, 185, 80);
    
        y = 90;
    
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0);
        doc.setFontSize(12);
        doc.text("Appointment Information", 25, y);
        y += 8;
    
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(50);
        doc.text(`Representative: ${appointment.repname || 'N/A'}`, 30, y);
        doc.text(`Company: ${appointment.company || 'N/A'}`, 110, y);
        y += 6;
        doc.text(`Contact: ${appointment.contact || 'N/A'}`, 30, y);
        doc.text(`Date: ${appointment.date || 'N/A'}`, 110, y);
        y += 6;
        doc.text(`Time: ${appointment.atime || 'N/A'}`, 30, y);
        y += 10;

        doc.setFont("helvetica", "bold");
        doc.text("Reason for Appointment", 25, y);
        y += 6;
    
        doc.setFont("helvetica", "normal");
        doc.text(appointment.reason || 'No reason provided.', 30, y);
        y += 10;
    
        doc.setFont("helvetica", "italic");
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("Thank you for using MEDICOS to schedule your appointment.", 105, y, { align: 'center' });
    
        doc.save(`appointment_${appointment._id.slice(-8)}.pdf`);
    };
    
    // if (!localStorage.getItem('authToken')) {
    if (authLoading || loading){
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
                <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm text-center">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Session Expired</h3>
                    <p className="text-gray-600 mb-6">Please login to view your appointments</p>
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
                <p className="text-gray-700">Loading your appointments...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-red-600 mb-3">Error Loading Appointments</h3>
                <p className="text-gray-600 mb-5">{error}</p>
                <div className="flex space-x-3">
                    <button 
                        onClick={() => window.location.reload()}
                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                    >
                        Try Again
                    </button>
                    <button 
                        onClick={() => navigate('/Userhome')}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        </div>
    );

    // Get unique dates and outcomes for filter dropdowns
    const uniqueDates = [...new Set(appointments.map(appt => appt.date))];
    const uniqueOutcomes = [...new Set(appointments.map(appt => appt.outcome).filter(Boolean))];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                    <div className="flex space-x-3 w-full sm:w-auto">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
                        >
                            Back
                        </button>
                    </div>
                    
                    <div className="mt-4 sm:mt-0 w-full sm:w-auto">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="w-full sm:w-auto flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                        >
                            <MdFilterList className="mr-2" />
                            {showFilters ? 'Hide Filters' : 'Show Filters'}
                        </button>
                    </div>
                </div>

                {showFilters && (
                    <div className="bg-white shadow rounded-lg p-4 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="date-filter" className="block text-sm font-medium text-black mb-1">
                                    Filter by Date
                                </label>
                                <select
                                    id="date-filter"
                                    name="date"
                                    value={filters.date}
                                    onChange={handleFilterChange}
                                    className="w-full pl-3 pr-10 py-2 text-black text-base border bg-white border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                >
                                    <option value="">All Dates</option>
                                    {uniqueDates.map(date => (
                                        <option key={date} value={date}>{date}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <label htmlFor="outcome-filter" className="block text-sm font-medium text-black bg-white text-blck mb-1">
                                    Filter by Outcome
                                </label>
                                <select
                                    id="outcome-filter"
                                    name="outcome"
                                    value={filters.outcome}
                                    onChange={handleFilterChange}
                                    className="w-full pl-3 pr-10 py-2 text-black  text-base border bg-white border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                >
                                    <option value="">All Outcomes</option>
                                    {uniqueOutcomes.map(outcome => (
                                        <option key={outcome} value={outcome}>{outcome}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="flex items-end">
                                <button
                                    onClick={resetFilters}
                                    className="w-18 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-700 focus:outline-none"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {filteredAppointments.length === 0 ? (
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
                            <h3 className="mt-2 text-lg font-medium text-gray-900">
                                {appointments.length === 0 ? 'No appointments' : 'No matching appointments'}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {appointments.length === 0 
                                    ? "You haven't scheduled any appointments yet." 
                                    : "No appointments match your current filters."}
                            </p>
                            <div className="mt-6">
                                {appointments.length === 0 ? (
                                    <button
                                        onClick={() => navigate('/Available')}
                                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                                    >
                                        Book New Appointment
                                    </button>
                                ) : (
                                    <button
                                        onClick={resetFilters}
                                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                                    >
                                        Reset Filters
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredAppointments.map(appt => (
                            <div key={appt._id} className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                                <div className="px-4 py-5 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">{appt.repname}</h3>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            appt.outcome === 'Successful' 
                                                ? 'bg-green-100 text-green-800' 
                                                : appt.outcome === 'Failed' 
                                                    ? 'bg-red-100 text-red-800' 
                                                    : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {appt.outcome || 'Pending'}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">{appt.company}</p>
                                </div>
                                <div className="px-4 py-5 sm:p-6">
                                    <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                                        <div className="sm:col-span-2">
                                            <dt className="text-sm font-medium text-gray-500">Reason</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{appt.reason}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Contact</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{appt.contact}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Date</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{appt.date}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Time</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{appt.atime}</dd>
                                        </div>
                                    </dl>
                                </div>
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex justify-end space-x-3">
                                        <button
                                            onClick={() => generatePDF(appt)}
                                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                                            title="Download PDF"
                                        >
                                            <MdPictureAsPdf className="-ml-0.5 mr-2 h-4 w-4" />
                                            PDF
                                        </button>
                                        <Link 
                                            to={`/Payment`}
                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                                        >
                                            <MdPayment className="-ml-0.5 mr-2 h-4 w-4" />
                                            Pay
                                        </Link>
                                        <Link 
                                            to={`/UpdateAppointmentPage/${appt._id}`}
                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none"
                                        >
                                            <MdEdit className="-ml-0.5 mr-2 h-4 w-4" />
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(appt._id)}
                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                                        >
                                            <MdDelete className="-ml-0.5 mr-2 h-4 w-4" />
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

export default AppointmentsPage;