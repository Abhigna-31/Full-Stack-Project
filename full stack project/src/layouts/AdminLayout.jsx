import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, Sun, Moon, LayoutDashboard, Film, MonitorPlay, Users } from 'lucide-react';
import { cn } from '../utils/cn';

export default function AdminLayout() {
    const { logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: Film, label: 'Movies', path: '/admin/movies' },
        { icon: MonitorPlay, label: 'Theatres', path: '/admin/theatres' },
        { icon: Users, label: 'Bookings', path: '/admin/bookings' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex transition-colors duration-200">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 fixed h-full z-10 flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
                    <div className="bg-primary-600 p-1.5 rounded-lg mr-3">
                        <Film className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">Admin Panel</span>
                </div>

                <div className="flex-1 py-6 px-3 space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                                        : "text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                )}
                            >
                                <Icon className={cn("w-5 h-5 mr-3", isActive ? "text-primary-600 dark:text-primary-400" : "text-gray-400")} />
                                {item.label}
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Theme</span>
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
                        >
                            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                <Outlet />
            </main>
        </div>
    );
}
