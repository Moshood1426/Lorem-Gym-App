"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connectDB_1 = require("../db/connectDB");
const sequelize_2 = require("sequelize");
class Subscription extends sequelize_2.Model {
}
Subscription.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    subtype: {
        type: sequelize_1.DataTypes.ENUM,
        allowNull: false,
        values: ["basic", "premium"],
    },
    amount: {
        type: sequelize_1.DataTypes.INTEGER,
        set: function () {
            const value = this.getDataValue("subtype") === "basic" ? 27.22 : 227.22;
            this.setDataValue("amount", value);
        },
    },
    identifier: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    active: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    expires: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    timestamps: true,
    sequelize: connectDB_1.sequelize,
    paranoid: true,
});
exports.default = Subscription;
