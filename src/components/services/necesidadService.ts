import { apiRequest } from "./api";
export const getNecesidades = () => apiRequest<unknown[]>("/necesidades");
