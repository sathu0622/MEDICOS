import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Head from "../pages/WelcomeHeader";

const Registration = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        type: '',
        gender: '',
        password: ''
    });
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
  event.preventDefault();

  if (formData.password !== formData.cpassword) {
    setError("Passwords do not match!");
    return;
  }
  setError('');

  try {
    const { cpassword, ...payload } = formData; // strip cpassword
    const response = await axios.post(
      "http://localhost:4000/UserOperations/register",
      payload,
      { headers: { "Content-Type": "application/json" } }
    );
    alert("Your Profile Created!");
    navigate("/Login");
  } catch (error) {
    console.error("Registration error:", error.response?.data);
    if (error.response?.data?.errors) {
      setError(error.response.data.errors.map(err => err.msg).join(", "));
    } else {
      setError(error.response?.data?.message || "Error registering user!");
    }
  }
};



    return (
        <div className="min-h-screen bg-white flex flex-col items-center">
            <div className="w-full fixed top-0 left-0 z-50 bg-white shadow-md">
                <Head />
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl mt-28 mb-8 border border-gray-100">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-[#007BFF]">Create Your Account</h2>
                </div>
                
                {error && <div className="text-red-500 text-center mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your name"
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
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF] bg-white text-black"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">Mobile Number</label>
                            <input
                                type="tel"
                                name="mobile"
                                placeholder="Enter your mobile number"
                                value={formData.mobile}
                                onChange={handleChange}
                                required
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
                                <option value="">Select your role</option>
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
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Create password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF] bg-white text-black"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">Confirm Password</label>
                            <input
                                type="password"
                                name="cpassword"
                                placeholder="Confirm password"
                                value={formData.cpassword}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF] bg-white text-black"
                            />
                        </div>
                    </div>
                    
                    <div className="pt-2">
                        <button 
                            type="submit" 
                            className="w-full bg-[#007BFF] hover:bg-[#0069D9] text-white font-medium py-3 px-6 rounded-lg transition duration-300 shadow-md"
                        >
                            Register Now
                        </button>
                    </div>
                </form>
                
                <div className="text-center mt-6 text-gray-600">
                    <p>Already have an account? 
                        <span 
                            onClick={() => navigate('/Login')}
                            className="text-[#007BFF] font-medium cursor-pointer hover:underline ml-1"
                        >
                            Sign in
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Registration;