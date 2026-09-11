import { apiRequest } from "./api";
export const getEventos = () => apiRequest<unknown[]>("/eventos");
