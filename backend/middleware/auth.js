import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

// Legacy middleware used by existing cart/order routes (token header)
const authUser = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.token;

  if (!authHeader) {
    return res
      .status(401)
      .json({ success: false, message: "Not Authorized. Login Again" });
  }

  // Support both "Bearer <token>" and raw token in headers
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  if (!token || token === "null" || token === "undefined") {
    return res
      .status(401)
      .json({ success: false, message: "Not Authorized. Login Again" });
  }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = token_decode.id;
        next();
    } catch (error) {
        console.log(error);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

// New middleware for Bearer token auth
export const isAuthenticated = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authorization token is missing or invalid",
    });
    }
    
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    req.id = user._id;
    next();
  } catch (error) {
    console.log(error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "The token has expired",
      });
    }
    return res.status(401).json({
      success: false,
      message: "Access token is invalid",
    });
  }
};

export const isAdmin = async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Access denied, admin only",
  });
};

export default authUser;
