import axios from "axios"
import { toast } from "react-toastify";
import { useAuthStore } from "./store";



const axiosInstance = axios.create({
   baseURL: import.meta.env.VITE_API_URL,
});


axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    if (response) {
      if (response.status === 401) {
        toast.error("Unauthorized");
        useAuthStore.getState().logOut()
        
      } else if (response.status === 403) {
        console.error("Forbidden Error:", response.data.message);
        toast.error(response.data.message);
      } else if (response.status === 404) {
        console.error("Not Found Error:", response.data.message);
        toast.error(response.data.message);
      } else if (response.status === 500) {
        console.error("Internal Server Error:", response.data.message);
        toast.error(response.data.message);
      }
    } else {
      console.error("Network Error:", error.message);
      toast.error(error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
