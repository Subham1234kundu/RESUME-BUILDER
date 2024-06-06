import React, { useEffect } from 'react'
import {Logo} from "../assets"
import Footer from '../container/Footer'
import { AuthBtnWithProvider, MainSpinner } from '../components'
import { FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import useUser from '../hooks/useUser';
import { useNavigate } from 'react-router-dom';

const Authentication = () => {

  const {data, isLoading , isError } = useUser();
  const navigate = useNavigate();

  useEffect(()=>{
      if(!isLoading && data){
        navigate("/",{replace:true});
      }

  },[data, isLoading]);
  
  if(isLoading){
    return <MainSpinner/>
  }
  return (
    <div className='auth-section'>
      <img src={Logo} className='w-12 h-auto object-contain' alt="" />

      <div className='w-full flex flex-1 flex-col items-center justify-center gap-6 '>
      <h1 className='text-emerald-400 font-bold text-3xl lg:text-4xl'>Welcome to Resume Crusher</h1>
      <p className='text-base text-gray-400 flex gap-2'>crush your resume in <span className='text-emerald-400'>2</span> min</p>
      <h2 className='text-2xl text-gray-500'>Authentication</h2>
      <div className='w-full lg:w-96 rounded-md  p-2 flex flex-col items-center justify-start gap-6'>
        <AuthBtnWithProvider 
        Icon={FaGoogle} 
        label={"Sign in With Google" } 
        provider={"GoogleAuthProvider"}
        />

        <AuthBtnWithProvider 
        Icon={FaGithub} 
        label={"Sign in With Github" } 
        provider={"GithubAuthProvider"}/>
      </div>
      </div>
      <Footer/>
    </div>
  )
}

export default Authentication
