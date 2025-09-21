import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const StockAdd = () => {
    const [stock, setStock] = useState({
        Product: '',
        category: '',
        Formulation: '',
        manufecturer: '',
        Regulatory_status: '',
        Description: '',
        lastUpadte: new Date().toISOString().split('T')[0], // Initialize with current date
        Img:'',
    });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const navigate = useNavigate();

    const handleChange = (event) => {
        setStock({ ...stock, [event.target.name]: event.target.value });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        
        // Create preview
        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setPreview(null);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

          const formattedStock = {
            ...stock,
            lastUpadte: new Date(stock.lastUpadte).toISOString()
        };
        
        const formData = new FormData();
        formData.append('Product', stock.Product);
        formData.append('category', stock.category);
        formData.append('Formulation', stock.Formulation);
        formData.append('manufecturer', stock.manufecturer);
        formData.append('Regulatory_status', stock.Regulatory_status);
        formData.append('Description', stock.Description);
        formData.append('lastUpadte', stock.lastUpadte);
        if (file) {
            formData.append('Img', file);
        }

        try {
            const response = await axios.post('http://localhost:4000/InventoryOperations/Stock', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Stock added success:', response.data);
            alert("Stock added successfully!");
            navigate('/InventoryPage');
        } catch (error) {
            console.error('Error:', error);
            alert(error.response?.data?.message || "Error adding stock. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-5">
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-8 my-8">
                <Link to='/inventory'>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mb-6 transition duration-300">
                        View Current Stock
                    </button>
                </Link>
               
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold text-gray-800">Add Stocks</h1>
                </div>

                <form onSubmit={handleSubmit} className="w-full" encType="multipart/form-data">
                    <div className="flex flex-wrap gap-5 mb-5">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                            <input
                                type="text"
                                name="Product"
                                placeholder="Enter Product Name"
                                value={stock.Product}
                                onChange={handleChange}
                                required
                                className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-black bg-white" />
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
                                className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-black bg-white"/>
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
                                className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-black bg-white"/>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-5 mb-5">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                            <input
                                type="text"
                                name="manufecturer"
                                placeholder="Enter Manufacturer"
                                value={stock.manufecturer}
                                onChange={handleChange}
                                required
                                className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-black bg-white" />
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
                                className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-black bg-white" />
                        </div>

                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Update Date</label>
                            <input
                                type="date"
                                name="lastUpadte"
                                value={stock.lastUpadte}
                                onChange={handleChange}
                                required
                                className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-black bg-white"/>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-5 mb-5">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                name="Description"
                                value={stock.Description}
                                onChange={handleChange}
                                placeholder="Enter Description"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-black bg-white"
                                rows="3"/>
                        </div>
                        
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                            <input
                                type="file"
                                name="Img"
                                onChange={handleFileChange}
                                className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-black bg-white file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                accept="image/*"/>
                            {preview && (
                                <div className="mt-3">
                                    <img src={preview} alt="Preview" className="max-w-[200px]" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-center mt-8">
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium uppercase tracking-wider transition duration-300 transform hover:-translate-y-1 hover:shadow-md">
                            Add Stock
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StockAdd;