const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  // Read Authorization header
  const authHeader = req.headers.authorization;

  // Authorization: Bearer <token>
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify JWT using server secret
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Make authenticated user information
    // available to later middleware/controllers
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = {
  authenticateToken,
};