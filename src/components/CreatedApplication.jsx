import { getApplications } from '@/api/jobsApi';
import React, { useEffect } from 'react'
import { BarLoader } from 'react-spinners';
import ApplicationCard from './applicationCard';

export default function CreatedApplication() {

    const { user } = useUser()
    
    const {
        loading:loadingApplications,
        data:application,
        fn:fnApplication
    } = useFetch(getApplications,{ user_id: user.id});

    useEffect(()=>{
        fnApplication()
    },[])

    if(loadingApplications){
        return <BarLoader className='mb-4' width={"100%"} color='#36d7b7'/>
    }

  return (
    <div className='flex flex-col gap-2'>
        {application.map((application)=>{
            return (
                <ApplicationCard 
                    key={application.id} 
                    application={application}
                    isCandidate
                    />
            )
        })}
      
    </div>
  )
}
