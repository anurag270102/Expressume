import React, { Suspense } from "react";
import Header from "../Components/Header";
import { MainSpinner } from "../Components";
import { Route, Routes } from "react-router-dom";
import { HomeContainer } from "../Containers";
import {
  CreateResume,
  CreateTemplate,
  TemplateDesignPinDetails,
  UserProfile,
} from "../Pages";
const HomeScreen = () => {
  return (
    <div className=" w-full flex items-center justify-center flex-col ">
      <Header></Header>
      <main className=" w-full ">
        <Suspense fallback={<MainSpinner></MainSpinner>}>
          <Routes>
            <Route path="/" element={<HomeContainer></HomeContainer>}></Route>
            <Route
              path="/template/create"
              element={<CreateTemplate></CreateTemplate>}
            ></Route>
            <Route
              path="/profile/:uid"
              element={<UserProfile></UserProfile>}
            ></Route>
            <Route
              path="/resume/*"
              element={<CreateResume></CreateResume>}
            ></Route>
            <Route
              path="/resumeDetail/:templateID"
              element={<TemplateDesignPinDetails></TemplateDesignPinDetails>}
            ></Route>
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};

export default HomeScreen;
