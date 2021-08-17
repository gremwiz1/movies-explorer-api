const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const { errors } = require("celebrate");
const limiter = require("./middlewares/limiter");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const errorsMiddlewares = require("./middlewares/errors");
const usersRouter = require("./routes/users");
const moviesRouter = require("./routes/movies");
const errorsRouter = require("./routes/errors");
const auth = require("./middlewares/auth");
const authorizationRouter = require("./routes/index");

const { DB_CONNECTION_STRING, NODE_ENV } = process.env;
const { PORT = 3000 } = process.env;
const allowedCors = [
  "localhost:3000",
  "https://praktikum.tk",
  "http://praktikum.tk",
];
const app = express();
app.use(helmet());
app.use(express.json());
mongoose.connect(NODE_ENV === "production" ? DB_CONNECTION_STRING : "mongodb://localhost:27017/moviesdb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
app.use(requestLogger); // подключаем логгер запросов
app.use(limiter);
app.use((req, res, next) => {
  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
  // проверяем, что источник запроса есть среди разрешённых
  const { methodHttp } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную
  const requestHeaders = req.headers["access-control-request-headers"];
  const DEFAULT_ALLOWED_METHODS = "GET,HEAD,PUT,PATCH,POST,DELETE";
  if (allowedCors.includes(origin)) {
    // устанавливаем заголовок, который разрешает браузеру запросы с этого источника
    res.header("Access-Control-Allow-Origin", origin);
  }
  if (methodHttp === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", DEFAULT_ALLOWED_METHODS);
    res.header("Access-Control-Allow-Headers", requestHeaders);
    return res.end();
  }
  return next();
});
app.use("/", authorizationRouter);
app.use(auth);
app.use("/", usersRouter);
app.use("/", moviesRouter);
app.use("*", errorsRouter);
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(errorsMiddlewares);
app.listen(PORT, () => { });
