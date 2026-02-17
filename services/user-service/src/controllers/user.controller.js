const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const Joi = require('joi');

// Validation for profile update
const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(100)
});

// Validation for password change
const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).max(100).required()
});

class UserController {
  // GET /api/users/profile - Get my profile
  async getProfile(req, res) {
    try {
      // req.user is set by auth middleware
      const userId = req.user.userId;

      const user = await userModel.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          created_at: user.created_at,
          updated_at: user.updated_at
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get profile',
        error: error.message
      });
    }
  }

  // PUT /api/users/profile - Update my profile
  async updateProfile(req, res) {
    try {
      // Validate input
      const { error, value } = updateProfileSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message
        });
      }

      const userId = req.user.userId;

      // Update user
      const updatedUser = await userModel.update(userId, value);

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedUser
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update profile',
        error: error.message
      });
    }
  }

  // PUT /api/users/change-password - Change password
  async changePassword(req, res) {
    try {
      // Validate input
      const { error, value } = changePasswordSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message
        });
      }

      const { currentPassword, newPassword } = value;
      const userId = req.user.userId;

      // Get user with password hash
      const user = await userModel.findByEmail(req.user.email);

      // Check current password is correct
      const isValid = await userModel.verifyPassword(
        currentPassword,
        user.password_hash
      );

      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      // Check new password is different
      if (currentPassword === newPassword) {
        return res.status(400).json({
          success: false,
          message: 'New password must be different from current password'
        });
      }

      // Change password
      await userModel.changePassword(userId, newPassword);

      res.json({
        success: true,
        message: 'Password changed successfully! Please login again.'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to change password',
        error: error.message
      });
    }
  }

  // GET /api/users/me - Quick check who I am
  async whoAmI(req, res) {
    res.json({
      success: true,
      data: {
        userId: req.user.userId,
        email: req.user.email,
        role: req.user.role,
        message: 'You are logged in!'
      }
    });
  }
}

module.exports = new UserController();