
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaCheck, FaTimes, FaSearch, FaFilter } from 'react-icons/fa';

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editOutcome, setEditOutcome] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, statusFilter]);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:4000/AppointmentOperations/getappointment');
      setBookings(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let results = bookings;
  
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(booking =>
        booking.repname.toLowerCase().includes(term) ||
        booking.company.toLowerCase().includes(term) ||
        booking.contact.toLowerCase().includes(term) ||
        booking.reason.toLowerCase().includes(term)
      );
    }
  
    // Apply status filter
    if (statusFilter !== 'All') {
      results = results.filter(booking => booking.outcome === statusFilter);
    }
  
    setFilteredBookings(results);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:4000/AppointmentOperations/deleteappointment/${id}`);
      setBookings(bookings.filter(booking => booking._id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete booking');
    }
  };

  const handleEdit = (booking) => {
    setEditingId(booking._id);
    setEditOutcome(booking.outcome);
  };

  const handleSave = async (id) => {
    try {
      const booking = bookings.find(b => b._id === id);
      const updatedBooking = { ...booking, outcome: editOutcome };
      
      await axios.put(`http://localhost:4000/AppointmentOperations/update/${id}`, updatedBooking);
      
      setBookings(bookings.map(booking => 
        booking._id === id ? { ...booking, outcome: editOutcome } : booking
      ));
      
      setEditingId(null);
      setEditOutcome('');
    } catch (err) {
      setError(err.message || 'Failed to update booking');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditOutcome('');
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading bookings...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">All Bookings</h1>
        
        {/* Search and Filter Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search bookings..."
                className="block w-full pl-10 pr-3 text-black py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <FaFilter className="text-gray-400 mr-2" />
                <select
                  className="border border-gray-300 text-black rounded-md px-3 py-2 bg-white text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Approved</option>
                  <option value="Canceled">Canceled</option>
                </select>
              </div>
              
              <button
                onClick={resetFilters}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Reset
              </button>
            </div>
          </div>
          
          <div className="mt-2 text-sm text-gray-500">
            Showing {filteredBookings.length} of {bookings.length} bookings
          </div>
        </div>
        
        {filteredBookings.length === 0 ? (
          <div className="text-center text-gray-600 py-8 bg-white rounded-lg shadow">
            No bookings match your search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Representative
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purpose
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.repname}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(booking.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.atime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.contact}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.company}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {editingId === booking._id ? (
                        <div className="flex items-center space-x-2">
                          <select
                            value={editOutcome}
                            onChange={(e) => setEditOutcome(e.target.value)}
                            className="border border-gray-300 bg-white rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Approved</option>
                            <option value="Canceled">Canceled</option>
                          </select>
                          <button
                            onClick={() => handleSave(booking._id)}
                            className="text-green-600 hover:text-green-900"
                            title="Save"
                          >
                            <FaCheck size={16} />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="text-red-600 hover:text-red-900"
                            title="Cancel"
                          >
                            <FaTimes size={16} />
                          </button>
                        </div>
                      ) : (
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.outcome === 'Confirmed' ? 'bg-green-100 text-green-800' :
                          booking.outcome === 'Canceled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.outcome || 'Pending'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(booking)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                        title="Edit outcome"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(booking._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete booking"
                      >
                        <FaTrash size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBookings;