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
import Sidebar from "./AdminNav";

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
      const response = await axios.get(
        "http://localhost:5000/api/manager/allmanagers"
      );
      setManagers(response.data);
    } catch (error) {
      console.error("Error fetching managers:", error);
    }
  };

  const [editManager, setEditManager] = useState<Manager | null>(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [managerToDelete, setManagerToDelete] = useState<Manager | null>(null);

  const [editConfirmPopup, setEditConfirmPopup] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");

  const handleEditClick = (manager: Manager) => {
    setEditManager(manager);
    setUpdateMessage("");
    setShowEditPopup(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditConfirmPopup(true);
  };

  const confirmUpdate = async () => {
    if (!editManager) return;
    try {
      await axios.put(
        `http://localhost:5000/api/manager/${editManager._id}`,
        editManager
      );
      setUpdateMessage("Manager updated successfully.");
      setShowEditPopup(false);
      setEditConfirmPopup(false);
      fetchManagers(); // Refresh
    } catch (error) {
      setUpdateMessage("Failed to update manager.");
      console.error("Error updating manager:", error);
    }
  };

  const handleDelete = (manager: Manager) => {
    setManagerToDelete(manager);
    setDeleteMessage("");
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    if (!managerToDelete) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/manager/del/${managerToDelete._id}`
      );
      setDeleteMessage("Manager deleted successfully.");
      setShowDeletePopup(false);
      fetchManagers();
    } catch (error) {
      setDeleteMessage("Failed to delete manager.");
      console.error("Error deleting manager:", error);
    }
  };

  const [banks, setBanks] = useState([]);

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/bank/bank");
      setBanks(response.data);
    } catch (error) {
      console.error("Error fetching banks:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/manager/register",
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
          {updateMessage && (
            <p className="alert alert-success">{updateMessage}</p>
          )}
          {deleteMessage && (
            <p className="alert alert-danger">{deleteMessage}</p>
          )}

          {/* Statistics */}
          <div className="row g-4">
            <div className="col-12 col-md-6">
              <Link to="/cb-ad/managers">
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
              <Link to="/cb-ad/banks">
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
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-warning"
                        size="sm"
                        onClick={() => handleEditClick(manager)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(manager)}
                      >
                        Delete
                      </Button>
                    </div>
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

      {/* Edit Manager */}
      <Modal show={showEditPopup} onHide={() => setShowEditPopup(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Manager</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editManager && (
            <Form onSubmit={handleUpdate}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={editManager.name}
                  onChange={(e) =>
                    setEditManager({ ...editManager, name: e.target.value })
                  }
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <InputGroup>
                  <InputGroup.Text>+977</InputGroup.Text>
                  <Form.Control
                    type="text"
                    value={editManager.phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 10) {
                        setEditManager({ ...editManager, phone: value });
                      }
                    }}
                    required
                    placeholder="Enter 10-digit number"
                  />
                </InputGroup>
                {editManager.phone.length !== 10 &&
                  editManager.phone.length > 0 && (
                    <p className="text-danger mt-1">
                      Phone number must be 10 digits
                    </p>
                  )}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Bank Code</Form.Label>
                <Form.Control
                  type="text"
                  value={editManager.bank}
                  onChange={(e) =>
                    setEditManager({ ...editManager, bank: e.target.value })
                  }
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="text"
                  value={editManager.email}
                  onChange={(e) =>
                    setEditManager({ ...editManager, email: e.target.value })
                  }
                  required
                />
              </Form.Group>
              <Button variant="success" type="submit">
                Save Changes
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showDeletePopup} onHide={() => setShowDeletePopup(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete{" "}
          <strong>{managerToDelete?.name}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeletePopup(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={editConfirmPopup} onHide={() => setEditConfirmPopup(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Edit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to update this manager’s information?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setEditConfirmPopup(false)}
          >
            Cancel
          </Button>
          <Button variant="success" onClick={confirmUpdate}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Managers;
