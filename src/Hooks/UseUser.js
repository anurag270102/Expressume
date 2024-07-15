import { useQuery } from "react-query";
import { toast } from "react-toastify";

import { GetUserDetail } from "../Api";
const UseUser = () => {
  const { data, isLoading, isError, refetch } = useQuery(
    "user",
    async () => {
      try {
        const userDetail = await GetUserDetail();
        return userDetail;
      } catch (error) {
        if (!error.message.includes("not authenticated")) {
          toast.error("Something went wrong...");
        }
      }
    },
    { refetchOnWindowFocus: false }
  );
  return { data, isLoading, isError, refetch };
};
export default UseUser;