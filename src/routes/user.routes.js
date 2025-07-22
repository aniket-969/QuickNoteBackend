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

router.post("/register", validate(registerSchema), registerUser);
router.post("/login",    validate(loginSchema),    loginUser);
router.post("/refresh-token", refreshTokens);

// Protected
router.get( "/session",verifyJWT, fetchSession);
router.post("/logout",     verifyJWT, logoutUser);

export default router;
 