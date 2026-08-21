const express = require("express");

const {
  login,
} = require("../controllers/authController");

const {
  authenticateToken,
} = require("../middleware/authMiddleware");

const {
  authorizeRole,
} = require("../middleware/roleMiddleware");

const router = express.Router();

// Login
router.post("/login", login);

// Verify authenticated user
router.get("/me", authenticateToken, (req, res) => {
  return res.status(200).json({
    message: "Authenticated user",
    user: {
      id: req.user.userId,
      role: req.user.role,
    },
  });
});

// Passenger-only endpoint
router.get(
  "/passenger",
  authenticateToken,
  authorizeRole("Passenger"),
  (req, res) => {
    return res.status(200).json({
      message: "Passenger access granted",
    });
  }
);

// Staff-only endpoint
router.get(
  "/staff",
  authenticateToken,
  authorizeRole("Staff"),
  (req, res) => {
    return res.status(200).json({
      message: "Staff access granted",
    });
  }
);

module.exports = router;