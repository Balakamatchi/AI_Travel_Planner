import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMapPin, FiCalendar, FiUsers } from "react-icons/fi";
import GlassCard from "./GlassCard";
import { getTripStatus } from "../utils/getTripStatus";
import { FaRupeeSign } from "react-icons/fa";

const statusColors = {
  upcoming: "bg-primary-500/15 text-primary-600 dark:text-primary-400",
  ongoing: "bg-teal-500/15 text-teal-600 dark:text-teal-400",
  completed: "bg-slate-500/15 text-slate-600 dark:text-slate-300",
  cancelled: "bg-red-500/15 text-red-500",
};

const TripCard = ({ trip }) => {
  const status = getTripStatus(trip);
  const [imgFailed, setImgFailed] = useState(false);

  // Picsum is a live placeholder-image CDN. Seeding by destination name
  // keeps the same "random" photo consistent for the same trip on reload,
  // without needing an API key.
  const cover =
    trip.coverImage ||
    `https://picsum.photos/seed/${encodeURIComponent(trip.destination)}/600/400`;

  return (
    <GlassCard className="overflow-hidden p-0">
      <div className="relative h-40 w-full overflow-hidden">
        {!imgFailed ? (
          <img
            src={cover}
            alt={trip.destination}
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-200 dark:bg-slate-700">
            <FiMapPin className="mr-2 text-2xl text-slate-400" />
            <span className="text-sm font-medium text-slate-500 dark:text-slate-300">
              {trip.destination}
            </span>
          </div>
        )}
        <span
          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusColors[status]}`}
        >
          {status}
        </span>
      </div>
      <div className="space-y-3 p-5">
        <div className="flex items-center gap-1.5 text-lg font-bold text-slate-800 dark:text-white">
          <FiMapPin className="text-primary-500" />
          {trip.destination}
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <FiCalendar /> {trip.days} days
          </span>
          <span className="flex items-center gap-1">
            <FiUsers /> {trip.travelers}
          </span>
          <span className="flex items-center gap-1">
            <FaRupeeSign /> {trip.budget?.toLocaleString()}
          </span>
        </div>
        <Link
          to={`/trips/${trip._id}`}
          className="btn-primary mt-2 w-full text-sm"
        >
          View Details
        </Link>
      </div>
    </GlassCard>
  );
};

export default TripCard;