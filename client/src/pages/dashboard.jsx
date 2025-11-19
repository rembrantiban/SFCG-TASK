import React, { useState, useEffect } from 'react'
import Header from '../component/common/header.jsx'
import StatsCards from '../component/statcard/statCards.jsx';
import MetricsBarChart from '../component/analytics/metricsBarChart .jsx';
import MetricsLineChart from '../component/analytics/metricsLineChart.jsx';
import SkillsChart from '../component/analytics/skillsChart.jsx';
import axiosInstance from '../lib/axios.js';

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);  
  const [totalRequests, setTotalRequests] = useState(0);
    const [totalAssigned, setTotalAssigned] = useState(0);


  useEffect(() => {
  const fetchAssigned = async () => {
    try {
      const res = await axiosInstance.get("/assign/totalassigned");
      setTotalAssigned(res.data.totalAssigned || 0);
      console.log("Total Assigned:", res.data.totalAssigned);
    } catch (error) {
      console.warn("Error fetching assigned count:", error);
    }
  };

  fetchAssigned();
}, []);

 useEffect(() => {
  const fetchRequests = async () => {
    try {
      const res = await axiosInstance.get("/request/count"); 
      setTotalRequests(res.data.totalRequests || 0);
      console.log("Total Requests:", res.data.totalRequests);
    } catch (error) {
      console.warn("Error fetching request count:", error);
    }
  };

  fetchRequests();
}, []);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/auth/totaluserscount");
      setTotalUsers(response.data.totalUsers || 0);
      console.log(response.data.totalUsers);
    } catch (error) {
      console.warn("Error while fetching users", error);
    }
  };
  fetchData();
}, []);



  
  const user = {
    firstName: localStorage.getItem("userFirstName") || "",
    lastName: localStorage.getItem("userLastName") || "",
    role: localStorage.getItem("userRole") || "",
    depart: localStorage.getItem("userDepart") || "",
  };

  return (
    <div>
      <Header
        title="Dashboard"
        subtitle={`Welcome back ${user.firstName} ${user.lastName}!`}
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

      <div className='px-20 w-full'>
        <StatsCards
        totalUsers={totalUsers}
        totalTasks={35}
        totalRequest={totalRequests}
        totalAssigned={totalAssigned}
      />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 px-20 mt-8 pb-4">
        <MetricsLineChart />
        <MetricsBarChart />
        <SkillsChart />
      </div>
    </div>
  )
}

export default Dashboard
