import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateInventory = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();

    const [stock, setStock] = useState({
        Product: '',
        category: '',
        Formulation: '',
        manufecturer: '',
        Regulatory_status: '',
        Description: '',
        lastUpadte: ''
    });

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        const fetchStock = async () => {
            try {
            const response = await api.get(`/InventoryOperations/getstock/${id}`);
            if (response.data) {
                setStock({
                Product: response.data.Product || '',
                category: response.data.category || '',
                Formulation: response.data.Formulation || '',
                manufecturer: response.data.manufecturer || '',
                Regulatory_status: response.data.Regulatory_status || '',
                Description: response.data.Description || '',
                lastUpadte: response.data.lastUpadte ? response.data.lastUpadte.split('T')[0] : ''
                });

                if (response.data.Img) {
                setPreview(`http://localhost:4000${response.data.Img}`);
                }
            }
            } catch (err) {
            console.error('Error fetching stock:', err);
            setError(err.response?.data?.message || err.message || 'Failed to fetch stock');
            } finally {
            setLoading(false);
            }
        };

        fetchStock();
        }, [id]);

    const handleChange = (event) => {
        setStock({ ...stock, [event.target.name]: event.target.value });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        Object.entries(stock).forEach(([key, value]) => {
            formData.append(key, value);
        });

        if (file) {
            formData.append('Img', file);
        }

        try {
            await axios.put(`http://localhost:4000/InventoryOperations/updatestock/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert("Stock updated successfully!");
            navigate('/InventoryPage');
        } catch (err) {
            console.log("Error updating stock:", err);
            alert("Error updating stock. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-md p-6 sm:p-8 my-8">
                <button 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mb-6 transition-colors duration-300"
                    onClick={() => navigate('/InventoryPage')}
                >
                    View Current Stock
                </button>
                
                <div className="text-center mb-8">
                    <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">Edit Stock Details</h1>
                </div>

                <form onSubmit={handleSubmit} className="w-full" encType="multipart/form-data">
                    <div className="flex flex-wrap gap-4 sm:gap-6 mb-6">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                            <input
                                type="text"
                                name="Product"
                                placeholder="Enter Product Name"
                                value={stock.Product}
                                onChange={handleChange}
                                required
                                className="w-full h-11 px-4 border border-gray-300 rounded-lg text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-gray-50 focus:bg-white"
                            />
                        </div>
                        
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <input
                                type="text"
                                name="category"
                                value={stock.category}
                                onChange={handleChange}
                                placeholder="Enter Category"
                                required
                                className="w-full h-11 px-4 border border-gray-300 rounded-lg text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-gray-50 focus:bg-white"
                            />
                        </div>

                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Formulation</label>
                            <input
                                type="text"
                                name="Formulation"
                                value={stock.Formulation}
                                onChange={handleChange}
                                placeholder="Enter Formulation"
                                required
                                className="w-full h-11 px-4 border border-gray-300 rounded-lg text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-gray-50 focus:bg-white"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 sm:gap-6 mb-6">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                            <input
                                type="text"
                                name="manufecturer"
                                placeholder="Enter Manufacturer"
                                value={stock.manufecturer}
                                onChange={handleChange}
                                required
                                className="w-full h-11 px-4 border border-gray-300 rounded-lg text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-gray-50 focus:bg-white"
                            />
                        </div>

                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Regulatory Status</label>
                            <input
                                type="text"
                                name="Regulatory_status"
                                placeholder="Enter Regulatory Status"
                                value={stock.Regulatory_status}
                                onChange={handleChange}
                                required
                                className="w-full h-11 px-4 border border-gray-300 text-black rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-gray-50 focus:bg-white"
                            />
                        </div>

                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Update Date</label>
                            <input
                                type="date"
                                name="lastUpadte"
                                value={stock.lastUpadte}
                                onChange={handleChange}
                                required
                                className="w-full h-11 px-4 border border-gray-300 text-black rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-gray-50 focus:bg-white"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 sm:gap-6 mb-6">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                name="Description"
                                value={stock.Description}
                                onChange={handleChange}
                                placeholder="Enter Description"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-gray-50 focus:bg-white min-h-[100px]"
                                rows="3"
                            />
                        </div>
                        
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                            <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 hover:border-gray-400 transition-colors">
                                <input
                                    type="file"
                                    name="Img"
                                    onChange={handleFileChange}
                                    className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    accept="image/*"
                                />
                            </div>
                            {preview && (
                                <div className="mt-4 text-center">
                                    <img 
                                        src={preview} 
                                        alt="Preview" 
                                        className="max-w-[200px] max-h-[200px] rounded-lg border border-gray-300 mx-auto mb-2" 
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-center mt-8">
                        <button 
                            type="submit" 
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium uppercase tracking-wider transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                        >
                            Update Stock
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateInventory;