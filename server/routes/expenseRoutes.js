const express = require("express");
const { body } = require("express-validator");
const {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(getExpenses)
  .post(
    [
      body("trip").notEmpty().withMessage("Trip id is required"),
      body("title").notEmpty().withMessage("Title is required"),
      body("amount").isFloat({ min: 0 }).withMessage("Amount must be positive"),
    ],
    validate,
    createExpense
  );

router.route("/:id").put(updateExpense).delete(deleteExpense);

module.exports = router;
