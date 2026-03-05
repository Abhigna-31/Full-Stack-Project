import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MockService } from '../../services/mockData';
import { Star, Clock, Calendar, Play, ChevronLeft, Ticket } from 'lucide-react';

export default function MovieDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMovie();
    }, [id]);

    const loadMovie = async () => {
        const movies = await MockService.getMovies();
        const found = movies.find(m => m.id.toString() === id);
        setMovie(found);
        setLoading(false);
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!movie) return <div className="p-8 text-center">Movie not found</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-500 hover:text-primary-600 transition-colors"
            >
                <ChevronLeft className="w-5 h-5 mr-1" /> Back
            </button>

            {/* Hero Section */}
            <div className="relative rounded-3xl overflow-hidden bg-gray-900 aspect-[21/9] shadow-2xl">
                <img
                    src={movie.image}
                    alt={movie.title}
                    className="w-full h-full object-cover opacity-60 backdrop-blur-sm"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent flex items-end p-8 md:p-12">
                    <div className="max-w-4xl">
                        <div className="flex items-center space-x-3 mb-4">
                            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-semibold tracking-wide uppercase">
                                {movie.genre}
                            </span>
                            <div className="flex items-center text-yellow-400">
                                <Star className="w-4 h-4 fill-current mr-1" />
                                <span className="font-bold">{movie.rating}</span>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">{movie.title}</h1>

                        <p className="text-gray-300 text-lg mb-8 line-clamp-2 max-w-2xl">{movie.description}</p>

                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => navigate(`/book/${movie.id}`)}
                                className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-lg shadow-primary-600/30 flex items-center transition-all hover:scale-105"
                            >
                                <Ticket className="w-5 h-5 mr-2" />
                                Book Tickets
                            </button>
                            <button className="px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-xl font-bold flex items-center transition-all">
                                <Play className="w-5 h-5 mr-2" />
                                Watch Trailer
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Grid */}
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Synopsis</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{movie.description}</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Cast</h2>
                        <div className="flex gap-4 flex-wrap">
                            {movie.cast.map(actor => (
                                <div key={actor} className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {actor}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="space-y-4">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Movie Info</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Duration</span>
                                <span className="font-medium text-gray-900 dark:text-white">{movie.duration}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Genre</span>
                                <span className="font-medium text-gray-900 dark:text-white">{movie.genre}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Release Status</span>
                                <span className={`font-medium ${movie.upcoming ? 'text-yellow-500' : 'text-green-500'}`}>
                                    {movie.upcoming ? 'Coming Soon' : 'Now Showing'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
