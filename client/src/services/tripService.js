import api from "./api";

export const getTrips = (params) => api.get("/trips", { params });
export const getTripById = (id) => api.get(`/trips/${id}`);
export const createTrip = (data) => api.post("/trips", data);
export const updateTrip = (id, data) => api.put(`/trips/${id}`, data);
export const deleteTrip = (id) => api.delete(`/trips/${id}`);
export const updateTripCover = (id, formData) =>
  api.put(`/trips/${id}/cover`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
