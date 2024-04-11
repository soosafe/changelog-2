import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_PAYLOAD_URL || "http://localhost:3001",
});

export default api;
