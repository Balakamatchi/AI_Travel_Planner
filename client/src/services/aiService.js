import api from "./api";

export const generateTripPlan = (data) => api.post("/ai/generate-trip", data);
export const generateAndSaveTrip = (data) => api.post("/ai/generate-and-save", data);
