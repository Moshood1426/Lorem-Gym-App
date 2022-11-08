import CustomAPIError from "./customAPIError";
import { StatusCodes } from "http-status-codes";

class UnauthorizedError extends CustomAPIError {
  statusCode;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

export default UnauthorizedError
