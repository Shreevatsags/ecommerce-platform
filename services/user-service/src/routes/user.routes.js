const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

// All routes below require login (protect middleware)

// GET /api/users/me - Who am I?
router.get('/me', protect, userController.whoAmI);

// GET /api/users/profile - Get my profile
router.get('/profile', protect, userController.getProfile);

// PUT /api/users/profile - Update my profile
router.put('/profile', protect, userController.updateProfile);

// PUT /api/users/change-password - Change password
router.put('/change-password', protect, userController.changePassword);

module.exports = router;