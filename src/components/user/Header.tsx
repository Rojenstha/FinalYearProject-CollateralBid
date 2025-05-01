import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Modal, Button, Dropdown } from "react-bootstrap";
import { Bell, Person, MenuDown } from "react-bootstrap-icons";
import axios from "axios";
import logo from "../../assets/logo.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Header = () => {
  const [user, setUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  // Fetch user data using cookie
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/user/user", { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Error fetching user:", err));
  }, []);

  const handleLogout = () => setShowPopup(true);

  const confirmLogout = () => {
    axios
      .post("http://localhost:5000/logout", {}, { withCredentials: true })
      .then(() => {
        localStorage.removeItem("token"); // Clear token from localStorage
        setShowPopup(false);
        toast.success("Signed out successfully!", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => navigate("/"), 2500); // Delay navigation to show toast
      })
      .catch((err) => console.error("Logout error:", err));
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
        <a className="navbar-brand" href="#">
          <img src={logo} alt="Logo" width="150" height="70" />
        </a>

        <div className="dropdown ms-3">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
          >
            <MenuDown className="me-2" /> Menu
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
          <Dropdown>
            <Dropdown.Toggle
              variant="dark"
              className="d-flex align-items-center text-white border-0"
            >
              <Person className="me-2" />
              <strong>{user ? user.name : "User"}</strong>
            </Dropdown.Toggle>
            <Dropdown.Menu className="bg-dark text-white">
              <Dropdown.Item
                as={Link}
                to="/user-dashboard"
                className="text-secondary"
              >
                Profile
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout} className="text-danger">
                Sign out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </nav>

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

      <ToastContainer />
    </>
  );
};

export default Header;
