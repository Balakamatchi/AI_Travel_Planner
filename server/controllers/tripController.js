const asyncHandler = require("express-async-handler");
const Trip = require("../models/Trip");
const Expense = require("../models/Expense");
const Journal = require("../models/Journal");
const cloudinary = require("../config/cloudinary");

// @desc    Create a trip manually
// @route   POST /api/trips
// @access  Private
exports.createTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.create({ ...req.body, user: req.user._id });
  res.status(201).json({ success: true, trip });
});

// @desc    Get all trips for logged in user
// @route   GET /api/trips
// @access  Private
exports.getTrips = asyncHandler(async (req, res) => {
  const { status, search } = req.query;
  const filter = { user: req.user._id };
  if (status) filter.status = status;
  if (search) filter.destination = { $regex: search, $options: "i" };

  const trips = await Trip.find(filter).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: trips.length, trips });
});

// @desc    Get single trip by id
// @route   GET /api/trips/:id
// @access  Private
exports.getTripById = asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({ _id: req.params.id, user: req.user._id });
  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }
  res.status(200).json({ success: true, trip });
});

// @desc    Update trip
// @route   PUT /api/trips/:id
// @access  Private
exports.updateTrip = asyncHandler(async (req, res) => {
  let trip = await Trip.findOne({ _id: req.params.id, user: req.user._id });
  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  if (req.body.startDate && isNaN(new Date(req.body.startDate).getTime())) {
    res.status(400);
    throw new Error("Enter valid start date to update the trip");
  }

  if (req.body.endDate && isNaN(new Date(req.body.endDate).getTime())) {
    res.status(400);
    throw new Error("Enter valid end date to update the trip");
  }

  if (req.body.startDate) {
    const start = new Date(req.body.startDate);

    if (
      isNaN(start.getTime()) ||
      start.getFullYear() < 2000 ||
      start.getFullYear() > 2100
    ) {
      res.status(400);
      throw new Error("Invalid start date");
    }
  }


  trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, trip });
});

// @desc    Delete trip (cascades expenses & journal entries)
// @route   DELETE /api/trips/:id
// @access  Private
exports.deleteTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({ _id: req.params.id, user: req.user._id });
  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  if (trip.coverImage) {
    const publicId = trip.coverImagePublicId;
    if (publicId) await cloudinary.uploader.destroy(publicId).catch(() => {});
  }

  await Expense.deleteMany({ trip: trip._id });
  await Journal.deleteMany({ trip: trip._id });
  await trip.deleteOne();

  res.status(200).json({ success: true, message: "Trip deleted successfully" });
});



