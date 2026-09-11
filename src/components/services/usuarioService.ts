import { apiRequest } from "./api";
export const getUsuarios = () => apiRequest<unknown[]>("/usuarios");
