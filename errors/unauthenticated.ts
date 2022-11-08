import CustomAPIError from "./customAPIError";
import { StatusCodes } from "http-status-codes";

class UnauthenticatedError extends CustomAPIError {
  statusCode;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

export default UnauthenticatedError
