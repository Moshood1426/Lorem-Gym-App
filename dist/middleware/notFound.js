"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notFoundMiddleware = (req, res) => {
    res.render("not_found", { pageTitle: "Page Not Found" });
};
exports.default = notFoundMiddleware;
