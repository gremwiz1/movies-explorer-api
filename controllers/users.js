const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const BadRequestError = require("../errors/bad-request-err");
const NotFoundError = require("../errors/not-found-err");
const ConflictError = require("../errors/conflict-err");
const UnauthorizedError = require("../errors/unauthorized-err");

module.exports.getInfoAboutMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Некорректный id пользователя"));
      } else {
        next(err);
      }
    });
};
module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email },
    { new: true, runValidators: true, upsert: true })
    .orFail(new Error("NotValidIdUser"))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === "NotValidIdUser") {
        next(new NotFoundError("Нет пользователя с таким id"));
      } else if (err.name === "ValidationError") {
        next(new BadRequestError(`Переданы не корректные данные: ${err}`));
      } else {
        next(err);
      }
    });
};
module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  User.findOne({ email })
    .then((customer) => {
      if (customer) {
        throw new ConflictError("Пользователь с таким email уже существует в базе");
      }
      return bcrypt.hash(password, 10)
        .then((hash) => User.create({
          name, email, password: hash,
        }))
        .then((user) => {
          res.status(200).send({
            name: user.name,
            _id: user._id,
            email: user.email,
          });
        })
        .catch((err) => {
          if (err.name === "ValidationError") {
            next(new BadRequestError(`Переданы не корректные данные: ${err}`));
          } else {
            next(err);
          }
        });
    }).catch(next);
};
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  const { JWT_SECRET = "dev-key" } = process.env;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: "7d" },
      );
      res.status(200).send({ token });
    })
    .catch((err) => {
      if (err.message === "IncorrectEmailOrPassword") {
        next(new UnauthorizedError("Неправильная почта или пароль"));
      } else {
        next(err);
      }
    });
};
