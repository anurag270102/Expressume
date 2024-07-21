import React from "react";
import { Filter, MainSpinner, TemplateDesignpin } from "../Components";
import UseTemplate from "../Hooks/UseTemplate";
import { AnimatePresence } from "framer-motion";

const HomeContainer = () => {
  const {
    data: templates,
    isError: templateError,
    isLoading: templateLoading,
    
  } = UseTemplate();
  if (templateLoading) {
    return <MainSpinner></MainSpinner>;
  }
  return (
    <div className=" w-full px-4 lg:px-12 py-6 flex flex-col items-center justify-start">
      {/* fileter */}
      <Filter></Filter>
      {/* render those template */}
      {templateError ? (
        <>
          <p>Something Wrong Please try again</p>
        </>
      ) : (
        <>
          <div className=" w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 ">
            <ReanderTemplate  templates={templates}/>
          </div>
        </>
      )}
    </div>
  );
};

const ReanderTemplate = ({ templates }) => {
  return (
    <>
      {templates && templates.length > 0 ? (
        <>
          <AnimatePresence>
            {templates &&
              templates.map((template, index) => (
                <TemplateDesignpin
                  key={template?._id}
                  data={template}
                  index={index}
                ></TemplateDesignpin>
              ))}
          </AnimatePresence>
        </>
      ) : (
        <>
          <p>No Data found</p>
        </>
      )}
    </>
  );
};
export default HomeContainer;
