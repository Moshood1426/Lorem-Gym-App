"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
const authenticateUser = (req, res, next) => {
    const user = req.session.user;
    if (!user) {
        throw new errors_1.UnauthenticatedError("User not allowed to access this route");
    }
    next();
};
exports.default = authenticateUser;
