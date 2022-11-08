import express from "express";
import { getUser, getAdmin, postAdmin } from "../controllers/userController";
import authenticateUser from "../middleware/authMiddleware";
import { body } from "express-validator";
const router = express.Router();

//authenticate user
router.route("/").get(authenticateUser, getUser);

router
  .route("/admin")
  .get(getAdmin)
  .post(
    body("info")
      .isLength({ min: 1 })
      .withMessage("User info field cannot be empty"),
    postAdmin
  );
export default router;
