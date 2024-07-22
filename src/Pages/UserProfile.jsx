import React, { useState } from "react";
import UseUser from "../Hooks/UseUser";
import { AnimatePresence } from "framer-motion";
import { MainSpinner, TemplateDesignpin } from "../Components";
import UseTemplate from "../Hooks/UseTemplate";
// import { useNavigate } from "react-router-dom";
import { NoData } from "../assets";
import { useQuery } from "react-query";
import { getSavedResumes } from "../Api";
const UserProfile = () => {
  const { data: user } = UseUser();
  const [activeTab, setActiveTab] = useState("collections");
  const { data: templates,isLoading:temploading } = UseTemplate();
  const { data: savedResume } = useQuery(["savedResumes"], () =>
    getSavedResumes(user?.uid)
  );
  // const navigate = useNavigate();
  // useEffect(() => {
  //   if (!user) navigate("/auth", { replace: true });
  // });

  if (temploading) {
   return <MainSpinner></MainSpinner> 
  }
  return (
    <div className=" w-full flex flex-col items-center justify-start py-12 ">
      <div className=" w-full h-72 bg-blue-50 ">
        <img
          src="https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG98by1wYWdlfHx8fGVufDB8fHx8A%3D%3D&auto=format&fit=crop&w=1470&q=80"
          alt=""
          className=" w-full h-full object-cover"
        />
        <div className="flex  items-center justify-center flex-col gap-4">
          {user?.photoURL ? (
            <>
              <img
                src={user?.photoURL}
                alt=""
                className=" w-24 h-24 rounded-md border-2 border-white -mt-1 shadow-md"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            </>
          ) : (
            <>
              <img
                src="https://img.freepik.com/premium-vector/adorable-cyberpunk-dj-vector_868778-499.jpg"
                alt=""
                className=" w-24 h-24 rounded-md border-2 border-white -mt-1 shadow-md"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            </>
          )}
          <p className="text-2xl text-txtDark">{user?.displayName}</p>
        </div>

        {/* tabs */}
        <div className="flex items-center justify-center mt-12">
          <div
            className=" px-4 py-2 rounded-md flex items-center justify-center gap-2 group cursor-pointer"
            onClick={() => setActiveTab("resumes")}
          >
            <p
              className={`text-base text-txtPrimary group-hover:text-blue-600 px-4 py-1 rounded-full ${
                activeTab === "collections" &&
                "bg-white shadow-md text-blue-600"
              }`}
            >
              My Resumes
            </p>
          </div>
          <div
            className=" px-4 py-2 rounded-md flex items-center justify-center gap-2 group cursor-pointer"
            onClick={() => setActiveTab("collections")}
          >
            <p
              className={`text-base text-txtPrimary group-hover:text-blue-600 px-4 py-1 rounded-full ${
                activeTab === "collections" &&
                "bg-white shadow-md text-blue-600"
              }`}
            >
              collections
            </p>
          </div>
        </div>

        {/* tab content */}
        <div className=" w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 px-4 py-6">
          <AnimatePresence>
            {activeTab === "collections" && (
              <>
                {user?.collections.length > 0 && user?.collections ? (
                  <>
                    <ReanderTemplate
                      templates={templates?.filter((temp) =>
                        user?.collections?.includes(temp?._id)
                      )}
                    ></ReanderTemplate>
                    {/* {console.log(
                      templates?.filter((temp) =>
                        user?.collections?.includes(temp?._id)
                      )
                    )} */}
                  </>
                ) : (
                  <>
                    <div className="col-span-12 w-full flex flex-col items-center justify-center gap-3">
                      <img
                        src={NoData}
                        className=" w-32 h-auto object-contain"
                        alt=""
                      />
                      <p>No Data</p>
                    </div>
                  </>
                )}
              </>
            )}
             {activeTab === "resumes" && (
              <>
                {savedResume.length > 0 && savedResume ? (
                  <>
                    <ReanderTemplate
                      templates={savedResume}
                    ></ReanderTemplate>
                    {/* {console.log(
                      templates?.filter((temp) =>
                        user?.collections?.includes(temp?._id)
                      )
                    )} */}
                  </>
                ) : (
                  <>
                    <div className="col-span-12 w-full flex flex-col items-center justify-center gap-3">
                      <img
                        src={NoData}
                        className=" w-32 h-auto object-contain"
                        alt=""
                      />
                      <p>No Data</p>
                    </div>
                  </>
                )}
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
const ReanderTemplate = ({ templates }) => {
  return (
    <>
      {templates && templates.length > 0 && (
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
      )}
    </>
  );
};
