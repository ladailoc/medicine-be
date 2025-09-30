const mongoose = require("mongoose");
const validator = require("validator");

const supplierSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: [true, "Organization ID is required"],
    },
    name: {
      type: String,
      required: [true, "Supplier name is required"],
      trim: true,
      maxlength: [255, "Supplier name must not exceed 255 characters"],
    },
    code: {
      type: String,
      trim: true,
      maxlength: [100, "Supplier code must not exceed 100 characters"],
    },
    contactPerson: {
      type: String,
      trim: true,
      maxlength: [255, "Contact person must not exceed 255 characters"],
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [50, "Phone number must not exceed 50 characters"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: [255, "Email must not exceed 255 characters"],
      validate: {
        validator: function (value) {
          return !value || validator.isEmail(value);
        },
        message: "Please provide a valid email",
      },
    },
    address: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "suppliers",
  }
);

// Compound indexes
supplierSchema.index({ organizationId: 1, name: 1 }, { unique: true });
supplierSchema.index({ organizationId: 1, code: 1 });
supplierSchema.index({ organizationId: 1 });

// Virtual for organization
supplierSchema.virtual("organization", {
  ref: "Organization",
  localField: "organizationId",
  foreignField: "_id",
  justOne: true,
});

// Methods
supplierSchema.methods.toJSON = function () {
  const supplier = this.toObject();
  return supplier;
};

module.exports = mongoose.model("Supplier", supplierSchema);
