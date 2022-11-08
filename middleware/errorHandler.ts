import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { UnauthenticatedError } from "../errors";

const errorHandlerMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //custom error declaration
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong try again later",
  };

  req.session.user = undefined;

  req.session.save((err) => {
    if (err) {
      throw new UnauthenticatedError(
        "Something went wrong. Kindly try again later"
      );
    }
    res.render('error', { pageTitle: 'Error Page' })
  });
};

export default errorHandlerMiddleware;
