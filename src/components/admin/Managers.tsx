import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Dropdown,
  Modal,
  Button,
  Form,
  InputGroup,
  Table,
} from "react-bootstrap";
import {
  House,
  Grid,
  People,
  GraphUp,
  CreditCard,
  Bank,
  ChatDots,
  PlusCircle,
  Check,
} from "react-bootstrap-icons";
import axios from "axios";

function Managers() {
  const [active, setActive] = useState("Managers");
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bank, setBank] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  interface Manager {
    _id: string;
    name: string;
    phone: string;
    bank: string;
    email: string;
  }
  const [managers, setManagers] = useState<Manager[]>([]);

  useEffect(() => {
    fetchManagers();
  }, []);

  const fetchManagers = async () => {
    try {
      const response = await axios.get("http://localhost:3001/allmanagers");
      setManagers(response.data);
    } catch (error) {
      console.error("Error fetching managers:", error);
    }
  };

  const [editManager, setEditManager] = useState<Manager | null>(null);
  const [showEditPopup, setShowEditPopup] = useState(false);

  const handleEditClick = (manager: Manager) => {
    setEditManager(manager);
    setShowEditPopup(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editManager) return;

    try {
      await axios.put(
        `http://localhost:3001/managers/${editManager._id}`,
        editManager
      );
      setShowEditPopup(false);
      fetchManagers(); // Refresh the list
    } catch (error) {
      console.error("Error updating manager:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this manager?"))
      return;

    try {
      await axios.delete(`http://localhost:3001/managers/${id}`);
      fetchManagers(); // Refresh the list
    } catch (error) {
      console.error("Error deleting manager:", error);
    }
  };

  const [banks, setBanks] = useState([]);

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    try {
      const response = await axios.get("http://localhost:3001/allbanks");
      setBanks(response.data);
    } catch (error) {
      console.error("Error fetching managers:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/registermanager",
        {
          name,
          phone,
          bank,
          email,
          password,
        }
      );
      setMessage(response.data.message);
      fetchManagers();
    } catch (error: any) {
      setMessage(error.response?.data?.error || "Registration Failed.");
    }
  };

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
            <div className="col-12 col-md-6">
              <Link to="/managers">
                <div className="bg-secondary text-white p-3 rounded shadow-sm text-center">
                  <h4>
                    <People className="me-2" />
                    Managers
                  </h4>
                  <h2>{managers.length}</h2>
                </div>
              </Link>
            </div>

            <div className="col-12 col-md-6">
              <Link to="/banks">
                <div className="bg-secondary text-white p-3 rounded shadow-sm text-center">
                  <h4>
                    <Bank className="me-2" />
                    Associated Banks
                  </h4>
                  <h2>{banks.length}</h2>
                </div>
              </Link>
            </div>
          </div>
          {/* Add Manager Button */}
          <Button
            variant="primary"
            className="mt-4 d-flex align-items-center"
            onClick={() => setShowAddPopup(true)}
          >
            <PlusCircle className="me-2" /> Add Manager{" "}
            <People className="me-2" />
          </Button>

          {/* Managers Table */}
          <Table striped bordered hover className="mt-4">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Bank</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {managers.map((manager: Manager) => (
                <tr key={manager._id}>
                  <td>{manager.name}</td>
                  <td>{manager.phone}</td>
                  <td>{manager.bank}</td>
                  <td>{manager.email}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => handleEditClick(manager)}
                    >
                      Edit
                    </Button>{" "}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(manager._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      {/* Logout Confirmation */}
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

      {/* Add Manager */}
      <Modal show={showAddPopup} onHide={() => setShowAddPopup(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Manager</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {message && <p className="alert alert-info">{message}</p>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <InputGroup>
                <InputGroup.Text>+977</InputGroup.Text>
                <Form.Control
                  type="text"
                  name="number"
                  value={phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 10) {
                      setPhone(value);
                    }
                  }}
                  required
                  placeholder="Enter 10-digit number"
                />
              </InputGroup>
              {phone.length !== 10 && phone.length > 0 && (
                <p className="text-danger mt-1">
                  Phone number must be 10 digits
                </p>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Bank Code</Form.Label>
              <Form.Control
                type="text"
                name="bankCode"
                onChange={(e) => setBank(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="success" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Managers;
