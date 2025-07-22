import {
  ERROR_BAD_REQUEST,
  ERROR_NOT_ENOUGH_FUNDS,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL
} from "../configs/userErrorMessages";

class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }

  static badRequest(): ApiError {
    return new ApiError(400, ERROR_BAD_REQUEST);
  }

  static notEnoughFunds(): ApiError {
    return new ApiError(403, ERROR_NOT_ENOUGH_FUNDS);
  }

  static notFound(): ApiError {
    return new ApiError(404, ERROR_NOT_FOUND);
  }

  static internal(): ApiError {
    return new ApiError(500, ERROR_INTERNAL);
  }
}

export default ApiError;
