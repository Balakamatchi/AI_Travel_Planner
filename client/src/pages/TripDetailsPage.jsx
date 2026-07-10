import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getTripStatus } from "../utils/getTripStatus";
import {
  FiEdit2,
  FiTrash2,
  FiMapPin,
  FiCalendar,
  FiUsers,
  FiClock,
  FiCheckSquare,
  FiSquare,
} from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";
import GlassCard from "../components/GlassCard";
import Loader from "../components/Loader";
import * as tripService from "../services/tripService";

const TripDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  // Derived end date — declared up top so it's clear it's available
  // wherever it's needed (handleUpdate, the disabled End Date input, etc.)
  const endDate =
    form.startDate && form.days
      ? new Date(
          new Date(form.startDate).getTime() +
            (Number(form.days) - 1) * 24 * 60 * 60 * 1000
        )
          .toISOString()
          .split("T")[0]
      : "";

  const today = new Date().toISOString().split("T")[0];

  const fetchTrip = async () => {
    try {
      const { data } = await tripService.getTripById(id);
      setTrip(data.trip);
      setForm({
        destination: data.trip.destination,
        budget: data.trip.budget,
        travelers: data.trip.travelers,
        startDate: data.trip.startDate?.split("T")[0],
        days: data.trip.days,
        // endDate: data.trip.endDate?.split("T")[0],
        // status: data.trip.status,
      });
    } catch (error) {
      toast.error("Trip not found");
      navigate("/trips");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const start = new Date(form.startDate);

    if (
      isNaN(start.getTime()) ||
      start.getFullYear() < 2000 ||
      start.getFullYear() > 2100
    ) {
      toast.error("Enter a valid start date to update the Itinerary");
      return;
    }

    const originalDays = trip.itinerary?.length || 0;

    if (form.days > originalDays) {
      toast.error(
        `This Itinerary was generated for ${originalDays} days. Please generate a new AI Itinerary to extend your trip.`
      );
      return;
    }

    const updatedForm = {
      ...form,
      endDate,
    };

    // Trim itinerary if days reduced
    if (form.days < originalDays) {
      updatedForm.itinerary = trip.itinerary.slice(0, form.days);
    }

    try {
      const { data } = await tripService.updateTrip(id, updatedForm);

      setTrip(data.trip);
      setEditing(false);
      toast.success("Trip updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this trip? This cannot be undone.")) return;
    try {
      await tripService.deleteTrip(id);
      toast.success("Trip deleted");
      navigate("/trips");
    } catch (error) {
      toast.error("Failed to delete trip");
    }
  };

  const handleCancelTrip = async () => {
    if (!window.confirm("Are you sure you want to cancel this trip?")) return;

    try {
      const { data } = await tripService.updateTrip(id, {
        status: "cancelled",
      });

      setTrip(data.trip);
      toast.success("Trip cancelled successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel trip");
    }
  };

  const togglePacked = async (index) => {
    const updatedChecklist = [...trip.packingChecklist];
    updatedChecklist[index].packed = !updatedChecklist[index].packed;
    setTrip({ ...trip, packingChecklist: updatedChecklist });
    try {
      await tripService.updateTrip(id, { packingChecklist: updatedChecklist });
    } catch (error) {
      toast.error("Failed to update checklist");
    }
  };

  if (loading) return <Loader label="Loading trip details..." />;
  if (!trip) return null;

  const status = getTripStatus(trip);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="section-title flex items-center gap-2">
            <FiMapPin className="text-primary-500" /> {trip.destination}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Status: {status} {trip.aiGenerated && "• AI Generated"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {status !== "cancelled" && status !== "completed" && (
            <button onClick={() => setEditing(!editing)} className="btn-secondary">
              <FiEdit2 /> {editing ? "Cancel" : "Edit"}
            </button>
          )}

          {status !== "cancelled" && status !== "completed" && (
            <button
              onClick={handleCancelTrip}
              className="btn-secondary text-orange-500 hover:bg-orange-50"
            >
              <FiTrash2 /> Cancel Trip
            </button>
          )}

          <button
            onClick={handleDelete}
            className="btn-secondary text-red-500 hover:bg-red-50"
          >
            <FiTrash2 /> Delete
          </button>
        </div>
      </div>

      {editing ? (
        <GlassCard>
          <form onSubmit={handleUpdate} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <label className="label-text">Destination</label>
              <input
                className="input-field opacity-60 cursor-not-allowed"
                value={form.destination}
                disabled
              />
            </div>
            <div>
              <label className="label-text">Budget</label>
              <input
                type="number"
                className="input-field"
                value={form.budget}
                min={1}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
              />
            </div>
            <div>
              <label className="label-text">Start Date</label>
              <input
                type="date"
                className="input-field"
                value={form.startDate}
                min={today}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
              />
            </div>

            <div>
              <label className="label-text">End Date</label>
              <input
                type="date"
                className="input-field opacity-60 cursor-not-allowed"
                value={endDate}
                disabled
              />
            </div>
            <div>
              <label className="label-text">Days</label>
              <input
                type="number"
                min={1}
                className="input-field"
                value={form.days}
                onChange={(e) =>
                  setForm({ ...form, days: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <label className="label-text">Travelers</label>
              <input
                type="number"
                className="input-field"
                value={form.travelers}
                onChange={(e) => setForm({ ...form, travelers: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-5">
              <button type="submit" className="btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </GlassCard>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <GlassCard className="flex items-center gap-3">
            <FiUsers className="text-primary-500" /> {trip.travelers} {trip.travelers === 1 ? "Traveler" : "Travelers"}
          </GlassCard>
          <GlassCard className="flex items-center gap-3">
            <FaRupeeSign className="text-primary-500" />
            {trip.budget?.toLocaleString()} Budget
          </GlassCard>
          <GlassCard className="flex items-center gap-3">
            <FiCalendar className="text-primary-500" />
            {trip.days} {trip.days === 1 ? "Day" : "Days"}
          </GlassCard>
          <GlassCard>
            <div className="flex items-center gap-3">
              <FiCalendar className="text-2xl text-primary-500" />

              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Travel Dates
                </p>

                <p className="font-semibold text-slate-800 dark:text-white">
                  {new Date(trip.startDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                  {" "}<span className="text-slate-500 dark:text-slate-400">-</span>{" "}
                  {new Date(trip.endDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                  {", "}
                  {new Date(trip.endDate).toLocaleDateString("en-IN", {
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {trip.itinerary?.length > 0 && (
        <GlassCard>
          <h3 className="mb-3 font-semibold text-slate-800 dark:text-white">Itinerary</h3>
          <div className="space-y-4">
            {trip.itinerary.map((day) => (
              <div key={day.day} className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
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
                        <span className="font-medium text-slate-700 dark:text-slate-200">{act.title}</span>
                        {act.description && (
                          <span className="text-slate-500 dark:text-slate-400"> — {act.description}</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        {trip.foodRecommendations?.length > 0 && (
          <GlassCard>
            <h3 className="mb-3 font-semibold text-slate-800 dark:text-white">Food Recommendations</h3>
            <ul className="list-inside list-disc space-y-1 text-sm text-slate-600 dark:text-slate-300">
              {trip.foodRecommendations.map((food, idx) => (
                <li key={idx}>{food}</li>
              ))}
            </ul>
          </GlassCard>
        )}

        {trip.packingChecklist?.length > 0 && (
          <GlassCard>
            <h3 className="mb-3 font-semibold text-slate-800 dark:text-white">Packing Checklist</h3>
            <ul className="space-y-2 text-sm">
              {trip.packingChecklist.map((item, idx) => (
                <li
                  key={idx}
                  onClick={() => togglePacked(idx)}
                  className="flex cursor-pointer items-center gap-2 text-slate-600 dark:text-slate-300"
                >
                  {item.packed ? (
                    <FiCheckSquare className="text-teal-500" />
                  ) : (
                    <FiSquare className="text-slate-400" />
                  )}
                  <span className={item.packed ? "line-through opacity-60" : ""}>{item.item}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to={`/budget?trip=${trip._id}`} className="btn-secondary">
          <FaRupeeSign /> View Expenses
        </Link>
        <Link to={`/journal?trip=${trip._id}`} className="btn-secondary">
          Add Journal Entry
        </Link>
        <Link to={`/map?trip=${trip._id}`} className="btn-secondary">
          <FiMapPin /> View on Map
        </Link>
      </div>
    </div>
  );
};

export default TripDetailsPage;