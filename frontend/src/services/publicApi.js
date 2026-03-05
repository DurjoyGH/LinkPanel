import api from "./api";

export const getLinks    = ()           => api.get("/links");
export const createLink  = (data)        => api.post("/links", data);
export const updateLink  = (id, data)    => api.put(`/links/${id}`, data);
export const deleteLink  = (id)          => api.delete(`/links/${id}`);
export const getLinkById = (id)          => api.get(`/links/${id}`);
