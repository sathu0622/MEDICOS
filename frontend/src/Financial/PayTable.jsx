import { useEffect, useState } from 'react'; 
import { Link } from 'react-router-dom';
import api from '../services/api'; // ✅ cookie-based API instance

const PayTable = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await api.get('/PaymentOperations/getpay');
                setPayments(response.data);
            } catch (err) {
                console.error('Error fetching payments:', err);
                setError('Failed to load payment records.');
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this payment record?')) return;

        try {
            await api.delete(`/PaymentOperations/deletePay/${id}`);
            setPayments(payments.filter((pay) => pay._id !== id));
        } catch (err) {
            console.error('Error deleting payment:', err);
            alert('Failed to delete payment.');
        }
    };

    if (loading) {
        return <p className="text-center mt-8 text-gray-600">Loading payment records...</p>;
    }

    if (error) {
        return <p className="text-center mt-8 text-red-600">{error}</p>;
    }

    return (
        <div className="p-8">
            <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200 bg-white">
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
                        {payments.length > 0 ? (
                            payments.map((pay) => (
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
                                            <Link 
                                                to={`/UpdatePayment/${pay._id}`}
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
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10" className="py-6 text-center text-gray-500">
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

export default PayTable;
