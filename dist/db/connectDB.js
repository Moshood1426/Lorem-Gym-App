"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sequelize = new sequelize_1.Sequelize("heroku_9f0d53f4b78be51", process.env.SQL_USER, process.env.SQL_PASSWORD, {
    host: process.env.SQL_HOST,
    dialect: "mysql",
    logging: false,
});
exports.sequelize = sequelize;
const connectDB = async () => {
    try {
        await sequelize.sync();
        return;
    }
    catch (error) {
        console.log(error);
        throw new Error("Unable to connect to the database:");
    }
};
exports.default = connectDB;
