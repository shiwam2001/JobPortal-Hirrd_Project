import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { State } from 'country-state-city'
import getCompanies from '@/api/apiCompanies'
import { useUser } from '@clerk/clerk-react'
import { BarLoader } from 'react-spinners'
import useFetch from '@/hooks/use-fetch'
import { Navigate, useNavigate } from 'react-router-dom'
import MarkdownEditor from '@uiw/react-markdown-editor'
import { Button } from '@/components/ui/button'
import MDEditor from '@uiw/react-md-editor'

import CompanyDrawer from '@/components/addCompanyDrawer'
import addNewJob from '@/api/apiNewJob'

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "select a location" }),
  company_id: z.string().min(1, { message: "Select or Add a new Company" }),
  requirements: z.string().min(1, { message: "Requirements are required" })
})


const post_job = () => {
   const navigate = useNavigate()
  const { isLoaded, user } = useUser()

  const {
    register, control, handleSubmit, formState: { errors }
  } = useForm({
    defaultValues: {

      location: "",
      company_id: "",
      requirements: ""
    },
    resolver: zodResolver(schema),
  })

  const {
    fn: fnCompanies,
    data: companies,
    loading: loadingCompanies,
  } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
  }, [isLoaded,])

  const {
    loading: loadingCreateJob,
    fn: fnCreateJob,
    data: dataCreateJob,
    error: errorCreateJob,
  }= useFetch( addNewJob )

  const onSubmit = (data) => {
    fnCreateJob({
      ...data,
      isOpen: true,
      recruiter_id: user.id,
    })
  }

  useEffect(() => {
    if (dataCreateJob?.length>0) navigate('/jobs') 
      
  },[loadingCreateJob])

  if (!isLoaded || loadingCompanies) {
    return <BarLoader className='mb-4' width={"100%"} color='#36d7b7' />
  }

  if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="/jobs" />
  }
  return (
    <div>
      <h1 className='gradient-title font-extrabold text-3xl sm:text-7xl text-center pb-8'>Post a Job</h1>

      <form onSubmit={handleSubmit(onSubmit)} 
       className='flex flex-col gap-4 p-4 pb-0'
      >
        <Input
          placeholder='Job Title'
          {...register("title")}
          className='mb-4'
        />
        {errors.title && <p className='text-red-500'>{errors.title.message}</p>}




        <Textarea placeholder="Job Description" {...register("description")} />
        {errors.description && <p className='text-red-500'>{errors.description.message}</p>}

        <div className='flex mt-2 gap-4  items-center sm:flex-row'>
          <Controller
            name='location'
            control={control}
            render={({ field }) => (

              <Select
                value={field.value}
                onValueChange={(field.onChange)}
              >
                <SelectTrigger >
                  <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup >
                    {State.getStatesOfCountry("IN").map(({ name }) => {
                      return (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      )
                    })}
                  </SelectGroup>

                </SelectContent>
              </Select>
            )}
          />

          <Controller
            name='company_id'
            control={control}
            render={({ field }) => (
              <Select
               value={field.value} 
               onValueChange={field.onChange} 
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="Filter by Company">
                    {field.value ? companies?.find((c) => c.id === Number(field.value))?.name : "Select or Add a new Company"}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {companies?.map(({ name, id }) => {
                      return (
                        <SelectItem key={name} value={id}>
                          {name}
                        </SelectItem>
                      )
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />


          {/* Add company drawer */}

          <CompanyDrawer fetchCompanies={fnCompanies} />

        </div>
        {errors.location && <p className='text-red-500'>{errors.location.message}</p>}
        {errors.company_id && <p className='text-red-500'>{errors.company_id.message}</p>}

        <Controller
            name='requirements'
            control={control}
            render={({ field }) => (

              <MDEditor value={field.value} onChange={field.onChange}/>
            )}
        />
        {errors.requirements && <p className='text-red-500'>{errors.requirements.message}</p>}
        {errorCreateJob?.message && <p className='text-red-500'>{errorCreateJob?.message}</p>}
            {loadingCreateJob && <BarLoader className='mb-4' width={"100%"} color='#36d7b7' />}
        <Button type="submit" variant="blue" size="lg" className="mt-2" >Submit</Button>
      </form>
    </div>
  )
}

export default post_job
