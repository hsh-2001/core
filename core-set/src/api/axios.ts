import axios from "axios";

const api = axios.create({
  baseURL: "https://hcore.shkh1601.workers.dev/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

export default api;