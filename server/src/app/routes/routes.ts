import express from "express";
import { authController } from "../auth/auth.controller";
import { UserSchema } from "../auth/auth.validate";
import validateRequest from "../midddlewares/validate";

const router = express.Router();

// User signup
router.post(
  "/signup",
  validateRequest(UserSchema.userSignupSchema),
  authController.signup
);

// User signin
router.post(
  "/signin",
  validateRequest(UserSchema.userSigninSchema),
  authController.signin
);

export default router;
