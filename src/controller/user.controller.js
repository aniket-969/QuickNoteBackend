// src/controllers/auth.controller.js

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError }       from "../utils/ApiError.js";
import { ApiResponse }    from "../utils/ApiResponse.js";
import { User }           from "../models/user.models.js";
import jwt                from "jsonwebtoken";


const generateTokens = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  const accessToken  = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};


const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // 1) Check for existing email
  if (await User.findOne({ email })) {
    throw new ApiError(409, "Email already in use");
  }

  // 2) Create user (pre-‘save’ hook will hash password)
  const user = await User.create({ name, email, password });

  // 3) Return user data (omit password & refreshToken)
  const created = await User.findById(user._id)
    .select("-password -refreshToken");

  return res
    .status(201)
    .json(new ApiResponse(201, created, "User registered successfully"));
});


const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "Invalid email or password");

  if (!(await user.isPasswordCorrect(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  const { accessToken, refreshToken } = await generateTokens(user._id);

  const payload = await User.findById(user._id)
    .select("name email");

  const cookieOpts = { httpOnly: true, secure: true, sameSite: "lax" };
  res
    .cookie("accessToken",  accessToken,  { ...cookieOpts, path: "/" })
    .cookie("refreshToken", refreshToken, { ...cookieOpts, path: "/auth/refresh" })
    .json(new ApiResponse(200, payload, "Logged in successfully"));
});


const logoutUser = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "Not authenticated");

  await User.findByIdAndUpdate(userId, { refreshToken: null });

  const cookieOpts = { httpOnly: true, secure: true, sameSite: "lax" };
  res
    .clearCookie("accessToken",  cookieOpts)
    .clearCookie("refreshToken", cookieOpts)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});


const refreshTokens = asyncHandler(async (req, res) => {
  const oldToken = req.cookies.refreshToken;
  if (!oldToken) throw new ApiError(401, "Missing refresh token");

  let decoded;
  try {
    decoded = jwt.verify(oldToken, process.env.REFRESH_TOKEN_SECRET);
  } catch {
    throw new ApiError(401, "Invalid refresh token");
  }

  const user = await User.findById(decoded._id);
  if (!user || user.refreshToken !== oldToken) {
    throw new ApiError(401, "Refresh token revoked or mismatched");
  }

  const { accessToken, refreshToken } = await generateTokens(user._id);

  const cookieOpts = { httpOnly: true, secure: true, sameSite: "lax" };
  res
    .cookie("accessToken",  accessToken,  { ...cookieOpts, path: "/" })
    .cookie("refreshToken", refreshToken, { ...cookieOpts, path: "/auth/refresh" })
    .json(new ApiResponse(200, { accessToken }, "Token refreshed"));
});


const fetchSession = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("-password -refreshToken");
  if (!user) throw new ApiError(401, "Session not found");

  res.json(new ApiResponse(200, user, "Session retrieved"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshTokens,
  fetchSession,
};
