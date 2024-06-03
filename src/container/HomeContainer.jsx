import React from 'react';
import Filters from '../components/Filters';

const HomeContainer = () => {
  return (
    <div className='w-full px-4 lg:px-12 py-6 flex flex-col items-center justify-start'>
      {/* Filter section  */}
        <Filters/>
      {/* Render those templete - Resume PIN */}
    </div>
  )
}

export default HomeContainer
