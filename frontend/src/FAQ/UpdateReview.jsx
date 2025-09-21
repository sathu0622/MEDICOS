import React, { useState, useEffect } from 'react';
import Header from '../pages/Header';

const UpdateReview = () => {
  const [review, setReview] = useState({
    name: '',
    email: '',
    date: '',
    description: '',
    rating: '3',
  });

  // Simulate fetching review data from an API or props
  useEffect(() => {
    const existingReview = {
      name: 'John Doe',
      email: 'john@example.com',
      date: '2025-04-01',
      description: 'The service was excellent and the staff was friendly!',
      rating: '4'
    };
    setReview(existingReview);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReview(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    console.log('Updated Review:', review);
    alert(`Your ${review.rating}-star review has been updated!`);
    // You can send this data to your backend API here.
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white">
        <Header />
      </div>
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-4">
        <h2 className="text-3xl font-bold text-[#007BFF] mb-8 text-center">Update Your Review</h2>

        <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Name */}
          <div className="flex flex-col">
            <label className="mb-1 text-black font-medium">User Name</label>
            <input 
              type="text"
              name="name"
              value={review.name}
              onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded-lg text-black bg-white focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF] outline-none"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="mb-1 text-black font-medium">Email</label>
            <input 
              type="email"
              name="email"
              value={review.email}
              onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded-lg text-black bg-white focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF] outline-none"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Date */}
          <div className="flex flex-col">
            <label className="mb-1 text-black font-medium">Appointment Date</label>
            <input 
              type="date"
              name="date"
              value={review.date}
              onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded-lg text-black bg-white focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF] outline-none"
              required
            />
          </div>

          {/* Rating */}
          <div className="flex flex-col">
            <label className="mb-1 text-black font-medium">Rating</label>
            <select 
              name="rating"
              value={review.rating}
              onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded-lg text-black bg-white focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF] outline-none"
              required
            >
              <option value="1">★ (1 star - Poor)</option>
              <option value="2">★★ (2 stars - Fair)</option>
              <option value="3">★★★ (3 stars - Good)</option>
              <option value="4">★★★★ (4 stars - Very Good)</option>
              <option value="5">★★★★★ (5 stars - Excellent)</option>
            </select>
          </div>

          {/* Star Preview */}
          <div className="col-span-1 md:col-span-2 flex items-center">
            <span className="text-black mr-2">Your selection:</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span 
                  key={i}
                  className={`text-2xl ${i < review.rating ? 'text-[#007BFF]' : 'text-gray-300'}`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="ml-2 text-black">({review.rating} stars)</span>
          </div>

          {/* Description */}
          <div className="col-span-1 md:col-span-2 flex flex-col">
            <label className="mb-1 text-black font-medium">Review Description</label>
            <textarea
              name="description"
              value={review.description}
              onChange={handleChange}
              className="h-32 p-3 border border-gray-300 rounded-lg text-black bg-white focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF] outline-none"
              placeholder="Update your appointment experience..."
              required
            ></textarea>
          </div>

          {/* Update Button */}
          <div className="col-span-1 md:col-span-2">
            <button 
              type="submit"
              className="w-full bg-[#007BFF] hover:bg-[#0256b3] text-white font-semibold py-3 px-6 rounded-lg transition duration-300 shadow-md"
            >
              Update Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateReview;
