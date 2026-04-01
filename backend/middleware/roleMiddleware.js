const User = require('../models/User');

/**
 * Role-based access control middleware.
 * Use after authMiddleware to restrict routes to specific roles.
 * 
 * Usage: router.get('/admin', authMiddleware, requireRole('admin'), handler)
 *        router.post('/events', authMiddleware, requireRole('manager', 'admin'), handler)
 */
const requireRole = (...roles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.userId).select('role');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to perform this action'
        });
      }

      req.userRole = user.role;
      next();
    } catch (error) {
      console.error('Role middleware error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };
};

module.exports = { requireRole };
