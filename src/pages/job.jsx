import { useUser } from '@clerk/clerk-react'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useFetch from '@/hooks/use-fetch'

import { BarLoader } from 'react-spinners'
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from 'lucide-react'
import MarkdownEditor from '@uiw/react-markdown-editor'
import ApplicationCard from '@/components/applicationCard'
import ApplyJobDrawer from '@/components/applyjob'

import updateHiringStatus from '@/api/hiringStatus'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getSingleJob } from '@/api/apiGetSingleJob'

const jobpage = () => {

  const { isLoaded, user } = useUser()
  const { id } = useParams()

  const {
    loading: loadingJob,
    data: job,
    fn: fnjob,
  } = useFetch( getSingleJob , { jobId: id });

  useEffect(() => {
    if (isLoaded) fnjob()
  }, [isLoaded])

  const {
    loading: loadingHiringStatus,
    fn: fnHiringStatus,
  } = useFetch(updateHiringStatus, { jobId: id });

  const handleStatusChange = (value) => {
    const isOpen = value === 'open';
    fnHiringStatus(isOpen).then(() => fnjob());
  }

  

  if (!isLoaded || loadingJob) {
    return <BarLoader className='mb-4' width={"100%"} color="#36d7b7" />
  }

  return (
    <div className='flex flex-col gap-8 mt-5'>
      <div className='flex flex-col-reverse gap-6 md:flex-row justify-between items-center'>
        <h1 className='gradient-title font-extrabold pb-3 text-4xl sm:text-6xl'>{job?.title}</h1>
        <img src={job?.company?.logo_url} className='h-12' alt={job?.title} />
      </div>

      <div className='flex justify-between'>
        <div className='flex gap-2'>
          <MapPinIcon />
          {job?.location}
        </div>
        <div className='flex gap-2 '>
          <Briefcase /> {job?.applications?.length} Applicants
        </div>
        <div className='flex gap-2'>
          {job?.isOpen ? (
            <>
              <DoorOpen /> Open
            </>
          ) : (
            <>
              <DoorClosed /> Closed
            </>
          )}
        </div>
      </div>

      {/* hiring Status */}


      {job?.recruiter_id === user?.id && (
        <Select onValueChange={handleStatusChange} className=" mt-4">
          <SelectTrigger className={`w-full ${job?.isOpen ? "bg-green-950" : "bg-red-950"}`}>
            <SelectValue
              placeholder={"Hiring Status" + (job?.isOpen ? '( Open )' : '( Closed )')}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>

          </SelectContent>
        </Select>
      )}

      <h2 className='text2xl sm:text-3xl font-bold'>About the Job</h2>
      <p className='sm:text-lg'>{job?.description}</p>

      <h2 className='text-2xl sm:text-3xl font-bold'>
        What we are looking for
      </h2>
      <MarkdownEditor.Markdown
        source={job?.requirements}
        className='bg-transparent sm:text-lg'
      />

      {job?.recruiter_id !== user?.id && (
        <ApplyJobDrawer
          job={job}
          user={user}
          fetchJob={fnjob}
          applied={job?.applications?.find((app) => app.candidate_id === user.id)}
        />
      )}

      {job?.applications?.length > 0 && job?.recruiter_id === user?.id && (
        <div className='flex flex-col gap-4'>
          <h2 className='text-2xl sm:text-3xl font-bold'>Applications</h2>
          {job?.applications.map((application) => {
            return (
              <ApplicationCard key={application.id} application={application} />
            )

          })}
        </div>

      )}


    </div>
  )
}

export default jobpage
