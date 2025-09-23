// import { useEffect, useState } from 'react'; 
// import { Link, useParams } from 'react-router-dom';
// import axios from 'axios';

// const InventoryPage = () => {
//     const [stock, setStock] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const { id } = useParams();  

//     useEffect(() => {
//         const fetchStock = async () => {
//             try {
//                 const response = await axios.get('http://localhost:4000/InventoryOperations/getstock');
//                 setStock(response.data);
//                 setLoading(false);
//             } catch (err) {
//                 console.error("Error fetching stock:", err);
//                 setError("Failed to load stock data");
//                 setLoading(false);
//             }
//         };

//         fetchStock();
//     }, []);

//     const handleDelete = async (stockId) => {
//         try {
//             await axios.delete(`http://localhost:4000/InventoryOperations/deletestock/${stockId}`);
//             setStock(prevStock => prevStock.filter(item => item._id !== stockId));
//         } catch (err) {
//             console.error("Error deleting stock:", err);
//             alert("Failed to delete stock item");
//         }
//     };

//     if (loading) return <div className="p-4 text-center">Loading inventory data...</div>;
//     if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <div className="overflow-x-auto">
//                 <table className="min-w-full bg-white border border-gray-200">
//                     <thead>
//                         <tr>
//                             <th className="px-6 py-3 bg-blue-600 text-white text-left text-sm font-medium border border-gray-300">Product</th>
//                             <th className="px-6 py-3 bg-blue-600 text-white text-left text-sm font-medium border border-gray-300">Category</th>
//                             <th className="px-6 py-3 bg-blue-600 text-white text-left text-sm font-medium border border-gray-300">Formulation</th>
//                             <th className="px-6 py-3 bg-blue-600 text-white text-left text-sm font-medium border border-gray-300">Manufacturer</th>
//                             <th className="px-6 py-3 bg-blue-600 text-white text-left text-sm font-medium border border-gray-300">Regulatory Status</th>
//                             <th className="px-6 py-3 bg-blue-600 text-white text-left text-sm font-medium border border-gray-300">Description</th>
//                             <th className="px-6 py-3 bg-blue-600 text-white text-left text-sm font-medium border border-gray-300">Last Update</th>
//                             <th className="px-6 py-3 bg-blue-600 text-white text-left text-sm font-medium border border-gray-300">Image</th>
//                             <th className="px-6 py-3 bg-blue-600 text-white text-left text-sm font-medium border border-gray-300">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {stock.length > 0 ? (
//                             stock.map((item) => (
//                                 <tr key={item._id} className="even:bg-gray-50 odd:bg-gray-100 hover:bg-gray-200">
//                                     <td className="px-6 py-4 border border-gray-300">{item.Product}</td>
//                                     <td className="px-6 py-4 border border-gray-300">{item.category}</td>
//                                     <td className="px-6 py-4 border border-gray-300">{item.Formulation}</td>
//                                     <td className="px-6 py-4 border border-gray-300">{item.manufecturer}</td>
//                                     <td className="px-6 py-4 border border-gray-300">{item.Regulatory_status}</td>
//                                     <td className="px-6 py-4 border border-gray-300 max-w-xs truncate">{item.Description}</td>
//                                     <td className="px-6 py-4 border border-gray-300">{new Date(item.lastUpadte).toLocaleDateString()}</td>
//                                     <td className="px-6 py-4 border border-gray-300">
//                                         {item.Img && (
//                                             <img 
//                                                 src={`http://localhost:4000${item.Img}`} 
//                                                 alt={item.Product} 
//                                                 className="h-16 w-16 object-contain mx-auto"
//                                             />
//                                         )}
//                                     </td>
//                                     <td className="px-6 py-4 border border-gray-300 space-x-2">
//                                         <Link to={`/UpdateInventory/${item._id}`}>
//                                             <button className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">
//                                                 Update
//                                             </button>
//                                         </Link>
//                                         <button 
//                                             className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
//                                             onClick={() => {
//                                                 if (window.confirm('Are you sure you want to delete this item?')) {
//                                                     handleDelete(item._id);
//                                                 }
//                                             }}
//                                         >
//                                             Delete
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan="9" className="px-6 py-4 text-center border border-gray-300">No stock items available</td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default InventoryPage;


