"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postAdmin = exports.getAdmin = exports.getUser = void 0;
const subModel_1 = __importDefault(require("../models/subModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const validation_result_1 = require("express-validator/src/validation-result");
const moment_1 = __importDefault(require("moment"));
const getUser = async (req, res) => {
    const user = await userModel_1.default.findOne({ where: { id: req.session.user } });
    const subscription = await subModel_1.default.findOne({
        where: { UserId: req.session.user },
    });
    const userInfo = {
        name: (user === null || user === void 0 ? void 0 : user.firstName) + " " + user.lastName,
        gender: (user === null || user === void 0 ? void 0 : user.gender) === "male" ? "M" : user.gender === "female" ? "F" : "O",
        employment: user === null || user === void 0 ? void 0 : user.employment,
        number: user === null || user === void 0 ? void 0 : user.number,
        email: user === null || user === void 0 ? void 0 : user.email,
    };
    const daysRemaining = (subscription === null || subscription === void 0 ? void 0 : subscription.active) === false
        ? "0"
        : (0, moment_1.default)(subscription === null || subscription === void 0 ? void 0 : subscription.expires).diff((0, moment_1.default)(), "days");
    const subInfo = {
        identifier: subscription === null || subscription === void 0 ? void 0 : subscription.identifier,
        subStatus: (subscription === null || subscription === void 0 ? void 0 : subscription.active) ? "ACTIVE" : "EXPIRED",
        subType: subscription === null || subscription === void 0 ? void 0 : subscription.subtype,
        amount: (subscription === null || subscription === void 0 ? void 0 : subscription.subtype) === "basic" ? "$27.22" : "$227.22",
        expiryDate: (0, moment_1.default)(subscription === null || subscription === void 0 ? void 0 : subscription.expires).format("MMMM Do YYYY HH:mm"),
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
exports.getUser = getUser;
const getAdmin = (req, res) => {
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
exports.getAdmin = getAdmin;
const postAdmin = async (req, res) => {
    const info = req.body.info;
    const errors = (0, validation_result_1.validationResult)(req);
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
    let user;
    let sub;
    user = await userModel_1.default.findOne({ where: { email: info } });
    if (!user) {
        sub = await subModel_1.default.findOne({ where: { identifier: info } });
        if (!sub) {
            res.status(422).render("user/admin", {
                pageTitle: "Admin",
                alertText: 'User with info does not exist',
                showAlert: true,
                alertType: "danger",
                formValue: { info },
                userInfo: null,
                subInfo: null
            });
            return;
        }
        else {
            user = await userModel_1.default.findOne({ where: { id: sub.UserId } });
        }
    }
    sub = await subModel_1.default.findOne({ where: { UserId: user === null || user === void 0 ? void 0 : user.id } });
    const userInfo = {
        name: (user === null || user === void 0 ? void 0 : user.firstName) + " " + user.lastName,
        gender: (user === null || user === void 0 ? void 0 : user.gender) === "male" ? "M" : user.gender === "female" ? "F" : "O",
        email: user === null || user === void 0 ? void 0 : user.email,
    };
    const subInfo = {
        identifier: sub === null || sub === void 0 ? void 0 : sub.identifier,
        subStatus: (sub === null || sub === void 0 ? void 0 : sub.active) ? "ACTIVE" : "EXPIRED",
        subType: sub === null || sub === void 0 ? void 0 : sub.subtype,
        amount: (sub === null || sub === void 0 ? void 0 : sub.subtype) === "basic" ? "$27.22" : "$227.22",
        expiryDate: (0, moment_1.default)(sub === null || sub === void 0 ? void 0 : sub.expires).format("MMMM Do YYYY HH:mm"),
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
exports.postAdmin = postAdmin;
