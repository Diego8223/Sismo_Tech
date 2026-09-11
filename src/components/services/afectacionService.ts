import { apiRequest } from "./api";
export const getAfectaciones = () => apiRequest<unknown[]>("/afectaciones");
