import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown, Modal, Button } from "react-bootstrap";
import {
  House,
  Grid,
  People,
  GraphUp,
  CreditCard,
  Bank,
  ChatDots,
  Check,
} from "react-bootstrap-icons";
import Sidebar from "./AdminNav";

function Transaction() {
  const [active, setActive] = useState("Transactions");
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => setShowLogoutPopup(true);
  const confirmLogout = () => {
    localStorage.removeItem("token");
    setShowLogoutPopup(false);
    navigate("/");
  };

  return (
    <>
      <div className="d-flex">
        {/* Sidebar */}
        <Sidebar
          active={active}
          setActive={setActive}
          onLogout={handleLogout}
        />

        {/* Main Content */}
        <div className="p-4 w-100">
          <h1>Welcome to Admin Dashboard</h1>
          <p>
            Manage auctions, transactions, and user roles efficiently from this
            dashboard.
          </p>
          <h2>
            <GraphUp className="me-4" />
            Insight Statistics <hr />
          </h2>

          {/* Statistics */}
          <div className="row g-4">
            <div className="col-12 col-md-4">
              <Link to="/users">
                <div className="bg-secondary text-white p-3 rounded shadow-sm text-center">
                  <h4>
                    <People className="me-2" />
                    Users
                  </h4>
                  <h2>25</h2>
                </div>
              </Link>
            </div>
            <div className="col-12 col-md-4">
              <Link to="/managers">
                <div className="bg-secondary text-white p-3 rounded shadow-sm text-center">
                  <h4>
                    <People className="me-2" />
                    Managers
                  </h4>
                  <h2>12</h2>
                </div>
              </Link>
            </div>

            <div className="col-12 col-md-4">
              <Link to="/banks">
                <div className="bg-secondary text-white p-3 rounded shadow-sm text-center">
                  <h4>
                    <Bank className="me-2" />
                    Associated Banks
                  </h4>
                  <h2>10</h2>
                </div>
              </Link>
            </div>
          </div>

          <div className="row g-4 mt-4">
            <div className="col-12 col-md-4">
              <Link to="/in-auction">
                <div className="bg-success text-white p-3 rounded shadow-sm text-center">
                  <h4>
                    <Grid className="me-2" />
                    Number of Auctions
                  </h4>
                  <h2>350</h2>
                </div>
              </Link>
            </div>
            <div className="col-12 col-md-4">
              <Link to="/transaction">
                <div className="bg-secondary text-white p-3 rounded shadow-sm text-center">
                  <h4>
                    <CreditCard className="me-2" />
                    Transactions Made
                  </h4>
                  <h2>8</h2>
                </div>
              </Link>
            </div>
            <div className="col-12 col-md-4">
              <Link to="/messages">
                <div className="bg-primary text-white p-3 rounded shadow-sm text-center">
                  <h4>
                    <ChatDots className="me-2" />
                    Messages
                  </h4>
                  <h2>15</h2>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal show={showLogoutPopup} onHide={() => setShowLogoutPopup(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to sign out?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLogoutPopup(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmLogout}>
            Sign out
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Transaction;
