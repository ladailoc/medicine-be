const mongoose = require("mongoose");

const warehouseSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: [true, "Organization ID is required"],
    },
    code: {
      type: String,
      required: [true, "Warehouse code is required"],
      trim: true,
      maxlength: [100, "Warehouse code must not exceed 100 characters"],
    },
    name: {
      type: String,
      required: [true, "Warehouse name is required"],
      trim: true,
      maxlength: [255, "Warehouse name must not exceed 255 characters"],
    },
  },
  {
    timestamps: true,
    collection: "warehouses",
  }
);

// Compound indexes
warehouseSchema.index({ organizationId: 1, code: 1 }, { unique: true });
warehouseSchema.index({ organizationId: 1, name: 1 });
warehouseSchema.index({ organizationId: 1 });

// Virtual for organization
warehouseSchema.virtual("organization", {
  ref: "Organization",
  localField: "organizationId",
  foreignField: "_id",
  justOne: true,
});

// Methods
warehouseSchema.methods.toJSON = function () {
  const warehouse = this.toObject();
  return warehouse;
};

module.exports = mongoose.model("Warehouse", warehouseSchema);
