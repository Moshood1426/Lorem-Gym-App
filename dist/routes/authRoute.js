"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const express_validator_1 = require("express-validator");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = express_1.default.Router();
router
    .route("/login")
    .get(authController_1.getLogin)
    .post([
    (0, express_validator_1.body)("email").isEmail().withMessage("Invalid email input"),
    (0, express_validator_1.body)("password").isLength({ min: 1 }).withMessage("Kindly enter a password"),
], authController_1.postLogin);
router
    .route("/register")
    .get(authController_1.register)
    .post([
    (0, express_validator_1.body)("email").isEmail().withMessage("Invalid email input"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 5 })
        .withMessage("Your password should be more than 5 characters"),
    (0, express_validator_1.body)("firstName")
        .isLength({ min: 3, max: 15 })
        .withMessage("first name should be between 3 and 20 characters"),
    (0, express_validator_1.body)("lastName")
        .isLength({ min: 3, max: 15 })
        .withMessage("last name should be between 3 and 20 characters"),
], authController_1.initializeReg);
router
    .route("/completeReg")
    .get(authController_1.getCompleteReg)
    .post(authMiddleware_1.default, [
    (0, express_validator_1.body)("gender")
        .isIn(["male", "female", "others"])
        .withMessage("Kindly select a valid gender option"),
    (0, express_validator_1.body)("employment")
        .isIn(["student", "employed", "unemployed", "self-employed"])
        .withMessage("Kindly select a valid employment status"),
    (0, express_validator_1.body)("number")
        .isLength({ min: 8, max: 15 })
        .withMessage("Kindly input valid mobile number"),
], authController_1.completeReg);
router
    .route("/selectSub")
    .get(authController_1.getSelectSub)
    .post(authMiddleware_1.default, (0, express_validator_1.body)("subtype")
    .isIn(["basic", "premium"])
    .withMessage("Kindly select a valid subscription option"), authController_1.selectSub);
router.route("/checkout").post(authMiddleware_1.default, authController_1.checkout);
router.route('/logout').get(authController_1.logout);
exports.default = router;
