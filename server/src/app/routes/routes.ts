import express from "express";
import { authController } from "../auth/auth.controller";
import { UserSchema } from "../auth/auth.validate";
import validateRequest from "../midddlewares/validate";
import auth from "../midddlewares/auth";

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

// Get user profile
router.get(
  "/profile",
  auth(),
  authController.getProfile
);

// Get user by ID
router.get(
  "/user/:userId",
  auth(),
  authController.getUserById
);

export default router;
