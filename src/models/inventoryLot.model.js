const mongoose = require("mongoose");

const inventoryLotSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: [true, "Organization ID is required"],
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product ID is required"],
    },
    warehouseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: false, // Can be null for general inventory
    },
    lotNumber: {
      type: String,
      required: [true, "Lot number is required"],
      trim: true,
      maxlength: [100, "Lot number must not exceed 100 characters"],
    },
    expiryDate: {
      type: Date,
      required: [true, "Expiry date is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: "inventory_lots",
  }
);

// Compound indexes
inventoryLotSchema.index(
  {
    organizationId: 1,
    productId: 1,
    lotNumber: 1,
    warehouseId: 1,
  },
  { unique: true }
);

inventoryLotSchema.index({ organizationId: 1, productId: 1 });
inventoryLotSchema.index({ organizationId: 1, warehouseId: 1 });
inventoryLotSchema.index({ expiryDate: 1 });
inventoryLotSchema.index({ organizationId: 1, expiryDate: 1 });

// Virtual for organization
inventoryLotSchema.virtual("organization", {
  ref: "Organization",
  localField: "organizationId",
  foreignField: "_id",
  justOne: true,
});

// Virtual for product
inventoryLotSchema.virtual("product", {
  ref: "Product",
  localField: "productId",
  foreignField: "_id",
  justOne: true,
});

// Virtual for warehouse
inventoryLotSchema.virtual("warehouse", {
  ref: "Warehouse",
  localField: "warehouseId",
  foreignField: "_id",
  justOne: true,
});

// Methods
inventoryLotSchema.methods.toJSON = function () {
  const inventoryLot = this.toObject();
  return inventoryLot;
};

inventoryLotSchema.methods.isExpired = function () {
  return this.expiryDate < new Date();
};

inventoryLotSchema.methods.isExpiringSoon = function (days = 30) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  return this.expiryDate <= futureDate;
};

inventoryLotSchema.methods.adjustQuantity = function (amount) {
  this.quantity += amount;
  if (this.quantity < 0) {
    throw new Error("Insufficient quantity in lot");
  }
  return this.save();
};

// Static methods
inventoryLotSchema.statics.findExpiring = function (organizationId, days = 30) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);

  return this.find({
    organizationId,
    expiryDate: { $lte: futureDate },
    quantity: { $gt: 0 },
  }).populate("product warehouse");
};

inventoryLotSchema.statics.findExpired = function (organizationId) {
  return this.find({
    organizationId,
    expiryDate: { $lt: new Date() },
    quantity: { $gt: 0 },
  }).populate("product warehouse");
};

module.exports = mongoose.model("InventoryLot", inventoryLotSchema);
