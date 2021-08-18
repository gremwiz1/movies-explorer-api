const mongoose = require("mongoose");
const { isURL } = require("validator");
const ANSWER = require("../utils/answers");

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
      message: ANSWER.ImageNotUrl,
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isURL(v),
      message: ANSWER.TrailerNotUrl,
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isURL(v),
      message: ANSWER.ThumbnailNotUrl,
    },
  },
  owner: {
    type: mongoose.ObjectId,
    required: true,
    ref: "user",
  },
  movieId: {
    type: String,
    required: true,
    minLength: 1,
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
