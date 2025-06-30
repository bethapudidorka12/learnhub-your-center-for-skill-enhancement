import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: "http://localhost:5001", // Change to 5001 if you changed it in backend
});

export default AxiosInstance;
