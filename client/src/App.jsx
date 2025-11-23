import "./App.css";
import Home from "./pages/Home";
import Dashboard from "./pages/dashboard.jsx";
import { Toaster } from "react-hot-toast";
import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./component/sidebar/sidebar";
import { useState } from "react";
import User from "./pages/user.jsx";
import RegisterForm from "./pages/register.jsx";
import About from "./pages/about.jsx";
import StaffDashboard from "./pages/staffDashboard.jsx";
import UserRequestpage from "./pages/userRequestpage.jsx";
import RoleManagement from "./pages/roleManagement.jsx";
import Addtask from "./pages/addtask.jsx";
import RequestCoordinator from "./pages/taskCoordinator/requestCoordinator.jsx";
import RequestCollege from "./pages/collegePresident/requestCollege.jsx"
import Todoworks from "./pages/todoworks.jsx";
import AdminProfile from "./pages/adminProfile.jsx";
import UserProfile from "./pages/userProfile.jsx";
import AssignedTaskPage from "./pages/assignTaskPage.jsx";
import AllRequest from "./pages/allreaquest.jsx";
import Assignlist from "./pages/assignlist.jsx";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const hideSidebarRoutes = ["/", "/register", "/about", "/staffdashboard", "/userRequest", "/request/taskcoordinator", "/request/taskpresident", "/todowork", "/adminprofile", "/user/profile","/allassign" ]; 

  const shouldShowSidebar = !hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-y-auto">
      
      {shouldShowSidebar && (
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      )}

      <div
        className={`transition-all duration-300 flex-1
        ${shouldShowSidebar ? (sidebarOpen ? "md:ml-64 ml-20" : "ml-20") : "ml-0"}`}
      >
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/user" element={ <User />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="about" element={ <About />} />
          <Route path="staffdashboard" element={<StaffDashboard />} />
          <Route path="/userRequest" element={<UserRequestpage /> } />
          <Route path="/role" element={<RoleManagement /> } />
          <Route path="/addtask" element={<Addtask /> } />
          <Route path="/request/taskcoordinator" element={<RequestCoordinator />} />
          <Route path="/request/taskpresident" element={<RequestCollege />} />
          <Route path="/todowork" element={<Todoworks />} />
          <Route path="adminprofile" element={<AdminProfile />} />
          <Route path="/user/profile" element={<UserProfile />} />
          <Route path="/assignpage" element={<AssignedTaskPage />} />          
          <Route path="/allrequest" element={<AllRequest />} />
          <Route path="/allassign" element={<Assignlist />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
