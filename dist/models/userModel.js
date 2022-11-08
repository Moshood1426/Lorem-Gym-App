"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connectDB_1 = require("../db/connectDB");
const sequelize_2 = require("sequelize");
class User extends sequelize_2.Model {
}
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    gender: {
        type: sequelize_1.DataTypes.ENUM,
        values: ["male", "female", "others"],
    },
    employment: {
        type: sequelize_1.DataTypes.ENUM,
        values: ["student", "employed", "self-employed", "unemployed"],
    },
    number: {
        type: sequelize_1.DataTypes.STRING,
    },
}, {
    timestamps: true,
    sequelize: connectDB_1.sequelize,
    paranoid: true,
});
exports.default = User;
