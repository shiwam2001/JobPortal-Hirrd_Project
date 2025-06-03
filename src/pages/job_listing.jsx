import React from 'react'

import { useEffect, useState } from 'react'
import useFetch from '@/hooks/use-fetch'
import { useSession, useUser } from '@clerk/clerk-react'
import { BarLoader } from 'react-spinners'
import JobCard from '@/components/JobCard'
import getCompanies from '@/api/apiCompanies'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'


import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { State } from 'country-state-city'
import getJobs from '@/api/apiJobs'


const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')
  const [companyId, setCompanyId] = useState('')
  const { isLoaded } = useUser()
  const { session } = useSession();

  const {
    fn: fetchJobs,
    data: jobs,
    loading: loadingJobs,
    error } = useFetch(getJobs, { location, companyId, searchQuery });

  const {
    fn: fnCompanies,
    data: companies,
  } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded ){
       fnCompanies();
    }
  }, [isLoaded,])

  useEffect(() => {
    if (isLoaded) {
      fetchJobs(); // Only run once session is loaded
    }
  }, [isLoaded, session, location, companyId, searchQuery,]);

  const handleSearch = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    let query = formData.get('searchQuery')
    if (query) setSearchQuery(query);
  }

 const clearFilters = () => {
    setLocation('');
    setCompanyId('');
    setSearchQuery('');
    fetchJobs(); // Re-fetch jobs without filters
  }

  if (!isLoaded) {
    return <BarLoader className='mb-4' width={"100%"} color='#36d7b7' />
  }

 

  return <div>
    <h1 className='gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8'>
      Latest Jobs
    </h1>

    {/* {add filter is there} */}
    <form onSubmit={handleSearch} className='h-14 flex w-full items-center gap-2'>
      <Input
        type="text"
        placeholder='Search by Job Title...'
        name="searchQuery"
        // value={searchQuery}
        className="h-full flex-1 px-4 text-md"
      />
     

      <Button type="submit" className="h-full sm:w-28 " variant="blue" >Search</Button>
    </form>

    <div className='flex flex-col sm:flex-row gap-2 my-3'>
      <Select value={location} onValueChange={(value)=>setLocation(value)}  className=" mt-4">
        <SelectTrigger className="">
          <SelectValue placeholder="Filter by location" />
        </SelectTrigger>
        <SelectContent>
          {State.getStatesOfCountry("IN").map(({name}) => {
            return (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            )
          })}
          
        </SelectContent>
      </Select>

      <Select value={companyId} onValueChange={(value)=>setCompanyId(value)}  className="w-[180px] mt-4">
        <SelectTrigger className="">
          <SelectValue placeholder="Filter by Company" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
          {(companies || []).map(({name,id}) => {
            return (
              <SelectItem key={name} value={id}>
                {name}
              </SelectItem>
            )
          })}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Button onClick={clearFilters} variant="destructive" className="sm:w-1/2 " >Clear Filters</Button>

    </div>
     

    {loadingJobs && <BarLoader className='mb-4' width={"100%"} color='#36d7b7' />}

    {loadingJobs === false && (
      <div className='mt-4 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4'>
        {jobs?.length ? (
          jobs.map((job) => {
            return <JobCard
              key={job.id}
              job={job}
              savedInit={job?.saved?.length > 0}
            />
          })
        ) : (
          <div>No Jobs Found</div>
        )}
      </div>
    )}
  </div>

}

export default JobListing
