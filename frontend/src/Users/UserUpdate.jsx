import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserUpdate = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        type: '',
        gender: '',
        password: '',
        cpassword: '',
    });

    const navigate = useNavigate();

    useEffect(() => {
        // Fetch current user data
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/UserOperations/getUser/${id}`);
                setFormData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, []);

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (formData.password !== formData.cpassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            await axios.put(`http://localhost:4000/UserOperations/updateUser/${id}`, formData);
            alert("Profile updated successfully!");
            navigate('/profile');
        } catch (error) {
            console.error('Error updating user:', error);
            alert(error.response?.data?.message || "Error updating profile!");
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl mt-24 mb-8 border border-gray-100">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-[#007BFF]">Edit</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Your name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF] bg-white text-black"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF] bg-white text-black"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">New Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Leave blank to keep current"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF] bg-white text-black"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">Confirm Password</label>
                            <input
                                type="password"
                                name="cpassword"
                                placeholder="Confirm new password"
                                value={formData.cpassword}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF] bg-white text-black"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">Role</label>
                            <select 
                                name="type" 
                                value={formData.type} 
                                onChange={handleChange} 
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF] bg-white text-black cursor-pointer"
                            >
                                <option value="doctor">Doctor</option>
                                <option value="representative">Representative</option>
                                <option value="company">Company</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">Gender</label>
                            <select 
                                name="gender" 
                                value={formData.gender} 
                                onChange={handleChange} 
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF] bg-white text-black cursor-pointer"
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="flex justify-center space-x-4 pt-4">
                        <button 
                            type="button"
                            onClick={() => navigate(-1)}
                            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition duration-300 shadow-md"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="w-full bg-[#007BFF] hover:bg-[#0069D9] text-white font-medium py-3 px-6 rounded-lg transition duration-300 shadow-md"
                        >
                            Update Profile
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserUpdate;