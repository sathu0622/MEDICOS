import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import Header from '../pages/Header';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../context/AuthContext'; // use AuthContext for user info

const Available = () => {
  const { user, loading } = useContext(AuthContext); // get logged-in user
  const [slots, setSlots] = useState([]);
  const [filteredSlots, setFilteredSlots] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");

  const navigate = useNavigate();

  // Fetch available slots
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await api.get('/ScheduleOperations/getslot/available'); // Use new endpoint
        const availableSlots = response.data.filter(slot => !slot.isBooked);
        setSlots(availableSlots);
        setFilteredSlots(availableSlots);
      } catch (err) {
        console.error("Error fetching slots:", err);
        setError("Failed to load available slots");
      }
    };

    fetchSlots();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = slots;

    // Doctor name search
    if (searchQuery) {
      result = result.filter(slot =>
        slot.doctor.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Date filter
    if (dateFilter !== "all") {
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);

      result = result.filter(slot => {
        const slotDate = new Date(slot.slotDate);
        if (dateFilter === "today") return slotDate.toDateString() === today.toDateString();
        if (dateFilter === "tomorrow") return slotDate.toDateString() === tomorrow.toDateString();
        if (dateFilter === "week") {
          const nextWeek = new Date();
          nextWeek.setDate(today.getDate() + 7);
          return slotDate >= today && slotDate <= nextWeek;
        }
        return true;
      });
    }

    // Time filter
    if (timeFilter !== "all") {
      result = result.filter(slot => {
        const hour = parseInt(slot.start.split(':')[0]);
        if (timeFilter === "morning") return hour >= 6 && hour < 12;
        if (timeFilter === "afternoon") return hour >= 12 && hour < 17;
        if (timeFilter === "evening") return hour >= 17 || hour < 6;
        return true;
      });
    }

    setFilteredSlots(result);
  }, [searchQuery, dateFilter, timeFilter, slots]);

  const handleSearch = (e) => setSearchQuery(e.target.value);

  const handleBooking = async (slotId) => {
    try {
      if (!user) {
        toast.error("Please login to book an appointment");
        navigate('/login');
        return;
      }

      // Navigate to booking page; backend knows user from cookie
      navigate(`/AppointmentBooking/${slotId}`);
    } catch (err) {
      console.error("Booking error:", err);
      toast.error("Error processing booking");
    }
  };

  if (loading) return <div className="text-center p-10 text-lg text-gray-600">Loading user info...</div>;
  if (error) return <div className="text-center p-10 text-lg text-red-600">{error}</div>;
  if (filteredSlots.length === 0) return <div className="text-center p-10 text-lg text-gray-500">No available slots found</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md py-2">
        <Header />
      </div>

      <div className="pt-32 pb-8 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <input
              type="text"
              className="px-4 py-2 border border-gray-300 rounded-md w-full max-w-md bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search by Doctor's Name"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center">
              <label htmlFor="date-filter" className="mr-2 text-gray-700">Date:</label>
              <select
                id="date-filter"
                className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="week">This Week</option>
              </select>
            </div>

            <div className="flex items-center">
              <label htmlFor="time-filter" className="mr-2 text-gray-700">Time:</label>
              <select
                id="time-filter"
                className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800"
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
              >
                <option value="all">All Times</option>
                <option value="morning">Morning (6AM-12PM)</option>
                <option value="afternoon">Afternoon (12PM-5PM)</option>
                <option value="evening">Evening (5PM-6AM)</option>
              </select>
            </div>
          </div>

          {/* Slots */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSlots.map((slot, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="space-y-3">
                  <p className="text-lg font-semibold text-gray-800">
                    <span className="text-gray-600">Doctor:</span> {slot.doctor}
                  </p>
                  <p className="text-gray-700">
                    <span className="text-gray-600">Date:</span> {new Date(slot.slotDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700">
                    <span className="text-gray-600">Time:</span> {slot.start} - {slot.end}
                  </p>
                </div>

                <div className="mt-5 flex justify-between items-center">
                  <button
                    onClick={() => handleBooking(slot._id)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors flex items-center"
                  >
                    Book Appointment
                  </button>
                  <button className="text-red-500 hover:text-red-600 transition-colors" aria-label="Add to favorites">
                    <i className="far fa-heart text-xl"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Available;
