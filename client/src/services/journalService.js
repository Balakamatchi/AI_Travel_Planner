import api from "./api";

export const getJournals = (tripId) =>
  api.get("/journals", { params: tripId ? { trip: tripId } : {} });
export const getJournalById = (id) => api.get(`/journals/${id}`);
export const createJournal = (formData) =>
  api.post("/journals", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updateJournal = (id, formData) =>
  api.put(`/journals/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteJournal = (id) => api.delete(`/journals/${id}`);
