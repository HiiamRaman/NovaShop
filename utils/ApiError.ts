export class ApiError extends Error {
  statusCode: number;
  data: unknown | null;
  success: boolean;
  errors: unknown[];
  stack?: string | undefined;

  constructor(
    statusCode: number,
    message: string = "something went wrong !",
    errors: unknown[] = [],
    data: unknown = null,
    stack: string = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
    this.name = "ApiError";

    this.success = false;
    this.errors = errors;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
