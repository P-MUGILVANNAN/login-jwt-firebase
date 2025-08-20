// backend/src/routes/authRoutes.js
const express = require("express");
const { signup, signin, googleAuth } = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signup);      // Local signup
router.post("/signin", signin);      // Local signin
router.post("/google", googleAuth);  // Google signup/signin

module.exports = router;
