"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
const errorHandlerMiddleware = (err, req, res, next) => {
    //custom error declaration
    let customError = {
        statusCode: err.statusCode || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || "Something went wrong try again later",
    };
    req.session.user = undefined;
    req.session.save((err) => {
        if (err) {
            throw new errors_1.UnauthenticatedError("Something went wrong. Kindly try again later");
        }
        res.render('error', { pageTitle: 'Error Page' });
    });
};
exports.default = errorHandlerMiddleware;
