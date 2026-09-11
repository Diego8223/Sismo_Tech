import { apiRequest } from "./api";
export const getFamilias = () => apiRequest<unknown[]>("/familias");
