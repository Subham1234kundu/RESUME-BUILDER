import React from 'react'
import {ClimbingBoxLoader} from "react-spinners"
const MainSpinner = () => {
  return (
    <div className='w-screen h-screen flex items-center justify-center'>
      <ClimbingBoxLoader color={'red'} size={15}/>
    </div>
  )
}

export default MainSpinner
