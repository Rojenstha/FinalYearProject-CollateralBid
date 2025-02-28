import { useState } from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { House, Grid, People } from "react-bootstrap-icons";

const ManagerDashboard = () => {
  const [active, setActive] = useState("Home");

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
            to=""
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
            to="/dashboard"
            className={`nav-link ${
              active === "Dashboard" ? "active" : "text-white"
            }`}
            onClick={() => setActive("Dashboard")}
          >
            <Grid className="me-2" /> Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/products"
            className={`nav-link ${
              active === "Products" ? "active" : "text-white"
            }`}
            onClick={() => setActive("Products")}
          >
            <Grid className="me-2" /> Products
          </Link>
        </li>
        <li>
          <Link
            to="/customers"
            className={`nav-link ${
              active === "Customers" ? "active" : "text-white"
            }`}
            onClick={() => setActive("Customers")}
          >
            <People className="me-2" /> Customers
          </Link>
        </li>
      </ul>
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
          <Dropdown.Item as={Link} to="/logout" className="text-danger">
            Sign out
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default ManagerDashboard;
