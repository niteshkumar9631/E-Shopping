import express from "express";
import {
  register,
  verify,
  reVerify,
  login,
  logout,
  forgotPassword,
  verifyOtp,
  changePassword,
  allUser,
  getUserById,
} from "../controllers/authController.js";
import authUser, { isAuthenticated, isAdmin } from "../middleware/auth.js";

const userRouter = express.Router();

// Public auth routes
userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/verify", verify);
userRouter.post("/reverify", reVerify);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/verify-otp/:email", verifyOtp);
userRouter.post("/change-password/:email", changePassword);

// Logout (requires Bearer token)
userRouter.post("/logout", isAuthenticated, logout);

// Get current user by id (requires header token or Bearer, depending on usage)
userRouter.get("/me/:userId", isAuthenticated, getUserById);

// Admin-only list of all users
userRouter.get("/all", isAuthenticated, isAdmin, allUser);

// Legacy admin login kept if needed
// userRouter.post('/admin', adminLogin)

// Also export authUser for cart/order middleware compatibility
export { authUser };
export default userRouter;

