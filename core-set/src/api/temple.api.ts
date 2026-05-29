import api from "./axios";
import type { Temple, TempleApiResponse, TempleCreateInput, TempleQuery } from "../types/temple";

const callListTemples = async (params?: TempleQuery) => {
  return await api.get<TempleApiResponse<Temple[]>>("/temples", { params });
};

const callGetTemple = async (id: number | string) => {
  return await api.get<TempleApiResponse<Temple>>(`/temples/${id}`);
};

const callCreateTemple = async (input: TempleCreateInput) => {
  return await api.post<TempleApiResponse<Temple>>("/temples", input);
};

export default {
  callListTemples,
  callGetTemple,
  callCreateTemple,
};
