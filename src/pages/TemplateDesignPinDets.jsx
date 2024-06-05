import React from 'react'
import { useQuery } from 'react-query';
import { Link, useParams } from 'react-router-dom'
import MainSpinner from '../components/MainSpinner';
import { getTemplateDetails, saveToCollections, saveTofavrourits } from '../api';
import { FaHome } from 'react-icons/fa';
import { BiFolderPlus, BiHeart, BiSolidFolderPlus, BiSolidHeart } from 'react-icons/bi';
import useUser from '../hooks/useUser';
import useTemplates from '../hooks/useTemplates';
import { TemplateDesignPin } from '../components';
import { AnimatePresence } from 'framer-motion';

const TemplateDesignPinDets = () => {
  const {templateID} = useParams();
  const {data, isError, isLoading , refetch} = useQuery(
    ["template",templateID],
    () => getTemplateDetails(templateID)
  );

  const {data:user,refetch:userRefetch} = useUser();
  const{data:templates,refetch:temp_refetch,isLoading:temp_isLoading} = useTemplates();

  
  const addToCollection = async(e)=>{
    e.stopPropagation();
    await saveToCollections(user,data);
    userRefetch();
}

const addToFavrouts = async(e)=>{
  e.stopPropagation();
  await saveTofavrourits(user,data);
  temp_refetch();
  refetch();
}

  if(isLoading) return <MainSpinner/>
  if(isError){
    return (
      <div className=' w-full h-[60vh] flex flex-col items-center justify-center'>
        <p className=' text-lg text-yellow-600 font-semibold'>Error while fetching the data... Plese try again later</p>
      </div>
    );
  }

  return (
    <div className=' w-full flex flex-col items-center justify-start px-4 py-12 '>
      {/* bread crump */}
      <div className=' w-full flex items-center pb-8 gap-2'>
        <Link to={"/"} className=' flex items-center justify-center gap-2 text-gray-500'>
          <FaHome/> Home
          <p>/</p>
          <p>{data?.name}</p>
        </Link>
      </div>

      {/* Main section */}
      <div className=' w-full grid grid-cols-1 lg:grid-cols-12'>

        {/* Left Section */}
        <div className=' col-span-1 lg:col-span-8 flex flex-col items-start justify-start gap-4'>
          <img className=' w-full h-auto object-contain rounded-md' src={data?.imageURL} alt="" />

          {/* title and other section */}
        <div className=' w-full flex flex-col items-start justify-start
         gap-2'>
          <div className=' w-full flex items-center justify-between'>
            <p className=' text-base text-gray-400 font-semibold'>
              {data?.title}
            </p>

            {/* likes */}
            {data?.favrourits?.length > 0 && (
            <div className=' flex items-center justify-center gap-1'>
            <BiSolidHeart className=' text-base text-red-500'/>
            <p className=' text-base text-gray-400 font-semibold'>{data?.favrourits?.length}likes</p>
          </div>
            )}

          </div>

            {/* collection favrouts opction  */}
            {user && (
              <div            
              className=' flex items-center justify-center gap-3'>
                { user?.collections?.includes(data?.id) ? 
                <>
                <div 
                onClick={addToCollection}
                className=' flex items-center justify-center px-4 py-2 rounded-md border bg-gray-300 gap-2 hover:bg-gray-400 cursor-pointer'>
                  <BiSolidFolderPlus className=' text-base text-gray-900'/>
                  <p className=' text-sm whitespace-nowrap text-gray-600 '>Remove From collections</p>

                </div>
                </>
                :
                <>
                <div 
                onClick={addToCollection}
                className=' flex items-center justify-center px-4 py-2 rounded-md border bg-gray-300 gap-2 hover:bg-gray-400 cursor-pointer'>
                  <BiFolderPlus className=' text-base text-gray-900'/>
                  <p className=' text-sm whitespace-nowrap text-gray-600 '>Add To collections</p>

                </div>                
                </>}



                { data?.favrourits?.includes(user?.uid) ? 
                <>
                <div 
                onClick={addToFavrouts}
                className=' flex items-center justify-center px-4 py-2 rounded-md border bg-gray-300 gap-2 hover:bg-gray-400 cursor-pointer'>
                  <BiSolidHeart className=' text-base text-gray-900'/>
                  <p className=' text-sm whitespace-nowrap text-gray-600 '>Remove From favrourits</p>

                </div>
                </>
                :
                <>
                <div 
                onClick={addToFavrouts}
                className=' flex items-center justify-center px-4 py-2 rounded-md border bg-gray-300 gap-2 hover:bg-gray-400 cursor-pointer'>
                  <BiHeart className=' text-base text-gray-900'/>
                  <p className=' text-sm whitespace-nowrap text-gray-600 '>Add To favrourits</p>

                </div>                
                </>}
              </div>
            )}


         </div>
        </div>


        {/* Right Section */}
        <div className=' col-span-1 lg:col-span-4 w-full flex flex-col ic justify-start px-3 lg:py-0 py-3 gap-6'>
          {/* Discover more */}
          <div 
          className=' w-full h-72 bg-blue-200 rounded-md overflow-hidden relative'
          style={{background:"url(https://images.unsplash.com/photo-1586053113575-4f3b3ca59a04?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)" , backgroundPosition:"center",backgroundSize:"cover"}}
          >
            <div className=' absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.4)]'>
            <Link to={"/"} className='px-4 py-2 rounded-md border border-gray-50 text-white'>
              Discover More
            </Link>
            </div>
          </div>

          {/* Edit the template */}
          {user && (
            <Link className=' w-full px-4 py-3 rounded-md flex items-center justify-center bg-emerald-500 cursor-pointer' to={`/resume/${data?.name}?templateId=${templateID}`}>
              <p className=' text-white font-semibold text-lg'>Edit the Template</p>
            </Link>
          )}

          {/* tags */}
          <div className=' w-full flex items-center justify-start flex-wrap  gap-2'>
            {data?.tags?.map((tag, index)=>(
              <p className=' text-xs border text-white border-gray-300 px-2 py-1 rounded-md whitespace-nowrap' key={index}>{tag}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Simillar templates */}
      {templates?.filter((temp)=>temp.id !== data.id)?.length >0 && (
      <div className=' w-full py-8 flex flex-col items-start justify-start gap-4'>
        <p className=' text-lg font-semibold text-white'>
          You might also like 
        </p>

        <div className=' w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2'>
        
         <>
        <AnimatePresence>
          { templates?.filter((temp)=>temp.id !== data.id).map((template , index)=>(
            <TemplateDesignPin 
            key={template?.id} 
            index={index} 
            data={template}/>
          ))}
        </AnimatePresence>
      </> 
        </div>
      </div>
      )}

      </div>
  );

}

export default TemplateDesignPinDets
