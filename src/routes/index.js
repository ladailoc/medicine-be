const express = require("express");
const router = express.Router();

// Import route files
const authRoutes = require("./auth.route");
const userRoutes = require("./user.route");
const organizationRoutes = require("./organization.route");
const productRoutes = require("./product.route");

// Mount routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/organizations", organizationRoutes);
router.use("/products", productRoutes);

module.exports = router;
