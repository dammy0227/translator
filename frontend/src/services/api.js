import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // adjust if your backend is deployed
});

// Fetch available languages
export const fetchLanguages = async () => {
  const { data } = await API.get("/languages");
  return data;
};

// Translate text
export const translateText = async (payload) => {
  const { data } = await API.post("/translate", payload);
  return data;
};

export default API;
