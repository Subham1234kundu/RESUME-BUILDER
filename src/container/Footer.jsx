import React from 'react'
import {Logo} from "../assets"
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='w-full flex items-center justify-between border-gray-300'>
     <div className='flex items-center justify-center gap-3 text-gray-300 py-3'>
     <img src={Logo} className='w-8 h-auto object-contain' alt="" />
     <p>Resume Crusher</p>
     </div>

     <div className='flex items-center justify-center gap-3 text-gray-300 py-3'>
        <Link to={"/"} className='text-sm'>Home</Link>
        <Link to={"/"} className='text-sm'>Contact</Link>
        <Link to={"/"} className='text-sm whitespace-nowrap'>Privacy-Policy</Link>
     </div>
    </div>
  )
}

export default Footer
