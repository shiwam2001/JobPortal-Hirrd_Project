import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/clerk-react'
import React, { useEffect } from 'react'
import {  useNavigate } from 'react-router-dom';
import { BarLoader } from 'react-spinners';


const onboarding = () => {

  const { user, isLoaded } = useUser();
 
  const navigate = useNavigate();


  const handleRoleSelection = async (role) => {
    await user.update({
      unsafeMetadata:{role}
    }).then(() => {
      navigate(role === "recruiter" ? "/post-job" : "/jobs")
    }).catch((error) => {
      console.error("Error updating user role:", error);
      // Handle error (e.g., show a notification to the user) 
    })
 }

 useEffect(() => {
  if (user?.unsafeMetadata?.role) {
    navigate(user?.unsafeMetadata?.role === "recruiter" ? "/post-job" : "/jobs")
  }
}, [user]);

if (!isLoaded) {
  return <BarLoader className='mb-4' width={"100%"} color='#36d7b7' />
}
   

  return (
    <div className='flex flex-col items-center justify-center mt-40'>
      <h2 className='gradient-title font-extrabold text-7xl sm:text-8xl tracking-tighter'>I am a...</h2>

      <div className='mt-16 grid grid-cols-2 gap-4 w-full md:px-40'>
          <Button onClick={()=>handleRoleSelection("candidate")}  variant='blue' className='h-25 text-2xl' 
           >Candidate</Button>
          <Button  variant='red' className='h-25 text-2xl'
          onClick={()=>handleRoleSelection("recruiter")} >Recruiter</Button>
      </div>
    </div>


  )
}

export default onboarding
