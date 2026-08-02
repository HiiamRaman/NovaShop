export class ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: unknown ;

  constructor(statusCode: number, data:unknown = null, message: string = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}
