// Export all models
const Organization = require("./organization.model");
const User = require("./user.model");
const Supplier = require("./supplier.model");
const Product = require("./product.model");
const Warehouse = require("./warehouse.model");
const InventoryLot = require("./inventoryLot.model");
const Transaction = require("./transaction.model");
const TransactionDetail = require("./transactionDetail.model");

module.exports = {
  Organization,
  User,
  Supplier,
  Product,
  Warehouse,
  InventoryLot,
  Transaction,
  TransactionDetail,
};
