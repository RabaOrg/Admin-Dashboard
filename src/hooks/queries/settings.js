import { useQuery } from "@tanstack/react-query"
import { handleGetUpdate } from "../../services/settings"



export const useFetchGetUpdate = () => {
   
    return useQuery({
        queryFn: () => handleGetUpdate(),
        queryKey: ["update"],
        
        
    })

}
