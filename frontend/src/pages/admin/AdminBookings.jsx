import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Ticket, Search } from 'lucide-react';

export default function AdminBookings() {
    const [bookings, setBookings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        if (token) {
            fetchBookings();
        }
    }, [token]);

    const fetchBookings = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/bookings', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch bookings');
            }

            const data = await response.json();
            setBookings(data.bookings);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const filtered = bookings.filter(b =>
        b.movieTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.userEmail && b.userEmail.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Bookings</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search bookings..."
                        className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 font-medium">
                        <tr>
                            <th className="px-6 py-4">Booking ID</th>
                            <th className="px-6 py-4">User Email</th>
                            <th className="px-6 py-4">Movie</th>
                            <th className="px-6 py-4">Theatre</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {filtered.map(booking => (
                            <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <td className="px-6 py-4 font-mono text-xs text-gray-500">#{booking.id.slice(-6)}</td>
                                <td className="px-6 py-4">{booking.userEmail}</td>
                                <td className="px-6 py-4 font-medium">{booking.movieTitle}</td>
                                <td className="px-6 py-4">
                                    <div className="text-xs">
                                        <div className="font-medium">{booking.theatreName}</div>
                                        <div className="text-gray-500">{booking.showTime}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">${booking.amount}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700'}`}>
                                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && <div className="p-8 text-center text-gray-500">{loading ? 'Loading...' : 'No bookings found'}</div>}
            </div>
        </div>
    );
}
