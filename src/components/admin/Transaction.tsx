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
        <div
          className="d-flex flex-column flex-shrink-0 p-3 bg-dark text-white"
          style={{ width: "250px", height: "100vh" }}
        >
          <Link
            to=""
            className="d-flex align-items-center mb-3 text-white text-decoration-none"
          >
            <img
              src="/src/assets/logo2.png"
              alt="Logo"
              width="211"
              height="72"
            />
          </Link>
          <hr />
          <ul className="nav nav-pills flex-column mb-auto">
            <li className="nav-item">
              <Link
                to="/admin-dashboard"
                className={`nav-link ${
                  active === "Home" ? "active" : "text-white"
                }`}
                onClick={() => setActive("Home")}
              >
                <House className="me-2" /> Home
              </Link>
            </li>
            <li>
              <Link
                to="/in-auction"
                className={`nav-link ${
                  active === "In-Auction" ? "active" : "text-white"
                }`}
                onClick={() => setActive("In-Auction")}
              >
                <Grid className="me-2" /> In-Auction
              </Link>
            </li>
            <li>
              <Link
                to="/transaction"
                className={`nav-link ${
                  active === "Transactions" ? "active" : "text-white"
                }`}
                onClick={() => setActive("Transactions")}
              >
                <CreditCard className="me-2" /> Transactions
              </Link>
            </li>
            <li>
              <Link
                to="/banks"
                className={`nav-link ${
                  active === "Banks" ? "active" : "text-white"
                }`}
                onClick={() => setActive("Banks")}
              >
                <Bank className="me-2" /> Associated Banks
              </Link>
            </li>
            <li>
              <Link
                to="/managers"
                className={`nav-link ${
                  active === "Managers" ? "active" : "text-white"
                }`}
                onClick={() => setActive("Managers")}
              >
                <People className="me-2" /> Managers
              </Link>
            </li>
            <li>
              <Link
                to="/users"
                className={`nav-link ${
                  active === "Customers" ? "active" : "text-white"
                }`}
                onClick={() => setActive("Customers")}
              >
                <People className="me-2" /> Customers
              </Link>
            </li>
            <li>
              <Link
                to="/verifyauctions"
                className={`nav-link ${
                  active === "VerifyAuction" ? "active" : "text-white"
                }`}
                onClick={() => setActive("VerifyAuction")}
              >
                <GraphUp className="me-2" /> Verfiy Auction
              </Link>
            </li>
            <li>
              <Link
                to="/verifyusers"
                className={`nav-link ${
                  active === "VerifyUser" ? "active" : "text-white"
                }`}
                onClick={() => setActive("VerifyUser")}
              >
                <Check className="me-2" /> Verify Users
              </Link>
            </li>
            <li>
              <Link
                to="/messages"
                className={`nav-link ${
                  active === "Messages" ? "active" : "text-white"
                }`}
                onClick={() => setActive("Messages")}
              >
                <ChatDots className="me-2" /> Messages
              </Link>
            </li>
          </ul>
          <hr />
          <Dropdown>
            <Dropdown.Toggle
              variant="dark"
              className="d-flex align-items-center text-white border-0"
            >
              <strong>Admin</strong>
            </Dropdown.Toggle>
            <Dropdown.Menu className="bg-dark text-white">
              <Dropdown.Item as={Link} to="/" className="text-secondary">
                Change Username
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/" className="text-secondary">
                Change Password
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout} className="text-danger">
                Sign out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

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
