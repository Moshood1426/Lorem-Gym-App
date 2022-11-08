import express, { Request, Response, NextFunction } from "express";
import path from "path";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import session from "express-session";
import favicon from "serve-favicon";
import helmet from "helmet";
//@ts-ignore
import xss from "xss-clean";

import connectDB, { sequelize } from "./db/connectDB";

import authRoute from "./routes/authRoute";
import userRoute from "./routes/userRoute";
import User from "./models/userModel";
import Subscription from "./models/subModel";

import "express-async-errors";
import notFoundMiddleware from "./middleware/notFound";
import errorHandlerMiddleware from "./middleware/errorHandler";
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const store = new SequelizeStore({ db: sequelize });

const app = express();
dotenv.config();

app.set("view engine", "ejs");
app.set("views", "views");
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(xss())
app.use(helmet())
app.use(
  favicon(path.join(__dirname, "/../public/assets/images", "favicon.ico"))
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "/../public")));
app.use("/auth", authRoute);
app.use("/user", userRoute);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.render("landing", { pageTitle: "Lorem Gym" });
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 5000;

User.hasOne(Subscription);
Subscription.belongsTo(User);

const start = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log("app is listening on port 5000");
    });
  } catch (error) {
    console.log(error);
  }
};

start();
