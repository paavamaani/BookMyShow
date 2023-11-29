const Movie = require('../models/movie');

/**
 *
 * @param {Object} request
 * @param {Object} response
 *
 * Add Movie
 */
exports.addMovie = (request, response) => {
  const newMovie = new Movie(request.body);

  newMovie
    .save()
    .then(() => {
      console.log('Movie added successfully');

      response.status(200).json({
        message: 'Movie added successfully',
      });
    })
    .catch((error) => {
      console.error('Error adding movie:', error);

      response.status(500).json({
        message: 'Error adding movie',
      });
    });
};

/**
 *
 * @param {Object} request
 * @param {Object} response
 *
 * Fetch Movies
 */
exports.fetchMovies = (request, response) => {
  const query = {
    $and: [
      { location: request.params.location },
      { theater: request.params.theater },
    ],
  };

  Movie.find(query)
    .then((movies) => {
      console.log('Movie fetched successfully', movies);

      response.status(200).json(movies);
    })
    .catch((error) => {
      console.error('Error fetching movie:', error);

      response.status(500).json({
        message: 'Error fetching movie',
      });
    });
};
