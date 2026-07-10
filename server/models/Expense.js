const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
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
    title: { type: String, required: [true, "Expense title is required"] },
    amount: { type: Number, required: [true, "Amount is required"], min: 0 },
    category: {
      type: String,
      enum: [
        "accommodation",
        "food",
        "transport",
        "activities",
        "shopping",
        "misc",
      ],
      default: "misc",
    },
    date: { type: Date, default: Date.now },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

expenseSchema.index({ trip: 1, date: -1 });

module.exports = mongoose.model("Expense", expenseSchema);
