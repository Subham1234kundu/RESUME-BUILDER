import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { getTemplates } from "../api";

const useTemplates = () => {
    const { data, isLoading, isError, refetch } = useQuery(
        "templates",
        async () => {
            try {
                const templates = await getTemplates();
                console.log("Fetched templates:", templates);
                return templates;
            } catch (err) {
                console.error("Error fetching templates:", err);
                toast.error("Something went wrong");
            }
        },
        { refetchOnWindowFocus: false }
    );

    return { data, isLoading, isError, refetch };
};

export default useTemplates;