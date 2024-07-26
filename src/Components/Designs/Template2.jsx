import React, { useState, useEffect, useRef } from "react";
import useUser from "../../Hooks/UseUser";
import { useQuery } from "react-query";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { db } from "../../Config/firebase.config";
import { getTemplateDetailEditByUser } from "../../Api";
import { toast } from "react-toastify";
import MainSpinner from "../MainSpinner";
import {
  FaHouse,
  FaTrash,
  FaPenToSquare,
  FaPencil,
  FaPlus,
} from "react-icons/fa6";
import { BiSolidBookmarks } from "react-icons/bi";
import {
  BsFiletypePdf,
  BsFiletypePng,
  BsFiletypeJpg,
  BsFiletypeSvg,
} from "react-icons/bs";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import { AnimatePresence, motion } from "framer-motion";
import { FadeinOutWithOpecity, opacityINOut } from "../../Animations";
const Template2 = () => {
  const [formData, setFormData] = useState({
    name: "OLIVIA WILSON",
    location: "London,UK",
    email: "OLIVIA WILSON@gmail.com",
    portfolio: "Portfolio",
    role: "CHEMICAL ENGINEER",
    about:
      "A practical Chemical Engineer with Significant Experience in Process Designs, I have worked with some organizations, ensuring a grounded approach to my profession.",
    experiences: [
      {
        title: "Policy Manager",
        company: "Lexramax Inc",
        duration: "Oct 2020 - present",
        tasks: [
          "Formulate and review policies as regards Industry Improvement",
          "Create a functional and technical application of set policies",
        ],
      },
      {
        title: "Quality Control Engineer",
        company: "KrystaPointe Water",
        duration: "Jan 2019 - Sept 2020",
        tasks: [
          "Collect and Analyse water samples from different stages of Production",
          "Make Recommendations on Improvement based on my analysis",
          "Supervise Implementations of Recommendations",
        ],
      },
    ],
    skills: [
      "Effective Time Management",
      "Creative Problem-Solving",
      "Active Listening",
      "Efficiency Under Pressure",
      "Critical Thinking",
      "Talented Customer Services",
    ],
    education: [
      {
        degree: "MAsc Process Engineering",
        institution: "Dandilton",
        duration: "Oct 2017 - Sept 2018",
        details: [
          "Studied Process planning, coordination, and efficiency",
          "Worked with various industries on launching efficient Process Systems",
        ],
      },
      {
        degree: "BEng Chemical Engineering",
        institution: "Royal Clickton",
        duration: "Jan 2012 - Sept 2016",
        details: [
          "GPA: 3.19",
          "Minor in Process Management Thesis in Modelling and Analysis of Process Efficiency in a Cement Plant",
        ],
      },
    ],
    interests: [
      "Simulation Design",
      "Chess",
      "Volunteer Work",
      "International Affairs",
      "Particulate Matters",
      "Football",
    ],
    awards: [
      "Most Innovative Employee of the Year, LexraMax (2020)",
      "Overall Best Employee of the Year, CrystaPointe (2019)",
      "Project Leader, Dandilton (2018)",
    ],
  });
  const { data: user } = useUser();
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const location = useLocation();
  const resumeRef = useRef(null);
  const templateName = pathname?.split("/")?.slice(-1);
  const searchParams = new URLSearchParams(location.search);
  const loadedTemplateId = searchParams.get("templateId");

  const {
    data: resumeData,
    isLoading: resume_isLoading,
    isError: resume_isError,
    refetch: refetch_resumeData,
  } = useQuery(["templateEditedByUser", `${templateName}-${user?.uid}`], () =>
    getTemplateDetailEditByUser(user?.uid, `${templateName}-${user?.uid}`)
  );
  useEffect(() => {
    if (resumeData?.formData) {
      setFormData({ ...resumeData?.formData });
    }
  }, [resumeData]);
  const handleChange = (section, index, field) => (e) => {
    const newValue = e.target.value;
    setFormData((prevFormData) => {
      const newSection = [...prevFormData[section]];
      if (field) {
        newSection[index][field] = newValue;
      } else {
        newSection[index] = newValue;
      }
      return { ...prevFormData, [section]: newSection };
    });
  };

  const handleAdd = (section) => () => {
    setFormData((prevFormData) => {
      const newSection = [
        ...prevFormData[section],
        section === "experiences" || section === "education" ? {} : "",
      ];
      return { ...prevFormData, [section]: newSection };
    });
  };

  const handleRemove = (section, index) => () => {
    setFormData((prevFormData) => {
      const newSection = [...prevFormData[section]];
      newSection.splice(index, 1);
      return { ...prevFormData, [section]: newSection };
    });
  };

  const toggleEditable = () => {
    setIsEdit(!isEdit);
  };
  const saveFormData = async () => {
    const timeStamp = serverTimestamp();
    const resume_id = `${templateName}-${user?.uid}`;
    const _doc = {
      _id: loadedTemplateId,
      resume_id,
      formData,
      timeStamp,
    };
    console.log(_doc);
    setDoc(doc(db, "users", user?.uid, "resumes", resume_id), _doc)
      .then(() => {
        toast.success(`Data Saved`);
        refetch_resumeData();
      })
      .catch((err) => {
        toast.error(`Error : ${err.message}`);
      });
  };
  const generatePDF = async () => {
    // access the dom element using useRef HOOK

    const element = resumeRef.current;
    if (!element) {
      toast.info("Unable to capture the content at a moment");
      return;
    }
    console.log(element);
    htmlToImage
      .toPng(element)
      .then((dataURL) => {
        const a4Width = 210;
        const a4Hight = 297;
        var pdf = new jsPDF({
          orientation: "p",
          unit: "mm",
          format: [a4Hight, a4Width],
        });

        const aspectRatio = a4Width / a4Hight;
        const imgWidth = a4Width;
        const imgHeight = a4Width / aspectRatio;

        const verticalMargin = (a4Hight - imgHeight) / 2;

        pdf.addImage(dataURL, "PNG", 0, verticalMargin, imgWidth, imgHeight);
        pdf.save("resume.pdf");
      })
      .catch((e) => toast.error(`Error:${e.message}`));
  };

  const generateImage = async () => {
    const element = resumeRef.current;
    if (!element) {
      toast.info("Unable to capture the content at a moment");
      return;
    }

    htmlToImage
      .toJpeg(element)
      .then((dataURL) => {
        const a = document.createElement("a");
        a.href = dataURL;
        a.download = "resume.jpg";
        a.click();
      })
      .catch((e) => toast.error(`Error:${e.message}`));
  };

  const generatePng = async () => {
    const element = resumeRef.current;
    if (!element) {
      toast.info("Unable to capture the content at a moment");
      return;
    }

    htmlToImage
      .toPng(element)
      .then((dataURL) => {
        const a = document.createElement("a");
        a.href = dataURL;
        a.download = "resume.png";
        a.click();
      })
      .catch((e) => toast.error(`Error:${e.message}`));
  };

  const generateSvg = async () => {
    const element = resumeRef.current;
    if (!element) {
      toast.info("Unable to capture the content at a moment");
      return;
    }

    htmlToImage
      .toSvg(element)
      .then((dataURL) => {
        const a = document.createElement("a");
        a.href = dataURL;
        a.download = "resume.svg";
        a.click();
      })
      .catch((e) => toast.error(`Error:${e.message}`));
  };
  if (resume_isLoading) return <MainSpinner />;

  if (resume_isError) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center">
        <p className="text-lg text-txtPrimary font-semibold">
          Error While fetching the data
        </p>
      </div>
    );
  }
  return (
    <div className="w-full flex flex-col items-center justify-start gap-4">
      <div className="w-full flex items-center gap-2 px-4">
        <Link
          to={"/"}
          className="flex items-center justify-center gap-2 text-txtPrimary"
        >
          <FaHouse />
          Home
        </Link>
        <p
          className="text-txtPrimary cursor-pointer"
          onClick={() => navigate(-1)}
        >
          / Template2 /
        </p>
        <p>Edit</p>
      </div>
      <div className="w-full lg:w-[1200px]  flex flex-wrap px-6 lg:px-32">
        <div className="col-span-12 px-4 py-6">
          <div className="flex items-center justify-end w-full gap-12 mb-4">
            <div
              className="flex items-center justify-center gap-1 px-3 py-1 rounded-md bg-gray-200 cursor-pointer"
              onClick={toggleEditable}
            >
              {isEdit ? (
                <FaPenToSquare className="text-sm text-txtPrimary" />
              ) : (
                <FaPencil className="text-sm text-txtPrimary" />
              )}
              <p className="text-sm text-txtPrimary">Edit</p>
            </div>

            <div
              className="flex items-center justify-center gap-1 px-3 py-1 rounded-md bg-gray-200 cursor-pointer"
              onClick={saveFormData}
            >
              <BiSolidBookmarks className="text-sm text-txtPrimary" />
              <p className="text-sm text-txtPrimary">Save</p>
            </div>

            <div className=" flex items-center justify-center gap-2">
              <p className="text-sm text-txtPrimary">Download : </p>
              <BsFiletypePdf
                className="text-2xl text-txtPrimary cursor-pointer"
                onClick={generatePDF}
              />
              <BsFiletypePng
                onClick={generatePng}
                className="text-2xl text-txtPrimary cursor-pointer"
              />
              <BsFiletypeJpg
                className="text-2xl text-txtPrimary cursor-pointer"
                onClick={generateImage}
              />
              <BsFiletypeSvg
                onClick={generateSvg}
                className="text-2xl text-txtPrimary cursor-pointer"
              />
            </div>
          </div>
          <div className=" border border-gray-300 p-[1vw]">
            {/* Heading */}
            <div className="mb-2">
              {formData.name && isEdit ? (
                <input
                  className="text-[#0277bd] w-full text-center font-extrabold text-[2em] uppercase font-noto bg-transparent outline-none border-none"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  value={formData.name}
                  placeholder="your name"
                ></input>
              ) : (
                <input
                  className="text-[#0277bd] w-full text-center font-extrabold text-[2em] uppercase font-noto bg-transparent outline-none border-none"
                  value={formData.name}
                  onChange={() => toast.info("Click on Edit Button")}
                  placeholder="your name"
                ></input>
              )}
              <div className="flex justify-center items-center gap-2 w-full">
                <div className="w-fit">
                  <DynamicWidthInput
                    value={formData.location}
                    onChange={
                      isEdit
                        ? (e) =>
                            setFormData({
                              ...formData,
                              location: e.target.value,
                            })
                        : () => toast.info("Click on Edit Button")
                    }
                    type={"text"}
                    placeholder="location"
                  />
                </div>
                |
                <div className="max-w-fit">
                  <DynamicWidthInput
                    value={formData.portfolio}
                    onChange={
                      isEdit
                        ? (e) =>
                            setFormData({
                              ...formData,
                              portfolio: e.target.value,
                            })
                        : () => toast.info("Click on Edit Button")
                    }
                    type={"text"}
                    placeholder="Portfolio Link"
                  />
                  
                </div>
                |
                <div className="w-fit">
                  <DynamicWidthInput
                    value={formData.email}
                    onChange={isEdit?(e) =>
                      setFormData({ ...formData, email: e.target.value }):() => toast.info("Click on Edit Button")
                    }
                    type={"email"}
                    placeholder="your email"
                  />
                </div>
              </div>
            </div>

            {/* Role and About */}
            <div className="w-full mt-2 px-4 mb-8">
              <input
                type={"text"}
                placeholder={"Your Role"}
                value={formData.role}
                onChange={isEdit ?(e) =>
                  setFormData({ ...formData, role: e.target.value }):() => toast.info("Click on Edit Button")
                }
                className="uppercase text-xl font-bold text-[#0277bd] bg-transparent outline-none border-none "
              ></input>
              <textarea
                className="w-full mt-2 bg-transparent outline-none border-none  text-justify scrollbar-none resize-none text-black"
                value={formData.about}
                onChange={isEdit?(e) =>
                  setFormData({ ...formData, about: e.target.value }):() => toast.info("Click on Edit Button")
                }
              ></textarea>
            </div>

            {/* Work Experience */}
            <div className="w-full">
              <div className="w-full mt-6 flex gap-4">
                <p className="uppercase text-xl font-bold text-[#0277bd]">
                  Work Experience
                </p>
                <AnimatePresence>
                <motion.button 
                {...FadeinOutWithOpecity}>
                  {isEdit && (
                  <button onClick={handleAdd("experiences")} className="ml-2">
                    <FaPlus className="text-sm text-black"  />
                  </button>
                )}
                </motion.button>
                </AnimatePresence>
              </div>
              <div className="h-[1px] bg-gray-500 w-full my-2"></div>
              <div className="flex flex-col w-full gap-5 flex-wrap">
                <ul>
                  {formData.experiences.map((experience, index) => (
                    <div key={index}>
                      <div className="flex font-semibold justify-between">
                        <div className="flex gap-2">
                          <DynamicWidthInput
                            type="text"
                            placeholder="Title"
                            value={experience.title || "Title"}
                            onChange={isEdit?handleChange(
                              "experiences",
                              index,
                              "title"
                            ):() => toast.info("Click on Edit Button")}
                          />
                          |
                          <DynamicWidthInput
                            type="text"
                            placeholder="Company"
                            value={experience.company || "Company"}
                            onChange={isEdit?handleChange(
                              "experiences",
                              index,
                              "company"
                            ):() => toast.info("Click on Edit Button")}
                          />
                          |
                          <DynamicWidthInput
                            type="text"
                            placeholder="Duration"
                            value={experience.duration || "Duration"}
                            onChange={isEdit?handleChange(
                              "experiences",
                              index,
                              "duration"
                            ):() => toast.info("Click on Edit Button")}
                          />{" "}
                        </div>
                        {isEdit && (
                          <button onClick={handleRemove("experiences", index)}>
                            <FaTrash />
                          </button>
                        )}
                      </div>
                      <ul
                        style={{ listStyleType: "disc" }}
                        className="px-6 mt-2 bg-transparent"
                      >
                        {experience.tasks &&
                          experience.tasks.map((task, taskIndex) => (
                            <li
                              key={taskIndex}
                              className="flex items-center  justify-between "
                            >
                              <DynamicWidthInput
                                type="text"
                                value={task}
                                onChange={isEdit?(e) => {
                                  const newTasks = experience.tasks.slice();
                                  newTasks[taskIndex] = e.target.value;
                                  handleChange(
                                    "experiences",
                                    index,
                                    "tasks"
                                  )({
                                    target: { value: newTasks },
                                  });
                                }:() => toast.info("Click on Edit Button")}
                              />
                              {isEdit && (
                                <button
                                  onClick={() => {
                                    const newTasks = experience.tasks.filter(
                                      (_, i) => i !== taskIndex
                                    );
                                    handleChange(
                                      "experiences",
                                      index,
                                      "tasks"
                                    )({
                                      target: { value: newTasks },
                                    });
                                  }}
                                >
                                  <FaTrash />
                                </button>
                              )}
                            </li>
                          ))}
                        <li>
                          {isEdit && (
                            <button
                              onClick={() => {
                                const newTasks = experience.tasks
                                  ? [...experience.tasks, "add new task"]
                                  : ["add new task"];
                                handleChange(
                                  "experiences",
                                  index,
                                  "tasks"
                                )({
                                  target: { value: newTasks },
                                });
                              }}
                            >
                              <FaPlus />
                            </button>
                          )}
                        </li>
                      </ul>
                    </div>
                  ))}
                </ul>
              </div>
            </div>

            {/* Skills */}
            <div className="w-full">
              <div className="w-full mt-6 flex gap-2">
                <p className="uppercase text-xl font-bold text-[#0277bd]">
                  Skills
                </p>
                {isEdit && (
                  <button onClick={handleAdd("skills")} className="ml-2">
                    <FaPlus />
                  </button>
                )}
              </div>
              <div className="h-[1px] bg-gray-500 w-full my-2"></div>
              <div className="flex flex-wrap pl-10 justify-start w-full gap-10">
                <ul className="flex gap-2 flex-col">
                  {formData.skills.map((skill, index) => (
                    <li
                      style={{ listStyleType: "disc" }}
                      key={index}
                      className="flex gap-2"
                    >
                      <DynamicWidthInput
                        type="text"
                        value={skill}
                        onChange={isEdit?handleChange("skills", index):() => toast.info("Click on Edit Button")}
                        placeholder={"add skill"}
                      />
                      {isEdit && (
                        <button onClick={handleRemove("skills", index)}>
                          <FaTrash />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Education */}
            <div className="w-full">
              <div className="w-full mt-6 flex gap-2">
                <p className="uppercase text-xl font-bold text-[#0277bd]">
                  Education
                </p>
                {isEdit && (
                  <button onClick={handleAdd("education")} className="ml-2">
                    <FaPlus />
                  </button>
                )}
              </div>
              <div className="h-[1px] bg-gray-500 w-full my-2"></div>
              <div className="flex flex-col w-full gap-5 ">
                {formData.education.map((edu, index) => (
                  <div key={index}>
                    <div className="flex font-semibold justify-between">
                      <div className="flex gap-2">
                        <DynamicWidthInput
                          type="text"
                          className="w-full bg-transparent"
                          placeholder="Degree"
                          value={edu.degree || "Add Degree"}
                          onChange={isEdit?handleChange("education", index, "degree"):() => toast.info("Click on Edit Button")}
                        />
                        |
                        <DynamicWidthInput
                          type="text"
                          className="w-full"
                          placeholder="Institution"
                          value={edu.institution || "Add Institution"}
                          onChange={isEdit?handleChange(
                            "education",
                            index,
                            "institution"
                          ):() => toast.info("Click on Edit Button")}
                        />
                        |
                        <DynamicWidthInput
                          type="text"
                          className={`w-full ${
                            !isEdit && " flex justify-end items-end"
                          }`}
                          placeholder={`Duration`}
                          value={edu.duration || "Add Duration"}
                          onChange={isEdit?handleChange(
                            "education",
                            index,
                            "duration"
                          ):() => toast.info("Click on Edit Button")}
                        />
                      </div>
                      {isEdit && (
                        <button onClick={handleRemove("education", index)}>
                          <FaTrash />
                        </button>
                      )}
                    </div>
                    <ul style={{ listStyleType: "disc" }} className="px-6 mt-2">
                      {edu.details &&
                        edu.details.map((detail, detailIndex) => (
                          <li key={detailIndex}>
                            <DynamicWidthInput
                              type="text"
                              className="w-full bg-transparent"
                              value={detail}
                              onChange={isEdit?(e) => {
                                const newDetails = edu.details.slice();
                                newDetails[detailIndex] = e.target.value;
                                handleChange(
                                  "education",
                                  index,
                                  "details"
                                )({
                                  target: { value: newDetails },
                                });
                              }:() => toast.info("Click on Edit Button")}
                            />
                          </li>
                        ))}
                      <li>
                        {isEdit && (
                          <button
                            onClick={() => {
                              const newDetails = edu.details
                                ? [...edu.details, "Add Detail"]
                                : ["Add Detail"];
                              handleChange(
                                "education",
                                index,
                                "details"
                              )({
                                target: { value: newDetails },
                              });
                            }}
                          >
                            <FaPlus />
                          </button>
                        )}
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div className="w-full">
              <div className="w-full mt-6 flex gap-2">
                <p className="uppercase text-xl font-bold text-[#0277bd]">
                  Interests
                </p>
                {isEdit && (
                  <button onClick={handleAdd("interests")} className="ml-2">
                    <FaPlus />
                  </button>
                )}
              </div>
              <div className="h-[1px] bg-gray-500 w-full my-2"></div>
              <div className="flex flex-wrap px-10 justify-start w-full gap-10">
                <ul
                  style={{ listStyleType: "disc" }}
                  className=" flex flex-col gap-1"
                >
                  {formData.interests.map((interest, index) => (
                    <li key={index} className="flex gap-2">
                      <DynamicWidthInput
                        type="text"
                        className="w-full bg-transparent"
                        value={interest}
                        onChange={isEdit?handleChange("interests", index):() => toast.info("Click on Edit Button")}
                      />
                      {isEdit && (
                        <button onClick={handleRemove("interests", index)}>
                          <FaTrash />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Awards */}
            <div className="w-full">
              <div className="w-full mt-6 flex gap-2">
                <p className="uppercase text-xl font-bold text-[#0277bd]">
                  Awards
                </p>
                {isEdit && (
                  <button onClick={handleAdd("awards")} className="ml-2">
                    <FaPlus />
                  </button>
                )}
              </div>
              <div className="h-[1px] bg-gray-500 w-full my-2"></div>
              <div className="flex flex-wrap pl-10 justify-start w-full">
                <ul
                  style={{ listStyleType: "disc" }}
                  className="flex flex-col gap-2"
                >
                  {formData.awards.map((award, index) => (
                    <li key={index} className="flex gap-2">
                      <DynamicWidthInput
                        type="text"
                        className="w-full bg-transparent"
                        value={award}
                        onChange={isEdit?handleChange("awards", index):() => toast.info("Click on Edit Button")}
                      />
                      {isEdit && (
                        <button onClick={handleRemove("awards", index)}>
                          <FaTrash />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template2;
const DynamicWidthInput = ({ value, onChange, placeholder, type }) => {
  const [inputWidth, setInputWidth] = useState("auto");
  const spanRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (spanRef.current) {
      setInputWidth(`${spanRef.current.offsetWidth}px`);
    }
  }, [value]);

  return (
    <div className="flex items-center">
      <input
        ref={inputRef}
        className={`lowercase  bg-transparent outline-none border-none whitespace-nowrap`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ width: inputWidth }}
        type={type}
      />
      <span
        ref={spanRef}
        className="invisible absolute whitespace-nowrap"
        style={{ visibility: "hidden" }}
      >
        {value}
      </span>
    </div>
  );
};
