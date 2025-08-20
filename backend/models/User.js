// backend/src/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: function () {
        return this.provider === "local"; // Name required only for local signup
      },
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return this.provider === "local"; // Password only required for local signup
      },
      minlength: 6,
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    googleId: {
      type: String, // Firebase UID / Google ID
      required: function () {
        return this.provider === "google";
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
