import { useEffect, useState } from 'react'; 
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaUsers, FaUserMd, FaUserTie, FaBuilding } from 'react-icons/fa';

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:4000/UserOperations/getAllUsers')
        .then(result => {
            setUsers(result.data);
            setLoading(false);
        })
        .catch(err => {
            console.error("Error fetching users:", err);
            setLoading(false);
        });
    }, []);  

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:4000/UserOperations/deleteUser/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(prevUsers => prevUsers.filter(user => user._id !== id));
        } catch (err) {
            console.log("Delete error:", err);
        }
    };

    // Calculate user type statistics
    const userStats = {
        total: users.length,
        doctors: users.filter(user => user.type === 'doctor').length,
        representatives: users.filter(user => user.type === 'representative').length,
        companies: users.filter(user => user.type === 'company').length
    };

    // Filter users based on search term and type
    const filteredUsers = users.filter(user => {
        const matchesSearch = 
            (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (user.mobile?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        
        const matchesType = !filterType || user.type === filterType;
        
        return matchesSearch && matchesType;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <span className="ml-4">Loading users...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Analytics Board */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                                <FaUsers className="w-6 h-6" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Users</p>
                                <p className="text-2xl font-semibold text-gray-900">{userStats.total}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100 text-green-600">
                                <FaUserMd className="w-6 h-6" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Doctors</p>
                                <p className="text-2xl font-semibold text-gray-900">{userStats.doctors}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                                <FaUserTie className="w-6 h-6" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Representatives</p>
                                <p className="text-2xl font-semibold text-gray-900">{userStats.representatives}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                                <FaBuilding className="w-6 h-6" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Companies</p>
                                <p className="text-2xl font-semibold text-gray-900">{userStats.companies}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filter Section */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaSearch className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="search"
                                    placeholder="Search by name, email, or mobile..."
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Filter by Type</label>
                            <select
                                id="type"
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                <option value="">All Types</option>
                                <option value="doctor">Doctors</option>
                                <option value="representative">Representatives</option>
                                <option value="company">Companies</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <tr key={user._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                    user.type === 'doctor' ? 'bg-green-100 text-green-800' :
                                                    user.type === 'representative' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-purple-100 text-purple-800'
                                                }`}>
                                                    {user.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.mobile}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.gender}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                <Link to={`/UserUpdate/${user._id}`}>
                                                    <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                                                        Update
                                                    </button>
                                                </Link>
                                                <button
                                                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                    onClick={() => handleDelete(user._id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                            No users found matching your criteria
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserTable;
