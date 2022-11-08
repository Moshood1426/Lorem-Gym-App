"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_session_1 = __importDefault(require("express-session"));
const serve_favicon_1 = __importDefault(require("serve-favicon"));
const helmet_1 = __importDefault(require("helmet"));
//@ts-ignore
const xss_clean_1 = __importDefault(require("xss-clean"));
const connectDB_1 = __importStar(require("./db/connectDB"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const userModel_1 = __importDefault(require("./models/userModel"));
const subModel_1 = __importDefault(require("./models/subModel"));
require("express-async-errors");
const notFound_1 = __importDefault(require("./middleware/notFound"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const SequelizeStore = require("connect-session-sequelize")(express_session_1.default.Store);
const store = new SequelizeStore({ db: connectDB_1.sequelize });
const app = (0, express_1.default)();
dotenv_1.default.config();
app.set("view engine", "ejs");
app.set("views", "views");
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
}));
app.use((0, xss_clean_1.default)());
app.use((0, helmet_1.default)());
app.use((0, serve_favicon_1.default)(path_1.default.join(__dirname, "/../public/assets/images", "favicon.ico")));
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static(path_1.default.join(__dirname, "/../public")));
app.use("/auth", authRoute_1.default);
app.use("/user", userRoute_1.default);
app.get("/", (req, res, next) => {
    res.render("landing", { pageTitle: "Lorem Gym" });
});
app.use(notFound_1.default);
app.use(errorHandler_1.default);
const PORT = process.env.PORT || 5000;
userModel_1.default.hasOne(subModel_1.default);
subModel_1.default.belongsTo(userModel_1.default);
const start = async () => {
    try {
        await (0, connectDB_1.default)();
        app.listen(PORT, () => {
            console.log("app is listening on port 5000");
        });
    }
    catch (error) {
        console.log(error);
    }
};
start();
