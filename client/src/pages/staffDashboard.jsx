import StaffHeader from "../component/staffheader/header";
import StaffAnalytics from "../component/staffAnalytics/StaffAnalytics";
const staffDashboard = () => {
  const firstName = localStorage.getItem("userFirstName") || "Staff";

  return (
    <div className="w-full overflow-auto min-h-screen bg-gray-100">
      <StaffHeader name={firstName} />

      {/* Modern Analytics Section */}
      <div className="p-6 max-w-7xl mx-auto">
        <StaffAnalytics />
      </div>
    </div>
  );
};

export default staffDashboard;
