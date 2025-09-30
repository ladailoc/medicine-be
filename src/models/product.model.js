const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: [true, "Organization ID is required"],
    },
    sku: {
      type: String,
      trim: true,
      maxlength: [100, "SKU must not exceed 100 characters"],
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [255, "Product name must not exceed 255 characters"],
    },
    description: {
      type: String,
      trim: true,
    },
    activeIngredient: {
      type: String,
      trim: true,
      maxlength: [255, "Active ingredient must not exceed 255 characters"],
    },
    unit: {
      type: String,
      required: [true, "Unit is required"],
      trim: true,
      maxlength: [50, "Unit must not exceed 50 characters"],
    },
    minimumStock: {
      type: Number,
      min: [0, "Minimum stock cannot be negative"],
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "products",
  }
);

// Compound indexes
productSchema.index(
  { organizationId: 1, sku: 1 },
  { unique: true, sparse: true }
);
productSchema.index({ organizationId: 1, name: 1 });
productSchema.index({ organizationId: 1, isActive: 1 });
productSchema.index({ organizationId: 1 });

// Virtual for organization
productSchema.virtual("organization", {
  ref: "Organization",
  localField: "organizationId",
  foreignField: "_id",
  justOne: true,
});

// Virtual for current stock (will be calculated from inventory)
productSchema.virtual("currentStock");

// Methods
productSchema.methods.toJSON = function () {
  const product = this.toObject();
  return product;
};

productSchema.methods.isLowStock = function (currentStock) {
  return currentStock <= this.minimumStock;
};

module.exports = mongoose.model("Product", productSchema);
