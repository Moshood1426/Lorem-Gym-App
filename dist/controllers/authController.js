"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.checkout = exports.getSelectSub = exports.getCompleteReg = exports.selectSub = exports.completeReg = exports.initializeReg = exports.register = exports.postLogin = exports.getLogin = void 0;
const errors_1 = require("../errors");
const validation_result_1 = require("express-validator/src/validation-result");
const userModel_1 = __importDefault(require("../models/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const subModel_1 = __importDefault(require("../models/subModel"));
const moment_1 = __importDefault(require("moment"));
const register = (req, res, next) => {
    res.render("register/register_1", {
        pageTitle: "Register",
        alertText: "",
        alertType: "",
        showAlert: false,
        formValue: { email: "", password: "", firstName: "", lastName: "" },
    });
};
exports.register = register;
const initializeReg = async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    const errors = (0, validation_result_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).render("register/register_1", {
            pageTitle: "Register",
            alertText: errors.array()[0].msg,
            showAlert: true,
            alertType: "danger",
            formValue: { email, password, firstName, lastName },
        });
    }
    const userExists = await userModel_1.default.findOne({ where: { email: email } });
    if (userExists) {
        return res.status(422).render("register/register_1", {
            pageTitle: "Register",
            alertText: "User with this email exist",
            showAlert: true,
            alertType: "danger",
            formValue: { email, password, firstName, lastName },
        });
    }
    const salt = await bcryptjs_1.default.genSalt(10);
    req.body.password = await bcryptjs_1.default.hash(password, salt);
    const user = await userModel_1.default.create({ ...req.body });
    req.session.user = user.id;
    res.render("register/register_2", {
        pageTitle: "Register",
        alertText: "",
        showAlert: false,
        alertType: "",
        formValue: { gender: "", employment: "", number: "" },
    });
};
exports.initializeReg = initializeReg;
const getCompleteReg = async (req, res) => {
    res.render("register/register_2", {
        pageTitle: "Register",
        alertText: "",
        showAlert: false,
        alertType: "",
        formValue: { gender: "", employment: "", number: "" },
    });
};
exports.getCompleteReg = getCompleteReg;
const completeReg = async (req, res) => {
    const { gender, employment, number } = req.body;
    const errors = (0, validation_result_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).render("register/register_2", {
            pageTitle: "Register",
            alertText: errors.array()[0].msg,
            showAlert: true,
            alertType: "danger",
            formValue: { gender, employment, number },
        });
    }
    const userId = req.session.user;
    const user = await userModel_1.default.findByPk(userId);
    if (!user) {
        throw new errors_1.UnauthenticatedError("user not allowed to access this route");
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
exports.completeReg = completeReg;
const getSelectSub = async (req, res) => {
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
exports.getSelectSub = getSelectSub;
const selectSub = async (req, res) => {
    const errors = (0, validation_result_1.validationResult)(req);
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
    const userId = req.session.user;
    const sub = await subModel_1.default.create({ ...req.body, UserId: userId });
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
exports.selectSub = selectSub;
const checkout = async (req, res) => {
    const userId = req.session.user;
    const sub = await subModel_1.default.findOne({ where: { UserId: userId } });
    if (!sub) {
        throw new errors_1.UnauthenticatedError("User not allowed to access this route");
    }
    const days = sub.subtype === "basic" ? 30 : 365;
    const date = (0, moment_1.default)().add(days, "days").format("YYYY-MM-DD HH:mm:ss");
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
            throw new errors_1.UnauthenticatedError("Something went wrong. Kindly try again later");
        }
        res.redirect("/user");
    });
};
exports.checkout = checkout;
const getLogin = (req, res, next) => {
    res.render("sign_in", {
        pageTitle: "Login",
        showAlert: false,
        alertText: "",
        alertType: "",
        formValue: { email: "", password: "" },
    });
};
exports.getLogin = getLogin;
const postLogin = async (req, res, next) => {
    const { email, password } = req.body;
    const errors = (0, validation_result_1.validationResult)(req);
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
    const user = await userModel_1.default.findOne({ where: { email: email } });
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
    const passwordIsValid = await bcryptjs_1.default.compare(password, user === null || user === void 0 ? void 0 : user.password);
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
    req.session.user = user.id;
    //check if user registration is complete: if not, redirect to complete registration
    if (!(user === null || user === void 0 ? void 0 : user.employment)) {
        req.session.save((err) => {
            if (err) {
                throw new errors_1.UnauthenticatedError("Something went wrong. Kindly try again later");
            }
            res.redirect("/auth/completeReg");
        });
        return;
    }
    //check if user has subscribed in the past
    const subscription = await subModel_1.default.findOne({
        where: { UserId: req.session.user },
    });
    if (!subscription) {
        req.session.save((err) => {
            if (err) {
                throw new errors_1.UnauthenticatedError("Something went wrong. Kindly try again later");
            }
            res.redirect("/auth/selectSub");
        });
        return;
    }
    //redirect if all checks succeed
    req.session.save((err) => {
        if (err) {
            throw new errors_1.UnauthenticatedError("Something went wrong. Kindly try again later");
        }
        res.redirect("/user");
    });
};
exports.postLogin = postLogin;
const logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            throw new errors_1.UnauthenticatedError("Something went wrong. Kindly try again later");
        }
        res.redirect('/');
    });
};
exports.logout = logout;
