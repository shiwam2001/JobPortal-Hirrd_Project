import { zodResolver } from '@hookform/resolvers/zod'

import React, { useEffect } from 'react'
import { z } from 'zod'
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
import { useForm } from 'react-hook-form'
import { Button } from './ui/button'
import { Input } from './ui/input'
import addNewCompany from '@/api/apiNewCompany'
import useFetch from '@/hooks/use-fetch'
import { BarLoader } from 'react-spinners'

const schema = z.object({
    name: z.string().min(1, { message: "Company name is required" }),
    logo: z.any().refine((file) => file[0] && (
        file[0].type === "image/png" ||
        file[0].type === "image/jpeg"),
        {
            message: "Please upload a valid logo (PNG or JPEG)",
        }
    )
})

const addCompanyDrawer = ({ fetchCompanies }) => {

    const { register, handleSubmit, formState: { errors }
    } = useForm({
        resolver: zodResolver(schema),
    })

    const {
         loading:loadingAddCompany,
         error:errorAddCompany,
         data: dataAddCompany,
         fn: fnAddCompany } = useFetch(addNewCompany)

    const onSubmit =async (data) => {
        fnAddCompany({
            ...data,
            logo:data.logo[0]
        })
    }

    useEffect(()=>{
        if(dataAddCompany?.length>0) {
            fetchCompanies(); // Fetch companies after adding a new one
        }
    },[dataAddCompany])

    return (
        <div >
            <Drawer >
                <DrawerTrigger asChild>
                    <Button type="button" size='sm' variant="secondary">Add company</Button>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Add a New Company</DrawerTitle>

                    </DrawerHeader>
                    <form className='flex gap-2 pb-0' >
                        <Input placeholder="Company name" {...register("name")} />
                        <Input
                            type="file"
                            accept="image/*"
                            className="file:text-gray-500"
                            {...register("logo")}
                        />
                        <Button
                            type="submit"
                            onClick={handleSubmit(onSubmit)}
                            variant="destructive"
                            className="w-40"
                        >Add
                        </Button>
                    </form>

                    {errors.name && <p>{errors.name.message}</p>}
                    {errors.logo && <p>{errors.logo.message}</p>}
                    {errorAddCompany?.message && <p className='text-red-500'>{errorAddCompany}</p>}
                    {loadingAddCompany && <BarLoader width={"100%"} color='#36d7d7' />}
                    <DrawerFooter>

                        <DrawerClose asChild>
                            <Button type="button" variant="secondary">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    )
}

export default addCompanyDrawer
