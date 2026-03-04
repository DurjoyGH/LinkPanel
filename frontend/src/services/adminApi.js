import api from "./api";

export const addUser = (data) => api.post("/admin/add-user", data);
