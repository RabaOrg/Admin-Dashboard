
import axiosInstance from "../../store/axiosInstance";

export const  handleUpdates= async (formInfo) => {
  return axiosInstance.post(
   "/admin/app-updates",
    formInfo
  );
};
export const handleGetUpdate = async () => {
     const  data  = await axiosInstance.get("/admin/app-updates");
     
    return data.data
}
export const handleDeleteUpdate = async (id) => {
     const  data  = await axiosInstance.delete(`/admin/app-updates/${id}`);
     
    return data
}
