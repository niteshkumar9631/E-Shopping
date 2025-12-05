import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Names
    firstName: { type: String },
    lastName: { type: String },
    name: { type: String }, // legacy

    // Profile pics
    profilePic: { type: String, default: "" },
    profilePicPublicId: { type: String, default: "" },

    // Auth
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // Verification / Login
    token: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
    isLoggedIn: { type: Boolean, default: false },

    // OTP
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },

    // Address info
    address: { type: String },
    city: { type: String },
    zipCode: { type: String },
    phoneNo: { type: String },

    // Cart
    cartData: { type: Object, default: {} }
  },
  { timestamps: true, minimize: false }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
