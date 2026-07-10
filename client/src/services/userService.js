import api from "./api";

export const updateProfile = (data) => api.put("/users/profile", data);
export const updateAvatar = (formData) =>
  api.put("/users/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const getDashboardStats = () => api.get("/users/dashboard");
