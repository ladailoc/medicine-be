const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: [true, "Organization ID is required"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: false, // Only required for IN transactions from suppliers
    },
    warehouseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: false, // Can be null for general transactions
    },
    type: {
      type: String,
      enum: {
        values: ["IN", "OUT", "ADJUSTMENT"],
        message: "Transaction type must be one of: IN, OUT, ADJUSTMENT",
      },
      required: [true, "Transaction type is required"],
    },
    status: {
      type: String,
      enum: {
        values: ["NEW", "COMPLETED", "CANCELLED"],
        message: "Transaction status must be one of: NEW, COMPLETED, CANCELLED",
      },
      default: "NEW",
    },
    transactionDate: {
      type: Date,
      default: Date.now,
    },
    referenceCode: {
      type: String,
      trim: true,
      maxlength: [100, "Reference code must not exceed 100 characters"],
    },
    notes: {
      type: String,
      trim: true,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "transactions",
  }
);

// Indexes
transactionSchema.index({ organizationId: 1, transactionDate: -1 });
transactionSchema.index({ organizationId: 1, type: 1, status: 1 });
transactionSchema.index({ organizationId: 1, userId: 1 });
transactionSchema.index({ organizationId: 1, supplierId: 1 });
transactionSchema.index({ organizationId: 1, warehouseId: 1 });
transactionSchema.index({ referenceCode: 1 });

// Virtual for organization
transactionSchema.virtual("organization", {
  ref: "Organization",
  localField: "organizationId",
  foreignField: "_id",
  justOne: true,
});

// Virtual for user
transactionSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

// Virtual for supplier
transactionSchema.virtual("supplier", {
  ref: "Supplier",
  localField: "supplierId",
  foreignField: "_id",
  justOne: true,
});

// Virtual for warehouse
transactionSchema.virtual("warehouse", {
  ref: "Warehouse",
  localField: "warehouseId",
  foreignField: "_id",
  justOne: true,
});

// Virtual for transaction details
transactionSchema.virtual("details", {
  ref: "TransactionDetail",
  localField: "_id",
  foreignField: "transactionId",
});

// Methods
transactionSchema.methods.toJSON = function () {
  const transaction = this.toObject();
  return transaction;
};

transactionSchema.methods.complete = function () {
  if (this.status !== "NEW") {
    throw new Error("Only NEW transactions can be completed");
  }
  this.status = "COMPLETED";
  this.completedAt = new Date();
  return this.save();
};

transactionSchema.methods.cancel = function () {
  if (this.status === "COMPLETED") {
    throw new Error("Cannot cancel completed transactions");
  }
  this.status = "CANCELLED";
  return this.save();
};

// Pre-save middleware
transactionSchema.pre("save", function (next) {
  // Validate supplier requirement for IN transactions
  if (this.type === "IN" && !this.supplierId) {
    // Allow IN transactions without supplier (e.g., returns, transfers)
    // You can uncomment the line below if supplier is always required for IN transactions
    // return next(new Error('Supplier is required for IN transactions'));
  }
  next();
});

module.exports = mongoose.model("Transaction", transactionSchema);
