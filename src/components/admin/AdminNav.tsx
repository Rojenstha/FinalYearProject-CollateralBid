import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import {
  House,
  Grid,
  People,
  GraphUp,
  CreditCard,
  Bank,
  ChatDots,
  Check,
} from "react-bootstrap-icons";

type SidebarProps = {
  active: string;
  setActive: (tab: string) => void;
  onLogout: () => void;
};

const Sidebar = ({ active, setActive, onLogout }: SidebarProps) => {
  return (
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
          { label: "Home", icon: <House />, route: "admin-dashboard" },
          { label: "In-Auction", icon: <Grid />, route: "in-auction" },
          { label: "Transactions", icon: <CreditCard />, route: "transaction" },
          { label: "Banks", icon: <Bank />, route: "banks" },
          { label: "Managers", icon: <People />, route: "managers" },
          { label: "Customers", icon: <People />, route: "users" },
          {
            label: "Verify Auction",
            icon: <GraphUp />,
            route: "verifyauctions",
          },
          { label: "Verified User", icon: <Check />, route: "verifyusers" },
          { label: "Messages", icon: <ChatDots />, route: "messages" },
        ].map(({ label, icon, route }) => (
          <li key={label}>
            <Link
              to={`/cb-ad/${route}`}
              className={`nav-link ${
                active === label ? "active" : "text-white"
              }`}
              onClick={() => setActive(label)}
            >
              {icon} <span className="ms-2">{label}</span>
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
          <Dropdown.Item onClick={onLogout} className="text-danger">
            Sign out
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default Sidebar;
