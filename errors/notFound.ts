import CustomAPIError from "./customAPIError";
import { StatusCodes } from "http-status-codes";

class NotFoundError extends CustomAPIError {
  statusCode;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

export default NotFoundError;
