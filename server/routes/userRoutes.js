const express = require("express");
const {
  updateProfile,
  updateAvatar,
  getDashboardStats,
} = require("../controllers/userController");
const { protect } = require("../middleware/auth");
const { uploadAvatar } = require("../middleware/upload");

const router = express.Router();

router.use(protect);

router.put("/profile", updateProfile);
router.put("/avatar", uploadAvatar.single("avatar"), updateAvatar);
router.get("/dashboard", getDashboardStats);

module.exports = router;