import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const InventoryPage = () => {
    const [stock, setStock] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        const fetchStock = async () => {
            try {
                const response = await api.get('/InventoryOperations/getstock');
                const formattedStock = response.data.map(item => ({
                    ...item,
                    formattedDate: item.lastUpdate ? new Date(item.lastUpdate).toLocaleDateString() : 'N/A'
                }));
                setStock(formattedStock);
            } catch (err) {
                console.error("Error fetching stock:", err);
                setError(err.response?.data?.message || err.message || "Failed to load stock data");
            } finally {
                setLoading(false);
            }
        };

        fetchStock();
    }, []);

    const handleDelete = async (stockId) => {
        if (!window.confirm("Are you sure you want to delete this stock item?")) return;

        try {
            await api.delete(`/InventoryOperations/deletestock/${stockId}`);
            setStock(prev => prev.filter(item => item._id !== stockId));
        } catch (err) {
            console.error("Error deleting stock:", err);
            alert(err.response?.data?.message || "Failed to delete stock item");
        }
    };

    const categories = ['all', ...new Set(stock.map(item => item.category))];
    const statuses = ['all', ...new Set(stock.map(item => item.Regulatory_status))];

    const filteredStock = stock.filter(item => {
        const matchesSearch =
            item.Product.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.Formulation.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.manufecturer.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
        const matchesStatus = filterStatus === 'all' || item.Regulatory_status === filterStatus;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(24);
        doc.setTextColor(3, 123, 255);
        doc.text('MEDICOS', 14, 20);

        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('Inventory Report', 14, 30);

        let yOffset = 37;
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, yOffset);
        yOffset += 7;
        if (filterCategory !== 'all') { doc.text(`Category Filter: ${filterCategory}`, 14, yOffset); yOffset += 7; }
        if (filterStatus !== 'all') { doc.text(`Status Filter: ${filterStatus}`, 14, yOffset); yOffset += 7; }
        if (searchTerm) { doc.text(`Search Term: ${searchTerm}`, 14, yOffset); yOffset += 7; }
        doc.text(`Total Items: ${stock.length}`, 14, yOffset);
        doc.text(`Filtered Items: ${filteredStock.length}`, 14, yOffset + 7);

        const tableData = filteredStock.map(item => [
            item.Product,
            item.category,
            item.Formulation,
            item.manufecturer,
            item.Regulatory_status,
            item.lastUpdate ? new Date(item.lastUpdate).toLocaleDateString() : 'N/A',
            item.Description
        ]);

        autoTable(doc, {
            head: [['Product', 'Category', 'Formulation', 'Manufacturer', 'Status', 'Last Update', 'Description']],
            body: tableData,
            startY: yOffset + 15,
            styles: { fontSize: 8, cellPadding: 2, overflow: 'linebreak' },
            headStyles: { fillColor: [3, 123, 255], textColor: 255, fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [245, 245, 245] },
            margin: { top: 30 },
            columnStyles: {
                0: { cellWidth: 30 },
                1: { cellWidth: 20 },
                2: { cellWidth: 25 },
                3: { cellWidth: 25 },
                4: { cellWidth: 20 },
                5: { cellWidth: 20 },
                6: { cellWidth: 40 }
            }
        });

        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(128);
            doc.text('MEDICOS - Inventory Management System',
                doc.internal.pageSize.width / 2,
                doc.internal.pageSize.height - 10,
                { align: 'center' }
            );
        }

        doc.save('medicos-inventory-report.pdf');
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
            <p className="font-bold">Error</p>
            <p>{error}</p>
        </div>
    );

    return (
        <div className="container mx-auto bg-white px-4 py-8">
            <div className="mb-8 bg-white">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Inventory Management</h1>

                <Link to='/Profile'>
                                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mb-6 transition duration-300">
                                        Profile
                                    </button>
                                </Link>
                               
                
                {/* Search and Filter Section */}
                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search Input */}
                        <div>
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                            <div className="relative bg-white">
                                <input
                                    type="text"
                                    id="search"
                                    placeholder="Search products..."
                                    className="w-full px-4 py-2 border bg-white text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <svg
                                    className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                        
                        {/* Category Filter */}
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                id="category"
                                className="w-full px-4 py-2 border bg-white text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                            >
                                <option value="all">All Categories</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Status Filter */}
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Regulatory Status</label>
                            <select
                                id="status"
                                className="w-full px-4 py-2 border bg-white text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">All Statuses</option>
                                {statuses.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                            Showing {filteredStock.length} of {stock.length} items
                        </div>
                        <button
                                onClick={generatePDF}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Generate PDF
                            </button>
                        <Link to="/StockAdd">
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Add New Item
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
            
            {/* Inventory Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Formulation</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Manufacturer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Last Update</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Image</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredStock.length > 0 ? (
                                filteredStock.map((item) => (
                                    <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{item.Product}</div>
                                            <div className="text-sm text-gray-500 truncate max-w-xs">{item.Description}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.Formulation}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.manufecturer}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                item.Regulatory_status === 'Approved' 
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {item.Regulatory_status}
                                            </span>
                                        </td>
                                        {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(item.lastUpadte).toLocaleDateString()}
                                        </td> */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.formattedDate || 
                                             (item.lastUpadte ? new Date(item.lastUpadte).toLocaleDateString() : 'N/A')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {item.Img ? (
                                                <img 
                                                    src={`http://localhost:4000${item.Img}`} 
                                                    alt={item.Product} 
                                                    className="h-12 w-12 object-contain mx-auto rounded-md"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        // e.target.src = 'https://via.placeholder.com/48?text=No+Image';
                                                    }}
                                                />
                                            ) : (
                                                <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-500">
                                                    No Image
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <Link to={`/UpdateInventory/${item._id}`}>
                                                    <button 
                                                        className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition flex items-center gap-1"
                                                        title="Edit"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        <span className="hidden md:inline">Edit</span>
                                                    </button>
                                                </Link>
                                                <button 
                                                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition flex items-center gap-1"
                                                    onClick={() => {
                                                        if (window.confirm('Are you sure you want to delete this item?')) {
                                                            handleDelete(item._id);
                                                        }
                                                    }}
                                                    title="Delete"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    <span className="hidden md:inline">Delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                                        No items found matching your criteria
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InventoryPage;