import "leaflet/dist/leaflet.css";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import toast from "react-hot-toast";
import GlassCard from "../components/GlassCard";
import Loader from "../components/Loader";
import * as tripService from "../services/tripService";

// Fix default marker icons (Leaflet + Vite asset path issue)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const typeColors = {
  attraction: "#0aa8f0",
  hotel: "#ff7a45",
  restaurant: "#14b8a6",
};

const MapViewPage = () => {
  const [searchParams] = useSearchParams();
  const tripIdParam = searchParams.get("trip") || "";

  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(tripIdParam);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const trip = trips.find((t) => t._id === selectedTrip);
  const places = (trip?.places || []).filter(
    (p) => filter === "all" || p.type === filter
  );

  const validPlaces = places.filter(
    (p) => typeof p.lat === "number" && typeof p.lng === "number"
  );
  const center = validPlaces.length
    ? [validPlaces[0].lat, validPlaces[0].lng]
    : [20.5937, 78.9629]; // fallback: center of India

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const { data } = await tripService.getTrips();
        setTrips(data.trips);
        if (!selectedTrip && data.trips.length) setSelectedTrip(data.trips[0]._id);
      } catch (error) {
        toast.error("Failed to load trips");
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <Loader label="Loading map data..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title">Interactive Map</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Explore attractions, hotels, and restaurants for your trip
        </p>
      </div>

      <GlassCard className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="label-text">Trip</label>
          <select
            className="input-field"
            value={selectedTrip}
            onChange={(e) => setSelectedTrip(e.target.value)}
          >
            {trips.map((t) => (
              <option key={t._id} value={t._id}>
                {t.destination}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="label-text">Filter</label>
          <div className="flex gap-2">
            {["all", "attraction", "hotel", "restaurant"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize ${
                  filter === f
                    ? "bg-primary-500 text-white"
                    : "bg-white/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-0 overflow-hidden">
        {validPlaces.length === 0 ? (
          <div className="flex h-96 items-center justify-center text-sm text-slate-500 dark:text-slate-400">
            No map data available for this trip yet. Generate a trip with the AI planner to populate places.
          </div>
        ) : (
          <MapContainer center={center} zoom={12} style={{ height: "500px", width: "100%" }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {validPlaces.map((place, idx) => (
              <Marker key={idx} position={[place.lat, place.lng]}>
                <Popup>
                  <strong style={{ color: typeColors[place.type] }}>{place.name}</strong>
                  <br />
                  <span className="capitalize">{place.type}</span>
                  <br />
                  {place.description}
                  {place.rating ? <div>⭐ {place.rating}</div> : null}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </GlassCard>

      {places.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {places.map((place, idx) => (
            <GlassCard key={idx}>
              <p className="font-semibold text-slate-800 dark:text-white">{place.name}</p>
              <p className="text-xs uppercase tracking-wide" style={{ color: typeColors[place.type] }}>
                {place.type}
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{place.description}</p>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default MapViewPage;
