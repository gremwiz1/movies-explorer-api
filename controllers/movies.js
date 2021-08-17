const Movie = require("../models/movie");
const BadRequestError = require("../errors/bad-request-err");
const NotFoundError = require("../errors/not-found-err");
const ForbiddenError = require("../errors/forbidden-err");

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
        next(new BadRequestError(`Переданы не корректные данные: ${err}`));
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
        return res.status(200).send({ message: "Фильм успешно удален" });
      }
      return Promise.reject(new Error("YouNotOwnerMovie"));
    })
    .catch((err) => {
      if (err.message === "NotValidIdMovie") {
        next(new NotFoundError("Фильма с таким id не существует"));
      } else if (err.message === "YouNotOwnerMovie") {
        next(new ForbiddenError("Вы не можете удалить фильм, так как вы не его собственник"));
      } else if (err.name === "CastError") {
        next(new BadRequestError(`Переданы не корректные данные: ${err}`));
      } else {
        next(err);
      }
    });
};
