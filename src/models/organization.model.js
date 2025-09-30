const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Organization name is required"],
      trim: true,
      maxlength: [255, "Organization name must not exceed 255 characters"],
    },
    code: {
      type: String,
      unique: true,
      sparse: true, // allows null values but enforces uniqueness when present
      trim: true,
      maxlength: [100, "Organization code must not exceed 100 characters"],
    },
    address: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [50, "Phone number must not exceed 50 characters"],
    },
  },
  {
    timestamps: true, // creates createdAt and updatedAt automatically
    collection: "organizations",
  }
);

// Indexes
organizationSchema.index({ code: 1 });
organizationSchema.index({ name: 1 });

// Methods
organizationSchema.methods.toJSON = function () {
  const organization = this.toObject();
  return organization;
};

module.exports = mongoose.model("Organization", organizationSchema);
