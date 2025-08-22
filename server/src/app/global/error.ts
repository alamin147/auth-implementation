class AppError extends Error {
  statusCode: number;
  success: boolean = false;
  constructor(
    statusCode: number,
    message: string | undefined,
    stack = "",
    success: boolean = false
  ) {
    super(message);
    this.statusCode = statusCode;
    this.success = success;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
