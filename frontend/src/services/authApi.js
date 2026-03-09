import api from "./api";

export const loginUser = (data) => api.post("/auth/login", data);
export const getMe = () => api.get("/auth/me");
export const changePassword = (data) => api.put("/auth/change-password", data);
