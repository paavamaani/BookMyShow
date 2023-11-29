const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  theater: String,
  title: String,
  show: Array,
  seating_capacity: Number,
  price: String,
  language: String,
  location: String,
  release_date: Date,
});

module.exports = mongoose.model('Movie', movieSchema);
