const express = require("express");
const router = express.Router();
const { OrganizationController } = require("../controllers");
const auth = require("../middleware/auth");
const roleAuth = require("../middleware/roleAuth");

// @route   GET /api/organizations/me
// @desc    Get current organization
// @access  Private
router.get("/me", auth, OrganizationController.getMyOrganization);

// @route   PUT /api/organizations/me
// @desc    Update current organization
// @access  Private (Admin only)
router.put(
  "/me",
  auth,
  roleAuth(["ADMIN"]),
  OrganizationController.updateOrganization
);

// @route   POST /api/organizations
// @desc    Create new organization (Super Admin only)
// @access  Private (Super Admin only)
router.post(
  "/",
  auth,
  roleAuth(["SUPER_ADMIN"]),
  OrganizationController.createOrganization
);

// @route   GET /api/organizations
// @desc    Get all organizations (Super Admin only)
// @access  Private (Super Admin only)
router.get(
  "/",
  auth,
  roleAuth(["SUPER_ADMIN"]),
  OrganizationController.getAllOrganizations
);

module.exports = router;
