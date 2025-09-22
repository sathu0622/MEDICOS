import React, { useState, useEffect } from "react";
import Header from "../pages/Header";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";


const AppointmentBooking = () => {
  const { id } = useParams();
  const [appointment, setAppointment] = useState({
    repname: '',
    contact: '',
    reason: '',
    address: '',
    company: '',
    outcome: 'Pending',
    slotId: id,
    date: '',
    atime: '',
  });
  const [slot, setSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const navigate = useNavigate();




  useEffect(() => {
    const fetchSlot = async () => {
      try {
        const allSlotsResponse = await api.get('/ScheduleOperations/getslot');
        const foundSlot = allSlotsResponse.data.find(s => s._id === id);

        if (foundSlot) {
          setSlot(foundSlot);
          const slotDate = new Date(foundSlot.slotDate);
          const formattedDate = slotDate.toISOString().split('T')[0];
          const formattedTime = `${foundSlot.start} - ${foundSlot.end}`;
          
          setAppointment(prev => ({ 
            ...prev, 
            date: formattedDate,
            atime: formattedTime
          }));
        } else {
          throw new Error('Slot not found');
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching slot:", err);
        setError(err.message || "Failed to load slot details");
        setLoading(false);
      }
    };

    fetchSlot();
  }, [id]);





  const handleChange = (event) => {
    const { name, value } = event.target;
    setAppointment(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    
    if (!appointment.repname.trim()) {
      errors.repname = "Representative name is required";
      isValid = false;
    } else if (appointment.repname.trim().length < 2) {
      errors.repname = "Name must be at least 2 characters";
      isValid = false;
    }

   
    if (!appointment.contact.trim()) {
      errors.contact = "Contact email is required";
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(appointment.contact)) {
      errors.contact = "Please enter a valid email address";
      isValid = false;
    }

  
    if (!appointment.reason.trim()) {
      errors.reason = "Description is required";
      isValid = false;
    } else if (appointment.reason.trim().length < 10) {
      errors.reason = "Description must be at least 10 characters";
      isValid = false;
    }

   
    if (!appointment.address.trim()) {
      errors.address = "Address is required";
      isValid = false;
    } else if (appointment.address.trim().length < 10) {
      errors.address = "Address must be at least 10 characters";
      isValid = false;
    }

    // Company validation
    if (!appointment.company.trim()) {
      errors.company = "Company name is required";
      isValid = false;
    } else if (appointment.company.trim().length < 2) {
      errors.company = "Company name must be at least 2 characters";
      isValid = false;
    }

    // Outcome validation
    if (!appointment.outcome.trim()) {
      errors.outcome = "Booking outcome is required";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };




  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!validateForm()) {
      return;
    }
  
    setSubmitLoading(true);
    setError(null);
  
    try {
      const token = localStorage.getItem('authToken');
      const userData = JSON.parse(localStorage.getItem('userData'));
  
      if (!userData?._id) {
        throw new Error('User not authenticated');
      }
  
      const bookingData = {
        userId: userData._id,
        slotId: id, 
        repname: appointment.repname.trim(),
        contact: appointment.contact.trim(),
        address: appointment.address.trim(),
        reason: appointment.reason.trim(),
        company: appointment.company.trim(),
        outcome: appointment.outcome.trim(),
        date: appointment.date,
        atime: appointment.atime, 
      };
  
     const response = await api.post(
        "/AppointmentOperations/Appointment",
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.data.success) {
        // await axios.put(
        //   `http://localhost:4000/ScheduleOperations/updateslot/${id}`,
        //   { isBooked: true },
        //   {
        //     headers: { 'Authorization': `Bearer ${token}` }
        //   }
        // );
  
        navigate('/AppointmentsPage', {
          state: {
            successMessage: response.data.message || 'Appointment booked successfully!',
            appointmentId: response.data.appointmentId
          }
        });
      }
    } catch (err) {
      console.error('Booking error:', err);
      setError(err.response?.data?.message || err.message || "Error booking appointment");
    } finally {
      setSubmitLoading(false);
    }
  };




  if (loading) return <div className="text-center mt-32">Loading slot details...</div>;
  if (error) return <div className="text-center mt-32 text-red-500">{error}</div>;
  if (!slot) return <div className="text-center mt-32 text-red-500">Slot not found</div>;

  

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 w-full z-10 bg-white shadow-md py-2">
        <Header />
      </div>

      <div className="pt-32 pb-8 px-4">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 p-6 bg-white border-r border-gray-200">
              <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Doctor Details</h1>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-gray-50">
                  <p className="text-gray-800 font-semibold">Name:</p>
                  <p className="text-gray-600">{slot.doctor}</p>
                </div>
                <div className="p-4 rounded-lg bg-gray-50">
                  <p className="text-gray-800 font-semibold">Date:</p>
                  <p className="text-gray-600">{new Date(slot.slotDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                </div>
                <div className="p-4 rounded-lg bg-gray-50">
                  <p className="text-gray-800 font-semibold">Time:</p>
                  <p className="text-gray-600">{slot.start} to {slot.end}</p>
                </div>
              </div>
            </div>

            <div className="md:w-2/3 p-8 bg-white">
              <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Make Appointment</h1>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <label className="text-gray-700 mb-1">Representative Name</label>
                      <input
                        type="text"
                        className={`p-3 border ${validationErrors.repname ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800`}
                        name="repname"
                        value={appointment.repname}
                        onChange={handleChange}
                        placeholder="Enter representative name"
                      />
                      {validationErrors.repname && <p className="text-red-500 text-sm mt-1">{validationErrors.repname}</p>}
                    </div>

                    <div className="flex flex-col">
                      <label className="text-gray-700 mb-1">Description</label>
                      <textarea
                        className={`p-3 border ${validationErrors.reason ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800`}
                        name="reason"
                        value={appointment.reason}
                        onChange={handleChange}
                        placeholder="Enter appointment reason"
                        rows={3}
                      />
                      {validationErrors.reason && <p className="text-red-500 text-sm mt-1">{validationErrors.reason}</p>}
                    </div>

                    <div className="flex flex-col">
                      <label className="text-gray-700 mb-1">Company Name</label>
                      <input
                        type="text"
                        className={`p-3 border ${validationErrors.company ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800`}
                        name="company"
                        value={appointment.company}
                        onChange={handleChange}
                        placeholder="Enter company name"
                      />
                      {validationErrors.company && <p className="text-red-500 text-sm mt-1">{validationErrors.company}</p>}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <label className="text-gray-700 mb-1">Contact Email</label>
                      <input
                        type="email"
                        className={`p-3 border ${validationErrors.contact ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800`}
                        name="contact"
                        value={appointment.contact}
                        onChange={handleChange}
                        placeholder="Enter contact email"
                      />
                      {validationErrors.contact && <p className="text-red-500 text-sm mt-1">{validationErrors.contact}</p>}
                    </div>

                    <div className="flex flex-col">
                      <label className="text-gray-700 mb-1">Personal Address</label>
                      <textarea
                        className={`p-3 border ${validationErrors.address ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800`}
                        name="address"
                        value={appointment.address}
                        onChange={handleChange}
                        placeholder="Enter your address"
                        rows={3}
                      />
                      {validationErrors.address && <p className="text-red-500 text-sm mt-1">{validationErrors.address}</p>}
                    </div>

                  
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="flex flex-col">
                    <label className="text-gray-700 mb-1">Appointment Date</label>
                    <input
                      type="text"
                      className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 text-gray-800"
                      name="date"
                      value={new Date(appointment.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                      readOnly
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-gray-700 mb-1">Time Slot</label>
                    <input
                      type="text"
                      className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 text-gray-800"
                      name="atime"
                      value={appointment.atime}
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col">
                      <label className="text-gray-700 mb-1">Booking Status</label>
                      <select
                        className={`p-3 border ${validationErrors.outcome ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none  focus:ring-blue-500 bg-white text-gray-800`}
                        name="outcome"
                        value={appointment.outcome}
                        onChange={handleChange}
                        disabled
                      >
                        <option value=""></option>
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Approved</option>
                        <option value="Treatment">Canceled</option>
                      </select>
                      {validationErrors.outcome && <p className="text-red-500 text-sm mt-1">{validationErrors.outcome}</p>}
                    </div>
                </div>

                <div className="flex space-x-4 mt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    disabled={submitLoading}
                  >
                    {submitLoading ? 'Booking...' : 'Book Appointment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;