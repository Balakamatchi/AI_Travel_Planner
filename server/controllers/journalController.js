const asyncHandler = require("express-async-handler");
const Journal = require("../models/Journal");
const Trip = require("../models/Trip");
const cloudinary = require("../config/cloudinary");

// @desc    Create a journal entry
// @route   POST /api/journals
// @access  Private
exports.createJournal = asyncHandler(async (req, res) => {
  const { trip: tripId } = req.body;

  const trip = await Trip.findOne({ _id: tripId, user: req.user._id });
  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  const entryDate = new Date(req.body.entryDate);

  if (
    !req.body.entryDate ||
    isNaN(entryDate.getTime()) ||
    entryDate.getFullYear() < 2000 ||
    entryDate.getFullYear() > 2100
  ) {
    res.status(400);
    throw new Error("Invalid entry date");
  }


  const photos = (req.files || []).map((f) => ({
    url: f.path,
    publicId: f.filename,
  }));

  const journal = await Journal.create({
    ...req.body,
    photos,
    user: req.user._id,
  });

  res.status(201).json({ success: true, journal });
});

// @desc    Get journal entries (optionally filter by trip)
// @route   GET /api/journals?trip=<tripId>
// @access  Private
exports.getJournals = asyncHandler(async (req, res) => {
  const filter = { user: req.user._id };
  if (req.query.trip) filter.trip = req.query.trip;

  const journals = await Journal.find(filter).sort({ entryDate: -1 });
  res.status(200).json({ success: true, count: journals.length, journals });
});

// @desc    Get single journal entry
// @route   GET /api/journals/:id
// @access  Private
exports.getJournalById = asyncHandler(async (req, res) => {
  const journal = await Journal.findOne({ _id: req.params.id, user: req.user._id });
  if (!journal) {
    res.status(404);
    throw new Error("Journal entry not found");
  }
  if (req.body.entryDate) {
    const entryDate = new Date(req.body.entryDate);

    if (
      isNaN(entryDate.getTime()) ||
      entryDate.getFullYear() < 2000 ||
      entryDate.getFullYear() > 2100
    ) {
      res.status(400);
      throw new Error("Invalid entry date");
    }
  }

  res.status(200).json({ success: true, journal });
});

// @desc    Update journal entry (can also append new photos)
// @route   PUT /api/journals/:id
// @access  Private
exports.updateJournal = asyncHandler(async (req, res) => {
  const journal = await Journal.findOne({ _id: req.params.id, user: req.user._id });
  if (!journal) {
    res.status(404);
    throw new Error("Journal entry not found");
  }

  const newPhotos = (req.files || []).map((f) => ({
    url: f.path,
    publicId: f.filename,
  }));

  Object.assign(journal, req.body);
  if (newPhotos.length) {
    journal.photos = [...journal.photos, ...newPhotos];
  }

  await journal.save();
  res.status(200).json({ success: true, journal });
});

// @desc    Delete journal entry
// @route   DELETE /api/journals/:id
// @access  Private
exports.deleteJournal = asyncHandler(async (req, res) => {
  const journal = await Journal.findOne({ _id: req.params.id, user: req.user._id });
  if (!journal) {
    res.status(404);
    throw new Error("Journal entry not found");
  }

  for (const photo of journal.photos) {
    if (photo.publicId) {
      await cloudinary.uploader.destroy(photo.publicId).catch(() => {});
    }
  }

  await journal.deleteOne();
  res.status(200).json({ success: true, message: "Journal entry deleted successfully" });
});
