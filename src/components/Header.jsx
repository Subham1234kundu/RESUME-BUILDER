import React, { useState } from 'react'
import useUser from '../hooks/useUser';
import { Link } from 'react-router-dom';
import { Logo } from '../assets';
import { AnimatePresence, motion } from 'framer-motion';
import { PuffLoader } from 'react-spinners';
import { LuLogOut } from "react-icons/lu";
import { fadeInOutOpacity, slideUpDownMenu } from '../animations';
import { auth } from '../config/firebase.config';
import { useQueryClient } from 'react-query';
import useFilters from '../hooks/useFilters';


const Header = () => {
  const {data, isLoading , isError } = useUser();
  const [isMenu , setIsMenu] = useState(false);

  const queryClient = useQueryClient();

  const {data:filterData } = useFilters();

  const signOutUser = async()=>{
    await auth.signOut().then(()=>{
        queryClient.setQueryData("user" , null);
    })
  };

  const handleSearchTerm = (e)=>{
    queryClient.setQueriesData("globalFilter" , {
      ...queryClient.getQueriesData("globalFilter"), 
      searchTerm:e.target.value });
  }
  const clearFilter = ()=>{
    queryClient.setQueriesData("globalFilter" , {
      ...queryClient.getQueriesData("globalFilter"), 
      searchTerm:"" });
  }

  return (
    <header className='w-full flex items-center justify-between px-4 py-3 lg:px-8 border-b border-gray-900 bg-bgPrimary z-50 gap-12 sticky top-0'>
      <Link to={"/"}>
        <img src={Logo} className=' w-12 h-auto object-contain' alt="" />
      </Link>

      <div className=' flex-1 border border-gray-900 px-4 py-1 rounded-md flex items-center justify-between bg-gray-700'>
        <input 
        value={filterData?.searchTerm ? filterData?.searchTerm : ""}
        onChange={handleSearchTerm}
        type="text" placeholder='Search here...' className='flex-1 h-10 bg-transparent text-base font-semibold outline-none border-none text-white' />
                <AnimatePresence>
          {filterData?.searchTerm.length > 0 ? 
         ( <motion.div
         onClick={clearFilter}
         {...fadeInOutOpacity}
         className='w-8 h-8 flex items-center justify-center bg-gray-600 rounded-md cursor-pointer active:scale-95 duration-150 text-gray-200'
         > <p>X</p> </motion.div>):<></>
          }
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isLoading ? (
          <PuffLoader color='red' size={50}/>
        ) : (
          <React.Fragment>
            {data 
            ? 
            <motion.div className=' relative' onClick={()=>setIsMenu(!isMenu)}>
                {data.photoURL
                ? 
                <div className=' w-12 h-12 rounded-md relative flex flex-col items-center justify-center cursor-pointer'>
                  <img src={data?.photoURL} 
                  className=' w-full h-full object-cover rounded-md'
                  referrerPolicy='no-referrel' alt="" />
                </div> 
                : 
                <div className=' w-12 h-12 rounded-md relative flex flex-col items-center justify-center bg-red-700 shadow-md  cursor-pointer'>
                  <p className='text-2xl text-white'>{data?.email[0]}</p>
                </div>}


                {/* dropdown menu */}
                  <AnimatePresence>
                    {isMenu && 
                     <motion.div 
                                     {...slideUpDownMenu}
                                      className=' absolute px-4 py-3 rounded-md bg-slate-600 right-0 top-14 flex flex-col items-center justify-center gap-3 w-64 pt-12'
                                      onMouseLeave={()=>setIsMenu(false)}
                                      >

                                      {data.photoURL
                                      ? 
                                    <div className=' w-20 h-20 rounded-full relative flex flex-col items-center justify-center cursor-pointer'>
                                      <img src={data?.photoURL} 
                                      className=' w-full h-full object-cover rounded-full'
                                      referrerPolicy='no-referrel' 
                                      alt="" 
                                      />
                                    </div> 
                                    : 
                                    <div className='  w-20 h-20 rounded-full relative flex flex-col items-center justify-center bg-red-700 shadow-md  cursor-pointer'>
                                      <p className='text-5xl text-white'>{data?.email[0]}</p>
                                    </div>
                                    }
                    
                                      {data?.displayName && (
                                        <p className='text-lg text-gray-300'>
                                          {data?.displayName}
                                        </p>
                                      )}
                    
                                      {/* menus */}
                                      <div className='w-full flex flex-col items-start gap-7 pt-6 '>
                    
                                        <Link 
                                        className='text-gray-500 hover:text-gray-400 text-base whitespace-nowrap '
                                        to={`/profile/${data?.uid}`}
                                        >My Accunt</Link>
                                        <Link 
                                        className='text-gray-500 hover:text-gray-400 text-base whitespace-nowrap '
                                        to={"/template/create"}
                                        >Add New Templete</Link>
                                        <div onClick={signOutUser} className='w-full px-2 py-2 border-t border-gray-700 flex items-center cursor-pointer justify-between group'>
                                          <p className=' group-hover:text-gray-500 text-gray-400'>Sign Out</p>
                                          <LuLogOut className=' group-hover:text-gray-500 text-gray-400'/>
                                        </div>
                    
                                      </div>
                      </motion.div>
                    }
                  </AnimatePresence>
            </motion.div> 
            : 
            <Link to={"/auth"}>
              <motion.button className=' text-gray-300 px-4 py-2  bg-gray-700 hover:shadow-md active:scale-150 duration-150'
              {...fadeInOutOpacity}
              >Login</motion.button>
            </Link>}
          </React.Fragment>
        )}
      </AnimatePresence>
      
    </header>
  )
}

export default Header
