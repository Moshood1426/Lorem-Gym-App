import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const notFoundMiddleware = (req: Request, res: Response) => {
  res.render("not_found", { pageTitle: "Page Not Found" });
};

export default notFoundMiddleware;
