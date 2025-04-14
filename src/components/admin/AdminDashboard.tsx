import { useState } from "react";
import Sidebar from "./AdminNav";
import DashboardStats from "./DashboardStats";
import LogoutModal from "./LogoutModal";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [active, setActive] = useState("Home");
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => setShowLogoutPopup(true);
  const confirmLogout = () => {
    localStorage.removeItem("token");
    setShowLogoutPopup(false);
    navigate("/cb-ad");
  };

  return (
    <>
      <div className="d-flex">
        <Sidebar
          active={active}
          setActive={setActive}
          onLogout={handleLogout}
        />
        <div className="p-4 w-100">
          <h1>Welcome to Admin Dashboard</h1>
          <p>
            Manage auctions, transactions, and user roles efficiently from this
            dashboard.
          </p>
          <DashboardStats />
        </div>
      </div>

      <LogoutModal
        show={showLogoutPopup}
        onClose={() => setShowLogoutPopup(false)}
        onConfirm={confirmLogout}
      />
    </>
  );
};

export default AdminDashboard;
