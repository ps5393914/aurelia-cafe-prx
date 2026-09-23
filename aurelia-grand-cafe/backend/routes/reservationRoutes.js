const express = require('express');
const router = express.Router();
const {
  createReservation,
  getReservations,
  updateReservationStatus,
  deleteReservation,
} = require('../controllers/reservationController');
const { protect, admin } = require('../middleware/authMiddleware');

router
  .route('/')
  .post(createReservation)
  .get(protect, admin, getReservations);
router
  .route('/:id')
  .put(protect, admin, updateReservationStatus)
  .delete(protect, admin, deleteReservation);

module.exports = router;
