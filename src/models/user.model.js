const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: [true, "Organization ID is required"],
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: [255, "Full name must not exceed 255 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      maxlength: [255, "Email must not exceed 255 characters"],
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    hashedPassword: {
      type: String,
      required: [true, "Password is required"],
      select: false, // Don't include password in queries by default
    },
    role: {
      type: String,
      enum: {
        values: ["ADMIN", "MANAGER", "PHARMACIST"],
        message: "Role must be one of: ADMIN, MANAGER, PHARMACIST",
      },
      required: [true, "Role is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

// Compound indexes
userSchema.index({ organizationId: 1, email: 1 });
userSchema.index({ organizationId: 1, role: 1 });
userSchema.index({ email: 1 });

// Virtual for organization
userSchema.virtual("organization", {
  ref: "Organization",
  localField: "organizationId",
  foreignField: "_id",
  justOne: true,
});

// Methods
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.hashedPassword;
  return user;
};

userSchema.methods.updateLastLogin = function () {
  this.lastLoginAt = new Date();
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
