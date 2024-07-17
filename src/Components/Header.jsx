import React, { useState } from "react";
import UseUser from "../Hooks/UseUser";
import { Logo } from "../assets";
import { Link } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { PuffLoader } from "react-spinners";
import { motion } from "framer-motion";
import { HiLogout } from "react-icons/hi";
import { FadeinOutWithOpecity, slideupMenu } from "../Animations";
import { auth } from "../Config/firebase.config";
import { useQueryClient } from "react-query";
import { AdminIds } from "../Utils/Helper";
const Header = () => {
  const { data, isLoading } = UseUser();
  const [isMenu, setIsMenu] = useState(false);

  const queryClient = useQueryClient();

  const Signout = async () => {
    await auth.signOut().then(() => {
      queryClient.setQueryData("user", null);
    });
  };
  return (
    <header className=" w-full flex items-center justify-between px-4 py-3 lg:px-8 border-b  border-gray-300 bg-bgPrimary z-50 sticky  gap-10 top-0">
      {/* logo */}
      <Link>
        <img src={Logo} alt="" className=" w-8 h-auto object-contain " />
      </Link>
      {/* input */}
      <div className="flex-1 border border-gray-300 px-4 py-1 rounded-md flex items-center justify-between bg-gray-200">
        <input
          type="text"
          placeholder="Search here..."
          className="flex-1 h-10 bg-transparent text-base font-semibold outline-none border-none "
        />
      </div>
      {/* profile */}
      <AnimatePresence>
        {isLoading ? (
          <PuffLoader color="#498fcd" size={40}></PuffLoader>
        ) : (
          <>
            {data ? (
              <motion.div
                className="relative"
                onClick={() => setIsMenu(!isMenu)}
              >
                {data?.photoURL ? (
                  <div className=" w-12 h-12 rounded-md relative flex items-center justify-center">
                    <img
                      src={data?.photoURL}
                      referrerPolicy="no-referrer"
                      alt=""
                      className=" object-cover w-full h-full rounded-md  cursor-pointer"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-md relative flex items-center justify-center bg-blue-700 shadow-md">
                    <p className="text-lg text-white cursor-pointer ">
                      {data?.email[0]}
                    </p>
                  </div>
                )}

                {/* DropDwon menu */}
                <AnimatePresence>
                  {isMenu && (
                    <motion.div
                      {...slideupMenu}
                      className=" absolute px-4 py-3 rounded-md bg-white right-0 top-14 flex flex-col justify-start items-center w-64  gap-3 pt-12"
                      onMouseLeave={() => setIsMenu(false)}
                    >
                      {data?.photoURL ? (
                        <div className=" w-20 h-20 rounded-full relative flex  flex-col items-center justify-center">
                          <img
                            src={data?.photoURL}
                            referrerPolicy="no-referrer"
                            alt=""
                            className=" object-cover w-full h-full rounded-full  cursor-pointer"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-md relative flex items-center justify-center bg-blue-700 shadow-md">
                          <p className="text-3xl text-white cursor-pointer ">
                            {data?.email[0]}
                          </p>
                        </div>
                      )}
                      {data?.displayName && (
                        <p className="text-lg text-txtDark">
                          {data?.displayName}
                        </p>
                      )}

                      {/* menu options */}
                      <div className=" w-full flex flex-col pt-6 items-start gap-8 ">
                        <Link
                          className="text-textLight hover:text-txtDark text-base whitespace-nowrap"
                          to={"/profile"}
                        >
                          My Account
                        </Link>
                        {AdminIds.includes(data?.uid) && (
                          <Link
                            className="text-textLight hover:text-txtDark text-base whitespace-nowrap"
                            to={"/template/create"}
                          >
                            Add New Template
                          </Link>
                        )}

                        <div
                          className=" w-full px-2 py-2 border-t border-gray-300 flex items-center justify-between group cursor-pointer"
                          onClick={Signout}
                        >
                          <p>Sign Out</p>
                          <HiLogout className="group-hover:text-txtDark text-txtLight"></HiLogout>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <Link to={"/auth"}>
                <motion.button
                  {...FadeinOutWithOpecity}
                  className="px-4 py-2 rounded-md border border-gray-300 bg-gray-200 hover:shadow-md active:scale-95 duration-150"
                  type="button"
                >
                  Login
                </motion.button>
              </Link>
            )}
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
