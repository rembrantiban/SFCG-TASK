import React from 'react'
import Header from '../component/common/header';

const addtask = () => {
       const user = {
        firstName: localStorage.getItem("userFirstName") || "",
        lastName: localStorage.getItem("userLastName") || "",
        role: localStorage.getItem("userRole") || "",
  };
  return (
    <div>
        <Header
        title="Add Task"
        subtitle={`Ready to add a new task, ${user.firstName} ${user.lastName}?`}
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
  )
}

export default addtask