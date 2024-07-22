import React from "react";
import { Route, Routes } from "react-router-dom";
import { TemplateData } from "../Utils/Helper";

const CreateResume = () => {
  return (
    <div className=" w-full flex flex-col justify-start py-4 items-center">
      <Routes>
        {TemplateData.map((template) => (
          <Route
            key={template?.id}
            path={`/${template.name}`}
            Component={template.component}
          ></Route>
        ))}
      </Routes>
    </div>
  );
};

export default CreateResume;
