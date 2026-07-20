import React from 'react'
export default function Settings() {
  return (
    <div className="min-h-screen w-full bg-[#F1F5F9] dark:bg-slate-950 flex items-start justify-center p-8">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-800 mt-8 max-w-[1400px] w-full">
        <h2 className='text-cyan-400 text-xs tracking-[3px] uppercase'>Settings</h2>
        <h1 className='text-2xl text-gray-800 dark:text-white mt-2 font-semibold'>Preferences and integrations</h1>
        
         <p className='text-gray-500 dark:text-slate-400 mt-2'> Theme mode, API credentials, and dashboard preferences are managed here.</p>
        
      </div>
    </div>
  )
}