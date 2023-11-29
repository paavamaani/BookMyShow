const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const movieRoute = require('./api/routes/movie');

const app = express();

mongoose.connect(
  `mongodb+srv://admin:${process.env.MONGO_DB_PASSWORD}@cluster0.bdygguu.mongodb.net/`
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Headers', '*');

  if (request.method === 'OPTIONS') {
    request.header('Access-Control-Allow-Methods', '*');
    return response.status(200).json({});
  }

  next();
});

app.use('/movie', movieRoute);

app.use((request, response, next) => {
  const error = new Error('Not found API');
  error.status = 404;
  next(error);
});

app.use((error, request, response, next) => {
  response.status(error.status || 500).json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
