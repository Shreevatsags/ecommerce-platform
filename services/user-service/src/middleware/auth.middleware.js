const { verifyToken } = require('../utils/jwt');

// Middleware to protect routes
function protect(req, res, next) {
  try {
    // Step 1: Get token from request header
    const authHeader = req.headers.authorization;

    // Step 2: Check if token exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please login first!'
      });
    }

    // Step 3: Extract token
    // Header looks like: "Bearer eyJhbG..."
    // We only want the part after "Bearer "
    const token = authHeader.split(' ')[1];

    // Step 4: Verify token
    const decoded = verifyToken(token);

    // Step 5: Add user info to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };

    // Step 6: Continue to next function
    next();
  } catch (error) {
    if (error.message === 'Token has expired') {
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please login again!'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid token. Please login again!'
    });
  }
}

// Middleware to check user role
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    if (req.user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `Access denied! Only ${role}s can do this.`
      });
    }

    next();
  };
}

module.exports = { protect, requireRole };