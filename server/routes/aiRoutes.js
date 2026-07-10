const express = require("express");
const rateLimit = require("express-rate-limit");
const { generateTrip, generateAndSaveTrip } = require("../controllers/aiController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Limit AI generation to avoid abuse / runaway API costs
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many AI requests, please try again later." },
});

router.use(protect);
router.use(aiLimiter);

router.post("/generate-trip", generateTrip);
router.post("/generate-and-save", generateAndSaveTrip);

module.exports = router;
