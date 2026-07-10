const mongoose = require("mongoose");

const itineraryActivitySchema = new mongoose.Schema(
  {
    time: { type: String, default: "" },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    category: {
      type: String,
      enum: ["sightseeing", "food", "travel", "leisure", "shopping", "activities", "other"],
      default: "sightseeing",
    },
    estimatedCost: { type: Number, default: 0 },
  },
  { _id: false }
);

const itineraryDaySchema = new mongoose.Schema(
  {
    day: { type: Number, required: true },
    title: { type: String, default: "" },
    activities: [itineraryActivitySchema],
  },
  { _id: false }
);

const placeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["attraction", "hotel", "restaurant"],
      default: "attraction",
    },
    description: { type: String, default: "" },
    lat: { type: Number },
    lng: { type: Number },
    rating: { type: Number, default: 0 },
  },
  { _id: false }
);

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    destination: { type: String, required: [true, "Destination is required"] },
    country: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    startDate: { type: Date },
    endDate: { type: Date },
    days: { type: Number, required: true, min: 1 },
    travelers: { type: Number, required: true, min: 1, default: 1 },
    budget: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["cancelled"],
      default: undefined,
    },
    lat: { type: Number },
    lng: { type: Number },
    aiGenerated: { type: Boolean, default: false },
    itinerary: [itineraryDaySchema],
    foodRecommendations: [{ type: String }],
    packingChecklist: [
      {
        item: { type: String },
        packed: { type: Boolean, default: false },
      },
    ],
    bestTimeToVisit: { type: String, default: "" },
    estimatedBudgetBreakdown: {
      accommodation: { type: Number, default: 0 },
      food: { type: Number, default: 0 },
      transport: { type: Number, default: 0 },
      activities: { type: Number, default: 0 },
      misc: { type: Number, default: 0 },
    },
    places: [placeSchema],
  },
  { timestamps: true }
);

tripSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Trip", tripSchema);