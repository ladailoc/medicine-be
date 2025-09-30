const { Organization } = require("../models");
const ApiResponse = require("../utils/ApiResponse");

class OrganizationController {
  // @desc    Get organization details
  // @route   GET /api/organizations/me
  // @access  Private
  static async getMyOrganization(req, res) {
    try {
      const organizationId = req.user.organizationId;

      const organization = await Organization.findById(organizationId);
      if (!organization) {
        return ApiResponse.error(res, "Organization not found", 404);
      }

      return ApiResponse.success(
        res,
        organization,
        "Organization retrieved successfully"
      );
    } catch (error) {
      console.error("Get organization error:", error);
      return ApiResponse.error(res, "Server error", 500);
    }
  }

  // @desc    Update organization
  // @route   PUT /api/organizations/me
  // @access  Private (Admin only)
  static async updateOrganization(req, res) {
    try {
      const { name, address, phone } = req.body;
      const organizationId = req.user.organizationId;

      const organization = await Organization.findById(organizationId);
      if (!organization) {
        return ApiResponse.error(res, "Organization not found", 404);
      }

      // Update fields
      if (name) organization.name = name;
      if (address) organization.address = address;
      if (phone) organization.phone = phone;

      await organization.save();

      return ApiResponse.success(
        res,
        organization,
        "Organization updated successfully"
      );
    } catch (error) {
      console.error("Update organization error:", error);
      return ApiResponse.error(res, "Server error", 500);
    }
  }

  // @desc    Create new organization (Super Admin only)
  // @route   POST /api/organizations
  // @access  Private (Super Admin only)
  static async createOrganization(req, res) {
    try {
      const { name, code, address, phone } = req.body;

      const organization = new Organization({
        name,
        code,
        address,
        phone,
      });

      await organization.save();

      return ApiResponse.success(
        res,
        organization,
        "Organization created successfully",
        201
      );
    } catch (error) {
      console.error("Create organization error:", error);
      if (error.code === 11000) {
        return ApiResponse.error(res, "Organization code already exists", 400);
      }
      return ApiResponse.error(res, "Server error", 500);
    }
  }

  // @desc    Get all organizations (Super Admin only)
  // @route   GET /api/organizations
  // @access  Private (Super Admin only)
  static async getAllOrganizations(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      const organizations = await Organization.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Organization.countDocuments();

      const pagination = {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      };

      return ApiResponse.paginated(
        res,
        organizations,
        pagination,
        "Organizations retrieved successfully"
      );
    } catch (error) {
      console.error("Get organizations error:", error);
      return ApiResponse.error(res, "Server error", 500);
    }
  }
}

module.exports = OrganizationController;
