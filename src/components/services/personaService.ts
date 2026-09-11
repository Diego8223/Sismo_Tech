import { apiRequest } from "./api";
export type Persona = {
  id: number;
  nombre: string;
  documento: string;
  fechaNacimiento: string;
  familia: string;
};
export const getPersonas = () => apiRequest<Persona[]>("/personas");
