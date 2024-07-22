import React from "react";
import { useParams } from "react-router-dom";
import { getTemplateDeatails } from "../Api";
import { useQuery } from "react-query";
import { MainSpinner } from "../Components";
import { Link } from "react-router-dom";
import { FaHouse } from "react-icons/fa6";
import {
  BiFolderPlus,
  BiHeart,
  BiSolidFolderPlus,
  BiSolidHeart,
} from "react-icons/bi";
import UseUser from "../Hooks/UseUser";
import { saveTocollection, saveToFavourites } from "../Api";
import UseTemplate from "../Hooks/UseTemplate";
import { AnimatePresence } from "framer-motion";
import { TemplateDesignpin } from "../Components";
const TemplateDesignPinDetails = () => {
  const { templateID } = useParams();

  const { data, isError, isLoading, refetch } = useQuery(
    ["template", templateID],
    () => {
      return getTemplateDeatails(templateID);
    }
  );

  const { data: user, refetch: userRefetch } = UseUser();
  const {
    refetch: TempRefetch,
    data: templates,
    isLoading: tempLoading,
  } = UseTemplate();

  const addToCollection = async (e) => {
    e.stopPropagation();
    await saveTocollection(user, data);
    userRefetch();
  };

  const addToFavourites = async (e) => {
    e.stopPropagation();
    await saveToFavourites(user, data);
    TempRefetch();
    refetch();
  };

  if (isLoading) <MainSpinner></MainSpinner>;

  if (isError) {
    return (
      <div className=" w-full h-[60vh] flex items-center justify-center">
        <p className=" text-lg text-txtPrimary">
          Error while featching the data... please try again later
        </p>
      </div>
    );
  }
  return (
    <div className=" w-full flex items-center justify-start flex-col px-4 py-12 ">
      {/* bread cruomp */}
      <div className=" w-full flex items-center pb-8 gap-2 ">
        <Link
          to={"/"}
          className=" flex items-center justify-center gap-2 text-txtPrimary
    "
        >
          {" "}
          <FaHouse></FaHouse>Home
        </Link>
        <p>/</p>
        <p>{data?.name}</p>
      </div>

      {/* design main section */}
      <div className=" w-full grid grid-cols-1 lg:grid-cols-12">
        {/* left */}
        <div className=" col-span-1 lg:col-span-8 flex flex-col justify-start items-start gap-4">
          {/* templateImage */}
          <img
            src={data?.imageURL}
            className=" w-full h-auto object-contain rounded-md "
            alt=""
          />
          {/* title other options */}
          <div className=" w-full flex flex-col items-start justify-start gap-2">
            <div className=" w-full flex items-center justify-between">
              {/* title */}
              <p className=" text-base text-txtPrimary font-semibold">
                {data?.title}
              </p>
              {/* likes */}
              {data?.favourites?.length > 0 ? (
                <div className=" flex items-center justify-center gap-1">
                  <BiHeart className="text-base text-red-500"></BiHeart>
                  <p className="text-base text-txtPrimary font-semibold">
                    {data?.favourites?.length} likes
                  </p>
                </div>
              ) : (
                <></>
              )}
            </div>

            {/* collections and favourites options */}
            {user && (
              <div className=" flex items-center justify-center gap-3 ">
                {user?.collections?.includes(data?._id) ? (
                  <>
                    <div
                      className=" flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer"
                      onClick={addToCollection}
                    >
                      <BiSolidFolderPlus className="text-base text-txtPrimary"></BiSolidFolderPlus>
                      <p className="text-sm  whitespace-nowrap text-txtPrimary">
                        Remove from Collcetion
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className=" flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer"
                      onClick={addToCollection}
                    >
                      <BiFolderPlus className="text-base text-txtPrimary"></BiFolderPlus>
                      <p className="text-sm  whitespace-nowrap text-txtPrimary">
                        Add To Collcetion
                      </p>
                    </div>
                  </>
                )}

                {data?.favourites?.includes(user?.uid) ? (
                  <>
                    <div
                      className=" flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer"
                      onClick={addToFavourites}
                    >
                      <BiSolidHeart className="text-base text-txtPrimary"></BiSolidHeart>
                      <p className="text-sm  whitespace-nowrap text-txtPrimary">
                        Remove from Favourites
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className=" flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer"
                      onClick={addToFavourites}
                    >
                      <BiHeart className="text-base text-txtPrimary"></BiHeart>
                      <p className="text-sm  whitespace-nowrap text-txtPrimary">
                        Add To Favourites
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        {/* right */}
        <div className=" col-span-1 lg:col-span-4 w-full flex flex-col items-center justify-start px-3 gap-6 ">
          {/* discover section */}
          <div
            className=" w-full h-72 bg-blue-200 overflow-hidden relative rounded-md"
            style={{
              background:
                "url(https://cdn.pixabay.com/photo/2023/10/04/03/04/ai-generated-8292699_1280.jpg)",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          >
            <div className=" absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.4)] ">
              <Link
                to={"/"}
                className=" px-4 py-2 rounded-md border-2 border-gray-50 text-white"
              >
                Discpver More
              </Link>
            </div>
          </div>
          {/* edit the template */}
          {user && (
            <Link
              to={`/resume/${data?.name}?templateId=${templateID}`}
              className=" w-full px-4 py-3 rounded-md flex items-center justify-center bg-emerald-500 cursor-pointer "
            >
              <p className=" text-white font-semibold text-lg">
                Edit this Template
              </p>
            </Link>
          )}

          {/* tags */}
          <div className=" w-full flex items-center justify-start flex-wrap gap-2 ">
            {data?.tags?.map((tag, index) => (
              <p
                className="text-zs border border-gray-300 px-2 py-1 rounded-md whitespace-nowrap"
                key={index}
              >
                {tag}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* similar template */}
      {templates?.filter((temp) => temp._id !== data?._id).length > 0 && (
        <div className=" w-full  py-8flex flex-col items-start justify-start gap-4">
          <p className="text-lg font-semibold text-txtDark py-3">
            You might also Like
          </p>
          <div className=" w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 ">
            <>
              <AnimatePresence>
                {templates
                  ?.filter((temp) => temp._id !== data?._id)
                  .map((template, index) => (
                    <TemplateDesignpin
                      key={template?._id}
                      data={template}
                      index={index}
                    ></TemplateDesignpin>
                  ))}
              </AnimatePresence>
            </>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateDesignPinDetails;
