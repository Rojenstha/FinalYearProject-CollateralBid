import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { DropdownHeader } from "react-bootstrap";
import {
  House,
  Grid,
  Person,
  Check,
  CreditCard,
  Bell,
  Messenger,
  Plus,
} from "react-bootstrap-icons";

const MSidebar = ({ active, setActive, onLogout }: any) => (
  <div
    className="d-flex flex-column flex-shrink-0 p-3 bg-dark text-white"
    style={{ width: "250px", height: "100vh" }}
  >
    <Link
      to=""
      className="d-flex align-items-center mb-3 text-white text-decoration-none"
    >
      <img src="/src/assets/logo2.png" alt="Logo" width="211" height="72" />
    </Link>
    <hr />
    <ul className="nav nav-pills flex-column mb-auto">
      {[
        {
          to: "/manager-dashboard",
          icon: <House className="me-2" />,
          label: "Home",
        },
        {
          to: "/in-auction",
          icon: <Grid className="me-2" />,
          label: "In-Auction",
        },
        {
          to: "/success-auction",
          icon: <Check className="me-2" />,
          label: "Successful Auctions",
        },
        {
          to: "/transaction",
          icon: <CreditCard className="me-2" />,
          label: "Transaction",
        },
        {
          to: "/send-message",
          icon: <Messenger className="me-2" />,
          label: "Send Message",
        },
        {
          to: "/manager-notification",
          icon: <Bell className="me-2" />,
          label: "Notifications",
        },
        {
          to: "/add-product",
          icon: <Plus className="me-2" />,
          label: "Add Product",
        },
      ].map((item) => (
        <li key={item.label}>
          <Link
            to={item.to}
            className={`nav-link ${
              active === item.label ? "active" : "text-white"
            }`}
            onClick={() => setActive(item.label)}
          >
            {item.icon} {item.label}
          </Link>
        </li>
      ))}
    </ul>

    <hr />
    <Dropdown>
      <Dropdown.Toggle
        variant="dark"
        className="d-flex align-items-center text-white border-0"
      >
        <strong>
          <Person className="me-2" />
          Manager
        </strong>
      </Dropdown.Toggle>
      <Dropdown.Menu className="bg-dark text-white">
        <Dropdown.Item as={Link} to="/" className="text-secondary">
          Change Username
        </Dropdown.Item>
        <Dropdown.Item as={Link} to="/" className="text-secondary">
          Change Password
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item onClick={onLogout} className="text-danger">
          Sign out
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  </div>
);

export default MSidebar;
