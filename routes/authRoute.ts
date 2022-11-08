import express from "express";
import { Request, Response, NextFunction } from "express";
import {
  getLogin,
  register,
  initializeReg,
  completeReg,
  selectSub,
  getCompleteReg,
  getSelectSub,
  checkout,
  postLogin,
  logout,
} from "../controllers/authController";
import { body } from "express-validator";
import authenticateUser from "../middleware/authMiddleware";

const router = express.Router();

router
  .route("/login")
  .get(getLogin)
  .post(
    [
      body("email").isEmail().withMessage("Invalid email input"),
      body("password").isLength({ min: 1 }).withMessage("Kindly enter a password"),
    ],
    postLogin
  );

router
  .route("/register")
  .get(register)
  .post(
    [
      body("email").isEmail().withMessage("Invalid email input"),
      body("password")
        .isLength({ min: 5 })
        .withMessage("Your password should be more than 5 characters"),
      body("firstName")
        .isLength({ min: 3, max: 15 })
        .withMessage("first name should be between 3 and 20 characters"),
      body("lastName")
        .isLength({ min: 3, max: 15 })
        .withMessage("last name should be between 3 and 20 characters"),
    ],
    initializeReg
  );

router
  .route("/completeReg")
  .get(getCompleteReg)
  .post(
    authenticateUser,
    [
      body("gender")
        .isIn(["male", "female", "others"])
        .withMessage("Kindly select a valid gender option"),
      body("employment")
        .isIn(["student", "employed", "unemployed", "self-employed"])
        .withMessage("Kindly select a valid employment status"),
      body("number")
        .isLength({ min: 8, max: 15 })
        .withMessage("Kindly input valid mobile number"),
    ],
    completeReg
  );

router
  .route("/selectSub")
  .get(getSelectSub)
  .post(
    authenticateUser,
    body("subtype")
      .isIn(["basic", "premium"])
      .withMessage("Kindly select a valid subscription option"),
    selectSub
  );

router.route("/checkout").post(authenticateUser, checkout);

router.route('/logout').get(logout)

export default router;
