import React, { useState } from "react";
import { MdLayersClear } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import { slideUpDownwithScale } from "../Animations";
import { FiltersData } from "../Utils/Helper";
import UseFilters from "../Hooks/UseFilters";
import { useQueryClient } from "react-query";
const Filter = () => {
  const [isClearHover, setIsClearHover] = useState(false);

  const { data: FilterData } = UseFilters();

  const queryClient = useQueryClient();
  const handleFilterValue = (value) => {
    // const previousState = queryClient.getQueryData("globalFilter");
    // const updatedState = { ...previousState, searchTrem: value };
    // queryClient.setQueriesData("globalFilter", updatedState);

    queryClient.setQueryData("globalFilter", {
      ...queryClient.getQueryData("globalFilter"),
      searchTerm: value,
    });
  };

  const clearFilter = () => {
    queryClient.setQueryData("globalFilter", {
      ...queryClient.getQueryData("globalFilter"),
      searchTerm: "",
    });
  };


  return (
    <div className=" w-full flex items-center justify-start py-4">
      <div
        className="border border-gray-300 rounded-md px-3 py-2 mr-2 cup group hover:shadow-md bg-gray-200 relative"
        onMouseEnter={() => setIsClearHover(true)}
        onMouseLeave={() => setIsClearHover(false)}
        onClick={clearFilter}
      >
        <MdLayersClear className="text-xl" />

        <AnimatePresence>
          {isClearHover && (
            <motion.div
              onClick={clearFilter}
              {...slideUpDownwithScale}
              className=" absolute -top-8 -left-2 bg-white shadow-md rounded-md px-2 py-1 "
            >
              <p className="whitespace-nowrap text-xs">Clear all</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className=" w-full flex items-center justify-start overflow-x-scroll gap-6 scrollbar-none">
        {FiltersData &&
          FiltersData.map((item) => (
            <div
              onClick={() => handleFilterValue(item.value)}
              key={item.id}
              className={`border border-gray-300  rounded-md px-6 py-2  cursor-pointer group hover: shadow-md ${
                FilterData &&
                FilterData.searchTerm === item.value &&
                "bg-gray-300 shadow-md"
              } `}
            >
              <p className=" text-sm text-txtPrimary group-hover:text-txtDark whitespace-nowrap">
                {item.label}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Filter;
