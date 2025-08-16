import axios from "axios";

const API = axios.create({
  baseURL: "https://translator-ocet.onrender.com/api", // use your Render backend
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
