import React, { useState } from 'react'
import {  AnimatePresence, motion } from 'framer-motion'
import { fadeInOutOpacity, fadeInOutWithOpacity, scaleInOut } from '../animations'
import { BiFolderPlus, BiHeart, BiSolidFolderPlus, BiSolidHeart } from 'react-icons/bi';
import useUser from '../hooks/useUser';
import { saveToCollections, saveTofavrourits } from '../api';
import useTemplates from '../hooks/useTemplates';
import { useNavigate } from 'react-router-dom';


const TemplateDesignPin = ({data,index}) => {

    const{data:user , refetch: userRefetch} = useUser();
    const{refetch:temp_refetch} = useTemplates();

    const [isHovered, setIsHovered] = useState(false);

    const navigate = useNavigate();

    const addToCollection = async(e)=>{
        e.stopPropagation();
        await saveToCollections(user,data);
        userRefetch();
    }

    const addToFavrouts = async(e)=>{
        e.stopPropagation();
        await saveTofavrourits(user,data);
        temp_refetch();
    }

    const handleRouteNavigation = ()=>{
        navigate(`/resumeDetail/${data?.id}`,{replace:true});
    }

  return (
    <motion.div 
    key={data?.id}
    {...scaleInOut(index)}
    onMouseEnter={()=>setIsHovered(true)}
    onMouseLeave={()=>setIsHovered(false)}
    >
        <div className=' w-full h-[400px] 2xl:h-[500px] rounded-md bg-gray-400 overflow-hidden relative'>
        <img src={data?.imageURL} alt="" className=' w-full h-full object-cover' />

        <AnimatePresence>
            {isHovered && (
            <motion.div 
            onClick={handleRouteNavigation}
            {...fadeInOutOpacity} 
            className=' absolute inset-0 bg-[rgba(0,0,0,0.4)] flex flex-col items-center justify-start px-4 py-3 cursor-pointer'>
            <div className=' flex flex-col items-end justify-start w-full gap-8'>
                <InnerBoxCard 
                label={user?.collections?.includes(data?.id) ? "Added to collections":"Add to collections"} 
                Icon={user?.collections?.includes(data?.id) ?BiSolidFolderPlus : BiFolderPlus} 
                onHandle={addToCollection}/>
                <InnerBoxCard 
                label={data?.favrourits?.includes(user?.uid) ?"Added to Favourites":"Add to Favrourites"} 
                Icon={data?.favrourits?.includes(user?.uid) ? BiSolidHeart :BiHeart} 
                onHandle={addToFavrouts}/>
            </div>
            </motion.div>
            )}
        </AnimatePresence>
        </div>

    </motion.div>
  );
};

const InnerBoxCard = ({label , Icon, onHandle}) =>{
    const [isHoverd, setIsHoverd] = useState(false)
    return(
        <div 
        onClick={onHandle} 
        className=' w-10 h-10 bg-gray-700 rounded-md flex items-center justify-center hover:bg-gray-800 relative'
        onMouseEnter={()=>setIsHoverd(true)}
        onMouseLeave={()=>setIsHoverd(false)}
        >
            <Icon className='text-gray-200 text-base'/>
            <AnimatePresence>
                {isHoverd && 
                <motion.div 
                
                {...fadeInOutWithOpacity}
                className='px-3 py-2 rounded-md bg-gray-500 text-gray-400 -left-44 absolute after:w-2 after:h-2 after:bg-gray-500 after:absolute after:-right-1 after:top-[14px] after:rotate-45 '>
                    <p className='tex-sm whitespace-nowrap'>{label}</p>
                </motion.div>                
                }
            </AnimatePresence>
        </div>
    )
}

export default TemplateDesignPin
