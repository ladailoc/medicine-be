const express = require("express");
const router = express.Router();
const { AuthController } = require("../controllers");
const auth = require("../middleware/auth");
const {
  validateRegister,
  validateLogin,
  checkValidation,
} = require("../validators/authValidator");
const { validateChangePassword } = require("../validators/userValidator");

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post(
  "/register",
  validateRegister,
  checkValidation,
  AuthController.register
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", validateLogin, checkValidation, AuthController.login);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get("/me", auth, AuthController.getMe);

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", auth, AuthController.updateProfile);

// @route   PUT /api/auth/change-password
// @desc    Change password
// @access  Private
router.put(
  "/change-password",
  auth,
  validateChangePassword,
  checkValidation,
  AuthController.changePassword
);

module.exports = router;
