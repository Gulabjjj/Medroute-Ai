import api from "./api";

export const getHospitals = async () => {
  const response = await api.get(
    "/hospitals"
  );

  return response.data;
};