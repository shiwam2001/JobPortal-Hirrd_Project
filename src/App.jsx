import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppLayout from './layouts/appLayout'
import LandingPage from './pages/landingPage'
import Onboarding from './pages/onboarding'
import JobListing from './pages/job_listing'
import Jobpage from './pages/job'
import Postjob from './pages/post-job'
import Savedjobs from './pages/saved-job'
import MyJobs from './pages/my-jobs'
import './App.css'
import { ThemeProvider } from './components/theme-provider'
import Protected_Route from './components/protected-route'

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children:[
      {
        path: '/',
        element: <LandingPage/>,
      },
      {
        path: '/onboarding',
        element: 
        <Protected_Route>
          <Onboarding />
        </Protected_Route>
       
      },
      {
        path: '/jobs',
        element:<Protected_Route>
         <JobListing />
      </Protected_Route>
      },
      {
        path: '/job/:id',
        element: <Protected_Route>
          <Jobpage />
        </Protected_Route>

      },
      {
        path: '/post-job',
        element:<Protected_Route>
        <Postjob />
      </Protected_Route>  ,
      },
      {
        path: '/saved-jobs',
        element: <Protected_Route>
        <Savedjobs />
      </Protected_Route>,
      },
      {
        path: '/my-jobs',
        element:
        <Protected_Route>
        <MyJobs />
      </Protected_Route> ,
      }
    ]
  }
])

const App = () => {
  
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
       <RouterProvider router={router} />
    </ThemeProvider>
  )
}
export default App

