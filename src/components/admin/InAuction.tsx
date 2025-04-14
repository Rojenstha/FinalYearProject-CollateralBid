import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Button, Table, Badge } from "react-bootstrap";
import {
  People,
  GraphUp,
  Check,
  XCircle,
  PlusCircle,
} from "react-bootstrap-icons";
import axios from "axios";
import Sidebar from "./AdminNav";

function Users() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<
    "delete" | "verify" | "unverify" | null
  >(null);
  const [active, setActive] = useState("In-Auction");
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/user/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleLogout = () => setShowLogoutPopup(true);
  const confirmLogout = () => {
    localStorage.removeItem("token");
    setShowLogoutPopup(false);
    navigate("/");
  };

  const handleActionConfirm = (
    userId: string,
    type: "delete" | "verify" | "unverify"
  ) => {
    setSelectedUserId(userId);
    setActionType(type);
    setShowConfirmModal(true);
  };

  const handleActionExecute = async () => {
    if (!selectedUserId || !actionType) return;

    try {
      if (actionType === "verify") {
        await axios.patch(
          `http://localhost:5000/api/user/verify/${selectedUserId}`
        );
        setMessage("User successfully verified.");
      } else if (actionType === "unverify") {
        await axios.patch(
          `http://localhost:5000/api/user/unverify/${selectedUserId}`
        );
        setMessage("User verification removed.");
      } else if (actionType === "delete") {
        await axios.delete(
          `http://localhost:5000/api/user/delete/${selectedUserId}`
        );
        setMessage("User successfully deleted.");
      }
      fetchUsers();
    } catch (error) {
      setMessage("An error occurred during the action.");
      console.error(`Error during ${actionType}:`, error);
    } finally {
      setShowConfirmModal(false);
      setSelectedUserId(null);
      setActionType(null);
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
          {message && (
            <div className="alert alert-info mt-4">
              <strong>{message}</strong>
            </div>
          )}
          <div className="row g-4">
            <div className="col-12 col-md-6">
              <Link to="/cb-ad/users">
                <div className="bg-secondary text-white p-3 rounded shadow-sm text-center">
                  <h4>
                    <People className="me-2" />
                    Total Users
                  </h4>
                  <h2>{users.length}</h2>
                </div>
              </Link>
            </div>

            <div className="col-12 col-md-6">
              <Link to="/verifyusers">
                <div className="bg-success text-white p-3 rounded shadow-sm text-center">
                  <h4>
                    <Check className="me-2" />
                    Verified Users
                  </h4>
                  <h2>{users.filter((user) => user.isVerified).length}</h2>
                </div>
              </Link>
            </div>
          </div>

          <Table striped bordered hover className="mt-4">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Verified</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter((user) => user.isVerified)
                .map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.phone}</td>
                    <td>{user.email}</td>
                    <td>
                      <Badge bg="success">Verified</Badge>
                    </td>
                    <td>
                      <Button
                        variant="outline-warning"
                        size="sm"
                        onClick={() =>
                          handleActionConfirm(user._id, "unverify")
                        }
                      >
                        <XCircle className="me-2" />
                        Unverify
                      </Button>{" "}
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleActionConfirm(user._id, "delete")}
                      >
                        <XCircle className="me-2" />
                        Ban
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
      </div>

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

      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            Confirm {actionType?.charAt(0).toUpperCase() + actionType?.slice(1)}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to <strong>{actionType}</strong> this user?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant={
              actionType === "delete"
                ? "danger"
                : actionType === "verify"
                ? "success"
                : "warning"
            }
            onClick={handleActionExecute}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Users;
