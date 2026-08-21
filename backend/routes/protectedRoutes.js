const express = require("express");

const {
  authenticateToken,
} = require("../middleware/authMiddleware");

const {
  authorizeRoles,
} = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/passenger",
  authenticateToken,
  authorizeRoles("Passenger"),
  (req, res) => {
    res.status(200).json({
      message: "Passenger access granted",
      user: req.user,
    });
  }
);

router.get(
  "/staff",
  authenticateToken,
  authorizeRoles("Staff"),
  (req, res) => {
    res.status(200).json({
      message: "Staff access granted",
      user: req.user,
    });
  }
);

module.exports = router;