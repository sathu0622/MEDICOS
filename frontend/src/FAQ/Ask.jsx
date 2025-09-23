import React, { useState , useContext} from "react";
import { useNavigate } from "react-router-dom";
import api from '../services/api';
import Header from '../pages/Header';
import { AuthContext } from '../context/AuthContext';

const Ask = () => {
  const { user } = useContext(AuthContext);
  const [faq, setFaq] = useState({
    username: "",
    email: "",
    faq: ""
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFaq({ ...faq, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!faq.username.trim()) newErrors.username = "Name is required";
    if (!faq.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(faq.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!faq.faq.trim()) newErrors.faq = "Question is required";

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
  
    try {
     
      const faqData = {
        userId: user._id,
        username: faq.username.trim(),
        email: faq.email.trim(),
        faq: faq.faq.trim()
      };
  
      const response = await api.post('/FAQOperations/ask', faqData, {
        withCredentials: true
      });

  
      if (response.data && response.data.success) {
        navigate('/Profile', {
          state: { 
            successMessage: 'Question submitted successfully!',
            faqId: response.data.faqId
          }
        });
      } else {
        throw new Error(response.data?.message || 'Submission failed');
      }
    } catch (err) {
      setErrors({ 
        form: err.response?.data?.message || err.message || "Error submitting question" 
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="bg-white shadow-sm">
        <Header />
      </div>

      <div className="flex-grow flex justify-center items-center">
        <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-8 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold text-[#007BFF] mb-6 text-center">Submit Your Question</h2>

          {errors.form && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {errors.form}
            </div>
          )}

          <fieldset className="mb-5 border border-[#007BFF] rounded-lg p-4">
            <legend className="text-[#007BFF] font-medium px-2">your email</legend>
            <input 
              type="email" 
              name="email" 
              value={faq.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md bg-white text-black focus:border-[#007BFF] focus:ring-2 focus:ring-[#007BFF] outline-none"
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </fieldset>

          <fieldset className="mb-5 border border-[#007BFF] rounded-lg p-4">
            <legend className="text-[#007BFF] font-medium px-2">Your name</legend>
            <input 
              type="text" 
              name="username" 
              value={faq.username}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md bg-white text-black focus:border-[#007BFF] focus:ring-2 focus:ring-[#007BFF] outline-none"
              placeholder="Enter your name"
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
          </fieldset>

          <div className="mb-5">
            <label className="block text-[#007BFF] font-medium mb-2 ml-1">Ask your question</label>
            <textarea
              name="faq" 
              value={faq.faq}
              onChange={handleChange}
              className="w-full p-3 border border-[#007BFF] rounded-md bg-white text-black focus:border-[#007BFF] focus:ring-2 focus:ring-[#007BFF] outline-none"
              placeholder="Type your question here"
              rows={4}
            />
            {errors.faq && <p className="text-red-500 text-sm mt-1">{errors.faq}</p>}
          </div>

          <div className="text-center mt-6">
            <button 
              type="submit"
              disabled={submitLoading}
              className="bg-[#007BFF] hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition disabled:opacity-50"
            >
              {submitLoading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Ask;