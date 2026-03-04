import api from "./api";

export const loginUser = (data) => api.post("/auth/login", data);
