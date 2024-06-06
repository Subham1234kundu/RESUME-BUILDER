import React, { useState } from 'react'
import { MdLayersClear } from 'react-icons/md'
import { AnimatePresence,motion } from 'framer-motion'
import { slideUpDownWithScale } from '../animations';
import { FiltersData } from '../utils/helper';
import useFilters from '../hooks/useFilters';
import { useQueryClient } from 'react-query';

const Filters = () => {
  const [isMoved , setIsMoved] = useState(false);
  const {data:filterData ,  isLoading , isError ,refetch} = useFilters();

  const queryClient = useQueryClient();

  const handleFilterValue = (value)=>{
    // const previousValue = queryClient.getQueriesData("globalFilter");
    // const upsatedState = {...previousValue, searchTerm:value};
    // queryClient.setQueriesData("globalFilter",upsatedState);

    queryClient.setQueriesData("globalFilter" , {
    ...queryClient.getQueriesData("globalFilter"), 
    searchTerm:value });
  }

  const clearFilter = ()=>{
    queryClient.setQueriesData("globalFilter" , {
      ...queryClient.getQueriesData("globalFilter"), 
      searchTerm:"" });
  };


  return (
    <div className=' w-full h-full flex items-center justify-start py-4'>
      <div className=' border border-emerald-700 rounded-md px-3 py-2 mr-2 cursor-pointer group hover:shadow-2xl bg-emerald-500 relative'  
      onClick={clearFilter}    
      onMouseEnter={()=>setIsMoved(true)} 
      onMouseLeave={()=>setIsMoved(false)}>
        <MdLayersClear color='white' className='text-xl'/>

        <AnimatePresence>
          {isMoved && 
          <motion.div 
          {...slideUpDownWithScale}
          className=' absolute -top-8 -left-2 bg-emerald-400 shadow-md rounded-md px-2 py-1'

          >
            <p className=' whitespace-nowrap text-xs text-white'>Clear All</p>
          </motion.div>          
          }
        </AnimatePresence>
        
      </div>

      <div className=' w-full flex items-center justify-start overflow-x-scroll scrollbar-none gap-6'>
        {FiltersData && FiltersData.map((item)=>(
          <div
           onClick={()=>handleFilterValue(item.value)}
          key={item.id} 
          className={` border border-emerald-700 bg-emerald-500 rounded-md cursor-pointer px-6 py-2 group hover: shadow-xl
          ${filterData?.searchTerm === item.value && " shadow-md"}
          `}>
            <p className='text-sm text-white whitespace-nowrap group-hover:text-gray-100'>{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Filters
