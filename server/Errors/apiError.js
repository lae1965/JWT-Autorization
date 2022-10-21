export class ApiError extends Error {
  status;
  errorMessage;

  constructor(status, errorMessage) {
    super();
    this.status = status;
    this.errorMessage = errorMessage
  }

  static BadRequest(errorMessage) {
    return new ApiError(400, errorMessage);
  }

  static UnAuthorizate() {
    return new ApiError(401, 'Пользователь не  авторизован');
  }

  static InternalServerError(error) {
    return new ApiError(500, error.message);
  }
}