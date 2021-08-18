const ANSWER = {
  BadRequest: "Переданы не корректные данные",
  MovieSuccessDelete: "Фильм успешно удален",
  NotFoundMovie: "Фильма с таким id не существует",
  ForbiddenDeleteMovie: "Вы не можете удалить фильм, так как вы не его собственник",
  BadRequestUser: "Некорректный id пользователя",
  UserNotFound: "Нет пользователя с таким id",
  UserEmailExist: "Пользователь с таким email уже существует в базе",
  WrongEmailOrPassword: "Неправильная почта или пароль",
  DemandAuthorization: "Необходима авторизация",
  ServerError: "На сервере произошла ошибка",
  ImageNotUrl: "Поле image не является ссылкой",
  TrailerNotUrl: "Поле trailer не является ссылкой",
  ThumbnailNotUrl: "Поле thumbnail не является ссылкой",
  NotCorrectEmail: "Некорректная почта",
  NotFoundPage: "Такой страницы не существует",
  NotCorrectUrl: "URL validation err",
};
module.exports = ANSWER;
