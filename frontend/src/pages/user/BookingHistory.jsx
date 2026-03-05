import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, MapPin, Ticket } from 'lucide-react';

export default function BookingHistory() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, token } = useAuth();

    useEffect(() => {
        if (user && token) {
            loadBookings();
        }
    }, [user, token]);

    const loadBookings = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/bookings/my-bookings', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch bookings');
            }

            const data = await response.json();
            setBookings(data.bookings.reverse());
        } catch (error) {
            console.error('Error loading bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading history...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Bookings</h1>

            {bookings.length > 0 ? (
                <div className="space-y-6">
                    {bookings.map(booking => (
                        <div key={booking.id} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary-500/30 transition-colors">
                            <div className="space-y-3">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{booking.movieTitle}</h3>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center">
                                        <MapPin className="w-4 h-4 mr-1.5" />
                                        {booking.theatreName}
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-1.5" />
                                        {new Date(booking.date).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="w-4 h-4 mr-1.5" />
                                        {booking.showTime}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Ticket className="w-4 h-4 text-primary-600" />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Seats: {booking.seats.join(', ')}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-3">
                                <span className="text-2xl font-bold text-primary-600">${booking.amount}</span>
                                <div className="flex gap-2">
                                    {booking.status !== 'cancelled' && (
                                        <button
                                            onClick={async () => {
                                                if (window.confirm('Cancel this ticket?')) {
                                                    try {
                                                        const response = await fetch(`http://localhost:5000/api/bookings/${booking.id}`, {
                                                            method: 'PUT',
                                                            headers: {
                                                                'Content-Type': 'application/json',
                                                                Authorization: `Bearer ${token}`,
                                                            },
                                                        });

                                                        if (response.ok) {
                                                            loadBookings();
                                                        }
                                                    } catch (error) {
                                                        console.error('Error cancelling booking:', error);
                                                    }
                                                }
                                            }}
                                            className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                    <Link
                                        to={`/ticket/${booking.id}`}
                                        state={{ booking }}
                                        className="px-5 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        View Ticket
                                    </Link>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">You haven't booked any tickets yet</p>
                    <Link to="/home" className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700">
                        Explore Movies
                    </Link>
                </div>
            )}
        </div>
    );
}
