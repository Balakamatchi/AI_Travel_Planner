const express = require("express");
const { body } = require("express-validator");
const {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
} = require("../controllers/tripController");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(getTrips)
  .post(
    [
      body("destination").notEmpty().withMessage("Destination is required"),
      body("days").isInt({ min: 1 }).withMessage("Days must be at least 1"),
      body("budget").isFloat({ min: 0 }).withMessage("Budget must be a positive number"),
      body("travelers").isInt({ min: 1 }).withMessage("Travelers must be at least 1"),
      body("startDate").notEmpty().withMessage("Start date is required"),
      body("endDate")
        .notEmpty()
        .withMessage("End date is required")
        .custom((endDate, { req }) => {
          if (new Date(endDate) <= new Date(req.body.startDate)) {
            throw new Error("End date must be after start date");
          }
          return true;
        }),
    ],
    validate,
    createTrip
  );

router.route("/:id").get(getTripById).put(updateTrip).delete(deleteTrip);

module.exports = router;