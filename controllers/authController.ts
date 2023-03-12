import { Request, Response, NextFunction } from "express";
import { BadRequestError, UnauthenticatedError } from "../errors";
import { validationResult } from "express-validator/src/validation-result";
import User from "../models/userModel";
import bcrypt from "bcryptjs";
// import { createJWT } from "../utils/jwt";
import Subscription from "../models/subModel";
import { sequelize } from "../db/connectDB";
import moment from "moment";
import { Sequelize } from "sequelize";

const register = (req: Request, res: Response, next: NextFunction) => {
  res.render("register/register_1", {
    pageTitle: "Register",
    alertText: "",
    alertType: "",
    showAlert: false,
    formValue: { email: "", password: "", firstName: "", lastName: "" },
  });
};

const initializeReg = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body as {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  };
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("register/register_1", {
      pageTitle: "Register",
      alertText: errors.array()[0].msg,
      showAlert: true,
      alertType: "danger",
      formValue: { email, password, firstName, lastName },
    });
  }

  const userExists = await User.findOne({ where: { email: email } });

  if (userExists) {
    return res.status(422).render("register/register_1", {
      pageTitle: "Register",
      alertText: "User with this email exist",
      showAlert: true,
      alertType: "danger",
      formValue: { email, password, firstName, lastName },
    });
  }

  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(password, salt);
  const user = await User.create({ ...req.body });

  req.session.user = user.id;

  res.render("register/register_2", {
    pageTitle: "Register",
    alertText: "",
    showAlert: false,
    alertType: "",
    formValue: { gender: "", employment: "", number: "" },
  });
};

const getCompleteReg = async (req: Request, res: Response) => {
  res.render("register/register_2", {
    pageTitle: "Register",
    alertText: "",
    showAlert: false,
    alertType: "",
    formValue: { gender: "", employment: "", number: "" },
  });
};

const completeReg = async (req: Request, res: Response) => {
  const { gender, employment, number } = req.body as {
    gender: string;
    employment: string;
    number: string;
  };
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("register/register_2", {
      pageTitle: "Register",
      alertText: errors.array()[0].msg,
      showAlert: true,
      alertType: "danger",
      formValue: { gender, employment, number },
    });
  }

  const userId = req.session.user!;

  const user = await User.findByPk(userId);

  if (!user) {
    throw new UnauthenticatedError("user not allowed to access this route");
  }

  user.gender = req.body.gender;
  user.employment = req.body.employment;
  user.number = req.body.number;
  await user.save();

  res.render("register/register_3", {
    pageTitle: "Register",
    alertText: "",
    showAlert: false,
    alertType: "",
    checkout: false,
    subtype: "",
    amount: 0,
  });
};

const getSelectSub = async (req: Request, res: Response) => {
  res.render("register/register_3", {
    pageTitle: "Register",
    alertText: "",
    showAlert: false,
    alertType: "",
    checkout: false,
    subtype: "",
    amount: 0,
  });
};

const selectSub = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("register/register_3", {
      pageTitle: "Register",
      alertText: errors.array()[0].msg,
      showAlert: true,
      alertType: "danger",
      checkout: true,
      subtype: "",
      amount: 0,
    });
  }

  const userId = req.session.user!;

  const sub = await Subscription.create({ ...req.body, UserId: userId });

  res.render("register/register_3", {
    pageTitle: "Register",
    alertText: "",
    showAlert: false,
    alertType: "",
    checkout: true,
    subtype: sub.subtype,
    amount: sub.subtype === "basic" ? 27.22 : 227.22,
  });
};

const checkout = async (req: Request, res: Response) => {
  const userId = req.session.user!;

  const sub = await Subscription.findOne({ where: { UserId: userId } });

  if (!sub) {
    throw new UnauthenticatedError("User not allowed to access this route");
  }

  const days = sub.subtype === "basic" ? 30 : 365;
  const date = moment().add(days, "days").format("YYYY-MM-DD HH:mm:ss");
  const identifier = sub.subtype + userId + sub.id;

  sub.active = true;
  // @ts-ignore
  sub.expires = date;
  if (!sub.identifier) {
    sub.identifier = identifier;
  }
  await sub.save();

  req.session.save((err) => {
    if (err) {
      throw new UnauthenticatedError(
        "Something went wrong. Kindly try again later"
      );
    }
    res.redirect("/user");
  });
};

const getLogin = (req: Request, res: Response, next: NextFunction) => {
  res.render("sign_in", {
    pageTitle: "Login",
    showAlert: false,
    alertText: "",
    alertType: "",
    formValue: { email: "", password: "" },
  });
};

const postLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body as { email: string; password: string };
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).render("sign_in", {
      pageTitle: "sign_in",
      alertText: errors.array()[0].msg,
      showAlert: true,
      alertType: "danger",
      formValue: { email, password },
    });
    return;
  }

  //check if userExists
  const user = await User.findOne({ where: { email: email } });
  if (!user) {
    res.render("sign_in", {
      pageTitle: "Login",
      showAlert: true,
      alertText: "Invalid Credentials. Kindly re-check the email or password",
      alertType: "danger",
      formValue: { email, password },
    });
    return;
  }

  //check if password match
  const passwordIsValid = await bcrypt.compare(password, user?.password!);
  if (!passwordIsValid) {
    res.render("sign_in", {
      pageTitle: "Login",
      showAlert: true,
      alertText: "Invalid Credentials. Kindly re-check the email or password",
      alertType: "danger",
      formValue: { email, password },
    });
    return;
  }

  //authenticate user session
  req.session.user = user!.id;

  //check if user registration is complete: if not, redirect to complete registration
  if (!user?.employment) {
    req.session.save((err) => {
      if (err) {
        throw new UnauthenticatedError(
          "Something went wrong. Kindly try again later"
        );
      }
      res.redirect("/auth/completeReg");
    });
    return;
  }

  //check if user has subscribed in the past
  const subscription = await Subscription.findOne({
    where: { UserId: req.session.user },
  });

  if (!subscription) {
    req.session.save((err) => {
      if (err) {
        throw new UnauthenticatedError(
          "Something went wrong. Kindly try again later"
        );
      }
      res.redirect("/auth/selectSub");
    });
    return;
  }

  //redirect if all checks succeed
  req.session.save((err) => {
    if (err) {
      throw new UnauthenticatedError(
        "Something went wrong. Kindly try again later"
      );
    }
    res.redirect("/user");
  });
};

const logout = (req: Request, res: Response) => {

  req.session.destroy(err => {
    if (err) {
      throw new UnauthenticatedError(
        "Something went wrong. Kindly try again later"
      );
    }
    res.redirect('/');
  });
};

export {
  getLogin,
  postLogin,
  register,
  initializeReg,
  completeReg,
  selectSub,
  getCompleteReg,
  getSelectSub,
  checkout,
  logout,
};
