export class ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: unknown ;

  constructor(statusCode: number,  message: string = "Success",data:unknown = null) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = statusCode < 400;
  }
}
