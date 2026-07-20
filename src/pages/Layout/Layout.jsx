import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../component/Navbar'
import Sidebar from '../component/Sidebar'
import { Navbar } from '@heroui/react'
export default function Layout() {
  return (
    <div>
          <div className=' md:flex'>
            <div className='md:w-[315px] md:shrink-0'>
              <Sidebar/>
            </div>
            <div className="md:flex-1 md:min-w-0 bg-[#ECEFF3] dark:bg-slate-950 min-h-screen">          
              <Header/>
              <Outlet/>
            </div>
               
          </div>
    </div>
  )
}