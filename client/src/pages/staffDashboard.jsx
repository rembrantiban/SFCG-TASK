import StaffHeader from "../component/staffheader/header";

const staffDashboard = () => {
  const firstName = localStorage.getItem("userFirstName") || "Staff";

  return (
    <div className="flex overflow-auto">
      <StaffHeader name={firstName} />
    </div>
  );
};

export default staffDashboard;
