import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCreditCard, FaUser, FaEnvelope, FaPhone, FaFileAlt, FaLock } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

const Payment = () => {
   const { user, token } = useContext(AuthContext); 
  const [payment, setPayment] = useState({
    Repname: "",
    email: "",
    Contactno: "",
    BookRef: "",
    payRef: "",
    cnum: "",
    type: "",
    cmonth: "",
    cyear: "",
    cvv: ""
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
   
    if (user) {
      setPayment((prev) => ({
        ...prev,
        Repname: user.name || "",
        email: user.email || "",
        Contactno: user.mobile || ""
      }));
    }
  }, [user]);

  // Helper to format card number with spaces
  function formatCardNumber(value) {
    return value.replace(/\D/g, "") // Remove non-digits
      .replace(/(.{4})/g, "$1 ")    // Add space every 4 digits
      .trim();
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "cnum") {
      // Only allow digits, format with spaces
      const digits = value.replace(/\D/g, "").slice(0, 16);
      setPayment({ ...payment, cnum: digits });
      if (errors[name]) {
        setErrors({ ...errors, [name]: "" });
      }
    } else {
      setPayment({ ...payment, [name]: value });
      if (errors[name]) {
        setErrors({ ...errors, [name]: "" });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const cardRegex = /^\d{16}$/;
    const cvvRegex = /^\d{3}$/;

    if (!payment.Repname.trim()) newErrors.Repname = "Representative name is required";
    if (!payment.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(payment.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!payment.Contactno.trim()) {
      newErrors.Contactno = "Contact number is required";
    } else if (!phoneRegex.test(payment.Contactno)) {
      newErrors.Contactno = "Must be 10 digits";
    }
    if (!payment.BookRef.trim()) newErrors.BookRef = "Booking reference is required";
    if (!payment.payRef.trim()) newErrors.payRef = "Payment reference is required";
    if (!payment.cnum.trim()) {
      newErrors.cnum = "Card number is required";
    } else if (!cardRegex.test(payment.cnum)) {
      newErrors.cnum = "Must be 16 digits";
    }
    if (!payment.type) newErrors.type = "Card type is required";
    if (!payment.cmonth) newErrors.cmonth = "Month is required";
    if (!payment.cyear) newErrors.cyear = "Year is required";
    if (!payment.cvv.trim()) {
      newErrors.cvv = "CVV is required";
    } else if (!cvvRegex.test(payment.cvv)) {
      newErrors.cvv = "Must be 3 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!validateForm()) return;
     if (!user?._id) {
      setErrors({ form: "User not authenticated" });
      return;
    }
  
    setSubmitLoading(true);
    setErrors({});
  
    try {
    
      const paymentData = {
        userId: user._id,
        Repname: payment.Repname.trim(),
        email: payment.email.trim(),
        Contactno: payment.Contactno.trim(),
        BookRef: payment.BookRef.trim(),
        payRef: payment.payRef.trim(),
        cnum: payment.cnum.trim(),
        type: payment.type,
        cmonth: payment.cmonth,
        cyear: payment.cyear,
        cvv: payment.cvv
      };
  
      const response = await axios.post(
        'http://localhost:4000/PaymentOperations/pay',
        paymentData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (response.data && response.data.success) {
        navigate('/Profile', {
          state: { 
            successMessage: 'Payment processed successfully!',
            paymentId: response.data.paymentId
          }
        });
      } else {
        throw new Error(response.data?.message || 'Payment failed');
      }
    } catch (err) {
      setErrors({ form: err.response?.data?.message || err.message || "Error processing payment" });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
  //   <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
  //     <div className="bg-white rounded-xl shadow-lg w-full max-w-6xl p-6">
  //       {errors.form && (
  //         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
  //           {errors.form}
  //         </div>
  //       )}
        
  //       <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
  //         {/* Appointment Details Section */}
  //         {/* <div className="border border-black rounded-lg p-6 bg-white">
  //           <h3 className="text-xl font-semibold text-black text-center mb-6 uppercase">Appointment DETAILS</h3>
  //           <h3 className="text-xl font-semibold text-black text-center mb-6 uppercase">Doctor Details</h3>
  //         </div> */}

  //         {/* Medical Representative Details Section */}
  //         <div className="border border-black rounded-lg p-6 bg-white">
  //           <h3 className="text-xl font-semibold text-black text-center mb-6 uppercase">User DETAILS</h3>
            
  //           <div className="space-y-4">
  //             <div>
  //               <input 
  //                 type="text" 
  //                 name="Repname" 
  //                 placeholder=" Name" 
  //                 value={payment.Repname}
  //                 onChange={handleChange}
  //                 className={`w-full p-3 border rounded-md ${errors.Repname ? "border-red-500" : "border-black"} bg-white text-black uppercase`}
  //               />
  //               {errors.Repname && <p className="text-red-500 text-sm mt-1">{errors.Repname}</p>}
  //             </div>

  //             <div>
  //               <input 
  //                 type="email" 
  //                 name="email" 
  //                 placeholder="Email" 
  //                 value={payment.email}
  //                 onChange={handleChange}
  //                 className={`w-full p-3 border rounded-md ${errors.email ? "border-red-500" : "border-black"} bg-white text-black uppercase`}
  //               />
  //               {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
  //             </div>

  //             <div>
  //               <input 
  //                 type="tel" 
  //                 name="Contactno" 
  //                 placeholder="Contact Number" 
  //                 value={payment.Contactno}
  //                 onChange={handleChange}
  //                 className={`w-full p-3 border rounded-md ${errors.Contactno ? "border-red-500" : "border-black"} bg-white text-black uppercase`}
  //               />
  //               {errors.Contactno && <p className="text-red-500 text-sm mt-1">{errors.Contactno}</p>}
  //             </div>

  //             <div>
  //               <input 
  //                 type="text" 
  //                 name="BookRef" 
  //                 placeholder="Booking Reference" 
  //                 value={payment.BookRef}
  //                 onChange={handleChange}
  //                 className={`w-full p-3 border rounded-md ${errors.BookRef ? "border-red-500" : "border-black"} bg-white text-black uppercase`}
  //               />
  //               {errors.BookRef && <p className="text-red-500 text-sm mt-1">{errors.BookRef}</p>}
  //             </div>

  //             <div>
  //               <input 
  //                 type="text" 
  //                 name="payRef" 
  //                 placeholder="Payment Reference" 
  //                 value={payment.payRef}
  //                 onChange={handleChange}
  //                 className={`w-full p-3 border rounded-md ${errors.payRef ? "border-red-500" : "border-black"} bg-white text-black uppercase`}
  //               />
  //               {errors.payRef && <p className="text-red-500 text-sm mt-1">{errors.payRef}</p>}
  //             </div>
  //           </div>
  //         </div>

  //         {/* Card Details Section */}
  //         <div className="border border-black rounded-lg p-6 bg-white">
  //           <h3 className="text-xl font-semibold text-black text-center mb-6 uppercase">CARD DETAILS</h3>

  //           <div className="flex justify-center items-center gap-4 mb-6">
  //             <img 
  //               src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" 
  //               alt="Visa" 
  //               className="w-12 hover:scale-110 transition-transform" 
  //             />
  //             <img 
  //               src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" 
  //               alt="MasterCard" 
  //               className="w-12 hover:scale-110 transition-transform" 
  //             />
  //           </div>

  //           <div className="space-y-4">
  //             <div>
  //               <label className="block text-gray-700 mb-1 uppercase text-sm">Card Number</label>
  //               <input
  //                 type="text"
  //                 maxLength="16"
  //                 name="cnum"
  //                 placeholder="4182-XXXX-XXXX-XX63"
  //                 value={payment.cnum}
  //                 onChange={handleChange}
  //                 className={`w-full p-3 border rounded-md ${errors.cnum ? "border-red-500" : "border-black"} bg-white text-black uppercase`}
  //               />
  //               {errors.cnum && <p className="text-red-500 text-sm mt-1">{errors.cnum}</p>}
  //             </div>

  //             <div>
  //               <label className="block text-gray-700 mb-1 uppercase text-sm">Card Type</label>
  //               <select 
  //                 name="type" 
  //                 value={payment.type}
  //                 onChange={handleChange}
  //                 className={`w-full p-3 border rounded-md ${errors.type ? "border-red-500" : "border-black"} bg-white text-black uppercase`}
  //               >
  //                 <option value="" disabled>Select Card Type</option>
  //                 <option value="MASTER">MASTER</option>
  //                 <option value="VISA">VISA</option>
  //               </select>
  //               {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
  //             </div>

  //             <div className="grid grid-cols-3 gap-4">
  //               <div>
  //                 <label className="block text-gray-700 mb-1 uppercase text-sm">Expiry MM</label>
  //                 <select 
  //                   name="cmonth" 
  //                   value={payment.cmonth}
  //                   onChange={handleChange}
  //                   className={`w-full p-3 border rounded-md ${errors.cmonth ? "border-red-500" : "border-black"} bg-white text-black uppercase`}
  //                 >
  //                   <option value="" disabled>Month</option>
  //                   {Array.from({length: 12}, (_, i) => (
  //                     <option key={i} value={String(i+1).padStart(2, '0')}>
  //                       {String(i+1).padStart(2, '0')}
  //                     </option>
  //                   ))}
  //                 </select>
  //                 {errors.cmonth && <p className="text-red-500 text-sm mt-1">{errors.cmonth}</p>}
  //               </div>

  //               <div>
  //                 <label className="block text-gray-700 mb-1 uppercase text-sm">Expiry YY</label>
  //                 <select 
  //                   name="cyear" 
  //                   value={payment.cyear}
  //                   onChange={handleChange}
  //                   className={`w-full p-3 border rounded-md ${errors.cyear ? "border-red-500" : "border-black"} bg-white text-black uppercase`}
  //                 >
  //                   <option value="" disabled>Year</option>
  //                   {Array.from({length: 6}, (_, i) => (
  //                     <option key={i} value={2025 + i}>
  //                       {2025 + i}
  //                     </option>
  //                   ))}
  //                 </select>
  //                 {errors.cyear && <p className="text-red-500 text-sm mt-1">{errors.cyear}</p>}
  //               </div>

  //               <div>
  //                 <label className="block text-gray-700 mb-1 uppercase text-sm">CVV</label>
  //                 <input
  //                   type="password"
  //                   maxLength="3"
  //                   name="cvv"
  //                   placeholder="CVV"
  //                   value={payment.cvv}
  //                   onChange={handleChange}
  //                   className={`w-full p-3 border rounded-md ${errors.cvv ? "border-red-500" : "border-black"} bg-white text-black uppercase`}
  //                 />
  //                 {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
  //               </div>
  //             </div>

  //             <button 
  //               type="submit" 
  //               disabled={submitLoading}
  //               className="w-full bg-[#007bff] mt-6 py-3 px-4 text-white rounded-lg font-bold uppercase hover:bg-[#0056b3] transition-colors disabled:opacity-50"
  //             >
  //               {submitLoading ? "Processing..." : "Submit Payment"}
  //             </button>
  //           </div>
  //         </div>
  //       </form>
  //     </div>
  //   </div>
  // );


  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
  <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl overflow-hidden">
    {errors.form && (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
        <p className="font-medium">{errors.form}</p>
      </div>
    )}
    
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Payment Information</h1>
      <p className="text-center text-gray-600 mb-8">Complete your payment securely</p>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Details Section */}
        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <FaUser className="text-blue-600" /> User Information
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    name="Repname" 
                    placeholder="Nikshan" 
                    value={payment.Repname}
                    onChange={handleChange}
                        readOnly
                        className={`w-full pl-10 pr-4 py-3 border text-black placeholder-black rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      errors.Repname ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                {errors.Repname && <p className="mt-1 text-sm text-red-600">{errors.Repname}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="Nikshan@example.com" 
                    value={payment.email}
                    onChange={handleChange}
                        readOnly
                        className={`w-full pl-10 pr-4 py-3 text-black border bg-white placeholder-black  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                <div className="relative">
                  <input 
                    type="tel" 
                    name="Contactno" 
                    placeholder="9876543210" 
                    value={payment.Contactno}
                    onChange={handleChange}
                        readOnly
                        className={`w-full pl-10 pr-4 py-3 border text-black bg-white placeholder-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      errors.Contactno ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                {errors.Contactno && <p className="mt-1 text-sm text-red-600">{errors.Contactno}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Booking Reference</label>
                <div className="relative">
                  <input 
                    type="text" 
                    name="BookRef" 
                    placeholder="BOOK123456" 
                    value={payment.BookRef}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border bg-white placeholder-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      errors.BookRef ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <FaFileAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                {errors.BookRef && <p className="mt-1 text-sm text-red-600">{errors.BookRef}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Reference</label>
                <div className="relative">
                  <input 
                    type="text" 
                    name="payRef" 
                    placeholder="PAY789012" 
                    value={payment.payRef}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border text-black placeholder-black bg-white  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      errors.payRef ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <FaFileAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                {errors.payRef && <p className="mt-1 text-sm text-red-600">{errors.payRef}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Details Section */}
        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <FaCreditCard className="text-blue-600" /> Payment Details
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                <div className="relative">
                  <input
                        type="text"
                        maxLength="19"
                        name="cnum"
                        placeholder="0000 0000 0000 0000"
                        value={formatCardNumber(payment.cnum)}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border text-black bg-white placeholder-gray rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${errors.cnum ? "border-red-500" : "border-gray-300"
                          }`}
                  />
                  <FaCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                {errors.cnum && <p className="mt-1 text-sm text-red-600">{errors.cnum}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Type</label>
                <select 
                  name="type" 
                  value={payment.type}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg bg-white placeholder-black  text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                    errors.type ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="" disabled>Select Card Type</option>
                  <option value="MASTER">MasterCard</option>
                  <option value="VISA">Visa</option>
                </select>
                {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Expiry Date</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <select 
                        name="cmonth" 
                        value={payment.cmonth}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg placeholder-black bg-white text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                          errors.cmonth ? "border-red-500" : "border-gray-300"
                        }`}
                      >
                        <option value="" disabled className="placeholder-black">Month</option>
                        {Array.from({length: 12}, (_, i) => (
                          <option key={i} value={String(i+1).padStart(2, '0')}>
                            {String(i+1).padStart(2, '0')}
                          </option>
                        ))}
                      </select>
                      {errors.cmonth && <p className="mt-1 text-sm text-red-600">{errors.cmonth}</p>}
                    </div>
                    <div>
                      <select 
                        name="cyear" 
                        value={payment.cyear}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg bg-white text-black placeholder-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                          errors.cyear ? "border-red-500" : "border-gray-300"
                        }`}
                      >
                        <option value="" disabled>Year</option>
                        {Array.from({length: 6}, (_, i) => (
                          <option key={i} value={2025 + i}>
                            {2025 + i}
                          </option>
                        ))}
                      </select>
                      {errors.cyear && <p className="mt-1 text-sm text-red-600">{errors.cyear}</p>}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                  <div className="relative">
                    <input
                      type="password"
                      maxLength="3"
                      name="cvv"
                      placeholder="123"
                      value={payment.cvv}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 placeholder-black border bg-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                        errors.cvv ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  {errors.cvv && <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>}
                </div>
              </div>

              <button 
                type="submit" 
                disabled={submitLoading}
                className={`w-full mt-6 py-3 px-4 text-white rounded-lg font-semibold transition-colors ${
                  submitLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                } flex items-center justify-center gap-2`}
              >
                {submitLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaCreditCard /> Complete Payment
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" 
              alt="Visa" 
              className="h-8 opacity-80 hover:opacity-100 transition" 
            />
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" 
              alt="MasterCard" 
              className="h-8 opacity-80 hover:opacity-100 transition" 
            />
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" 
              alt="American Express" 
              className="h-8 opacity-80 hover:opacity-100 transition" 
            />
          </div>
        </div>
      </form>
    </div>
  </div>
</div>
);
};

export default Payment;