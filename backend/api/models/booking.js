const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  seat: String,
  movie: String,
  theater: String,
  location: String,
  time: String,
  screen: String,
  isRefunded: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Booking', bookingSchema);
