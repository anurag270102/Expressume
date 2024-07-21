import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FadeinOutWithOpecity, scaleInOut } from "../Animations";
import { BiFolderPlus, BiHeart } from "react-icons/bi";

const TemplateDesignpin = ({ data, index }) => {
  const addToCollection = async () => {};
  const addToFavourites = async () => {};
  return (
    <motion.div key={data?._id} {...scaleInOut(index)}>
      <div className="w-full h-[500px] 2xl:h-[720px] rounded-md bg-gray-300 overflow-hidden relative ">
        <img
          src={data?.imageURL}
          className=" w-full h-full object-cover "
          alt=""
        />

        <AnimatePresence>
          <motion.div
            {...FadeinOutWithOpecity}
            className=" absolute inset-0 bg-[rgba(0,0,0,0.4)] flex flex-col cursor-pointer items-center justify-start px-4 py-3 z-50  "
          >
            <div className="flex flex-col items-end justify-start w-full gap-8 ">
              <InnerBox
                label={"Add To Collection"}
                Icon={BiFolderPlus}
                onHandle={addToCollection}
              ></InnerBox>
              <InnerBox
                label={"Add To Favourites"}
                Icon={BiHeart}
                onHandle={addToFavourites}
              ></InnerBox>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TemplateDesignpin;

const InnerBox = ({ label, Icon, onHandle }) => {
  const [isHover, setIsHover] = useState(false);
  return (
    <div
      onClick={onHandle}
      className=" w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center hover:shadow-md relative "
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <Icon className="text-txtPrimary text-base"></Icon>
      <AnimatePresence>
        {isHover && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.6, x: 50 }}
            className="px-3 py-2 rounded-md bg-gray-200 absolute -left-44 after:w-2 after:h-2 after:bg-gray-200 after:absolute after:-right-1 after:top-[14px] after:rotate-45 "
          >
            <p className=" text-sm text-txtPrimary whitespace-nowrap">
              {label}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
