import { useQuery } from "react-query";

const fetchFilterData = async () => {
  return { searchTerm: "" };
};

const UseFilters = () => {
  const { data, isLoading, isError, refetch } = useQuery(
    "globalFilter",
    fetchFilterData,
    { refetchOnWindowFocus: false, initialData: { searchTerm: "" } }
  );
  return { data, isLoading, isError, refetch };
};

export default UseFilters;
