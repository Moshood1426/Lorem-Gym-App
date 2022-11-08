"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
//authenticate user
router.route("/").get(authMiddleware_1.default, userController_1.getUser);
router
    .route("/admin")
    .get(userController_1.getAdmin)
    .post((0, express_validator_1.body)("info")
    .isLength({ min: 1 })
    .withMessage("User info field cannot be empty"), userController_1.postAdmin);
exports.default = router;
