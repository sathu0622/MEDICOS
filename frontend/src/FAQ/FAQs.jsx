import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FAQs = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const userData = JSON.parse(localStorage.getItem('userData'));
        
        if (!userData?._id) {
          throw new Error('User not authenticated');
        }

        const response = await axios.get(
          `http://localhost:4000/FAQOperations/getfaq/user/${userData._id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        setFaqs(response.data.faqs || []);
      } catch (err) {
        console.error("Error fetching FAQs:", err);
        setError(err.response?.data?.message || "Failed to load FAQs");
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        const token = localStorage.getItem('authToken');
        await axios.delete(
          `http://localhost:4000/FAQOperations/deletefaq/${id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        setFaqs(faqs.filter(faq => faq._id !== id));
      } catch (err) {
        console.error("Error deleting FAQ:", err);
        setError(err.response?.data?.message || "Failed to delete question");
      }
    }
  };

  const handleUpdate = (id) => {
    navigate(`/UpdateFAQ/${id}`);
  };

  const handleReply = (id) => {
    alert(`Reply to question ID: ${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading FAQs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-[#007BFF] text-center">User's Questions</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-center">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#007BFF]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Question</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {faqs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No questions available.
                    </td>
                  </tr>
                ) : (
                  faqs.map((faq, index) => (
                    <tr key={faq._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-10">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{faq.username}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{faq.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-md">{faq.faq}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleReply(faq._id)}
                            className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md text-sm"
                          >
                            Reply
                          </button>
                          <button
                            onClick={() => handleUpdate(faq._id)}
                            className="text-yellow-600 hover:text-yellow-900 bg-yellow-50 hover:bg-yellow-100 px-3 py-1 rounded-md text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(faq._id)}
                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQs;