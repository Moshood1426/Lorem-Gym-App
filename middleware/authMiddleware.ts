import { Request, Response, NextFunction } from "express";
import { UnauthenticatedError, BadRequestError } from "../errors";

const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  const user = req.session.user;
 
  if (!user) {
    throw new UnauthenticatedError("User not allowed to access this route");
  }

  next();
};

export default authenticateUser;
