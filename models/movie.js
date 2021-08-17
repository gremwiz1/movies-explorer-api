const mongoose = require("mongoose");
const { isURL } = require("validator");

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isURL(v),
      message: "Поле image не является ссылкой",
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isURL(v),
      message: "Поле trailer не является ссылкой",
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isURL(v),
      message: "Поле thumbnail не является ссылкой",
    },
  },
  owner: {
    type: mongoose.ObjectId,
    required: true,
    ref: "user",
  },
  movieId: {
    type: mongoose.ObjectId,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("movie", movieSchema);
