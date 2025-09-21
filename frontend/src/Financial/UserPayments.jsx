// import { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const UserPayments = () => {
//     const [payments, setPayments] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchUserPayments = async () => {
//             try {
//                 const token = localStorage.getItem('authToken');
//                 const userData = JSON.parse(localStorage.getItem('userData'));
                
//                 if (!userData?._id) {
//                     throw new Error('User not authenticated');
//                 }

//                 const response = await axios.get(
//                     `http://localhost:4000/PaymentOperations/getpay/user/${userData._id}`,
//                     {
//                         headers: {
//                             'Authorization': `Bearer ${token}`
//                         }
//                     }
//                 );
                
//                 // Updated to access response.data.payments
//                 setPayments(response.data.payments);
//             } catch (err) {
//                 console.error("Error fetching payments:", err);
//                 setError(err.response?.data?.message || "Failed to load payments");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchUserPayments();
//     }, []);

//     const handleDelete = async (id) => {
//         if (window.confirm("Are you sure you want to delete this payment method?")) {
//             try {
//                 const token = localStorage.getItem('authToken');
//                 await axios.delete(
//                     `http://localhost:4000/PaymentOperations/deletePay/${id}`,
//                     {
//                         headers: {
//                             'Authorization': `Bearer ${token}`
//                         }
//                     }
//                 );
//                 setPayments(payments.filter(payment => payment._id !== id));
//             } catch (err) {
//                 console.error("Error deleting payment:", err);
//                 setError(err.response?.data?.message || "Failed to delete payment");
//             }
//         }
//     };

//     const handleEdit = (paymentId) => {
//         navigate(`/profile/payments/edit/${paymentId}`);
//     };

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-64">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//                 {error}
//             </div>
//         );
//     }


//         return (
//             <div className="p-8">
//                  <button
//                     onClick={() => navigate(-1)}
//                     className="mb-6 px-4 py-2 bg-[#007BFF] text-white rounded hover:opacity-90"
//                 >
//                     Back
//                 </button>
//                 <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200 bg-white">
//                     <table className="min-w-full text-sm text-gray-700">
//                         <thead className="bg-blue-600 text-white uppercase">
//                             <tr>
//                                 <th className="py-3 px-4 text-left">Representative</th>
//                                 <th className="py-3 px-4 text-left">Email</th>
//                                 <th className="py-3 px-4 text-left">Contact</th>
//                                 <th className="py-3 px-4 text-left">Booking Ref</th>
//                                 <th className="py-3 px-4 text-left">Payment Ref</th>
//                                 <th className="py-3 px-4 text-left">Card Number</th>
//                                 <th className="py-3 px-4 text-left">Card Type</th>
//                                 <th className="py-3 px-4 text-left">Expiry</th>
//                                 <th className="py-3 px-4 text-left">CVV</th>
//                                 <th className="py-3 px-4 text-center">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {payments.length > 0 ? payments.map((pay) => (
//                                 <tr key={pay._id} className="even:bg-gray-50 hover:bg-gray-100 transition-colors">
//                                     <td className="py-3 px-4 border-t">{pay.Repname}</td>
//                                     <td className="py-3 px-4 border-t">{pay.email}</td>
//                                     <td className="py-3 px-4 border-t">{pay.Contactno}</td>
//                                     <td className="py-3 px-4 border-t">{pay.BookRef}</td>
//                                     <td className="py-3 px-4 border-t">{pay.payRef}</td>
//                                     <td className="py-3 px-4 border-t">•••• •••• •••• {pay.cnum?.slice(-4)}</td>
//                                     <td className="py-3 px-4 border-t">{pay.type}</td>
//                                     <td className="py-3 px-4 border-t">{pay.cmonth}/{pay.cyear}</td>
//                                     <td className="py-3 px-4 border-t">•••</td>
//                                     <td className="py-3 px-4 border-t text-center">
//                                         <div className="flex justify-center gap-2">
//                                             <Link 
//                                                 to={`/EditPay/${pay._id}`}
//                                                 className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded transition"
//                                             >
//                                                 Edit
//                                             </Link>
//                                             <button 
//                                                 onClick={() => handleDelete(pay._id)}
//                                                 className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition"
//                                             >
//                                                 Delete
//                                             </button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             )) : (
//                                 <tr>
//                                     <td colSpan="10" className="py-6 text-center text-gray-500">
//                                         No payment records found.
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         );
// };

// export default UserPayments;

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jsPDF } from 'jspdf';

