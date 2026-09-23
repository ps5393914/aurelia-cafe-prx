const Reservation = require('../models/Reservation');

// @desc    Create new reservation
// @route   POST /api/reservations
// @access  Public
const createReservation = async (req, res) => {
  try {
    const { name, email, phone, date, time, guests, specialRequest } = req.body;

    const reservation = new Reservation({
      name,
      email,
      phone,
      date,
      time,
      guests,
      specialRequest,
    });

    const createdReservation = await reservation.save();
    res.status(201).json(createdReservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reservations
// @route   GET /api/reservations
// @access  Private/Admin
const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({}).sort({ createdAt: -1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update reservation status
// @route   PUT /api/reservations/:id
// @access  Private/Admin
const updateReservationStatus = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (reservation) {
      reservation.status = req.body.status || reservation.status;
      const updatedReservation = await reservation.save();
      res.json(updatedReservation);
    } else {
      res.status(404).json({ message: 'Reservation not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a reservation
// @route   DELETE /api/reservations/:id
// @access  Private/Admin
const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (reservation) {
      await reservation.deleteOne();
      res.json({ message: 'Reservation removed' });
    } else {
      res.status(404).json({ message: 'Reservation not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReservation,
  getReservations,
  updateReservationStatus,
  deleteReservation,
};
