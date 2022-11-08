import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../db/connectDB";
import { Model, Optional } from "sequelize";

interface UserI {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  number: string;
  employment: "student" | "employed" | "self-employed" | "unemployed" | null;
  gender: "male" | "female" | "others" | null;
}

type UserCreationAttributes = Optional<UserI, "id">;

class User extends Model<UserI, UserCreationAttributes> implements UserI {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public password!: string;
  public number!: string;
  public employment!:
    | "student"
    | "employed"
    | "self-employed"
    | "unemployed"
    | null;
  public gender!: "male" | "female" | "others" | null;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM,
      values: ["male", "female", "others"],
    },
    employment: {
      type: DataTypes.ENUM,
      values: ["student", "employed", "self-employed", "unemployed"],
    },
    number: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
    sequelize: sequelize,
    paranoid: true,
  }
);

export default User;
