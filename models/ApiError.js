import {
  ERROR_BAD_REQUEST,
  ERROR_INTERNAL,
  ERROR_NOT_FOUND
} from "../configs/userErrorMessages.js";

class ApiError {
  constructor(status, message) {
    this.status = status;
    this.message = message
  }

  static badRequest() {
    return new ApiError(400, ERROR_BAD_REQUEST);
  }
  static notFound() {
    return new ApiError(404, ERROR_NOT_FOUND);
  }
  static internal() {
    return new ApiError(500, ERROR_INTERNAL);
  }
}

export default ApiError;
