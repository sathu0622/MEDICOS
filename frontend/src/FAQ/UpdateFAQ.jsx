import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Header from '../pages/Header';

const UpdateFAQ = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    question: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFAQ = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/FAQOperations/getfaq/${id}`);
        setFormData({
          username: response.data.username || "",
          email: response.data.email || "",
          question: response.data.faq || ""
        });
      } catch (err) {
        console.error('Error fetching FAQ:', err);
        setError('Failed to load FAQ details');
        navigate('/Profile');
      } finally {
        setLoading(false);
      }
    };
    fetchFAQ();
  }, [id, navigate]);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.username.trim()) newErrors.username = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.question.trim()) newErrors.question = "Question is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await api.put(`/FAQOperations/updatefaq/${id}`, {
        username: formData.username,
        email: formData.email,
        faq: formData.question
      });
      alert("FAQ updated successfully!");
      navigate('/Profile');
    } catch (err) {
      console.error("Update error:", err);
      setError(err.response?.data?.message || "Failed to update FAQ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-md mx-auto p-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Update Question</h2>
          
          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-600 text-sm rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Your Name</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter your name"
              />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Your Question</label>
              <textarea
                name="question"
                value={formData.question}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                rows="4"
                placeholder="Type your question here"
              />
              {errors.question && <p className="text-red-500 text-xs mt-1">{errors.question}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-400"
            >
              {loading ? "Updating..." : "Update Question"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateFAQ;