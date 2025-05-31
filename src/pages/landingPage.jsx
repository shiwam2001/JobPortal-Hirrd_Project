import { Button } from '@/components/ui/button'
import React from 'react'
import { Link } from 'react-router-dom'
import Companies from '@/data/companies.json'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Faqs from '@/data/faq.json'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const landingpage = () => {

 

  return (
    <main className='flex flex-col  gap-10  sm:gap-20 py-20 sm:py-20 '>
      <section className='text-center '>
        <h1 className='flex flex-col items-center justify-center gradient-title text-4xl font-extrabold sm:text-6xl lg:text-8xl tracking-tighter py-4   '>Find Your Dream Job <span className='flex items-center gap-2 '> and get {' '} <img src="/logo.png" alt="Hirrd Logo " className='h-14 sm:h-24 lg:h-32' /></span></h1>

        <p className='text-lg sm:text-2xl lg:text-3xl text-gray-500 font-semibold py-4'>Join our community of talented professionals and take your career to the next level.</p>

        <div>

        </div>
      </section>

      <div className='flex mx-auto flex-col justify-center sm:flex-row gap-4 sm:gap-10  '>
        <Link to="/jobs">
          <Button size="xl" variant="blue">Find Jobs</Button>
        </Link>
        <Link to="/post-job">
          <Button variant="red" size="xl">Post a job</Button>
        </Link>
      </div>

      <Carousel plugins={[Autoplay({delay:2000, stopOnInteraction:true})]} className="w-full py-10 ">
        <CarouselContent className=" flex gap-5 sm:gap-20 items-canter  ">
          {Companies.map(({id,path,name}) => {
            return (
              <CarouselItem key={id} className=" basis-1/3 lg:basis-1/6 " >
                <img
                  src={path}
                  alt={name}
                  className="h-9 sm:h-14 object-contain" />
              </CarouselItem>
            )
          }
          )}
        </CarouselContent>
      </Carousel>

      {/* banner */}
        
      <img src="/banner.jpeg" alt="" />


<section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 p-10'>
  <Card>
  <CardHeader>
    <CardTitle>For Job Seekers</CardTitle>
    
  </CardHeader>
  <CardContent>
    <p>Search and apply for jobs, track application and more. </p>
  </CardContent>

</Card>

<Card>
  <CardHeader>
    <CardTitle>For Employers</CardTitle>
    
  </CardHeader>
  <CardContent>
   <p>Post jobs, manage applictions and find the best candidates.</p>
  </CardContent>

</Card>
</section>

<Accordion type="single" collapsible>
  {Faqs.map((faq,index) => {
    return (
      <AccordionItem key={index} value={`item-${index+1}`}>
        <AccordionTrigger>{faq.question}</AccordionTrigger>
        <AccordionContent>
          {faq.answer}
        </AccordionContent>
      </AccordionItem>
    )
  }
  )}
</Accordion>


    </main>
  )
}

export default landingpage
