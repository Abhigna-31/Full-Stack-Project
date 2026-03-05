import { useState, useEffect } from 'react';
import { MockService, MOVIES } from '../../services/mockData';
import { Plus, Edit, Trash2, X, Star } from 'lucide-react';

export default function ManageMovies() {
    const [movies, setMovies] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingMovie, setEditingMovie] = useState(null);
    const [formData, setFormData] = useState({
        title: '', genre: '', duration: '', rating: '', image: '', description: '', cast: '', upcoming: false
    });

    useEffect(() => {
        loadMovies();
    }, []);

    const loadMovies = async () => {
        const data = await MockService.getMovies();
        setMovies(data);
    };

    const handleEdit = (movie) => {
        setEditingMovie(movie);
        setFormData({
            ...movie,
            cast: movie.cast.join(', ')
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this movie?')) {
            const updated = movies.filter(m => m.id !== id);
            setMovies(updated);
            // In a real app, call service delete
            alert('Movie deleted (mock)');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const movieData = {
            ...formData,
            id: editingMovie ? editingMovie.id : Date.now(),
            cast: formData.cast.split(',').map(s => s.trim()),
            rating: parseFloat(formData.rating)
        };

        if (editingMovie) {
            setMovies(movies.map(m => m.id === editingMovie.id ? movieData : m));
        } else {
            setMovies([...movies, movieData]);
        }
        setShowModal(false);
        resetForm();
    };

    const resetForm = () => {
        setFormData({ title: '', genre: '', duration: '', rating: '', image: '', description: '', cast: '', upcoming: false });
        setEditingMovie(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Movies</h1>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                    <Plus className="w-5 h-5 mr-1" /> Add Movie
                </button>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 font-medium">
                        <tr>
                            <th className="px-6 py-4">Title</th>
                            <th className="px-6 py-4">Genre</th>
                            <th className="px-6 py-4">Rating</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {movies.map(movie => (
                            <tr key={movie.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white flex items-center gap-3">
                                    <img src={movie.image} alt="" className="w-10 h-14 object-cover rounded bg-gray-200" />
                                    {movie.title}
                                </td>
                                <td className="px-6 py-4 text-gray-500">{movie.genre}</td>
                                <td className="px-6 py-4 text-gray-500">
                                    <div className="flex items-center text-yellow-500">
                                        <Star className="w-3 h-3 fill-current mr-1" />
                                        {movie.rating}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${movie.upcoming ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                        {movie.upcoming ? 'Upcoming' : 'Showing'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button onClick={() => handleEdit(movie)} className="text-blue-600 hover:text-blue-800 p-1"><Edit className="w-4 h-4" /></button>
                                    <button onClick={() => handleDelete(movie.id)} className="text-red-600 hover:text-red-800 p-1"><Trash2 className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editingMovie ? 'Edit Movie' : 'Add New Movie'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                                    <input type="text" required className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Genre</label>
                                    <input type="text" required className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent" value={formData.genre} onChange={e => setFormData({ ...formData, genre: e.target.value })} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                                <input type="url" required className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent" placeholder="https://..." value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                <textarea required className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent" rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration</label>
                                    <input type="text" required className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent" placeholder="2h 15m" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rating</label>
                                    <input type="number" step="0.1" required className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent" value={formData.rating} onChange={e => setFormData({ ...formData, rating: e.target.value })} />
                                </div>
                                <div className="flex items-center pt-6">
                                    <label className="flex items-center cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" checked={formData.upcoming} onChange={e => setFormData({ ...formData, upcoming: e.target.checked })} />
                                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Upcoming Release</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cast (comma selected)</label>
                                <input type="text" required className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent" placeholder="Actor 1, Actor 2" value={formData.cast} onChange={e => setFormData({ ...formData, cast: e.target.value })} />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800 mt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-500 hover:text-gray-700">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium">Save Movie</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
