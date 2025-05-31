import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/header'
const app_layout = () => {
  return (
    <div >
      <div className="grid-background"></div>
      <main className='min-h-screen m-auto container' >
      <Header/>
      <Outlet />
      </main>
      <div className='p-10 text-2xl text-center bg-gray-800 mt-10'>
           Made with ❤️ by Shiwam 
      </div>
    </div>
  )
}

export default app_layout
