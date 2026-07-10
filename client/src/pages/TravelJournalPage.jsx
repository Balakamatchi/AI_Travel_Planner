import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FiPlus, FiTrash2, FiStar, FiImage } from "react-icons/fi";
import GlassCard from "../components/GlassCard";
import Loader from "../components/Loader";
import * as journalService from "../services/journalService";
import * as tripService from "../services/tripService";

const moods = ["amazing", "happy", "neutral", "tiring", "disappointing"];

const emptyForm = { title: "", content: "", rating: 5, mood: "happy", entryDate: "" };

const TravelJournalPage = () => {
  const [searchParams] = useSearchParams();
  const tripIdParam = searchParams.get("trip") || "";

  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(tripIdParam);
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [photos, setPhotos] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const fetchTrips = async () => {
    const { data } = await tripService.getTrips();
    setTrips(data.trips);
    if (!selectedTrip && data.trips.length) setSelectedTrip(data.trips[0]._id);
  };

  const fetchJournals = async (tripId) => {
    if (!tripId) return;
    setLoading(true);
    try {
      const { data } = await journalService.getJournals(tripId);
      setJournals(data.journals);
    } catch (error) {
      toast.error("Failed to load journal entries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedTrip) fetchJournals(selectedTrip);
  }, [selectedTrip]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTrip) {
      toast.error("Select a trip first");
      return;
    }

    if (
      !form.entryDate ||
      isNaN(new Date(form.entryDate).getTime())
    ) {
      toast.error("Enter a valid entry date.");
      return;
    }


    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));
    formData.append("trip", selectedTrip);
    photos.forEach((file) => formData.append("photos", file));

    try {
      await journalService.createJournal(formData);
      toast.success("Journal entry saved");
      setForm(emptyForm);
      setPhotos([]);
      setShowForm(false);
      fetchJournals(selectedTrip);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save journal entry");
    }
  };

  const handleDelete = async (journalId) => {
    if (!window.confirm("Delete this journal entry?")) return;
    try {
      await journalService.deleteJournal(journalId);
      toast.success("Entry deleted");
      fetchJournals(selectedTrip);
    } catch (error) {
      toast.error("Failed to delete entry");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="section-title">Travel Journal</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Capture your memories, one trip at a time
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          <FiPlus /> {showForm ? "Cancel" : "New Entry"}
        </button>
      </div>

      <GlassCard>
        <label className="label-text">Select Trip</label>
        <select
          className="input-field max-w-md"
          value={selectedTrip}
          onChange={(e) => setSelectedTrip(e.target.value)}
        >
          {trips.map((t) => (
            <option key={t._id} value={t._id}>
              {t.destination}
            </option>
          ))}
        </select>
      </GlassCard>

      {showForm && (
        <GlassCard>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                placeholder="Entry title"
                required
                className="input-field"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <input
                type="date"
                className="input-field"
                value={form.entryDate}
                min={today}
                onChange={(e) =>
                  setForm({ ...form, entryDate: e.target.value })
                }
              />
            </div>
            <textarea
              placeholder="Write about your day..."
              required
              rows={4}
              className="input-field"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="label-text">Rating</label>
                <select
                  className="input-field"
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: e.target.value })}
                >
                  {[1, 2, 3, 4, 5].map((r) => (
                    <option key={r} value={r}>
                      {r} Star{r > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-text">Mood</label>
                <select
                  className="input-field capitalize"
                  value={form.mood}
                  onChange={(e) => setForm({ ...form, mood: e.target.value })}
                >
                  {moods.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-text">Photos</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setPhotos(Array.from(e.target.files))}
                  className="input-field"
                />
              </div>
            </div>
            <button type="submit" className="btn-primary">
              Save Entry
            </button>
          </form>
        </GlassCard>
      )}

      {loading ? (
        <Loader label="Loading journal entries..." />
      ) : journals.length === 0 ? (
        <GlassCard className="text-center text-sm text-slate-500 dark:text-slate-400">
          No journal entries yet for this trip.
        </GlassCard>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {journals.map((entry) => (
            <GlassCard key={entry._id} className="space-y-3">
              {entry.photos?.length > 0 && (
                <img
                  src={entry.photos[0].url}
                  alt={entry.title}
                  className="h-40 w-full rounded-xl object-cover"
                />
              )}
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-800 dark:text-white">{entry.title}</h3>
                <button onClick={() => handleDelete(entry._id)} className="text-red-500">
                  <FiTrash2 />
                </button>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3">{entry.content}</p>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: entry.rating }).map((_, i) => (
                    <FiStar key={i} fill="currentColor" />
                  ))}
                </span>
                <span className="capitalize">{entry.mood}</span>
              </div>
              <p className="text-xs text-slate-400">
                {new Date(entry.entryDate).toLocaleDateString()}
              </p>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default TravelJournalPage;
