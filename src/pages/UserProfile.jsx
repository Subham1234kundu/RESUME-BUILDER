import React, { useEffect, useState } from 'react'
import useUser from '../hooks/useUser'
import { AnimatePresence } from 'framer-motion';
import TemplateDesignPin from '../components/TemplateDesignPin';
import useTemplates from '../hooks/useTemplates';
import { NoData } from '../assets';
import { useQuery } from 'react-query';
import { getSavedResumes } from '../api';
import MainSpinner from '../components/MainSpinner';


const UserProfile = () => {
  const {data:user} = useUser();
  const [activeTab , setActiveTab] = useState("collections");
  const{data:templates,refetch:temp_refetch,isLoading:temp_isLoading} = useTemplates();

  const {data:saveResume} = useQuery(["resumes"],() => getSavedResumes(user?.uid));





  if(temp_isLoading){
    return <MainSpinner/>
  }
  return (
    <div className=' w-full flex flex-col items-center justify-start py-12'>
      <div className=' w-full h-72 bg-black'>
        <img src="https://images.unsplash.com/photo-1637091064156-d4f31939c620?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" className=' w-full h-full object-cover'/>

        <div className=' flex items-center justify-center flex-col gap-4'>
        {user?.photoURL ? (
          <>
          <img src={user?.photoURL} 
          className=' w-24 h-24 rounded-full border-2 border-gray-900 shadow-md -mt-12'
          alt="" 
          referrerPolicy='no-referrer'
          loading='lazy'
          />
          </>
        ):
        ( <>
          <img src="https://images.unsplash.com/photo-1621541698493-4256a218ae8b?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          className=' w-24 h-24 rounded-full border-2 border-gray-900 shadow-md -mt-12'
          alt="" 
          referrerPolicy='no-referrer'
          loading='lazy'
          />
          </>)
        }
        <p className=' text-2xl text-white'>{user?.displayName}</p>
        </div>

        {/* tabs */}
        <div className='flex items-center justify-center mt-12'>
          <div className=' px-4 py-2 rounded-md flex items-center justify-center gap-2 group cursor-pointer'
          onClick={()=>setActiveTab("collections")}
          >
            <p className={` text-base text-gray-300 group-hover:text-gray-400 px-4 py-1 rounded-full
            ${activeTab === "collections" && "bg-white shadow-md text-gray-900"}
            `}>collections</p>
          </div>

          <div className=' px-4 py-2 rounded-md flex items-center justify-center gap-2 group cursor-pointer'
          onClick={()=>setActiveTab("resumes")}
          >
            <p className={` text-base text-gray-300 group-hover:text-gray-400 px-4 py-1 rounded-full
            ${activeTab === "resumes" && "bg-white shadow-md text-gray-900"}
            `}>My Resumes</p>
          </div>
        </div>

        {/* tab content */}
        <div className=' w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 px-4 py-6 '>
          <AnimatePresence>
            {activeTab === "collections" && (
              <>
              {user?.collections.length > 0 && user?.collections
               ? 
               <RenderTemplate templates={templates ?.filter((temp)=>user?.collections?.includes(temp?.id))}/>
              :
              (
              <div className=' col-span-12 w-full flex flex-col items-center justify-center gap-3'>
              <img src={NoData} className=' w-32 h-auto object-contain' alt="" />
              <p className='text-gray-50'>No data</p>
              </div>
              )}
              </>
            )}


              {activeTab === "resumes" && (
              <>
              {saveResume?.length > 0 && saveResume
               ? 
               <RenderTemplate templates={saveResume} />
              :
              (
              <div className=' col-span-12 w-full flex flex-col items-center justify-center gap-3'>
              <img src={NoData} className=' w-32 h-auto object-contain' alt="" />
              <p className='text-gray-50'>No data</p>
              </div>
              )}
              </>
            )}
          </AnimatePresence>
        </div>
      </div>  
    </div>
  )
}

const RenderTemplate = ({templates}) =>{
  return (
    <>{templates && templates.length >0 && 
      <>
      <AnimatePresence>
        {templates && templates.map((template , index)=>(
          <TemplateDesignPin 
          key={template?.id} 
          index={index} 
          data={template}/>
        ))}
      </AnimatePresence>
    </>}</>
  )
}

export default UserProfile
