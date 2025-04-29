import { useState } from "react";
import { GraphUp } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import Sidebar from "./MSidebar";
import DashboardStats from "./MDashboardStats";
import LogoutModal from "./MLogoutModal";

const Transaction = () => {
  const [active, setActive] = useState("Transaction");
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const confirmLogout = () => {
    localStorage.removeItem("token");
    setShowLogoutPopup(false);
    navigate("/");
  };

  return (
    <div className="d-flex">
      <Sidebar
        active={active}
        setActive={setActive}
        onLogout={() => setShowLogoutPopup(true)}
      />

      <div className="p-4 w-100">
        <h1>Welcome to Manager Dashboard</h1>
        <p>Manage auctions, transactions efficiently from this dashboard.</p>
        <h2>
          <GraphUp className="me-4" />
          Insight Statistics <hr />
        </h2>
        <DashboardStats />
      </div>

      <LogoutModal
        show={showLogoutPopup}
        onCancel={() => setShowLogoutPopup(false)}
        onConfirm={confirmLogout}
      />
    </div>
  );
};

export default Transaction;