const UserPayments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserPayments = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const userData = JSON.parse(localStorage.getItem('userData'));
                
                if (!userData?._id) {
                    throw new Error('User not authenticated');
                }

                const response = await axios.get(
                    `http://localhost:4000/PaymentOperations/getpay/user/${userData._id}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                
                setPayments(response.data.payments);
            } catch (err) {
                console.error("Error fetching payments:", err);
                setError(err.response?.data?.message || "Failed to load payments");
            } finally {
                setLoading(false);
            }
        };

        fetchUserPayments();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this payment method?")) {
            try {
                const token = localStorage.getItem('authToken');
                await axios.delete(
                    `http://localhost:4000/PaymentOperations/deletePay/${id}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                setPayments(payments.filter(payment => payment._id !== id));
            } catch (err) {
                console.error("Error deleting payment:", err);
                setError(err.response?.data?.message || "Failed to delete payment");
            }
        }
    };

    const generateReceipt = (payment) => {
        const doc = new jsPDF();
        let y = 20;

        // Header styles
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, 210, 297, 'F'); 
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(1);
        doc.rect(15, 15, 180, 267);

        doc.setFontSize(20);
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "bold");
        doc.text("Payment Receipt", 105, 30, { align: 'center' });

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 100);
        doc.text(" MEDICOS ", 105, 38, { align: 'center' });
        doc.text(" Kalmunai", 105, 44, { align: 'center' });

        const date = new Date().toLocaleDateString();
        doc.setFontSize(10);
        doc.text(`Generated on: ${date}`, 25, 60);
        doc.text(`Receipt #: ${payment.payRef || payment._id.slice(-8)}`, 150, 60);

        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.5);
        doc.line(25, 65, 185, 65);

        y = 75;

        // Payment Information
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Payment Details", 25, y);
        y += 8;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Representative: ${payment.Repname || 'N/A'}`, 30, y);
        doc.text(`Email: ${payment.email || 'N/A'}`, 110, y);
        y += 6;
        doc.text(`Contact: ${payment.Contactno || 'N/A'}`, 30, y);
        doc.text(`Booking Ref: ${payment.BookRef || 'N/A'}`, 110, y);
        y += 6;
        doc.text(`Payment Method: ${payment.type || 'N/A'}`, 30, y);
        doc.text(`Card: **** **** **** ${payment.cnum?.slice(-4) || '****'}`, 110, y);
        y += 6;
        doc.text(`Expiry: ${payment.cmonth || 'MM'}/${payment.cyear || 'YY'}`, 30, y);
        y += 10;

        // Footer
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.text("Thank you for your payment", 105, y, { align: 'center' });
        y += 6;
        doc.text("Please keep this receipt for your records", 105, y, { align: 'center' });

        doc.save(`payment_receipt_${payment.payRef || payment._id.slice(-8)}.pdf`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="border border-red-400 text-red-700 px-4 py-3 rounded bg-white">
                {error}
            </div>
        );
    }

    return (
        <div className="p-8 bg-white min-h-screen">
            <button
                onClick={() => navigate(-1)}
                className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Back
            </button>
            <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
                <table className="min-w-full text-sm text-gray-700">
                    <thead className="bg-blue-600 text-white uppercase">
                        <tr>
                            <th className="py-3 px-4 text-left">Representative</th>
                            <th className="py-3 px-4 text-left">Email</th>
                            <th className="py-3 px-4 text-left">Contact</th>
                            <th className="py-3 px-4 text-left">Booking Ref</th>
                            <th className="py-3 px-4 text-left">Payment Ref</th>
                            <th className="py-3 px-4 text-left">Card Number</th>
                            <th className="py-3 px-4 text-left">Card Type</th>
                            <th className="py-3 px-4 text-left">Expiry</th>
                            <th className="py-3 px-4 text-left">CVV</th>
                            <th className="py-3 px-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.length > 0 ? payments.map((pay) => (
                            <tr key={pay._id} className="even:bg-gray-50 hover:bg-gray-100 transition-colors">
                                <td className="py-3 px-4 border-t">{pay.Repname}</td>
                                <td className="py-3 px-4 border-t">{pay.email}</td>
                                <td className="py-3 px-4 border-t">{pay.Contactno}</td>
                                <td className="py-3 px-4 border-t">{pay.BookRef}</td>
                                <td className="py-3 px-4 border-t">{pay.payRef}</td>
                                <td className="py-3 px-4 border-t">•••• •••• •••• {pay.cnum?.slice(-4)}</td>
                                <td className="py-3 px-4 border-t">{pay.type}</td>
                                <td className="py-3 px-4 border-t">{pay.cmonth}/{pay.cyear}</td>
                                <td className="py-3 px-4 border-t">•••</td>
                                <td className="py-3 px-4 border-t text-center">
                                    <div className="flex justify-center gap-2">
                                        <button
                                            onClick={() => generateReceipt(pay)}
                                            className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded transition"
                                        >
                                            Bill
                                        </button>
                                        <Link 
                                            to={`/EditPay/${pay._id}`}
                                            className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded transition"
                                        >
                                            Edit
                                        </Link>
                                        <button 
                                            onClick={() => handleDelete(pay._id)}
                                            className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="10" className="py-6 text-center text-gray-500 bg-white">
                                    No payment records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserPayments;