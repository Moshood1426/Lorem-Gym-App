"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedError = exports.BadRequestError = exports.NotFoundError = exports.UnauthenticatedError = exports.CustomAPIError = void 0;
const customAPIError_1 = __importDefault(require("./customAPIError"));
exports.CustomAPIError = customAPIError_1.default;
const unauthenticated_1 = __importDefault(require("./unauthenticated"));
exports.UnauthenticatedError = unauthenticated_1.default;
const notFound_1 = __importDefault(require("./notFound"));
exports.NotFoundError = notFound_1.default;
const badRequest_1 = __importDefault(require("./badRequest"));
exports.BadRequestError = badRequest_1.default;
const unauthorized_1 = __importDefault(require("./unauthorized"));
exports.UnauthorizedError = unauthorized_1.default;
