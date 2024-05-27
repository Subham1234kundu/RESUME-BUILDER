import React from 'react'

const CreateTemplate = () => {
  return (
    <div className='w-full px-4 lg:px-10 2xl:px-32 py-4 grid grid-cols-1 lg:grid-cols-12'>
        {/* left containeer */}
        <div className=' col-span-12 lg:col-span-4 2xl:col-span-3 w-full flex-1 flex items-center justify-start flex-col gap-4 px-2 text-gray-300'>
            <div className='w-full'>
                <p className='text-lg'>Create a new Template</p>
            </div>

            <div className='w-full flex items-center justify-end'>
                <p className='text-base text-txtLight uppercase font-semibold'>
                    TempID:{""}
                </p>
                <p className='text-base text-gray-500 capitalize font-bold'>
                    Template1
                </p>
            </div>
        </div>

        {/* right containeer */}
        <div className=' col-span-12 lg:col-span-8 2xl:col-span-9'>
             
        </div>
      
    </div>
  )
}

export default CreateTemplate
