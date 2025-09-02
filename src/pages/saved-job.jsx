import { getSavedJobs } from '@/api/apiSavedJob'
import useFetch from '@/hooks/use-fetch'
import {useUser} from "@clerk/clerk-react"

import React, { useEffect } from 'react'
import { BarLoader } from 'react-spinners'

const saved_job = () => {

  const { isLoaded } = useUser()

  const {
    loading: loadingSavedJobs,
    data: savedJobs,
    fn: fnSavedJobs
  }=useFetch(getSavedJobs)

  useEffect(()=>{
    if(isLoaded) fnSavedJobs()
  },[isLoaded])

  if(!isLoaded || loadingSavedJobs){
    return <BarLoader className='mb-4' width={"100%"} color='#36d7b7'/>
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-center pb-8">
        Saved Jobs
      </h1>

      {loadingSavedJobs === false && (
      <div className='mt-4 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4'>
        {savedJobs?.length ? (
           savedJobs.map((saved) => {
            return <JobCard
              key={saved.id}
              job={saved.job}
              savedInit={true}
              onJobSaved={fnSavedJobs}
            />
          })
         
        ) : (
          <div className='text-red-500 text-2xl font-extrabold text-center'>No Saved Jobs Found! </div>
          
        )}
      </div>
    )}

    </div>
  )
}

export default saved_job
