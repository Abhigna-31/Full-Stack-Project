import { useState, useEffect } from 'react';
import { cn } from '../utils/cn';

export default function SeatMap({ selectedSeats, onSeatSelect, maxSeats = 6, movieId, theatreId, showTime }) {
    // Mock layout: 8 rows, 10 columns
    const rows = 8;
    const cols = 10;
    const [bookedSeats, setBookedSeats] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (movieId && theatreId && showTime) {
            fetchBookedSeats();
        }
    }, [movieId, theatreId, showTime]);

    const fetchBookedSeats = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `http://localhost:5000/api/bookings/booked-seats/${movieId}/${theatreId}/${encodeURIComponent(showTime)}`
            );
            
            if (response.ok) {
                const data = await response.json();
                setBookedSeats(data.bookedSeats || []);
                console.log('Booked seats:', data.bookedSeats);
            } else {
                // If endpoint not found, start with no booked seats
                setBookedSeats([]);
            }
        } catch (error) {
            console.error('Error fetching booked seats:', error);
            setBookedSeats([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSeatClick = (seatId) => {
        if (bookedSeats.includes(seatId)) return;
        onSeatSelect(seatId);
    };

    const getSeatStatus = (seatId) => {
        if (bookedSeats.includes(seatId)) return 'booked';
        if (selectedSeats.includes(seatId)) return 'selected';
        return 'available';
    };

    return (
        <div className="flex flex-col items-center">
            {/* Screen */}
            <div className="w-full max-w-lg mb-10">
                <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded-lg w-full mb-1"></div>
                <div className="h-12 bg-gradient-to-b from-primary-500/20 to-transparent w-full transform perspective-2000 rotate-x-12"></div>
                <p className="text-center text-xs text-gray-400 mt-2">All eyes this way please</p>
            </div>

            {/* Seats Grid */}
            <div className="grid gap-x-2 gap-y-2 mb-8" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
                {Array.from({ length: rows }).map((_, r) => (
                    Array.from({ length: cols }).map((_, c) => {
                        const seatLabel = `${String.fromCharCode(65 + r)}${c + 1}`;
                        const status = getSeatStatus(seatLabel);

                        return (
                            <button
                                key={seatLabel}
                                onClick={() => handleSeatClick(seatLabel)}
                                disabled={status === 'booked'}
                                title={seatLabel}
                                className={cn(
                                    "w-8 h-8 rounded-t-lg transition-all duration-200 text-[10px] font-medium flex items-center justify-center",
                                    status === 'booked' && "bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-transparent",
                                    status === 'selected' && "bg-primary-600 text-white shadow-lg scale-110",
                                    status === 'available' && "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500"
                                )}
                            >
                                {status !== 'booked' && seatLabel}
                            </button>
                        );
                    })
                ))}
            </div>

            {/* Legend */}
            <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-t-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"></div>
                    <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-t-lg bg-primary-600 border-2 border-primary-600"></div>
                    <span>Selected</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-t-lg bg-gray-300 dark:bg-gray-700"></div>
                    <span>Booked</span>
                </div>
            </div>
        </div>
    );
}
