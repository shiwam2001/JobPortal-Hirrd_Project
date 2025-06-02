import { useSession, useUser } from '@clerk/clerk-react'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useFetch from '@/hooks/use-fetch'
import getSingleJob from '@/api/apiJobs'
import { BarLoader } from 'react-spinners'
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from 'lucide-react'
import MarkdownEditor from '@uiw/react-markdown-editor'
import UpdateHiringStatus from '@/api/apiJobs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select'

const jobpage = () => {

  const { isLoaded, user } = useUser()
  const { id } = useParams()

  const {
    loading: loadingJob,
    data: job,
    fn: fnjob,
  } = useFetch(getSingleJob, { jobId: id });

  const {
    loading: loadingHiringStatus,
    fn: fnHiringStatus,
  } = useFetch(UpdateHiringStatus, { jobId: id });

  const handleStatusChange = (value) => {
    const isOpen = value === 'open';
    fnHiringStatus(isOpen).then(() => fnjob());
  }

  useEffect(() => {
    if (isLoaded) fnjob()
  }, [isLoaded])

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
              placeholder={"Hiring Status" + " " + (job?.isOpen ? '(Open)' : '(Closed)')}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open" className=''>Open</SelectItem>
            <SelectItem value="closed" className=''>Closed</SelectItem>

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


    </div>
  )
}

export default jobpage
