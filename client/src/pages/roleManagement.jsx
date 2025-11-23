import React from 'react'
import Header from '../component/common/header';
import DepartmentList from '../component/department/departmentlist';

const roleManagement = () => {
     const user = {
    firstName: localStorage.getItem("userFirstName") || "",
    lastName: localStorage.getItem("userLastName") || "",
    role: localStorage.getItem("userRole") || "",
  };
  return (
    <div>
        <Header
        title="Department Management"
        subtitle={`Here's all the Department List ${user.firstName} ${user.lastName}!`}
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

      <div className="w-full px-10">
  {/* Header Section */}
  <div className="bg-gradient-to-b from-gray-900 to-gray-700 text-white p-6 rounded-xl shadow mb-5">
    <h1 className="text-2xl font-bold flex items-center gap-2">
      🏢 Department Management
    </h1>
    <p className="text-gray-300 text-sm mt-1">
      Manage, organize, and update all departments within the organization.
    </p>
  </div>

  <DepartmentList />
</div>

    </div>
  )
}

export default roleManagement