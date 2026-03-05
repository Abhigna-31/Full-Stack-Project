import { Link } from 'react-router-dom';
import { Star, Clock, Calendar } from 'lucide-react';

export default function MovieCard({ movie }) {
    return (
        <Link
            to={`/book/${movie.id}`}
            className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col h-full"
        >
            <div className="relative aspect-[2/3] overflow-hidden">
                <img
                    src={movie.image}
                    alt={movie.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-white font-semibold bg-primary-600 px-3 py-1 rounded-full text-sm">
                        Book Now
                    </span>
                </div>
                {movie.upcoming && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg">
                        UPCOMING
                    </div>
                )}
            </div>

            <div className="p-4 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-primary-600 transition-colors">
                        {movie.title}
                    </h3>
                    <div className="flex items-center text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 px-1.5 py-0.5 rounded-md">
                        <Star className="w-3.5 h-3.5 fill-current mr-1" />
                        <span className="text-xs font-bold">{movie.rating}</span>
                    </div>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-3">{movie.genre}</p>

                <div className="mt-auto flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        {movie.duration}
                    </div>
                </div>
            </div>
        </Link>
    );
}
