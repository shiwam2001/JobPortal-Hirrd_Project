import { useUser } from '@clerk/clerk-react'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Heart, MapPinIcon, Trash2Icon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import useFetch from '@/hooks/use-fetch'
import { saveJob } from '@/api/apiJobs'

const JobCard = ({
    job,
    isMyJob = false,// Placeholder for job and isMyJob props
    savedInit = false,
    onJobSaved = () => { }
}) => {
    const [saved, setSaved] = useState(savedInit)

    const {
        fn: fnSavedJobs,
        data: savedJobs,
        loading: loadingSavedJobs,
        error } = useFetch(saveJob, {alreadySaved: saved });

    const { user } = useUser()

    const handleSavedJob = async () => {
        await fnSavedJobs({
            user_id: user.id,
            job_id: job.id,
        })
        onJobSaved()
    }

    useEffect(() => {
        if(savedJobs !== undefined ) setSaved(savedJobs?.length > 0)
    }, [savedJobs])

    return (
        <Card className=" mt-1" >
            <CardHeader className='flex justify-between font-bold gap-10'>

                <CardTitle> {job.title} </CardTitle>

                {!isMyJob && <Trash2Icon fill='red' size={18}
                    className='cursor-pointer text-red-300'
                />}
            </CardHeader>

            <CardContent className="flex flex-col gap-4 flex-1">
                <div className='flex justify-between'>
                    {job.company && <img src={job.company.logo_url} className=' h-6 ' />}
                    <div className='flex gap-2 items-center '>
                        <MapPinIcon size={15} /> {job.location}
                    </div>
                </div>
                <hr />
                {job.description.substring(0, job.description.indexOf("."))}
            </CardContent>
            <CardFooter className='flex gap-3'>
                <Link to={`/job/${job.id}`} className='text-blue-500 hover:underline'>
                    <Button className="w-full" variant="secondary">More Details </Button>
                </Link>

                {!isMyJob && (
                    <Button
                    variant='outline'
                    className='w-15'
                    onClick={handleSavedJob}
                    disabled={loadingSavedJobs}
                    >
                    {saved?  (<Heart size={20} stroke='red' fill='red' />):(<Heart size={20} />)}
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}

export default JobCard
