import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { getTemplates } from "../Api";

const UseTemplate = () => {
  const { data, isLoading, isError, refetch } = useQuery(
    "templates",
    async () => {
      try {
        const templates = await getTemplates();
        return templates;
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
      }
    },
    {refetchOnWindowFocus:false}
  );
  return  { data, isLoading, isError, refetch }
};

export default UseTemplate;