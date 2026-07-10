const asyncHandler = require("express-async-handler");
const Trip = require("../models/Trip");
const { generateTripPlan } = require("../utils/aiService");

// @desc    Generate an AI trip plan (preview only, not saved)
// @route   POST /api/ai/generate-trip
// @access  Private
exports.generateTrip = asyncHandler(async (req, res) => {
  const { destination, budget, days, travelers, startDate, endDate } = req.body;
  
  const start = new Date(startDate);

  if (
    isNaN(start.getTime()) ||
    start.getFullYear() > 2100 ||
    start.getFullYear() < 2000
  ) {
    res.status(400);
    throw new Error("Enter a valid start date to generate the itinerary");
  }


  const end = new Date(endDate);

  if (
    isNaN(end.getTime()) ||
    end.getFullYear() > 2100 ||
    end.getFullYear() < 2000
  ) {
    res.status(400);
    throw new Error("Invalid end date");
  }

  if (end <= start) {
    res.status(400);
    throw new Error("End date must be after start date");
  }

  if (!destination || !budget || !days || !travelers) {
    res.status(400);
    throw new Error("destination, budget, days and travelers are all required");
  }

  const plan = await generateTripPlan({
    destination,
    budget: Number(budget),
    days: Number(days),
    travelers: Number(travelers),
  });

  res.status(200).json({ success: true, plan });
});

// @desc    Generate AI plan and directly save it as a new Trip
// @route   POST /api/ai/generate-and-save
// @access  Private
exports.generateAndSaveTrip = asyncHandler(async (req, res) => {
  const { destination, budget, days, travelers, startDate, endDate } = req.body;

  const start = new Date(startDate);

  if (
    isNaN(start.getTime()) ||
    start.getFullYear() > 2100 ||
    start.getFullYear() < 2000
  ) {
    res.status(400);
    throw new Error("Enter a valid start date to generate and save the trip");
  }

  const end = new Date(endDate);

  if (
    isNaN(end.getTime()) ||
    end.getFullYear() > 2100 ||
    end.getFullYear() < 2000
  ) {
    res.status(400);
    throw new Error("Invalid end date");
  }

  if (end <= start) {
    res.status(400);
    throw new Error("End date must be after start date");
  }

  if (!destination || !budget || !days || !travelers) {
    res.status(400);
    throw new Error("destination, budget, days and travelers are all required");
  }

  const plan = await generateTripPlan({
    destination,
    budget: Number(budget),
    days: Number(days),
    travelers: Number(travelers),
  });

  const allowedCategories = [
    "sightseeing",
    "food",
    "travel",
    "leisure",
    "shopping",
    "activities",
    "other",
  ];

  plan.itinerary?.forEach((day) => {
    day.activities?.forEach((activity) => {
      if (!allowedCategories.includes(activity.category)) {
        activity.category = "other";
      }
    });
  });

  const allowedPlaceTypes = [
    "attraction",
    "hotel",
    "restaurant",
  ];

  plan.places?.forEach((place) => {
    if (!allowedPlaceTypes.includes(place.type)) {
      place.type = "attraction";
    }
  });


  const trip = await Trip.create({
    user: req.user._id,
    destination: plan.destination || destination,
    country: plan.country || "",
    coverImage: plan.coverImage || "",   
    budget: Number(budget),
    days: Number(days),
    travelers: Number(travelers),
    startDate,
    endDate,
    aiGenerated: true,
    itinerary: plan.itinerary || [],
    foodRecommendations: plan.foodRecommendations || [],
    packingChecklist: (plan.packingChecklist || []).map((item) => ({ item, packed: false })),
    bestTimeToVisit: plan.bestTimeToVisit || "",
    estimatedBudgetBreakdown: plan.estimatedBudgetBreakdown || {},
    places: plan.places || [],
  });


  res.status(201).json({ success: true, trip });
});
