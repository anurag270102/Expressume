import React, { useEffect, useState } from "react";
import { FaTrash, FaUpload } from "react-icons/fa6";
import { PuffLoader } from "react-spinners";
import { toast } from "react-toastify";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { deleteDoc, doc } from "firebase/firestore";
import { db, storage } from "../Config/firebase.config";
import { AdminIds, initialTags } from "../Utils/Helper";
import { serverTimestamp, setDoc } from "firebase/firestore";

import UseUser from "../Hooks/UseUser";
import UseTemplate from '../Hooks/UseTemplate';
import { useNavigate } from "react-router-dom";


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

  const [seletedTag, setseletedTags] = useState([]);

  const {
    data: templates,
    isLoading: templatesLoading,
    refetch: templaterefetch,
  } = UseTemplate();

  const {data:user,isLoading}=UseUser();

  const navigate=useNavigate();

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

  const DeleteAnImageObj = async () => {
    setInterval(() => {
      setImageAssate((prevAsset) => ({
        ...prevAsset,
        progress: 0,
        url: null,
        isImageLoading: false,
      }));
    }, 2000);
    setImageAssate((prevAsset) => ({ ...prevAsset, isImageLoading: true }));
    const deleteRef = ref(storage, imageAssate.url);
    deleteObject(deleteRef).then(() => {
      toast.success("image Removed");
    });
  };

  const handleTags = (tag) => {
    //check seleted or not
    if (seletedTag.includes(tag)) {
      setseletedTags(seletedTag.filter((selected) => selected !== tag));
    } else {
      setseletedTags([...seletedTag, tag]);
    }
  };

  const pushToCloud = async () => {
    const timestamp = serverTimestamp();
    const id = `${Date.now()}`;
    const _doc = {
      _id: id,
      title: formData.title,
      imageURL: imageAssate.url,
      tags: seletedTag,
      name:
        templates && templates.length > 0
          ? `Templates${templates.length + 1}`
          : "templates1",
      timestamp: timestamp,
    };

    await setDoc(doc(db, "templates", id), _doc)
      .then(() => {
        SetFormData((prevdata) => ({ ...prevdata, title: "", imageURL: "" }));
        setImageAssate((prevAsset) => ({ ...prevAsset, url: null }));
        setseletedTags([]);
        templaterefetch();
        toast.success("Data push to cloud");
      })
      .catch((error) => {
        console.log(error);
        toast.error(`Error ${error.message}`);
      });
  };

  const removeTemplate = async (template) => {
    const deleteRef=ref(storage,template?.imageURL)
    await deleteObject(deleteRef).then(async()=>{
      await deleteDoc(doc(db,'templates',template?._id)).then(()=>{
        toast.success('Template deleted from the cloud')
        templaterefetch()
      }).catch((error)=>{
        toast.error(`Error ${error.message}`);
      })
    });
  };

  useEffect(()=>{
    if(!isLoading && !AdminIds.includes(user?.uid)){
      navigate('/',{
        replace:true
      });
    }
  },[isLoading,user])


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
            {templates && templates.length > 0
              ? `Templates${templates.length + 1}`
              : "templates1"}
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
                    <img
                      src={imageAssate?.url}
                      alt=""
                      loading="lazy"
                      className=" w-full h-full object-cover"
                    />

                    <div
                      className=" absolute top-4  right-4 w-8 h-8 rounded-md flex items-center justify-center bg-red-500 cursor-pointer"
                      onClick={DeleteAnImageObj}
                    >
                      <FaTrash className="text-sm text-white"></FaTrash>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
        {/* tags */}
        <div className="  w-full flex items-center flex-wrap gap-2 ">
          {initialTags.map((tag, i) => {
            return (
              <div
                key={i}
                className={`border border-gray-300 px-2 py-1   rounded-md cursor-pointer  ${
                  seletedTag.includes(tag) ? "bg-blue-500 text-white " : ""
                }`}
                onClick={() => handleTags(tag)}
              >
                <p>{tag}</p>
              </div>
            );
          })}
        </div>

        {/* action Button */}
        <button
          type="button"
          className=" w-full bg-blue-700 text-white py-3 rounded-md hover:bg-blue-600"
          onClick={pushToCloud}
        >
          Save
        </button>
      </div>

      {/* right */}
      <div className="col-span-12 lg:col-span-8 2xl:col-span-9 px-2 w-full flex-1 py-4">
        {templatesLoading ? (
          <>
            <div className="flex flex-col items-center justify-center ">
              <PuffLoader className="#498fcd" size={40}></PuffLoader>
            </div>
          </>
        ) : (
          <>
            {templates && templates.length > 0 ? (
              <>
                <div className=" w-full h-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
                  {templates.map((template) => (
                    <div
                      key={template._id}
                      className=" w-full h-[500px] rounded-md overflow-hidden relative"
                    >
                      <img
                        src={template?.imageURL}
                        className=" w-full h-full object-cover"
                        alt=""
                      />
                      <div
                        className=" absolute top-4  right-4 w-8 h-8 rounded-md flex items-center justify-center bg-red-500 cursor-pointer"
                        onClick={() => removeTemplate(template)}
                      >
                        <FaTrash className="text-sm text-white"></FaTrash>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center justify-center gap-4">
                  <PuffLoader className="#498fcd" size={40}></PuffLoader>
                  <p className="text-xl tracking-wider capitalize text-txtPrimary">
                    {" "}
                    No Data
                  </p>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CreateTemplate;
