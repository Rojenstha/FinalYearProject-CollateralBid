import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import logo from "../assets/logo.png";
import background from "../assets/bg.jpg";
import { Dropdown, Modal, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Person, MenuDown, GraphUpArrow } from "react-bootstrap-icons";

const DashboardNavbar = () => {
  const [user, setUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/user", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        console.log("User data:", response.data);
        setUser(response.data);
      })
      .catch((error) => console.error("Error fetching user data:", error));
  }, []);

  const handleLogout = () => {
    setShowPopup(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    setShowPopup(false);
    navigate("/");
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
        <a className="navbar-brand" href="#">
          <img
            src={logo}
            alt="Logo"
            width="150"
            height="70"
            className="d-inline-block align-top"
          />
        </a>

        <div className="dropdown ms-3">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <MenuDown className="me-2" />
            Menu
          </button>
          <ul className="dropdown-menu">
            <li>
              <a className="dropdown-item" href="#about-us">
                About Us
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#auction">
                Auction
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#contact">
                Contact
              </a>
            </li>
          </ul>
        </div>

        <div className="ms-auto d-flex align-items-center">
          <button className="btn btn-outline-dk me-2">
            <i className="bi bi-bell"></i> <Bell className="me-2" />
            Notifications
          </button>
          {/* {user ? (
            <div className="d-flex align-items-center text-dk">
              <img
                src={user.profilePic || "/default-profile.png"}
                alt="Profile"
                width="30"
                height="30"
                className="rounded-circle me-2"
              />
              <span>{user.name}</span>
            </div>
          ) : (
            <span className="text-light">Loading...</span>
          )} */}
          <Dropdown>
            <Dropdown.Toggle
              variant="dark"
              className="d-flex align-items-center text-white border-0"
            >
              <Person className="me-2" />
              {/* <img
                src="https://via.placeholder.com/40"
                alt="Profile"
                width="40"
                height="40"
                className="rounded-circle me-2"
              /> */}
              <strong>User</strong>
            </Dropdown.Toggle>
            <Dropdown.Menu className="bg-dark text-white">
              <Dropdown.Item as={Link} to="/profile" className="text-secondary">
                Profile
              </Dropdown.Item>
              <Dropdown.Item
                as={Link}
                to="/settings"
                className="text-secondary"
              >
                Settings
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout} className="text-danger">
                Sign out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </nav>
      {/* Logout Confirmation Modal */}
      <Modal show={showPopup} onHide={() => setShowPopup(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to sign out?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPopup(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmLogout}>
            Sign out
          </Button>
        </Modal.Footer>
      </Modal>
      <div
        className="container-fluid text-light d-flex align-items-center justify-content-left text-left"
        style={{
          minHeight: "80vh",
          width: "100%",
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          //backgroundAttachment: "fixed",
          backgroundBlendMode: "darken",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <div className="container">
          <h1 className="pb-5" style={{ fontSize: "5rem", fontWeight: "bold" }}>
            Welcome to CollateralBid!
          </h1>
          <p className="fs-3">
            Discover amazing auctions, bid on your favorite items, and enjoy the
            thrill of winning! Explore unique items and win exclusive deals.
          </p>

          {/* Button below paragraph */}
          <a className="btn btn-outline-light mt-3" href="#auction">
            <GraphUpArrow className="me-2" />
            View Auctions
          </a>
        </div>
      </div>

      {/* Auction Section */}
      <div
        id="auction"
        className="container-fluid text-dk d-flex align-items-center justify-content-left text-left"
      >
        <div className="row align-items-center">
          <div>
            <h1 className="fw-bold">
              <GraphUpArrow className="me-2" />
              Auction
            </h1>
          </div>
          <div>
            <p className="fs-4">
              Browse our exciting auction listings, place your bids, and get
              ready to win amazing products!
            </p>
          </div>
        </div>
      </div>

      {/* Contact*/}
      <div
        id="contact"
        className="container-fluid text-dk d-flex align-items-center justify-content-left text-left"
      >
        <div className="row">
          <div className="col-md-6">
            <h2 className="fw-bold">
              {" "}
              <Person className="me-2" />
              Contact Us
            </h2>
            <p>
              Get in touch with us for any inquiries, support, or feedback. We
              are here to assist you!
            </p>
            <form>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Your Name"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Your Email"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Comment</label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Your Message"
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white text-center p-3">
        &copy; {new Date().getFullYear()} Auction Platform. All rights reserved.
      </footer>
    </div>
  );
};

export default DashboardNavbar;
