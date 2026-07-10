import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiMapPin,
  FiCalendar,
  FiUsers,
  FiCpu,
  FiSave,
  FiClock,
  FiCoffee,
  FiPackage,
} from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";
import GlassCard from "../components/GlassCard";
import Loader from "../components/Loader";
import * as aiService from "../services/aiService";

const AITripPlannerPage = () => {
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    destination: "",
    budget: "",
    days: "",
    travelers: 1,
    startDate: "",
    endDate: "",
  });
  const [plan, setPlan] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const endDate =
    form.startDate && form.days
      ? new Date(
          new Date(form.startDate).getTime() +
            (Number(form.days) - 1) * 24 * 60 * 60 * 1000
        )
          .toISOString()
          .split("T")[0]
      : "";

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    setPlan(null);
    if (!form.startDate || isNaN(new Date(form.startDate).getTime())) {
      toast.error("Enter a valid start date.");
      setGenerating(false);
      return;
    }

    const payload = {
      ...form,
      endDate,
    };

    try {
      const { data } = await aiService.generateTripPlan(payload);
      setPlan(data.plan);
      toast.success("Your AI Itinerary is ready!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to generate trip plan"
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);

    if (!form.startDate || isNaN(new Date(form.startDate).getTime())) {
      toast.error("Enter a valid start date.");
      setSaving(false);
      return;
    }

    const payload = {
      ...form,
      endDate,
    };

    try {
      const { data } = await aiService.generateAndSaveTrip(payload);
      toast.success("Trip saved successfully!");
      navigate(`/trips/${data.trip._id}`);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to save trip"
      );
    } finally {
      setSaving(false);
    }
  };


  

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title flex items-center gap-2">
          <FiCpu className="text-primary-500" /> AI Trip Planner
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Enter your trip details and let AI build your Itinerary
        </p>
      </div>

      <GlassCard>
        <form onSubmit={handleGenerate} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="label-text">Destination</label>
            <div className="relative">
              <FiMapPin className="absolute left-3 top-3.5 text-slate-400" />
              <input
                name="destination"
                required
                value={form.destination}
                onChange={handleChange}
                placeholder="e.g. Bali, Indonesia"
                className="input-field pl-10"
              />
            </div>
          </div>
          <div>
            <label className="label-text">Budget</label>
            <div className="relative">
              <FaRupeeSign className="absolute left-3 top-3.5 text-slate-400" />
              <input
                type="number"
                name="budget"
                required
                min={50}
                value={form.budget}
                onChange={handleChange}
                placeholder="e.g. 1500"
                className="input-field pl-10"
              />
            </div>
          </div>
          <div>
            <label className="label-text">Number of Days</label>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-3.5 text-slate-400" />
              <input
                type="number"
                name="days"
                required
                min={1}
                max={30}
                value={form.days}
                onChange={handleChange}
                placeholder="e.g. 5"
                className="input-field pl-10"
              />
            </div>
          </div>
          <div>
            <label className="label-text">Start Date</label>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-3.5 text-slate-400" />
              <input
                type="date"
                name="startDate"
                required
                value={form.startDate}
                min={today}
                onChange={handleChange}
                // onKeyDown={(e) => e.preventDefault()}
                // onPaste={(e) => e.preventDefault()}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div>
            <label className="label-text">End Date</label>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-3.5 text-slate-400" />
                <input
                  type="date"
                  value={endDate}
                  disabled
                  className="input-field pl-10 opacity-60 cursor-not-allowed"
                />
            </div>
          </div>

          <div>
            <label className="label-text">Travelers</label>
            <div className="relative">
              <FiUsers className="absolute left-3 top-3.5 text-slate-400" />
              <input
                type="number"
                name="travelers"
                required
                min={1}
                value={form.travelers}
                onChange={handleChange}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="sm:col-span-2 lg:col-span-4">
            <button type="submit" disabled={generating} className="btn-primary w-full sm:w-auto">
              <FiCpu /> {generating ? "Generating your plan..." : "Generate AI Itinerary"}
            </button>
          </div>
        </form>
      </GlassCard>

      {generating && <Loader label="Our AI is crafting your perfect trip..." />}

      <AnimatePresence>
        {plan && !generating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                {plan.destination} {plan.country ? `, ${plan.country}` : ""}
              </h2>
              <button onClick={handleSave} disabled={saving} className="btn-primary">
                <FiSave /> {saving ? "Saving..." : "Save This Trip"}
              </button>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              <GlassCard className="lg:col-span-2">
                <h3 className="mb-3 font-semibold text-slate-800 dark:text-white">
                  Daily Itinerary
                </h3>
                <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2">
                  {plan.itinerary?.map((day) => (
                    <div
                      key={day.day}
                      className="rounded-xl border border-slate-200 dark:border-slate-700 p-4"
                    >
                      <p className="mb-2 font-semibold text-primary-600 dark:text-primary-400">
                        Day {day.day}: {day.title}
                      </p>
                      <ul className="space-y-2">
                        {day.activities?.map((act, idx) => (
                          <li key={idx} className="flex gap-3 text-sm">
                            <span className="flex items-center gap-1 whitespace-nowrap text-slate-400">
                              <FiClock size={12} /> {act.time}
                            </span>
                            <span>
                              <span className="font-medium text-slate-700 dark:text-slate-200">
                                {act.title}
                              </span>
                              {act.description && (
                                <span className="text-slate-500 dark:text-slate-400">
                                  {" "}
                                  — {act.description}
                                </span>
                              )}
                              {act.estimatedCost ? (
                                <span className="ml-1 text-xs text-teal-500">
                                  (~₹{act.estimatedCost})
                                </span>
                              ) : null}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <div className="space-y-5">
                <GlassCard>
                  <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
                    <FiCoffee /> Food Recommendations
                  </h3>
                  <ul className="list-inside list-disc space-y-1 text-sm text-slate-600 dark:text-slate-300">
                    {plan.foodRecommendations?.map((food, idx) => (
                      <li key={idx}>{food}</li>
                    ))}
                  </ul>
                </GlassCard>

                <GlassCard>
                  <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
                    <FiPackage /> Packing Checklist
                  </h3>
                  <ul className="list-inside list-disc space-y-1 text-sm text-slate-600 dark:text-slate-300">
                    {plan.packingChecklist?.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </GlassCard>

                <GlassCard>
                  <h3 className="mb-2 font-semibold text-slate-800 dark:text-white">
                    Best Time to Visit
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {plan.bestTimeToVisit}
                  </p>
                </GlassCard>

                <GlassCard>
                  <h3 className="mb-3 font-semibold text-slate-800 dark:text-white">
                    Estimated Budget Breakdown
                  </h3>
                  <ul className="space-y-1.5 text-sm">
                    {Object.entries(plan.estimatedBudgetBreakdown || {}).map(
                      ([key, val]) => (
                        <li key={key} className="flex justify-between capitalize text-slate-600 dark:text-slate-300">
                          <span>{key}</span>
                          <span className="font-semibold">₹{val}</span>
                        </li>
                      )
                    )}
                  </ul>
                </GlassCard>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AITripPlannerPage;
