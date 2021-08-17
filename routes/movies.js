const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const { isURL } = require("validator");

const method = (value) => {
  const result = isURL(value);
  if (result) {
    return value;
  }
  throw new Error("URL validation err");
};
const {
  getMovies, createMovie, deleteMovie,
} = require("../controllers/movies");

router.get("/movies", getMovies);
router.post("/movies", celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(method),
    trailer: Joi.string().required().custom(method),
    thumbnail: Joi.string().required().custom(method),
    movieId: Joi.string().length(24).hex(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);
router.delete("/movies/:movieId", celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex(),
  }),
}), deleteMovie);
module.exports = router;
