import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(
  "heroku_9f0d53f4b78be51",
  process.env.SQL_USER!,
  process.env.SQL_PASSWORD!,
  {
    host: process.env.SQL_HOST!,
    dialect: "mysql",
    logging: false,
  }
);

const connectDB = async () => {
  try {
    await sequelize.sync();
    return;
  } catch (error) {
    console.log(error);
    throw new Error("Unable to connect to the database:");
  }
};

export { sequelize };
export default connectDB;
