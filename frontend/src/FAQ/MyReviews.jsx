import React, { useState } from 'react';
import Header from '../pages/Header';

const MyReviews = () => {
  // Sample initial reviews data
  const initialReviews = [
    {
      id: 1,
      name: 'John Doe',
      date: '2023-10-15',
      rating: '4',
      description: 'Great service! The doctor was very professional and attentive.'
    },
    {
      id: 2,
      name: 'Jane Smith',
      date: '2023-10-18',
      rating: '5',
      description: 'Excellent experience from start to finish. Highly recommended!'
    },
    {
      id: 3,
      name: 'Robert Johnson',
      date: '2023-10-20',
      rating: '3',
      description: 'Good service but the waiting time was longer than expected.'
    }
  ];

  const [reviews, setReviews] = useState(initialReviews);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    rating: '',
    description: ''
  });

  // Handle delete review
  const handleDelete = (id) => {
    setReviews(reviews.filter(review => review.id !== id));
  };

  // Start editing a review
  const handleEdit = (review) => {
    setEditingId(review.id);
    setEditForm({
      name: review.name,
      rating: review.rating,
      description: review.description
    });
  };

  // Handle edit form changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  // Save edited review
  const handleSaveEdit = (id) => {
    setReviews(reviews.map(review => 
      review.id === id ? { ...review, ...editForm } : review
    ));
    setEditingId(null);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
  };

  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <span 
            key={i} 
            className={`text-xl ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white">
        <Header />
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-[#007BFF] mb-8">My Reviews</h2>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reviews.map((review) => (
                <tr key={review.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === review.id ? (
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      <div className="text-sm font-medium text-gray-900">{review.name}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{review.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === review.id ? (
                      <select
                        name="rating"
                        value={editForm.rating}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1"
                      >
                        <option value="1">1 Star</option>
                        <option value="2">2 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="5">5 Stars</option>
                      </select>
                    ) : (
                      renderStars(parseInt(review.rating))
                    )
                }
                  </td>
                  <td className="px-6 py-4">
                    {editingId === review.id ? (
                      <textarea
                        name="description"
                        value={editForm.description}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 w-full"
                        rows="2"
                      />
                    ) : (
                      <div className="text-sm text-gray-500">{review.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingId === review.id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSaveEdit(review.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(review)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {reviews.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              You haven't submitted any reviews yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyReviews;