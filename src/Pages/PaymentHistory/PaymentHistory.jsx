import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Provider/AuthProvider";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import jsPDF from 'jspdf';
import { Helmet } from "react-helmet";


const PaymentHistory = () => {
    const { user } = useContext(AuthContext);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state
    const axiosPublic = useAxiosPublic();

    useEffect(() => {
        const fetchPaymentHistory = async () => {
            if (!user?.email) return;

            try {
                const response = await axiosPublic.get(`/payment-history?userEmail=${user.email}`);
                setPayments(response.data.payments || []); // Access `payments` array, or default to empty array
            } catch (error) {
                console.error('Error fetching payment history:', error);
            } finally {
                setLoading(false); // Set loading to false after fetching data
            }
        };

        fetchPaymentHistory();
    }, [user, axiosPublic]);

    // Function to generate PDF invoice
    const generateInvoice = (payment) => {
        const doc = new jsPDF();

        // Invoice Title
        doc.setFontSize(22);
        doc.text("Invoice", 105, 20, { align: 'center' });

        // Invoice Details
        doc.setFontSize(14);
        doc.text(`Item: ${payment.item}`, 10, 40);
        doc.text(`Price: $${payment.price}`, 10, 50);
        doc.text(`Date: ${new Date(payment.date).toLocaleString()}`, 10, 60);
        doc.text(`Payment ID: ${payment.paymentId}`, 10, 70);

        // Footer
        doc.setFontSize(12);
        doc.text("Thank you for your purchase!", 10, 90);

        // Save the PDF with payment ID as filename
        doc.save(`invoice_${payment.paymentId}.pdf`);
    };

    return (
        <div className="container mx-auto my-10 px-4">
            <Helmet> 
                <title>Payment History</title>
            </Helmet>
            
            <h1 className="text-2xl font-bold mb-5">Payment History</h1>
            
            {loading ? (
                <div className="text-center my-10">
                <span className="loading loading-bars loading-md"></span>
            </div>
            ) : payments.length === 0 ? (
                <p>No payment history found.</p>
            ) : (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Item</th>
                            <th className="px-4 py-2">Price</th>
                            <th className="px-4 py-2">Date</th>
                            <th className="px-4 py-2">Payment ID</th>
                            <th className="px-4 py-2">Invoice</th> {/* Add Invoice Column */}
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((payment) => (
                            <tr key={payment.paymentId}>
                                <td className="px-4 py-2">{payment.item}</td>
                                <td className="px-4 py-2">${payment.price}</td>
                                <td className="px-4 py-2">{new Date(payment.date).toLocaleString()}</td>
                                <td className="px-4 py-2">{payment.paymentId}</td>
                                <td className="px-4 py-2">
                                    {/* Invoice button to generate PDF */}
                                    <button 
                                        className="btn btn-sm bg-blue-500 hover:bg-blue-600 text-white"
                                        onClick={() => generateInvoice(payment)}
                                    >
                                        Invoice
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default PaymentHistory;
