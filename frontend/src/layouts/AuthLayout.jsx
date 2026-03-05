import { Outlet } from 'react-router-dom';
import { Film } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function AuthLayout() {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 transition-colors duration-200">
            <div className="max-w-md w-full">
                <div className="flex justify-center mb-8">
                    <div className="bg-primary-600 p-3 rounded-2xl shadow-lg shadow-primary-500/20">
                        <Film className="w-8 h-8 text-white" />
                    </div>
                </div>
                <Outlet />
            </div>
        </div>
    );
}
