import React, { useState } from "react";
import { FaUpload } from "react-icons/fa6";
import { PuffLoader } from "react-spinners";
import { toast } from "react-toastify";
import { ref, uploadBytesResumable,getDownloadURL } from "firebase/storage";
import { storage,  } from "../Config/firebase.config";
const CreateTemplate = () => {
  const [formData, SetFormData] = useState({
    title: "",
    imageURL: null,
  });

  const [imageAssate, setImageAssate] = useState({
    isImageLoading: false,
    url: null,
    progress: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    SetFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlefileSelect = async (e) => {
    setImageAssate((prevAsset) => ({ ...prevAsset, isImageLoading: true }));
    const file = e.target.files[0];

    if (file && isAllowed(file)) {
      const StorageRef = ref(storage, `Templates/${Date.now()}-${file.name}}`);

      const uploadTask = uploadBytesResumable(StorageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setImageAssate((prevAsset) => ({
            ...prevAsset,
            progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          }));
        },
        (error) => {
          if (error.message.includes("storage/unauthorizes")) {
            toast.error(`Error : Authorization Revoked `);
          } else {
            toast.error(`Error:${error.message}`);
          }
        },
        () =>
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageAssate((prevAsset) => ({
              ...prevAsset,
              url: downloadURL,
            }));
          })
      );

      toast.success("image Uploaded");
      setInterval(() => {
        setImageAssate((prevAsset) => ({
          ...prevAsset,
          isImageLoading: false,
        }));
      }, 2000);

    } else {
      toast.info("Invalid File Format");
    }
  };

  const isAllowed = (file) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    return allowedTypes.includes(file.type);
  };
  return (
    <div className=" w-full px-4 lg:px-10 2xl:px-32 py-4 grid grid-cols-1 lg:grid-cols-12">
      {/* left */}
      <div className="col-span-12 lg:col-span-4 2xl:col-span-3 w-full flex-1 flex items-center justify-start flex-col gap-4 px-2">
        <div className=" w-full ">
          <p className="text-lg text-txtPrimary">Create a new Template</p>
        </div>
        {/* templateId */}
        <div className=" w-full flex items-center justify-end">
          <p className=" text-base text-txtLight uppercase font-semibold  ">
            TempID:{" "}
          </p>
          <p className=" text-sm text-txtDark capitalize font-bold  ">
            Template1
          </p>
        </div>
        {/* templateTitle */}
        <input
          className=" w-full px-4 py-3 rounded-md bg-transparent border border-gray-300 text-lg text-txtPrimary focus:text-txtDark focus:to-txtDark focus:shadow-md outline-none"
          type="text"
          placeholder="Template Title"
          value={formData.title}
          onChange={handleInputChange}
          name="title"
        />
        {/* file Upload */}
        <div className=" w-full bg-gray-100 backdrop-blur-md h-[420px] lg:h-[620px] 2xl:h-[740px]  rounded-md  border-2 border-dotted border-gray-300 cup flex items-center justify-center ">
          {imageAssate.isImageLoading ? (
            <>
              <div className="flex flex-col items-center justify-center gap-4">
                <PuffLoader className="#498fcd" size={40}></PuffLoader>
                <p>{imageAssate?.progress.toFixed(2)}%</p>
              </div>
            </>
          ) : (
            <>
              {!imageAssate?.url ? (
                <>
                  <label className=" w-full cursor-pointer h-full">
                    <div className=" flex flex-col items-center justify-center h-full w-full ">
                      <div className=" flex items-center justify-center cursor-pointer flex-col gap-4">
                        <FaUpload className="text-2xl"></FaUpload>
                        <p className="text-lg  text-txtLight">
                          Click to upload
                        </p>
                      </div>
                    </div>

                    <input
                      type="file"
                      className="w-0 h-0"
                      accept=".jpeg,.jpg,.png"
                      onChange={handlefileSelect}
                    />
                  </label>
                </>
              ) : (
                <>
                  <div className="relative w-full h-full overflow-hidden rounded-md">
                    <img src={imageAssate?.url} alt="" loading="lazy" className=" w-full h-full object-cover" />
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* right */}
      <div className="col-span-12 lg:col-span-8 2xl:col-span-9"></div>
    </div>
  );
};

export default CreateTemplate;
