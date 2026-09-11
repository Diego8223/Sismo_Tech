import { apiRequest } from "./api";
export const getAyudas = () => apiRequest<unknown[]>("/ayudas");
