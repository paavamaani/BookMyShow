const express = require('express');

const movieController = require('../controllers/movieController');

const router = express.Router();

/**
 * Route for fetching movies
 */
router.get('/getmovies/:theater/:location', (request, response, next) => {
  console.log(
    'Route for fetching movies',
    request.params.theater,
    request.params.location
  );

  movieController.fetchMovies(request, response);
});

/**
 * Route for adding movie
 */
router.post('/addmovie', (request, response, next) => {
  console.log('Route for adding movie', request.body);

  movieController.addMovie(request, response);
});

module.exports = router;
