import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

interface SidebarProps {
  name?: string;
  email?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ name, email }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("userInfo");
    Cookies.remove("token");
    navigate("/");
  };

  const renderTab = (key: string, label: string) => (
    <li
      className={`list-group-item d-flex align-items-center rounded-pill mb-2 ${
        activeTab === key
          ? "bg-secondary-subtle text-dark"
          : "bg-white text-secondary border-secondary"
      }`}
      role="button"
      onClick={() => setActiveTab(key)}
      style={{ cursor: "pointer" }}
    >
      <span className="me-2 text-secondary">•</span>
      <span>{label}</span>
    </li>
  );

  return (
    <>
      <div
        className="d-flex flex-column p-3 rounded bg-light border border-dark"
        style={{
          minHeight: "85vh",
        }}
      >
        <div className="text-center mb-3">
          <i
            className="bi bi-person-circle mb-2"
            style={{ fontSize: "4rem", color: "#6c757d" }}
          ></i>
          <h5>{name || "Guest"}</h5>
          <p className="text-muted">{email}</p>
        </div>

        <ul className="list-group border-0 mb-auto">
          {renderTab("profile", "Personal Profile")}
        </ul>

        <button
          className="btn btn-outline-danger mt-auto w-100 rounded-pill"
          onClick={() => setShowLogoutPopup(true)}
        >
          Log Out
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutPopup && (
        <div
          className="modal d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Logout</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowLogoutPopup(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to log out?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowLogoutPopup(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleLogout}
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
