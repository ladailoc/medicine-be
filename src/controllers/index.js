// Export all controllers
const AuthController = require("./auth.controller");
const UserController = require("./user.controller");
const OrganizationController = require("./organization.controller");
const ProductController = require("./product.controller");


module.exports = {
  AuthController,
  UserController,
  OrganizationController,
  ProductController,
};
