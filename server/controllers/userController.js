const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Trip = require("../models/Trip");
const Expense = require("../models/Expense");
const cloudinary = require("../config/cloudinary");
const getTripStatus = require("../utils/getTripStatus");

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, country, theme } = req.body;

  const user = await User.findById(req.user._id);
  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (country !== undefined) user.country = country;
  if (theme) user.theme = theme;

  await user.save();
  res.status(200).json({ success: true, user });
});

// @desc    Upload/replace avatar
// @route   PUT /api/users/avatar
// @access  Private
exports.updateAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("Please upload an image");
  }

  const user = await User.findById(req.user._id);

  if (user.avatar && user.avatar.publicId) {
    await cloudinary.uploader.destroy(user.avatar.publicId).catch(() => {});
  }

  user.avatar = { url: req.file.path, publicId: req.file.filename };
  await user.save();

  res.status(200).json({ success: true, user });
});

// @desc    Get dashboard statistics for logged in user
// @route   GET /api/users/dashboard
// @access  Private
exports.getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const trips = await Trip.find({ user: userId }).sort({ createdAt: -1 });
  const expenses = await Expense.find({ user: userId });

  const upcomingTrips = trips.filter(
    (trip) => getTripStatus(trip) === "upcoming"
  );

  const totalBudget = trips.reduce((sum, t) => sum + (t.budget || 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

  const completedTrips = trips.filter(
    (trip) => getTripStatus(trip) === "completed"
  );

  const countries = new Set(
    completedTrips
      .map((trip) => trip.country || trip.destination)
      .filter(Boolean)
  );

  const expensesByCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  const tripsByMonth = trips.reduce((acc, t) => {
    const month = new Date(t.createdAt).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  res.status(200).json({
    success: true,
    stats: {
      totalTrips: trips.length,
      upcomingTrips: upcomingTrips.length,
      totalBudget,
      totalExpenses,
      remainingBudget: totalBudget - totalExpenses,
      countriesVisited: countries.size,
      recentTrips: trips.slice(0, 5),
      expensesByCategory,
      tripsByMonth,
    },
  });
});
