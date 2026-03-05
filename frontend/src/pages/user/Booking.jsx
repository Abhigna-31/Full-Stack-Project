import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MockService, THEATRES } from '../../services/mockData';
import { useAuth } from '../../context/AuthContext';
import SeatMap from '../../components/SeatMap';
import { Calendar, Clock, CreditCard, ChevronRight, Loader2 } from 'lucide-react';

export default function Booking() {
    const { movieId } = useParams();
    const navigate = useNavigate();
    const { user, token } = useAuth();

    const [step, setStep] = useState(1); // 1: Show Selection, 2: Seat Selection, 3: Payment
    const [movie, setMovie] = useState(null);
    const [selectedTheatre, setSelectedTheatre] = useState(null);
    const [selectedShow, setSelectedShow] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            const movies = await MockService.getMovies();
            const m = movies.find(m => m.id.toString() === movieId);
            if (m) setMovie(m);
        };
        loadData();
    }, [movieId]);

    const toggleSeat = (seatId) => {
        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(prev => prev.filter(s => s !== seatId));
        } else {
            if (selectedSeats.length >= 6) return alert("Max 6 seats allowed");
            setSelectedSeats(prev => [...prev, seatId]);
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            const booking = {
                movieId: movie.id,
                movieTitle: movie.title,
                theatreId: selectedTheatre.id,
                theatreName: selectedTheatre.name,
                showTime: selectedShow,
                seats: selectedSeats,
                amount: selectedSeats.length * 12, // Mock price $12
            };

            // Send booking to backend API
            const response = await fetch('http://localhost:5000/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(booking),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Booking failed');
            }

            const result = await response.json();
            
            // Simulate Payment Delay
            await new Promise(r => setTimeout(r, 1500));

            navigate(`/ticket/${result.booking.id}`, { state: { booking: result.booking } });
        } catch (err) {
            alert("Booking Failed: " + err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    if (!movie) return <div className="p-8 text-center text-gray-500">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto py-8">
            {/* Steps Indicator */}
            <div className="flex justify-between items-center mb-10 px-10">
                {[1, 2, 3].map(s => (
                    <div key={s} className="flex flex-col items-center relative z-10">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= s ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-400'}`}>
                            {s}
                        </div>
                    </div>
                ))}
                {/* Line */}
                <div className="absolute top-[138px] left-[20%] right-[20%] h-1 bg-gray-200 dark:bg-gray-800 -z-0">
                    <div className="h-full bg-primary-600 transition-all duration-500" style={{ width: `${(step - 1) * 50}%` }}></div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden min-h-[500px] flex flex-col">
                {step === 1 && (
                    <div className="p-8 animate-in fade-in slide-in-from-right-10 duration-300">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Select Theatre & Time</h2>
                        <div className="space-y-6">
                            {THEATRES.map(theatre => (
                                <div key={theatre.id} className="border border-gray-100 dark:border-gray-800 rounded-2xl p-6 hover:border-primary-500 dark:hover:border-primary-500 transition-colors">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">{theatre.name}</h3>
                                            <p className="text-sm text-gray-500">{theatre.location}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 flex-wrap">
                                        {theatre.shows.map(show => (
                                            <button
                                                key={show}
                                                onClick={() => { setSelectedTheatre(theatre); setSelectedShow(show); setStep(2); }}
                                                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm hover:bg-primary-600 hover:text-white hover:border-transparent transition-all"
                                            >
                                                {show}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="p-8 animate-in fade-in slide-in-from-right-10 duration-300 flex flex-col items-center">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Select Seats</h2>
                        <p className="text-gray-500 mb-8">{selectedTheatre.name} | {selectedShow}</p>

                        <SeatMap 
                            selectedSeats={selectedSeats} 
                            onSeatSelect={toggleSeat}
                            movieId={movie.id}
                            theatreId={selectedTheatre.id}
                            showTime={selectedShow}
                        />

                        <div className="w-full flex justify-between items-center mt-8 border-t border-gray-100 dark:border-gray-800 pt-6">
                            <div>
                                <p className="text-sm text-gray-500">Total Price</p>
                                <p className="text-2xl font-bold text-primary-600">${selectedSeats.length * 12}</p>
                            </div>
                            <button
                                disabled={selectedSeats.length === 0}
                                onClick={() => setStep(3)}
                                className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                                Proceed to Pay <ChevronRight className="w-5 h-5 ml-1" />
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="p-8 animate-in fade-in slide-in-from-right-10 duration-300">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Checkout</h2>

                        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 mb-8">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Booking Summary</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Movie</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{movie.title}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Theatre</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{selectedTheatre.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Seats</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{selectedSeats.join(', ')}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
                                    <span className="font-bold text-gray-900 dark:text-white">Total</span>
                                    <span className="font-bold text-primary-600">${selectedSeats.length * 12}</span>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleBooking}>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Payment Details</h3>
                            <div className="space-y-4 mb-8">
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input type="text" placeholder="Card Number" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent outline-none focus:ring-2 focus:ring-primary-500" required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent outline-none focus:ring-2 focus:ring-primary-500" required />
                                    <input type="text" placeholder="CVC" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent outline-none focus:ring-2 focus:ring-primary-500" required />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isProcessing}
                                className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl flex items-center justify-center"
                            >
                                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : `Pay $${selectedSeats.length * 12}`}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
