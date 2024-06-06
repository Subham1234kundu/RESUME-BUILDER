import React from 'react';
import Filters from '../components/Filters';
import useTemplates from "../hooks/useTemplates"
import { AnimatePresence } from 'framer-motion';
import TemplateDesignPin from '../components/TemplateDesignPin';
const HomeContainer = () => {

  const { data:templates, isLoading:temp_isLoading, isError:temp_isError, refetch:temp_refetch } = useTemplates();


  
  return (
    <div className='w-full px-4 lg:px-12 py-6 flex flex-col items-center justify-start'>
      {/* Filter section  */}
        <Filters/>

      {/* Render those templete - Resume PIN */}
      {temp_isError ? <><p className='text-lg text-[#424242] '>something went wrong... plese try again later</p></>:<>
       <div className=' w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2'>
          <RenderTemplate templates={templates}/>
       </div>
      </>}
    </div>
  );
};

const RenderTemplate = ({templates}) =>{
    return (
      <>{templates && templates.length >0 ? <>
        <AnimatePresence>
          {templates && templates.map((template , index)=>(
            <TemplateDesignPin 
            key={template?.id} 
            index={index} 
            data={template}/>
          ))}
        </AnimatePresence>
      </> : 
      <>
      <p className='text-2xl text-[#424242]'>No Data found</p>
      </>}</>
    )
}

export default HomeContainer
