import React, { useEffect, useState } from 'react';
import { PuffLoader } from 'react-spinners';
import { FaTrash, FaUpload } from "react-icons/fa";
import { toast } from 'react-toastify';
import {deleteObject, getDownloadURL, ref, uploadBytesResumable} from 'firebase/storage';
import { db, storage } from '../config/firebase.config';
import { adminIds, initialTags } from '../utils/helper';
import { deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import useTemplates from '../hooks/useTemplates';
import useUser from '../hooks/useUser';
import {ClimbingBoxLoader} from "react-spinners"
import { useNavigate } from 'react-router-dom';
const CreateTemplate = () => {
    const [formData , setFormData] = useState({
        title:"",
        imgUrl:null
    });

    const [imgAsset , setImgAsset] = useState({
        isImgLoading: false,
        url:null,
        progress:0,
    });
    const [selectedTags , setSelectedTags] = useState([]);

    const {
        data:templates , 
        isLoading:templatesIsLoading , 
        isError :templatesIsError , 
        refetch:templatesRefetch ,
        } = useTemplates();

    const {data:user,isLoading} = useUser();
    const navigate = useNavigate()

    // handling the input field change
    const handleInputChange = (e)=>{
        const {name, value} = e.target
        setFormData((prevRec)=> ({...prevRec , [name]:value}))
    };

    const handleImgSelect = async (e)=>{
        const file = e.target.files[0];
        setImgAsset((prevImg) => ({...prevImg , isImgLoading:true }));
        if(file && isAllowed(file)){
            const storageRef = ref(storage , `Template/${Date.now()} - ${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef , file);
            uploadTask.on('state_changed' ,
            (snapshot)=>{
                setImgAsset((prevImg) => ({...prevImg , progress: 
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
                    
                }))
            } , 
            (error) => {
                if(error.message.includes("storage/unauthorized")){
                    toast.error(`Error:Authorization Revoked`);
                }else{
                    toast.error(`Error: ${error.message}`);
                }
            },
                ()=>{
                    getDownloadURL(uploadTask.snapshot.ref).then(downloadURL =>{
                          setImgAsset((prevImg)=>({
                            ...prevImg,
                            url:downloadURL
                          }));            
                    });
                    toast.success("Image uploaded");
                     setInterval(
                        setImgAsset((prevImg)=>({
                            ...prevImg,
                            isImgLoading: false
                        })),2000)
                }
            )
        }else{
            toast.info("Invalid file format")
        }
    };

    //action to dlt
    const dltAnImg = async()=>{
        setInterval(
            setImgAsset((prevImg)=>({
                ...prevImg,
                progress : 0,
                url: null, 
            })),2000)
        
        const dltRef = ref(storage, imgAsset.url);
        deleteObject(dltRef).then(() => {
            toast.success("Image removed");

        } )
    }

    const isAllowed = (file) =>{
        const allowedTypes  = ["image/jpeg" , "image/jpg" , "image/png"];
        return allowedTypes.includes(file.type);
        
    }


    const handleSelectedTags = (tag)=>{
        if(selectedTags.includes(tag)){
            setSelectedTags(selectedTags.filter((selected) => selected !== tag));
        }
        else{
            setSelectedTags([...selectedTags , tag]);
        }

    };

    const pushToCloud = async()=>{
       const timeStamp = serverTimestamp();
       const id = `${Date.now()}`;
       const _doc = {
        id:id,
        title:formData.title,
        imageURL : imgAsset.url,
        tags: selectedTags,
        name:templates && templates.length > 0 
        ? `Template${templates.length+1}` 
        : "Template1",
        timeStamp:timeStamp,
       };
       
       await setDoc(doc(db,"templates",id), _doc)
       .then(()=>{
            setFormData((prevData)=> ({...prevData, title:"", imageURL:""}));
            setImgAsset((prevAsset)=> ({...prevAsset, url:null}));
            setSelectedTags([]);
            templatesRefetch();
            toast.success("Data pushed to the cloud");
       }).catch(error => {
            toast.error(`Error : ${error.message}`)
       });
    };

    //function to remove the data from the cloud
    const removeTemplate = async(template)=>{
        const deleteRef = ref(storage , template?.imageURL )
        await deleteObject(deleteRef).then(async ()=>{
            await deleteDoc(doc(db , "templates" , template?.id)).then(()=>{
                toast.success("Templete deleted from the cloud");
                templatesRefetch();
            })
            .catch(err => {
                toast.error(`Error: ${err.message}`)
            })
        })
    }

    useEffect(()=>{
        if(!isLoading && !adminIds.includes(user ?.uid)){
            navigate("/" , {replace: true})
        }
    },[user,isLoading])

  return (
    <div className='w-full px-4 lg:px-10 2xl:px-32 py-4 grid grid-cols-1 lg:grid-cols-12'>
        {/* left containeer */}
        <div className=' col-span-12 lg:col-span-4 2xl:col-span-3 w-full flex-1 flex items-center justify-start flex-col gap-4 px-2 text-gray-900'>
            <div className='w-full'>
                <p className='text-lg'>Create a new Template</p>
            </div>

            <div className='w-full flex items-center justify-end'>
                <p className='text-base text-txtLight uppercase font-semibold'>
                    TempID:{""}
                </p>
                <p className='text-base text-gray-500 capitalize font-bold'>
                    {templates && templates.length> 0 ? `Template${templates.length+1}` : "Template1"}
                </p>
            </div>

            {/* template title section */}
            <input 
            className='w-full px-4 py-3 rounded-md bg-transparent border border-gray-400 bg-gray-300' 
            type="text" 
            name='title' 
            placeholder='Template Title' 
            value={formData.title} 
            onChange={handleInputChange}
            />

                        {/* file uploader section */}
                        <div className='w-full bg-emerald-100 backdrop-blur-md h-[420px] lg:h-[620px] 2xl:h-[740px] rounded-md border-2 border-dotted border-emerald-500 cursor-pointer flex items-center justify-center'>
                            {imgAsset.isImgLoading ? (
                                <>
                                <div className='flex flex-col items-center justify-center gap-4'>
                                    <PuffLoader color='red' size={40}/>
                                    <p>{imgAsset?.progress.toFixed(2)}%</p>
                                </div>
                                </>
                                ) : 
                                (
                                <>
                                    {!imgAsset?.url ? 
                                    <>
                                    <label className='w-full cursor-pointer h-full'>
                                        <div className='flex flex-col justify-center items-center h-full w-full'>
                                            <div className='flex items-center justify-center cursor-pointer flex-col gap-4'>
                                                <FaUpload className='text-2xl'/>
                                                <p className='text-lg text-gray-500'>Click to upload</p>
                                            </div>
                                        </div>

                                        <input 
                                        type="file" 
                                        className=' w-0 h-0' 
                                        accept='.jpeg, .jpg, .png'
                                        onChange={handleImgSelect} 
                                        />
                                    </label>
                                    </>
                                    :
                                    <>
                                    <div className=' relative w-full h-full overflow-hidden rounded-md'>
                                        <img 
                                        src={imgAsset?.url}
                                        className=' w-full h-full object-cover'
                                        loading='lazy'
                                        alt="" />

                                        {/* delete position */}
                                        <div onClick={dltAnImg} className=' absolute top-4 right-4 w-8 h-8 rounded-md flex items-center justify-center bg-red-500'>
                                            <FaTrash className='text-sm text-white'/>
                                        </div>
                                    </div>
                                    </>}
                                </>
                                )}
                        </div>

                        {/* tags  */}
                        <div className='w-full flex items-center flex-wrap gap-2'>
                            {initialTags.map((tag , index)=>(
                                <div 
                                className={` border border-gray-600 px-2 py-1 rounded-md cursor-pointer ${selectedTags.includes(tag)  ? "text-white bg-gray-500" : ""}`}
                                key={index}
                                onClick={()=>handleSelectedTags(tag)}
                                >
                                <p className='text-xs'>{tag}</p>
                                </div>                                

                            )
                            )}

                        </div>

                        {/* btn access */}
                        <button 
                        type='button'
                        onClick={pushToCloud}
                        className='bg-emerald-500 text-white w-full rounded-md py-3'
                        >
                            save
                        </button>
            </div>



        {/* right containeer */}
        <div className=' col-span-12 lg:col-span-8 2xl:col-span-9 px-2 w-full flex-1 py-4'>
            {templatesIsLoading ? (<>
                <div className='w-full h-full flex items-center justify-center'>
                <ClimbingBoxLoader color={'red'} size={15}/>
                </div>
            </>)
            :
            (<>
                {templates && templates.length > 0 ? (
                <>
                                  <div className=' w-full h-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4'>
                {templates?.map((template) =>(

                     <div key={template.id} className='w-full h-[500px] rounded-md overflow-hidden relative'>
                        <img src={template?.imageURL} alt="" className='w-full object-cover' />
                        <div onClick={()=>removeTemplate(template)} 
                        className=' absolute top-4 right-4 w-8 h-8 rounded-md flex items-center justify-center bg-red-500 cursor-pointer'>
                        <FaTrash className='text-sm text-white'/>
                        </div>
                    </div>                   
                  
                ))}
                </div>
                </>
                ):(
                <>
                <div className='w-full h-full flex flex-col gap-6 items-center justify-center'>
                <ClimbingBoxLoader color={'red'} size={15}/>
                <p className='text-xl tracking-wider capitalize text-gray-600'>No data</p>
                </div>                
                </>
                )}
            </>)} 
        </div>
      
    </div>
  )
}

export default CreateTemplate
