import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiPlus, FiSearch } from "react-icons/fi";
import TripCard from "../components/TripCard";
import Loader from "../components/Loader";
import GlassCard from "../components/GlassCard";
import * as tripService from "../services/tripService";
import { getTripStatus } from "../utils/getTripStatus";

const statusTabs = ["all", "upcoming", "ongoing", "completed", "cancelled"];

const MyTripsPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

  const fetchTrips = async () => {
    setLoading(true);

    try {
      // Fetch all trips from backend
      const { data } = await tripService.getTrips({
        search,
      });

      let filteredTrips = data.trips;

      // Filter by calculated status
      if (status !== "all") {
        filteredTrips = filteredTrips.filter(
          (trip) => getTripStatus(trip) === status
        );
      }

      setTrips(filteredTrips);
    } catch (error) {
      toast.error("Failed to load trips");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTrips();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="section-title">My Trips</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage all your planned adventures
          </p>
        </div>
        <Link to="/ai-planner" className="btn-primary">
          <FiPlus /> New Trip
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2 overflow-x-auto">
          {statusTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setStatus(tab)}
              className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium capitalize transition ${
                status === tab
                  ? "bg-primary-500 text-white"
                  : "bg-white/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <form onSubmit={handleSearch} className="relative w-full sm:w-64">
          <FiSearch className="absolute left-3 top-3 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search destination..."
            className="input-field pl-10"
          />
        </form>
      </div>

      {loading ? (
        <Loader label="Loading your trips..." />
      ) : trips.length === 0 ? (
        <GlassCard className="text-center text-sm text-slate-500 dark:text-slate-400">
          No trips found. <Link to="/ai-planner" className="text-primary-500">Plan a new trip</Link>!
        </GlassCard>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <TripCard key={trip._id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTripsPage;
