const mongoose = require("mongoose");

const transactionDetailSchema = new mongoose.Schema(
  {
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
      required: [true, "Transaction ID is required"],
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product ID is required"],
    },
    inventoryLotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InventoryLot",
      required: [true, "Inventory lot ID is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      validate: {
        validator: function (value) {
          return value !== 0;
        },
        message: "Quantity cannot be zero",
      },
    },
    unitPrice: {
      type: Number,
      min: [0, "Unit price cannot be negative"],
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: "transaction_details",
  }
);

// Indexes
transactionDetailSchema.index({ transactionId: 1 });
transactionDetailSchema.index({ productId: 1 });
transactionDetailSchema.index({ inventoryLotId: 1 });
transactionDetailSchema.index({ transactionId: 1, productId: 1 });

// Virtual for transaction
transactionDetailSchema.virtual("transaction", {
  ref: "Transaction",
  localField: "transactionId",
  foreignField: "_id",
  justOne: true,
});

// Virtual for product
transactionDetailSchema.virtual("product", {
  ref: "Product",
  localField: "productId",
  foreignField: "_id",
  justOne: true,
});

// Virtual for inventory lot
transactionDetailSchema.virtual("inventoryLot", {
  ref: "InventoryLot",
  localField: "inventoryLotId",
  foreignField: "_id",
  justOne: true,
});

// Virtual for total price
transactionDetailSchema.virtual("totalPrice").get(function () {
  return Math.abs(this.quantity) * this.unitPrice;
});

// Methods
transactionDetailSchema.methods.toJSON = function () {
  const detail = this.toObject();
  detail.totalPrice = this.totalPrice;
  return detail;
};

// Static methods
transactionDetailSchema.statics.getTransactionTotal = async function (
  transactionId
) {
  const details = await this.find({ transactionId });
  return details.reduce((total, detail) => {
    return total + Math.abs(detail.quantity) * detail.unitPrice;
  }, 0);
};

// Pre-save middleware to validate quantity based on transaction type
transactionDetailSchema.pre("save", async function (next) {
  try {
    // Get the transaction to check type
    const Transaction = mongoose.model("Transaction");
    const transaction = await Transaction.findById(this.transactionId);

    if (!transaction) {
      return next(new Error("Invalid transaction ID"));
    }

    // Validate quantity sign based on transaction type
    if (transaction.type === "IN" && this.quantity < 0) {
      return next(new Error("IN transaction quantities must be positive"));
    }

    if (transaction.type === "OUT" && this.quantity > 0) {
      return next(new Error("OUT transaction quantities must be negative"));
    }

    // For ADJUSTMENT, both positive and negative quantities are allowed

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("TransactionDetail", transactionDetailSchema);
