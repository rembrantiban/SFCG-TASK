import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import StaffHeader from "../component/staffheader/header";
import WorkOrderRequestModal from "../component/modal/WorkOrderRequestModal";
import { FilePlus } from "lucide-react";
import UserRequest from "../component/userRequest/userRequest";

const UserRequestPage = () => {
      const [isModalOpen, setIsModalOpen] = useState(false);
    const handleSubmitRequest = (data) => {
    console.log("NEW REQUEST DATA:", data);
    setIsModalOpen(false);
  };

    const firstName = localStorage.getItem("userFirstName") || "Staff";
  return (
    <div className="w-full h-auto">
        <StaffHeader name={firstName} />
      {/* Header */}
      <div className="px-15 py-5 ">
       <motion.div
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
  className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-lg border border-gray-700/60 rounded-xl px-6 py-5 mb-6"
>
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 text-white">
    {/* Left Section */}
    <div className="flex items-center gap-3">
      <span className="p-2 bg-blue-600 rounded-lg shadow">
        <FileText size={22} />
      </span>
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-wide">
          Request Management
        </h1>
        <p className="text-sm text-gray-300 mt-1">
          Submit, track, and manage all your work order requests efficiently.
        </p>
      </div>
    </div>

    {/* Right Button */}
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setIsModalOpen(true)}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md self-start sm:self-auto"
    >
      <FilePlus size={18} /> Create Work Order
    </motion.button>
  </div>

  {/* Modal */}
  <WorkOrderRequestModal 
    isOpen={isModalOpen} 
    onClose={() => setIsModalOpen(false)}
    onSubmit={handleSubmitRequest}
  />
    </motion.div>
      </div>
        <div className="px-20 h-auto ">
             <div className="bg-gray-200 px-20 shadow-2xl rounded-2xl">
                <UserRequest />
                </div>
        </div>
    </div>
  );
};

export default UserRequestPage;
