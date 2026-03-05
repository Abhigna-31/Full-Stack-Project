import { useState } from 'react';
import { THEATRES } from '../../services/mockData';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function ManageTheatres() {
    const [theatres, setTheatres] = useState(THEATRES);

    const handleDelete = (id) => {
        if (confirm('Delete theatre?')) {
            setTheatres(theatres.filter(t => t.id !== id));
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Theatres</h1>
                <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                    <Plus className="w-5 h-5 mr-1" /> Add Theatre
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {theatres.map(theatre => (
                    <div key={theatre.id} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:border-primary-500 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{theatre.name}</h3>
                                <p className="text-sm text-gray-500">{theatre.location}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                                <button onClick={() => handleDelete(theatre.id)} className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Show Times</h4>
                            <div className="flex flex-wrap gap-2">
                                {theatre.shows.map(show => (
                                    <span key={show} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs rounded-md">
                                        {show}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
