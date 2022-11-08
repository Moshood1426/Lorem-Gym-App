import { Request, Response, NextFunction } from "express";
import Subscription from "../models/subModel";
import User from "../models/userModel";
import { validationResult } from "express-validator/src/validation-result";
import moment from "moment";

const getUser = async (req: Request, res: Response) => {
  const user = await User.findOne({ where: { id: req.session.user } });
  const subscription = await Subscription.findOne({
    where: { UserId: req.session.user },
  });

  const userInfo = {
    name: user?.firstName + " " + user!.lastName,
    gender:
      user?.gender === "male" ? "M" : user!.gender === "female" ? "F" : "O",
    employment: user?.employment,
    number: user?.number,
    email: user?.email,
  };

  const daysRemaining =
    subscription?.active === false
      ? "0"
      : moment(subscription?.expires).diff(moment(), "days");

  const subInfo = {
    identifier: subscription?.identifier,
    subStatus: subscription?.active ? "ACTIVE" : "EXPIRED",
    subType: subscription?.subtype,
    amount: subscription?.subtype === "basic" ? "$27.22" : "$227.22",
    expiryDate: moment(subscription?.expires).format("MMMM Do YYYY HH:mm"),
    daysRemaining: `${daysRemaining} days left`,
  };

  res.render("user/user", {
    pageTitle: "Welcome User",
    alertText: "",
    alertType: "",
    showAlert: false,
    userInfo,
    subInfo,
  });
};

const getAdmin = (req: Request, res: Response) => {
  res.render("user/admin", {
    pageTitle: "Admin",
    showAlert: false,
    alertText: "",
    alertType: "",
    formValue: { info: "" },
    userInfo: null,
    subInfo: null
  });
};

const postAdmin = async (req: Request, res: Response) => {
  const info = req.body.info;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("user/admin", {
      pageTitle: "Admin",
      alertText: errors.array()[0].msg,
      showAlert: true,
      alertType: "danger",
      formValue: { info },
      userInfo: null,
      subInfo: null
    });
  }

  let user
  let sub
  user = await User.findOne({ where: { email: info } });

  if(!user) {
    sub = await Subscription.findOne({ where: { identifier: info } });
    if(!sub) {
       res.status(422).render("user/admin", {
        pageTitle: "Admin",
        alertText: 'User with info does not exist',
        showAlert: true,
        alertType: "danger",
        formValue: { info },
        userInfo: null,
        subInfo: null
      });
      return
    } else {
      user = await User.findOne({ where: { id: sub.UserId } });
    } 
  }

  sub = await Subscription.findOne({ where: { UserId: user?.id } });

  const userInfo = {
    name: user?.firstName + " " + user!.lastName,
    gender:
      user?.gender === "male" ? "M" : user!.gender === "female" ? "F" : "O",
    email: user?.email,
  };

  const subInfo = {
    identifier: sub?.identifier,
    subStatus: sub?.active ? "ACTIVE" : "EXPIRED",
    subType: sub?.subtype,
    amount: sub?.subtype === "basic" ? "$27.22" : "$227.22",
    expiryDate: moment(sub?.expires).format("MMMM Do YYYY HH:mm"),
  };
  
  res.render("user/admin", {
    pageTitle: "Admin",
    showAlert: false,
    alertText: "",
    alertType: "",
    formValue: { info: "" },
    userInfo,
    subInfo
  });
};

export { getUser, getAdmin, postAdmin };
