import { useState, useEffect } from 'react';
import { MockService } from '../../services/mockData';
import { Users, Ticket, Film, TrendingUp } from 'lucide-react';

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalSales: 0,
        totalBookings: 0,
        activeMovies: 0
    });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        const bookings = await MockService.getBookings('admin');
        const movies = await MockService.getMovies();

        setStats({
            totalSales: bookings.reduce((sum, b) => sum + b.amount, 0),
            totalBookings: bookings.length,
            activeMovies: movies.filter(m => !m.upcoming).length
        });
    };

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${color} bg-opacity-10 dark:bg-opacity-20`}>
                <Icon className={`w-8 h-8 ${color.replace('bg-', 'text-')}`} />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
            </div>
        </div>
    );

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Sales" value={`$${stats.totalSales}`} icon={TrendingUp} color="bg-green-500" />
                <StatCard title="Total Bookings" value={stats.totalBookings} icon={Ticket} color="bg-primary-500" />
                <StatCard title="Active Movies" value={stats.activeMovies} icon={Film} color="bg-purple-500" />
            </div>
        </div>
    );
}
