import React from 'react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from './ui/button'
import { Input } from './ui/input'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import useFetch from '@/hooks/use-fetch'
import applyTojob from '@/api/apiApplication'
import  z  from 'zod'
import { BarLoader } from 'react-spinners'
import { Label } from './ui/label'

const schema = z.object({
    exprience:z.number()
    .min(0, "Experience must be a positive number")
    .max(50, "Experience cannot exceed 50 years")
    .int(),
    skills: z.string().min(1, "Skills are required"),
    education: z.enum(["Intermediate", "Graduate", "Post Graduate"],{
        message: "Education level is required",
    }),
    resume: z.any().refine((file)=>file[0] && (
        file[0].type === "application/pdf" ||
        file[0].type === "application/msword" 
      
    ), {
        message: "Please upload a valid resume (PDF, DOC, or DOCX)",
    }
    )
})

const applyJobDrawer = ({ user, job, applied = false, fetchJob }) => {

   const {register,handleSubmit,control,formState:{errors,},reset} = useForm({
        resolver: zodResolver(schema), 
    })

    const {
        loading: loadingApply,
        error: errorApply,
        fn: fnApply,
    } = useFetch(applyTojob)

    const onSubmit = (data) => {
        fnApply({
            ...data,
            job_id: job.id,
            candidate_id: user.id,
            name: user.name,
            status: "applied",
            resume: data.resume[0]
        }).then(() => {
            fetchJob()
            reset() 
        }
    )
    }

    return (
        <div>
            <Drawer open={applied ? false : undefined} >
                <DrawerTrigger asChild>
                    <Button
                    size='lg'
                    variant={job?.isOpen && !applied ? "default" : "destructive"}
                    disabled={!job?.isOpen || applied}
                    >
                        {job?.isOpen ? (applied ? "applied" : "apply now") : "Hiring closed"}
                    </Button>
                </DrawerTrigger >
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Apply For {job?.title} at {job?.company?.name}</DrawerTitle>
                        <DrawerDescription>This action cannot be undone.</DrawerDescription>
                    </DrawerHeader>

                    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 p-4 pb-0'>
                        <Input
                         type="text"
                            placeholder='Name'
                        className="flex-1"
                        {...register("name", )}
                        />
                        <Input
                        type="number"
                        placeholder='Years of Exprience'
                        className="flex-1" 
                        {...register("exprience",{
                            valueAsNumber: true,
                        })}
                        />
                        {errors.exprience && (
                            <p className='text-red-500'>{errors.exprience.message}</p>
                        )}


                        <Input 
                        type="text"
                        placeholder='Skills (comma separated)'
                        className="flex-1" 
                        {...register("skills")}
                        />
                         {errors.skills && (
                            <p className='text-red-500'>{errors.skills.message}</p>
                        )}

                        <Controller
                        name='education'
                        control={control}
                        render={({ field }) => (
                            <RadioGroup
                               onValueChange={field.onChange}
                               {...field}
                            >
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value="Intermediate" id="intermediate" className="h-4 w-4" />
                                    <Label htmlFor="intermediate">Intermediate</Label>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value="Graduate" id="graduate" className="h-4 w-4" />
                                    <Label htmlFor="graduate">Graduate</Label>
                                </div>
                                <div className='flex items-center space-x-2'>
                                    <RadioGroupItem value="Post Graduate" id="post-graduate" className="h-4 w-4" />
                                    <Label htmlFor="post-graduate">Post Graduate</Label>
                                </div>
                            </RadioGroup>
                        )}
                        />

                        {errors.education && (
                            <p className='text-red-500'>{errors.education.message}</p>
                        )}

                        <Input 
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="flex-1  file:text-gray-500"
                        {...register("resume")}
                        />

                        {errors.resume && (
                            <p className='text-red-500'>{errors.resume.message}</p>
                        )}

                        {errorApply?.message && (
                            <p className='text-red-500'>{errorApply?.message}</p>
                        )}
                        
                        {loadingApply && <BarLoader width={"100%"} color='#36d7d7'  />}

                        <Button type='submit' variant="blue" size="lg">
                            Apply
                        </Button>
                    </form>

                    <DrawerFooter >
                        <DrawerClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    )
}

export default applyJobDrawer
