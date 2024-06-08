import React, { useEffect, useRef, useState } from "react";
import MainSpinner from "../MainSpinner";
import { useQuery } from "react-query";
import useUser from "../../hooks/useUser";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../config/firebase.config";
import { getTemplateDetailEditByUser } from "../../api";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";

import { TemplateTwo } from "../../assets";
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
import { AnimatePresence, motion } from "framer-motion";
import { fadeInOutOpacity, opacityINOut } from "../../animations";

const Template2 = () => {
  const { pathname } = useLocation();
  const location = useLocation();
  const navigate = useNavigate();
  const templateName = pathname?.split("/")?.slice(-1);
  const searchParams = new URLSearchParams(location.search);
  const loadedTemplateId = searchParams.get("templateId");
  // console.log(pathname, templateName, loadedTemplateId);

  const [isEdit, setIsEdit] = useState(false);
  const { data: user } = useUser();

  const resumeRef = useRef(null);

  const [imageAsset, setImageAsset] = useState({
    isImageLoading: false,
    imageURL: null,
  });

  const {
    data: resumeData,
    isLoading: resume_isLoading,
    isError: resume_isError,
    refetch: refetch_resumeData,
  } = useQuery(["templateEditedByUser", `${templateName}-${user?.uid}`], () =>
    getTemplateDetailEditByUser(user?.uid, `${templateName}-${user?.uid}`)
  );

  const [formData, setFormData] = useState({
    fullname: "Karen Richards",
    professionalTitle: "Professional Title",
    personalDescription: `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Alia minus est culpa id corrupti nobis ullam harum, porro veniam facilis, obcaecati nulla magnam beatae quae at eos! Qui, similique laboriosam?`,
    refererName: "Sara Taylore",
    refererRole: "Director | Company Name",
    mobile: "+91 0000-0000",
    email: "urname@gmail.com",
    website: "urwebsite.com",
    address: "your street address, ss, street, city/zip code - 1234",
  });

  const [experiences, setExperiences] = useState([
    {
      year: "2012 - 2014",
      title: "Job Position Here",
      companyAndLocation: "Company Name / Location here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis voluptatibus minima tenetur nostrum quo aliquam dolorum incidunt.",
    },
    {
      year: "2012 - 2014",
      title: "Job Position Here",
      companyAndLocation: "Company Name / Location here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis voluptatibus minima tenetur nostrum quo aliquam dolorum incidunt.",
    },
    {
      year: "2012 - 2014",
      title: "Job Position Here",
      companyAndLocation: "Company Name / Location here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis voluptatibus minima tenetur nostrum quo aliquam dolorum incidunt.",
    },
  ]);

  const [skills, setSkills] = useState([
    {
      title: "skill1",
      percentage: "75",
    },
    {
      title: "skill2",
      percentage: "75",
    },
    {
      title: "skill3",
      percentage: "75",
    },
    {
      title: "skill4",
      percentage: "75",
    },
    {
      title: "skill5",
      percentage: "75",
    },
  ]);

  const [education, setEducation] = useState([
    {
      major: "ENTER YOUR MAJOR",
      university: "Name of your university / college 2005-2009",
    },
  ]);

  useEffect(() => {
    if (resumeData?.formData) {
      setFormData({ ...resumeData?.formData });
    }
    if (resumeData?.experiences) {
      setExperiences(resumeData?.experiences);
    }
    if (resumeData?.skills) {
      setSkills(resumeData?.skills);
    }
    if (resumeData?.education) {
      setEducation(resumeData?.education);
    }
    if (resumeData?.userProfilePic) {
      setImageAsset((prevAsset) => ({
        ...prevAsset,
        imageURL: resumeData?.userProfilePic,
      }));
    }
  }, [resumeData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const toggleEditable = () => {
    setIsEdit(!isEdit);
    var inputs = document.querySelectorAll("input");
    var textarea = document.querySelectorAll("textarea");

    for (var i = 0; i < inputs.length; i++) {
      inputs[i].readOnly = !inputs[i].readOnly;
    }

    for (var i = 0; i < textarea.length; i++) {
      textarea[i].readOnly = !textarea[i].readOnly;
    }
  };

  // image upload to the cloud
  const handleFileSelect = async (event) => {
    setImageAsset((prevAsset) => ({ ...prevAsset, isImageLoading: true }));
    // console.log(event.target.files[0]);
    const file = event.target.files[0];
    if (file && isAllowed(file)) {
      const reader = new FileReader();

      reader.onload = function (event) {
        const dataURL = event.target.result;
        console.log("Data URL:", dataURL);

        // You can now use the dataURL as needed, e.g., to display an image.
        setImageAsset((prevAsset) => ({
          ...prevAsset,
          imageURL: dataURL,
        }));
      };

      // Read the file as a Data URL
      reader.readAsDataURL(file);
    } else {
      toast.error("Invalid File Format");
    }
  };

  const isAllowed = (file) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    return allowedTypes.includes(file.type);
  };

  // delete an image
  const deleteImageObject = () => {
    setImageAsset((prevAsset) => ({
      ...prevAsset,
      imageURL: null,
    }));
  };

  // uploader finshed

  const handleExpChange = (index, e) => {
    const { name, value } = e.target;
    // Create a copy of the workExperiences array
    const updatedExperiences = [...experiences];
    // Update the specific field for the experience at the given index
    updatedExperiences[index][name] = value;
    // Update the state with the modified array
    setExperiences(updatedExperiences);
  };

  const removeExperience = (index) => {
    // Create a copy of the workExperiences array and remove the experience at the given index
    const updatedExperiences = [...experiences];
    updatedExperiences.splice(index, 1);
    // Update the state with the modified array
    setExperiences(updatedExperiences);
  };

  const addExperience = () => {
    // Create a copy of the workExperiences array and add a new experience
    const updatedExperiences = [
      ...experiences,
      {
        year: "2012 - 2014",
        title: "Job Position Here",
        companyAndLocation: "Company Name / Location here",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis voluptatibus minima tenetur nostrum quo aliquam dolorum incidunt.",
      },
    ];
    // Update the state with the modified array
    setExperiences(updatedExperiences);
  };

  const handleSkillsChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSkills = [...skills];
    updatedSkills[index][name] = value;
    setSkills(updatedSkills);
  };

  const removeSkill = (index) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    setSkills(updatedSkills);
  };

  const addSkill = () => {
    const updatedSkills = [
      ...skills,
      {
        title: "skill1",
        percentage: "75",
      },
    ];
    setSkills(updatedSkills);
  };

  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedEdu = [...education];
    updatedEdu[index][name] = value;
    setEducation(updatedEdu);
  };

  const removeEducation = (index) => {
    const updatedEdu = [...education];
    updatedEdu.splice(index, 1);
    setEducation(updatedEdu);
  };

  const addEducation = () => {
    const updatedEdu = [
      ...education,
      {
        major: "ENTER YOUR MAJOR",
        university: "Name of your university / college 2005-2009",
      },
    ];
    setEducation(updatedEdu);
  };

  const saveFormData = async () => {
    const timeStamp = serverTimestamp();
    const resume_id = `${templateName}-${user?.uid}`;
    const imageURL = await getImage();
    const _doc = {
      _id: loadedTemplateId,
      resume_id,
      formData,
      education,
      experiences,
      skills,
      timeStamp,
      userProfilePic: imageAsset.imageURL,
      imageURL,
    };
    
    setDoc(doc(db, "user", user?.uid, "resumes", resume_id), _doc)
      .then(() => {
        toast.success(`Data Saved`);
        refetch_resumeData();
      })
      .catch((err) => {
        toast.error(`Error : ${err.message}`);
      });
  };

  const getImage = async () => {
    const element = resumeRef.current;
    element.onload = async () => {
      // Call the image capture code here
    };
    element.onerror = (error) => {
      console.error("Image loading error:", error);
    };
    if (!element) {
      console.error("Unable to capture content. The DOM element is null.");
      return;
    }
    try {
      const dataUrl = await htmlToImage.toJpeg(element);
      console.log(dataUrl);
      return dataUrl;
    } catch (error) {
      console.error("Oops, something went wrong!", error.message);
      return null; // Return a default value or handle the error appropriately
    }
  };

  const generatePDF = async () => {
    //access the dom element useing useRef hooks
    const element = resumeRef.current;
    if(!element){
      toast.info("unable to capture the content at a moment");
      return;
    }
    htmlToImage.toPng(element).then((dataUrl)=>{
      const a4Width = 210;
      const a4Height = 297;
      var pdf = new jsPDF({
        orientation:"p",
        unit:"mm",
        format:[a4Width,a4Height]
      });
      const aspectRatio = a4Width / a4Height;
      const imgWidth = a4Width;
      const imgHeight = a4Width / aspectRatio;

      const verticalMargin = (a4Height - imgHeight) / 2;

      pdf.addImage(dataUrl , "PNG" , 0, verticalMargin , imgWidth,imgHeight)
      pdf.save("resume.pdf");
    })
    .catch((err)=>{
      toast.info(`Error: ${err.message}`)
    })
  };

  // const generatePDF = async () => {
  //   // Access the DOM element using useRef hooks
  //   const element = resumeRef.current;
  //   if (!element) {
  //     toast.info("Unable to capture the content at the moment");
  //     return;
  //   }
  
  //   try {
  //     const dataUrl = await htmlToImage.toPng(element);
  
  //     // A4 dimensions in mm
  //     const a4Width = 210;
  //     const a4Height = 297;
  
  //     // Create a new jsPDF instance
  //     const pdf = new jsPDF({
  //       orientation: "p",
  //       unit: "mm",
  //       format: [a4Width, a4Height]
  //     });
  
  //     // Create an image from the data URL
  //     const img = new Image();
  //     img.src = dataUrl;
  //     img.onload = () => {
  //       const imgWidth = img.width;
  //       const imgHeight = img.height;
  
  //       // Calculate the aspect ratio of the image
  //       const aspectRatio = imgWidth / imgHeight;
  
  //       // Calculate the dimensions to fit the image within A4 while maintaining aspect ratio
  //       let width, height;
  //       if (imgWidth / a4Width > imgHeight / a4Height) {
  //         width = a4Width;
  //         height = a4Width / aspectRatio;
  //       } else {
  //         height = a4Height;
  //         width = a4Height * aspectRatio;
  //       }
  
  //       // Calculate margins to center the image on the PDF
  //       const horizontalMargin = (a4Width - width) / 2;
  //       const verticalMargin = (a4Height - height) / 2;
  
  //       // Add the image to the PDF
  //       pdf.addImage(dataUrl, "PNG", horizontalMargin, verticalMargin, width, height);
  //       // Save the PDF
  //       pdf.save("resume.pdf");
  //     };
  //   } catch (err) {
  //     toast.info(`Error: ${err.message}`);
  //   }
  // };
  

  const generateImage = async () => {
    const element = resumeRef.current;
    if(!element){
      toast.info("unable to capture the content at a moment");
      return;
    }
 
    htmlToImage
    .toJpeg(element)
    .then((dataUrl)=>{
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "resume.jpg";
      a.click();
    })
    .catch((err)=>{
      toast.info(`Error: ${err.message}`)
    });
  };

  const generatePng = async () => {
    const element = resumeRef.current;
    if(!element){
      toast.info("unable to capture the content at a moment");
      return;
    }    
    htmlToImage
    .toPng(element)
    .then((dataUrl)=>{
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "resume.png";
      a.click();
    })
    .catch((err)=>{
      toast.info(`Error: ${err.message}`)
    });
    
  };

  const generateSvg = async () => {
    const element = resumeRef.current;
    if(!element){
      toast.info("unable to capture the content at a moment");
      return;
    }    
    htmlToImage
    .toSvg(element)
    .then((dataUrl)=>{
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "resume.svg";
      a.click();
    })
    .catch((err)=>{
      toast.info(`Error: ${err.message}`)
    });
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
    <div className="w-full  flex flex-col items-center justify-start gap-4">
      {/* bread crump */}
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
          / Template1 /
        </p>
        <p>Edit</p>
      </div>

      <div className="w-full lg:w-[1200px] grid grid-cols-1 lg:grid-cols-12 px-1 md:px-6 lg:px-32">
        {/* template design */}
        <div className="col-span-12 px-1 md:px-4 md:py-6">
          <div className="flex md:flex-row flex-col items-center justify-end w-full gap-7 md:gap-12 mb-4">
          <div className=" flex gap-6">
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

          <div className="w-full h-auto grid grid-cols-12" ref={resumeRef}>
            
            <div className="col-span-4 bg-black flex flex-col items-center justify-start">
              <div className="w-full h-48 md:h-80 bg-gray-300 flex items-center justify-center">
                {!imageAsset.imageURL ? (
                  <React.Fragment>
                    <label className=" w-full cursor-pointer h-full">
                      <div className="w-full flex flex-col items-center justify-center h-full">
                        <div className="w-full flex flex-col justify-center items-center cursor-pointer">
                          <img
                            src={TemplateTwo}
                            className="w-full h-48 md:h-80 object-cover"
                            alt=""
                          />
                        </div>
                      </div>

                      {isEdit && (
                        <input
                          type="file"
                          className="w-0 h-0"
                          accept=".jpeg,.jpg,.png"
                          onChange={handleFileSelect}
                        />
                      )}
                    </label>
                  </React.Fragment>
                ) : (
                  <div className="relative w-full h-full overflow-hidden rounded-md">
                    <img
                      src={imageAsset.imageURL}
                      alt="uploaded image"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />

                    {isEdit && (
                      <div
                        className="absolute top-4 right-4 w-8 h-8 rounded-md flex items-center justify-center bg-red-500 cursor-pointer"
                        onClick={deleteImageObject}
                      >
                        <FaTrash className="text-sm text-white" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="w-full flex flex-col items-center justify-start md:pl-8 pl-3 mt-2 md:mt-4 gap-6">
                <div className="w-full">
                  <p className="uppercase text-base md:text-lg font-semibold text-gray-100">
                    Education
                  </p>
                  <div className="w-full h-[2px] bg-gray-400 mt-2"></div>
                  <AnimatePresence>
                    {education &&
                      education?.map((edu, i) => (
                        <motion.div
                          key={i}
                          {...opacityINOut(i)}
                          className="w-full pl-1 md:pl-4 mt-1 md:mt-3 relative"
                        >

                          <textarea
                            readOnly={true}
                            className={`text-xs text-gray-200 mt-2  w-full  outline-none border-none ${
                              isEdit ? "bg-[#1c1c1c]" : "bg-transparent"
                            }`}
                            name="university"
                            value={edu.university}
                            onChange={(e) => handleEducationChange(i, e)}
                            rows="2"
                            style={{
                              maxHeight: "auto",
                              minHeight: "40px",
                              resize: "none",
                            }}
                          />
                          <AnimatePresence>
                            {isEdit && (
                              <motion.div
                                {...fadeInOutOpacity}
                                onClick={() => removeEducation(i)}
                                className="cursor-pointer absolute right-2 top-0"
                              >
                                <FaTrash className="text-sm text-gray-100" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                  </AnimatePresence>
                </div>

                <AnimatePresence>
                  {isEdit && (
                    <motion.div
                      {...fadeInOutOpacity}
                      onClick={addEducation}
                      className="cursor-pointer"
                    >
                      <FaPlus className="text-base text-gray-100" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* reference */}
                <div className="w-full">
                  <p className="uppercase text-base md:text-lg font-semibold text-gray-100">
                    Reference
                  </p>
                  <div className="w-full h-[2px] bg-gray-400 mt-2"></div>
                  <div className="w-full  md:pl-4 mt-3">
                    <input
                      value={formData.refererName}
                      onChange={handleChange}
                      name="refererName"
                      type="text"
                      readOnly={true}
                      className={`bg-transparent outline-none border-none text-base tracking-widest capitalize text-gray-100 w-full ${
                        isEdit && "bg-[#1c1c1c]"
                      }`}
                    />

                    <input
                      value={formData.refererRole}
                      onChange={handleChange}
                      name="refererRole"
                      type="text"
                      readOnly={true}
                      className={`bg-transparent outline-none border-none text-xs capitalize text-gray-300 w-full ${
                        isEdit && "bg-[#1c1c1c]"
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className="w-full flex flex-col items-start justify-start mt-6 gap-6">
                <div className="w-full grid grid-cols-12">
                  <div className="col-span-3 w-full h-6 "></div>
                  <div className="col-span-9">
                    <div className="w-full h-6 bg-[rgba(45,45,45,0.6)] px-3 flex items-center">
                      <p className="text-sm font-semibold text-gray-200">
                        Phone
                      </p>
                    </div>
                    <input
                      value={formData.mobile}
                      onChange={handleChange}
                      name="mobile"
                      type="text"
                      readOnly={true}
                      className={`bg-transparent outline-none border-none text-xs px-3 mt-2 text-gray-200 w-full ${
                        isEdit && "bg-[#1c1c1c]"
                      }`}
                    />
                  </div>
                </div>

                {/* email */}
                <div className="w-full grid grid-cols-12">
                  <div className="col-span-3 w-full h-6 "></div>
                  <div className="col-span-9">
                    <div className="w-full h-6 bg-[rgba(45,45,45,0.6)] px-3 flex items-center">
                      <p className="text-sm font-semibold text-gray-200">
                        Email
                      </p>
                    </div>
                    <input
                      value={formData.email}
                      onChange={handleChange}
                      name="email"
                      type="text"
                      readOnly={true}
                      className={`bg-transparent outline-none border-none text-xs px-3 mt-2 text-gray-200 w-full ${
                        isEdit && "bg-[#1c1c1c]"
                      }`}
                    />
                  </div>
                </div>

                {/* website */}
                <div className="w-full grid grid-cols-12">
                  <div className="col-span-3 w-full h-6 "></div>
                  <div className="col-span-9">
                    <div className="w-full h-6 bg-[rgba(45,45,45,0.6)] px-3 flex items-center">
                      <p className="text-sm font-semibold text-gray-200">
                        Website
                      </p>
                    </div>

                    <input
                      value={formData.website}
                      onChange={handleChange}
                      name="website"
                      type="text"
                      readOnly={true}
                      className={`bg-transparent outline-none border-none text-xs px-3 mt-2 text-gray-200 w-full ${
                        isEdit && "bg-[#1c1c1c]"
                      }`}
                    />
                  </div>
                </div>

                {/* address */}
                <div className="w-full grid grid-cols-12">
                  <div className="col-span-3 w-full h-6 "></div>
                  <div className="col-span-9">
                    <div className="w-full h-6 bg-[rgba(45,45,45,0.6)] px-3 flex items-center">
                      <p className="text-sm font-semibold text-gray-200">
                        Address
                      </p>
                    </div>

                    <textarea
                      readOnly={true}
                      className={`text-xs text-gray-200 mt-2 px-3  w-full  outline-none border-none ${
                        isEdit ? "bg-[#1c1c1c]" : "bg-transparent"
                      }`}
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="2"
                      style={{
                        maxHeight: "auto",
                        minHeight: "40px",
                        resize: "none",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>


            <div className="col-span-8 flex flex-col items-center justify-start md:py-6 bg-white">
              <div className="w-full py-6"></div>
              {/* title */}
              <div className="w-full px-2 md:px-8 md:py-6 ">
                <div className="flex items-center justify-start ">
                  <input
                    type="text"
                    readOnly={true}
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    className={`bg-transparent outline-none border-none text-xl md:text-3xl font-sans uppercase tracking-wider text-txtDark font-extrabold ${
                      isEdit && " text-white bg-gray-800 w-full"
                    }`}
                  />
                </div>

                <input
                  value={formData.professionalTitle}
                  onChange={handleChange}
                  name="professionalTitle"
                  type="text"
                  readOnly={true}
                  className={`bg-transparent outline-none border-none md:text-xl tracking-widest uppercase text-txtPrimary w-full ${
                    isEdit && "text-white bg-gray-800"
                  }`}
                />
              </div>

              {/* about me */}
              <div className="w-full px-2 py-3 md:px-8 md:py-6 flex flex-col items-start justify-start gap-1 md:gap-6">
                <div className="w-full">
                  <p className="uppercase md:text-xl tracking-wider ">About Me</p>
                  <div className="w-full h-[2px] md:h-1 bg-txtDark my-1 md:my-3"></div>
                  <textarea
                    readOnly={true}
                    className={`text-xs md:text-base text-txtPrimary tracking-wider w-full  outline-none border-none ${
                      isEdit ? "bg-gray-200" : "bg-transparent"
                    }`}
                    name="personalDescription"
                    value={formData.personalDescription}
                    onChange={handleChange}
                    rows="4"
                    style={{
                      minHeight: "100px",
                      width: "100%",
                      height: "100px",
                      resize: "none",
                    }}
                  />
                </div>

                {/* experience */}
                <div className="w-full">
                  <p className="uppercase  md:text-xl tracking-wider">
                    Work Experience
                  </p>
                  <div className="w-full h-[2px] md:h-1 bg-txtDark my-1 md:my-3"></div>
                  <div className="w-full flex flex-col items-center justify-start  md:gap-4">
                    <AnimatePresence>
                      {experiences &&
                        experiences?.map((exp, i) => (
                          <motion.div
                            {...opacityINOut(i)}
                            className="w-full grid grid-cols-12"
                            key={i}
                          >
                            <div className="col-span-4">
                              <input
                                value={exp.year}
                                onChange={(e) => handleExpChange(i, e)}
                                name="year"
                                type="text"
                                readOnly={true}
                                className={` outline-none border-none text-xs md:text-base tracking-eide uppercase text-txtDark w-full ${
                                  isEdit ? "bg-gray-200" : "bg-transparent"
                                }`}
                              />
                            </div>
                            <div className="col-span-8 relative">
                              <AnimatePresence>
                                {isEdit && (
                                  <motion.div
                                    {...fadeInOutOpacity}
                                    onClick={() => removeExperience(i)}
                                    className="cursor-pointer absolute right-0 top-2"
                                  >
                                    <FaTrash className="text-base text-txtPrimary" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              <input
                                value={exp.title}
                                onChange={(e) => handleExpChange(i, e)}
                                name="title"
                                type="text"
                                readOnly={true}
                                className={` outline-none border-none font-sans text-sm md:text-lg tracking-wide capitalize text-txtDark w-full ${
                                  isEdit ? "bg-gray-200" : "bg-transparent"
                                }`}
                              />

                              <input
                                value={exp.companyAndLocation}
                                onChange={(e) => handleExpChange(i, e)}
                                name="companyAndLocation"
                                type="text"
                                readOnly={true}
                                className={` outline-none border-none text-xs md:text-sm tracking-wide capitalize text-txtPrimary w-full ${
                                  isEdit ? "bg-gray-200" : "bg-transparent"
                                }`}
                              />

                              <textarea
                                readOnly={true}
                                className={`text-xs md:mt-4  text-txtPrimary tracking-wider w-full  outline-none border-none ${
                                  isEdit ? "bg-gray-200" : "bg-transparent"
                                }`}
                                name="description"
                                value={exp.description}
                                onChange={(e) => handleExpChange(i, e)}
                                rows="3"
                                style={{
                                  maxHeight: "auto",
                                  minHeight: "60px",
                                  resize: "none",
                                }}
                              />
                            </div>
                          </motion.div>
                        ))}
                    </AnimatePresence>
                    <AnimatePresence>
                      {isEdit && (
                        <motion.div
                          {...fadeInOutOpacity}
                          onClick={addExperience}
                          className="cursor-pointer"
                        >
                          <FaPlus className=" text-xs md:text-base text-txtPrimary" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* skills */}
                <div className="w-full">
                  <p className="uppercase text-lg md:text-xl tracking-wider">Skills</p>
                  <div className="w-full h-[2px] md:h-1 bg-txtDark my-1 md:my-3"></div>
                  <div className="w-full flex flex-wrap items-center justify-start gap-1 md:gap-4">
                    <AnimatePresence>
                      {skills &&
                        skills?.map((skill, i) => (
                          <motion.div
                            key={i}
                            {...opacityINOut(i)}
                            className="flex-1"
                            style={{ minWidth: 225 }}
                          >
                            <div className="w-full flex items-center justify-between">
                              <div className="flex items-center justify-center">
                                <input
                                  value={skill.title}
                                  onChange={(e) => handleSkillsChange(i, e)}
                                  name="title"
                                  type="text"
                                  readOnly={true}
                                  className={` outline-none border-none text-xs md:text-base tracking-wide capitalize font-semibold text-txtPrimary w-full ${
                                    isEdit ? "bg-gray-200" : "bg-transparent"
                                  }`}
                                />

                                <AnimatePresence>
                                  {isEdit && (
                                    <motion.input
                                      {...fadeInOutOpacity}
                                      value={skill.percentage}
                                      onChange={(e) => handleSkillsChange(i, e)}
                                      name="percentage"
                                      type="text"
                                      className={` outline-none border-none text-xs md:text-base tracking-wide capitalize font-semibold text-txtPrimary w-full ${
                                        isEdit
                                          ? "bg-gray-200"
                                          : "bg-transparent"
                                      }`}
                                    />
                                  )}
                                </AnimatePresence>
                              </div>

                              <AnimatePresence>
                                {isEdit && (
                                  <motion.div
                                    {...fadeInOutOpacity}
                                    onClick={() => removeSkill(i)}
                                    className="cursor-pointer "
                                  >
                                    <FaTrash className=" text-xs md:text-base text-txtPrimary" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                            <div className="relative md:mt-2 w-full h-[2px] md:h-1 rounded-md bg-gray-400">
                              <div
                                className="h-full rounded-md bg-gray-600"
                                style={{
                                  width: `${skill.percentage}%`,
                                  transition: "width 0.3s ease",
                                }}
                              ></div>
                            </div>
                          </motion.div>
                        ))}
                    </AnimatePresence>
                  </div>
                  <AnimatePresence>
                    {isEdit && (
                      <div className="w-full  flex items-center justify-center py-1 md:py-4">
                        <motion.div
                          {...fadeInOutOpacity}
                          onClick={addSkill}
                          className="cursor-pointer"
                        >
                          <FaPlus className=" text-xsmd:text-base text-txtPrimary" />
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template2;