const mongoose = require('mongoose');

const reservationSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    guests: { type: Number, required: true },
    specialRequest: { type: String, default: '' },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'Confirmed', 'Cancelled'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation;
