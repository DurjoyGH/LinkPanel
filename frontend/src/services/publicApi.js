import api from "./api";

export const getLinks    = ()           => api.get("/links");
export const createLink  = (data)        => api.post("/links", data);
export const updateLink  = (id, data)    => api.put(`/links/${id}`, data);
export const deleteLink  = (id)          => api.delete(`/links/${id}`);
export const getLinkById = (id)          => api.get(`/links/${id}`);
export const getFiles    = ()            => api.get("/files");
export const getFileById = (id)          => api.get(`/files/${id}`);
export const deleteFile  = (id)          => api.delete(`/files/${id}`);
export const updateFile  = (id, data)    => api.put(`/files/${id}`, data);

export const uploadFile  = (formData, onUploadProgress) =>
  api.post("/files/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress,
  });
