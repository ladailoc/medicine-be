const express = require("express");
const router = express.Router();
const { ProductController } = require("../controllers");
const auth = require("../middleware/auth");
const roleAuth = require("../middleware/roleAuth");
const {
  validateCreateProduct,
  validateUpdateProduct,
  validateProductSearch,
  validateObjectId,
  checkValidation,
} = require("../validators/productValidator");

// @route   GET /api/products
// @desc    Get all products
// @access  Private
router.get(
  "/",
  auth,
  validateProductSearch,
  checkValidation,
  ProductController.getProducts
);

// @route   GET /api/products/low-stock
// @desc    Get low stock products
// @access  Private
router.get("/low-stock", auth, ProductController.getLowStockProducts);

// @route   GET /api/products/:id
// @desc    Get product by ID
// @access  Private
router.get(
  "/:id",
  auth,
  validateObjectId,
  checkValidation,
  ProductController.getProductById
);

// @route   POST /api/products
// @desc    Create new product
// @access  Private (Admin/Manager)
router.post(
  "/",
  auth,
  roleAuth(["ADMIN", "MANAGER"]),
  validateCreateProduct,
  checkValidation,
  ProductController.createProduct
);

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private (Admin/Manager)
router.put(
  "/:id",
  auth,
  roleAuth(["ADMIN", "MANAGER"]),
  validateObjectId,
  validateUpdateProduct,
  checkValidation,
  ProductController.updateProduct
);

// @route   DELETE /api/products/:id
// @desc    Delete product (soft delete)
// @access  Private (Admin only)
router.delete(
  "/:id",
  auth,
  roleAuth(["ADMIN"]),
  validateObjectId,
  checkValidation,
  ProductController.deleteProduct
);

module.exports = router;
