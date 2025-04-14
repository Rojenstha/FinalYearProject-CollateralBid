import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Modal, Button, Dropdown } from "react-bootstrap";
import { Person, House } from "react-bootstrap-icons";
import axios from "axios";
import logo from "../../assets/logo.png";

const UserNav = () => {
  const [user, setUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

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
        setShowPopup(false);
        navigate("/");
      })
      .catch((err) => console.error("Logout error:", err));
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
        <Link to="/home" className="navbar-brand">
          <img src={logo} alt="Logo" width="150" height="70" />
        </Link>

        <div className="ms-auto d-flex align-items-center">
          <Link to="/home" className="btn btn-dark me-2">
            <House className="me-2" /> Home
          </Link>
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
    </>
  );
};

export default UserNav;
