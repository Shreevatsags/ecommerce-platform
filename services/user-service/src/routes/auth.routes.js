const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// POST /api/auth/register - Create new account
router.post('/register', authController.register);

// POST /api/auth/login - Login to account
router.post('/login', authController.login);

module.exports = router;