import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import { HomeScreen, Authcatation } from "../Pages";

//query client for state management
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

//toster
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const App = () => {
  const queryCient = new QueryClient();

  return (
    //suspence is used to if any error occure in routes then fallback to loader
    <QueryClientProvider client={queryCient}>
      <Suspense fallback={<div>...Loading</div>}>
        <Routes>
          <Route path="/*" element={<HomeScreen></HomeScreen>}></Route>
          <Route path="/auth" element={<Authcatation></Authcatation>}></Route>
        </Routes>
      </Suspense>
      <ToastContainer position="top-right" theme="dark" />
      <ReactQueryDevtools initialIsOpen={false}></ReactQueryDevtools>
    </QueryClientProvider>
  );
};

export default App;
