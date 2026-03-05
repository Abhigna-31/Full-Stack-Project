import { useLocation, Link, Navigate, useParams } from 'react-router-dom';
import { CheckCircle, Download, Home, QrCode } from 'lucide-react';
import { useState, useEffect } from 'react';
import { MockService } from '../../services/mockData';

export default function Ticket() {
    const { bookingId } = useParams();
    const location = useLocation();
    const [booking, setBooking] = useState(location.state?.booking);

    useEffect(() => {
        if (!booking) {
            // Try fetch if refreshing page
            MockService.getBookings('admin').then(all => {
                const found = all.find(b => b.id === bookingId);
                setBooking(found);
            });
        }
    }, [bookingId]);

    if (!booking) return <div className="p-8 text-center">Loading ticket...</div>;

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 text-green-600">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Booking Confirmed!</h1>
                <p className="text-gray-500">Your ticket has been booked successfully</p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-800 relative overflow-hidden">
                {/* Top/Bottom circles for ticket shape */}
                <div className="absolute -left-3 top-2/3 w-6 h-6 rounded-full bg-gray-50 dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800"></div>
                <div className="absolute -right-3 top-2/3 w-6 h-6 rounded-full bg-gray-50 dark:bg-gray-950 border-l border-gray-200 dark:border-gray-800"></div>
                <div className="absolute top-2/3 left-4 right-4 border-t-2 border-dashed border-gray-200 dark:border-gray-800"></div>

                <div className="text-center border-b border-gray-100 dark:border-gray-800 pb-6 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{booking.movieTitle}</h2>
                    <p className="text-primary-600 font-medium">{booking.theatreName}</p>
                </div>

                <div className="grid grid-cols-2 gap-y-6 mb-8 text-sm">
                    <div>
                        <p className="text-gray-500 mb-1">Date</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{new Date(booking.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-gray-500 mb-1">Time</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{booking.showTime}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 mb-1">Seats</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{booking.seats.join(', ')}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-gray-500 mb-1">Total</p>
                        <p className="font-semibold text-gray-900 dark:text-white">${booking.amount}</p>
                    </div>
                </div>

                <div className="pt-8 flex flex-col items-center">
                    <QrCode className="w-24 h-24 text-gray-900 dark:text-white mb-4" />
                    <p className="text-xs text-center text-gray-400">Show this QR code at the entrance</p>
                </div>
            </div>

            <div className="flex gap-4 mt-8">
                <Link to="/home" className="flex items-center px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <Home className="w-5 h-5 mr-2" />
                    Home
                </Link>
                <button className="flex items-center px-6 py-3 bg-primary-600 rounded-xl text-white font-medium hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/30">
                    <Download className="w-5 h-5 mr-2" />
                    Download Ticket
                </button>
            </div>
        </div>
    );
}
