export const getTripStatus = (trip) => {
  if (trip.status === "cancelled") return "cancelled";

  if (!trip.startDate || !trip.endDate)
    return trip.status || "upcoming";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(trip.startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(trip.endDate);
  end.setHours(23, 59, 59, 999);

  if (today < start) return "upcoming";

  if (today <= end) return "ongoing";

  return "completed";
};