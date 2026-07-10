const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },
    title: { type: String, required: [true, "Title is required"] },
    content: { type: String, required: [true, "Journal content is required"] },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    mood: {
      type: String,
      enum: ["amazing", "happy", "neutral", "tiring", "disappointing"],
      default: "happy",
    },
    photos: [
      {
        url: { type: String },
        publicId: { type: String },
      },
    ],
    entryDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

journalSchema.index({ trip: 1, entryDate: -1 });

module.exports = mongoose.model("Journal", journalSchema);
