import { useState } from "react";
import { GraphUp } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import Sidebar from "./MSideBar";
import DashboardStats from "./MDashboardStats";
import AddProductModal from "./MAddProductModal";
import LogoutModal from "./MLogoutModal";

const ManagerDashboard = () => {
  const [active, setActive] = useState("Home");
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    name: "",
    location: "",
    image: "",
    description: "",
  });

  const handleChange = (e: any) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(productData); // Replace with API call
    setShowModal(false);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    setShowLogoutPopup(false);
    navigate("/");
  };

  return (
    <div className="d-flex">
      <Sidebar
        active={active}
        setActive={setActive}
        onAddProduct={() => setShowModal(true)}
        onLogout={() => setShowLogoutPopup(true)}
      />

      <div className="p-4 w-100">
        <h1>Welcome to Manager Dashboard</h1>
        <p>Manage auctions, transactions efficiently from this dashboard.</p>
        <h2>
          <GraphUp className="me-4" />
          Insight Statistics <hr />
        </h2>
        <DashboardStats />
      </div>

      <AddProductModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />

      <LogoutModal
        show={showLogoutPopup}
        onCancel={() => setShowLogoutPopup(false)}
        onConfirm={confirmLogout}
      />
    </div>
  );
};

export default ManagerDashboard;
