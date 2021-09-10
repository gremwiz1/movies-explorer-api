const ALLOWED_CORS = [
  "localhost:3000",
  "https://diplom-yandex-practicum.site",
  "http://diplom-yandex-practicum.site",
  "https://praktikum.tk",
  "http://praktikum.tk",
];

const DEFAULT_ALLOWED_METHODS = "GET,HEAD,PUT,PATCH,POST,DELETE";

const cors = (req, res, next) => {
  const { method } = req;
  const requestHeaders = req.headers["access-control-request-headers"];
  const { origin } = req.headers;

  if (ALLOWED_CORS.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
  }

  if (method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", DEFAULT_ALLOWED_METHODS);
    res.header("Access-Control-Allow-Headers", requestHeaders);
    res.end();
  }

  next();
};

module.exports = cors;
