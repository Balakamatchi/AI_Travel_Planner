const asyncHandler = require("express-async-handler");
const Expense = require("../models/Expense");
const Trip = require("../models/Trip");

// @desc    Add an expense to a trip
// @route   POST /api/expenses
// @access  Private
exports.createExpense = asyncHandler(async (req, res) => {
  const { trip: tripId } = req.body;

  const trip = await Trip.findOne({ _id: tripId, user: req.user._id });
  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  const expenseDate = new Date(req.body.date);
  if (
    !req.body.date ||
    isNaN(expenseDate.getTime()) ||
    expenseDate.getFullYear() < 2000 ||
    expenseDate.getFullYear() > 2100
  ) {
    res.status(400);
    throw new Error("Invalid expense date");
  }

  const expense = await Expense.create({ ...req.body, user: req.user._id });
  res.status(201).json({ success: true, expense });
});

// @desc    Get all expenses (optionally filter by trip)
// @route   GET /api/expenses?trip=<tripId>
// @access  Private
exports.getExpenses = asyncHandler(async (req, res) => {
  const filter = { user: req.user._id };
  if (req.query.trip) filter.trip = req.query.trip;

  const expenses = await Expense.find(filter).sort({ date: -1 });

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const byCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  res.status(200).json({
    success: true,
    count: expenses.length,
    totalSpent,
    byCategory,
    expenses,
  });
});

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Private
exports.updateExpense = asyncHandler(async (req, res) => {
  let expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });
  if (!expense) {
    res.status(404);
    throw new Error("Expense not found");
  }

  const expenseDate = new Date(req.body.date);
  if (
    !req.body.date ||
    isNaN(expenseDate.getTime()) ||
    expenseDate.getFullYear() < 2000 ||
    expenseDate.getFullYear() > 2100
  ) {
    res.status(400);
    throw new Error("Invalid expense date");
  }



  expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, expense });
});

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
exports.deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });
  if (!expense) {
    res.status(404);
    throw new Error("Expense not found");
  }

  await expense.deleteOne();
  res.status(200).json({ success: true, message: "Expense deleted successfully" });
});
