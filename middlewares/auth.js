const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../errors/unauthorized-err");
const ANSWER = require("../utils/answers");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const { JWT_SECRET = "dev-key" } = process.env;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    next(new UnauthorizedError(ANSWER.DemandAuthorization));
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new UnauthorizedError(ANSWER.DemandAuthorization));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
