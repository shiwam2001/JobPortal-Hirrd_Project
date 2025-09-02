import React from 'react'
import { useUser } from "@clerk/clerk-react"
import { BarLoader } from 'react-spinners'
import CreatedApplication from '@/components/CreatedApplication'
import { CreatedJobs } from '@/components/CreatedJobs'

const my_jobs = () => {
  const {user,isLoaded} = useUser()

  if(!isLoaded){
    return <BarLoader className='mb-4' width={"100%"} color='#36d7b7'/>
  }
  return (
    <div>
      <h1 className='gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8'>
        {user?.unsafeMetadata?.role === "candidate"
        ? "My Application" : "My Jobs"}
      </h1>

      {user?.unsafeMetadata?.role === "candidate"?<CreatedApplication/>:<CreatedJobs/>}
      
    </div>
  )
}

export default my_jobs
