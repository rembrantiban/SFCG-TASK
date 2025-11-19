import React, { useState } from 'react'
import { Login } from '../modal/Login'
import Logo from '../../assets/logo.png'

const Navbar = () => {

  return (
    <div className='bg-gray-900'>   
      <nav className="bg-gray border-gray-900 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between  mx-auto p-4">
          <div className='flex items-center gap-1 '>
          <img src={Logo} className='size-10'/>
          <a className="flex items-center space-x-3 rtl:space-x-reverse">
            <span className="self-start lg:text-2xl font-semibold whitespace-nowrap text-white text-sm
             sm:text-sm md:text-lg">SFCG-STAFF MANAGEMENT SYSTEM</span>
          </a>
        </div>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">  
            <Login/>
          </div>
          
        </div>
      </nav>
    </div>
  )
}

export default Navbar