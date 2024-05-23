import React from 'react'
import {Logo} from "../assets"
import Footer from '../container/Footer'
import { AuthBtnWithProvider } from '../components'
import { FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";

const Authentication = () => {
  return (
    <div className='auth-section'>
      <img src={Logo} className='w-12 h-auto object-contain' alt="" />

      <div className='w-full flex flex-1 flex-col items-center justify-center gap-6 '>
      <h1 className='text-red-700 font-bold text-3xl lg:text-4xl'>Welcome to Resume Crusher</h1>
      <p className='text-base text-gray-300'>crush your resume in 2 min</p>
      <h2 className='text-2xl text-gray-300'>Authentication</h2>
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
