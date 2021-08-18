const Movie = require("../models/movie");
const BadRequestError = require("../errors/bad-request-err");
const NotFoundError = require("../errors/not-found-err");
const ForbiddenError = require("../errors/forbidden-err");
const ANSWER = require("../utils/answers");

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};
module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image, trailer, thumbnail, movieId, nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError(ANSWER.BadRequest));
      } else {
        next(err);
      }
    });
};
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new Error("NotValidIdMovie"))
    .then((movie) => {
      if (movie.owner.toString() === req.user._id.toString()) {
        movie.remove();
        return res.status(200).send({ message: ANSWER.MovieSuccessDelete });
      }
      return Promise.reject(new Error("YouNotOwnerMovie"));
    })
    .catch((err) => {
      if (err.message === "NotValidIdMovie") {
        next(new NotFoundError(ANSWER.NotFoundMovie));
      } else if (err.message === "YouNotOwnerMovie") {
        next(new ForbiddenError(ANSWER.ForbiddenDeleteMovie));
      } else if (err.name === "CastError") {
        next(new BadRequestError(ANSWER.BadRequest));
      } else {
        next(err);
      }
    });
};
