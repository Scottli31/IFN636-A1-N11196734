const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // Authentication middleware should run first
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    // Check whether the authenticated user's role is allowed
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    next();
  };
};

module.exports = {
  authorizeRoles,
};