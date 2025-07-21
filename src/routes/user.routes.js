import { Router } from "express";
import {
  loginSchema,
  registerSchema
} from "./../zod/user.schema.js";
import { validate } from "../middleware/validator.middleware.js";
import {
  fetchSession,
  loginUser,
  logoutUser,
  refreshTokens,
  registerUser
} from "../controller/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(validate(registerSchema), registerUser);
router.route("/login").post(validate(loginSchema), loginUser);
router.route("/session").get(verifyJWT,fetchSession);
router.route("/logout").post(verifyJWT, logoutUser);
router
  .route("/me/token")
  .patch(verifyJWT,updateFcmToken);
router.route("/refreshTokens").post(refreshTokens);

export default router;
 