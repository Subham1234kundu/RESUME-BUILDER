import { useQuery } from "react-query";
import { toast } from "react-toastify";

const useUser = ()=>{
    const {data, isLoading , isError , refetch} = useQuery(
        "user",
        async ()=>{
            try{
                const userDetail = new getUserDetail();
            }catch(err){
                if(!err.message.includes("not authenticated")){
                    toast.err("something went wrong....")
                }
            }
        }
    )
}