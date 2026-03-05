export const MOVIES = [
    {
        id: 1,
        title: "Inception",
        genre: "Sci-Fi",
        duration: "2h 28m",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=800&auto=format&fit=crop", // Sci-fi/Abstract
        description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page"],
        upcoming: false
    },
    {
        id: 2,
        title: "Interstellar",
        genre: "Sci-Fi",
        duration: "2h 49m",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop", // Space/Deep Space
        description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
        upcoming: false
    },
    {
        id: 3,
        title: "Dune: Part Two",
        genre: "Sci-Fi",
        duration: "2h 46m",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=800&auto=format&fit=crop", // Desert
        description: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
        cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson"],
        upcoming: true
    }
];

export const THEATRES = [
    {
        id: 1,
        name: "PVR Cinemas",
        location: "Downtown Mall",
        shows: ["10:00 AM", "01:00 PM", "04:00 PM", "07:00 PM"]
    },
    {
        id: 2,
        name: "INOX",
        location: "City Center",
        shows: ["11:00 AM", "02:00 PM", "05:00 PM", "08:00 PM"]
    }
];

// Simple storage wrapper
const STORAGE_KEYS = {
    USERS: 'movie_app_users',
    BOOKINGS: 'movie_app_bookings',
    MOVIES: 'movie_movies'
};

export const MockService = {
    login: async (email, password) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const cleanEmail = email.toLowerCase().trim();
        const cleanPassword = password.trim();

        if (cleanEmail === 'admin@test.com' && cleanPassword === 'admin') {
            return { id: 'admin', name: 'Admin User', role: 'admin', email: 'admin@test.com' };
        }

        if (cleanEmail === 'user@test.com' && cleanPassword === 'user') {
            return { id: 'test-user', name: 'Test User', role: 'user', email: 'user@test.com' };
        }

        // Check registered users
        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            const { password, ...safeUser } = user;
            return { ...safeUser, role: 'user' };
        }

        throw new Error('Invalid credentials');
    },

    register: async (userData) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');

        if (users.find(u => u.email === userData.email)) {
            throw new Error('User already exists');
        }

        const newUser = { ...userData, id: Date.now().toString() };
        users.push(newUser);
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

        const { password, ...safeUser } = newUser;
        return { ...safeUser, role: 'user' };
    },

    getMovies: async () => {
        // Return static + any local storage added movies
        return MOVIES;
    },

    bookTicket: async (bookingData) => {
        await new Promise(resolve => setTimeout(resolve, 800));
        const bookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
        const newBooking = { ...bookingData, id: Date.now().toString(), status: 'Confirmed', date: new Date().toISOString() };
        bookings.push(newBooking);
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
        return newBooking;
    },

    getBookings: async (userId) => {
        const bookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
        if (!userId || userId === 'admin') return bookings;
        return bookings.filter(b => b.userId === userId);
    },

    cancelBooking: async (bookingId) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const bookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
        const updated = bookings.map(b => b.id === bookingId ? { ...b, status: 'Cancelled' } : b);
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
        return true;
    }
};
