import React from 'react'
import Header from '../component/common/header'
import { motion  } from 'framer-motion'
import UserTable from '../component/Table/userTable'


const user = () => {

   const user = {
    firstName: localStorage.getItem("userFirstName") || "",
    lastName: localStorage.getItem("userLastName") || "",
    role: localStorage.getItem("userRole") || "",
  };
  return (
    <div className=''>
             <div className="h-screen dark:bg-gray-900 ">
           <div className="relative z-10 flex flex-col">
         <Header
        title="User Management"
        subtitle="Manage all employee information, update profiles and monitor activity here"
        actions={
          <div className="flex items-center gap-3  rounded-lg px-3 py-1.5 shadow hover:shadow-md transition cursor-pointer">
            <img
              src={user.image || "avatar.png"}
              alt="profile"
              className="w-9 h-9 rounded-full border-white object-cover border-2"
            />
            <div className="text-left leading-tight">
              <p className="text-sm text-white font-semibold ">
                {user.firstName} {user.lastName}
              </p>
              <p
              className={`text-xs font-medium px-3 py-0.5 rounded-full text-center capitalize shadow-sm
              ${user.role === "Admin" ? "bg-orange-900 text-white" :
                user.role === "Staff" ? "bg-green-600 text-white" :
                "bg-amber-900 text-white"}`}
            >
              {user.role || "Admin"}
            </p>

            </div>
          </div>
        }
      />
        </div>
       <motion.div className="max-w-7xl mx-auto py-8 px-4 lg:px-8"
        initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
       >
          <UserTable /> 
          </motion.div> 
    </div>
    </div>
  )
}

export default user

