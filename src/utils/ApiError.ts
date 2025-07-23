class ApiError extends Error {
  statusCode: number;
  isOperationl: boolean;
  override stack?: string;

  constructor(statusCode: number, message: string, isOperational = true, stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.isOperationl = isOperational;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};
export default ApiError;
