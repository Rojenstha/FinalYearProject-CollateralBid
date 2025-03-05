import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown, Modal, Button, Form } from "react-bootstrap";
import { House, Grid, People, Plus } from "react-bootstrap-icons";

function InAuction() {
  const [active, setActive] = useState("Products");
  const [showPopup, setShowPopup] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    name: "",
    location: "",
    image: "",
    description: "",
    type: "",
    googleMap: "",
    startDateTime: "",
    duration: "",
    startingAmount: "",
    bidIncrement: "",
  });

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log(productData);
    setShowModal(false);
  };

  const handleLogout = () => {
    setShowPopup(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    setShowPopup(false);
    navigate("/");
  };

  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 bg-dark text-white"
      style={{ width: "250px", height: "100vh" }}
    >
      <Link
        to=""
        className="d-flex align-items-center mb-3 text-white text-decoration-none"
      >
        <span className="fs-3">Collateral-Bid</span>
      </Link>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <Link
            to="/manager-dashboard"
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
              active === "Products" ? "active" : "text-white"
            }`}
            onClick={() => setActive("Products")}
          >
            <Grid className="me-2" /> In-Auction
          </Link>
        </li>
        <li>
          <Link
            to="/manager-notification"
            className={`nav-link ${
              active === "Customers" ? "active" : "text-white"
            }`}
            onClick={() => setActive("Customers")}
          >
            <People className="me-2" /> Notifications
          </Link>
        </li>
      </ul>
      <hr />
      <Button variant="primary" onClick={() => setShowModal(true)}>
        <Plus className="me-2" /> Add Product
      </Button>
      <hr />
      <Dropdown>
        <Dropdown.Toggle
          variant="dark"
          className="d-flex align-items-center text-white border-0"
        >
          <img
            src="https://via.placeholder.com/40"
            alt="Profile"
            width="40"
            height="40"
            className="rounded-circle me-2"
          />
          <strong>mdo</strong>
        </Dropdown.Toggle>
        <Dropdown.Menu className="bg-dark text-white">
          <Dropdown.Item as={Link} to="/profile" className="text-white">
            Profile
          </Dropdown.Item>
          <Dropdown.Item as={Link} to="/settings" className="text-white">
            Settings
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={handleLogout} className="text-danger">
            Sign out
          </Dropdown.Item>

          {/* logout */}
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
        </Dropdown.Menu>
      </Dropdown>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Name of Bank</Form.Label>
              <Form.Control
                type="text"
                name="name"
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                name="name"
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="name"
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="name"
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default InAuction;
