import { apiRequest } from "./api";
export const getAtenciones = () => apiRequest<unknown[]>("/atenciones");
