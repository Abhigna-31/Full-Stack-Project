const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   GET /api/bookings/booked-seats/:movieId/:theatreId/:showTime
// @desc    Get all booked seats for a specific show (for all users)
// @access  Public
router.get('/booked-seats/:movieId/:theatreId/:showTime', async (req, res) => {
  try {
    const { movieId, theatreId, showTime } = req.params;

    const bookings = await Booking.find({
      movieId: parseInt(movieId),
      theatreId: parseInt(theatreId),
      showTime: showTime,
      status: 'confirmed',
    });

    const bookedSeats = [];
    bookings.forEach(booking => {
      bookedSeats.push(...booking.seats);
    });

    res.status(200).json({
      success: true,
      bookedSeats: [...new Set(bookedSeats)], // Remove duplicates
      totalSeatsBooked: bookedSeats.length,
    });
  } catch (error) {
    console.error('Get booked seats error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { movieId, movieTitle, theatreId, theatreName, showTime, seats, amount } = req.body;

    // Validation
    if (!movieId || !theatreId || !showTime || !seats || seats.length === 0 || !amount) {
      return res.status(400).json({ message: 'Missing required booking information' });
    }

    // Check if any of the seats are already booked
    const existingBooking = await Booking.findOne({
      movieId,
      theatreId,
      showTime,
      seats: { $in: seats },
      status: 'confirmed',
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'Some seats are already booked. Please select different seats.' });
    }

    // Create booking
    const booking = new Booking({
      userId: req.user.id,
      movieId,
      movieTitle,
      theatreId,
      theatreName,
      showTime,
      seats,
      amount,
      status: 'confirmed',
    });

    await booking.save();

    console.log(`\n✓ NEW BOOKING CREATED:`);
    console.log(`  User: ${req.user.email}`);
    console.log(`  Movie: ${movieTitle}`);
    console.log(`  Seats: ${seats.join(', ')}`);
    console.log(`  Amount: $${amount}\n`);

    res.status(201).json({
      success: true,
      booking: {
        id: booking._id,
        movieId: booking.movieId,
        movieTitle: booking.movieTitle,
        theatreId: booking.theatreId,
        theatreName: booking.theatreName,
        showTime: booking.showTime,
        seats: booking.seats,
        amount: booking.amount,
        status: booking.status,
        bookingDate: booking.bookingDate,
      },
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/bookings/my-bookings
// @desc    Get current user's bookings
// @access  Private
router.get('/my-bookings', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).sort({ bookingDate: -1 });

    res.status(200).json({
      success: true,
      bookings: bookings.map(b => ({
        id: b._id,
        movieId: b.movieId,
        movieTitle: b.movieTitle,
        theatreId: b.theatreId,
        theatreName: b.theatreName,
        showTime: b.showTime,
        seats: b.seats,
        amount: b.amount,
        status: b.status,
        bookingDate: b.bookingDate,
      })),
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get single booking by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns this booking
    if (booking.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.status(200).json({
      success: true,
      booking: {
        id: booking._id,
        movieId: booking.movieId,
        movieTitle: booking.movieTitle,
        theatreId: booking.theatreId,
        theatreName: booking.theatreName,
        showTime: booking.showTime,
        seats: booking.seats,
        amount: booking.amount,
        status: booking.status,
        bookingDate: booking.bookingDate,
      },
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/bookings/:id
// @desc    Cancel a booking
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns this booking
    if (booking.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this booking' });
    }

    booking.status = 'cancelled';
    await booking.save();

    console.log(`✓ Booking cancelled: ${booking._id}`);

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      booking: {
        id: booking._id,
        status: booking.status,
      },
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/bookings (General - Admin only)
// @desc    Get all bookings (Admin only)
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'email name')
      .sort({ bookingDate: -1 });

    res.status(200).json({
      success: true,
      bookings: bookings.map(b => ({
        id: b._id,
        userId: b.userId._id,
        userEmail: b.userId.email,
        userName: b.userId.name,
        movieId: b.movieId,
        movieTitle: b.movieTitle,
        theatreId: b.theatreId,
        theatreName: b.theatreName,
        showTime: b.showTime,
        seats: b.seats,
        amount: b.amount,
        status: b.status,
        bookingDate: b.bookingDate,
      })),
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
