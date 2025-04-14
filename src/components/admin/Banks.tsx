import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Button, Form, InputGroup, Table } from "react-bootstrap";
import { Bank, People, GraphUp, PlusCircle } from "react-bootstrap-icons";
import axios from "axios";
import Sidebar from "./AdminNav";

function Banks() {
  const [active, setActive] = useState("Banks");
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const [banks, setBanks] = useState<any[]>([]);
  const [managers, setManagers] = useState<any[]>([]);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [contact, setContact] = useState("");
  const [bankToEdit, setBankToEdit] = useState<any | null>(null);
  const [bankToDelete, setBankToDelete] = useState<any | null>(null);

  useEffect(() => {
    fetchBanks();
    fetchManagers();
  }, []);

  const fetchBanks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/bank/bank");
      setBanks(response.data);
    } catch (error) {
      console.error("Error fetching banks:", error);
    }
  };

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

  const handleLogout = () => setShowLogoutPopup(true);
  const confirmLogout = () => {
    localStorage.removeItem("token");
    setShowLogoutPopup(false);
    navigate("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/bank/register",
        {
          name,
          code,
          contact,
        }
      );
      setMessage(response.data.message);
      fetchBanks();
    } catch (error: any) {
      setMessage(error.response?.data?.error || "Registration Failed.");
    }
  };

  const handleEditClick = (bank: any) => {
    setBankToEdit(bank);
    setName(bank.name);
    setCode(bank.code);
    setContact(bank.contact);
    setShowEditPopup(true);
  };

  const handleDeleteClick = (bank: any) => {
    setBankToDelete(bank);
    setShowDeletePopup(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankToEdit) return;
    try {
      const response = await axios.put(
        `http://localhost:5000/api/bank/${bankToEdit._id}`,
        {
          name,
          code,
          contact,
        }
      );
      setMessage("Bank updated successfully.");
      setShowEditPopup(false);
      fetchBanks();
    } catch (error: any) {
      setMessage("Failed to update bank.");
      console.error("Error updating bank:", error);
    }
  };

  const handleDelete = async () => {
    if (!bankToDelete) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/bank/del/${bankToDelete._id}`
      );
      setMessage("Bank deleted successfully.");
      setShowDeletePopup(false);
      fetchBanks();
    } catch (error: any) {
      setMessage("Failed to delete bank.");
      console.error("Error deleting bank:", error);
    }
  };

  return (
    <>
      <div className="d-flex">
        <Sidebar
          active={active}
          setActive={setActive}
          onLogout={handleLogout}
        />

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
          {message && <p className="alert alert-info">{message}</p>}
          <div className="row g-4">
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
          </div>

          <Button
            variant="primary"
            className="mt-4 d-flex align-items-center"
            onClick={() => setShowAddPopup(true)}
          >
            <PlusCircle className="me-2" /> Add Bank
            <Bank className="me-2" />
          </Button>

          <Table striped bordered hover className="mt-4">
            <thead>
              <tr>
                <th>Bank Name</th>
                <th>Bank Code</th>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {banks.map((bank) => (
                <tr key={bank._id}>
                  <td>{bank.name}</td>
                  <td>{bank.code}</td>
                  <td>{bank.contact}</td>
                  <td>
                    <Button
                      variant="outline-warning"
                      size="sm"
                      onClick={() => handleEditClick(bank)}
                    >
                      Edit
                    </Button>{" "}
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteClick(bank)}
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

      {/* Add Bank Modal */}
      <Modal show={showAddPopup} onHide={() => setShowAddPopup(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Bank</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {message && <p className="alert alert-info">{message}</p>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Bank Name</Form.Label>
              <Form.Control
                type="text"
                name="bank"
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
                  value={contact}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 10) {
                      setContact(value);
                    }
                  }}
                  required
                  placeholder="Enter 10-digit number"
                />
              </InputGroup>
              {contact.length !== 10 && contact.length > 0 && (
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
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="success" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Bank Modal */}
      <Modal show={showEditPopup} onHide={() => setShowEditPopup(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Bank</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3">
              <Form.Label>Bank Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
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
                  value={contact}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 10) {
                      setContact(value);
                    }
                  }}
                  required
                />
              </InputGroup>
              {contact.length !== 10 && contact.length > 0 && (
                <p className="text-danger mt-1">
                  Phone number must be 10 digits
                </p>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Bank Code</Form.Label>
              <Form.Control
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="success" type="submit">
              Update
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Bank Confirmation Modal */}
      <Modal show={showDeletePopup} onHide={() => setShowDeletePopup(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this bank?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeletePopup(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Banks;
