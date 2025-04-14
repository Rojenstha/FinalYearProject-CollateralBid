import { Link } from "react-router-dom";
import { Person, MenuDown } from "react-bootstrap-icons";
import logo from "../../assets/logo.png";

function LandingNavbar() {
  return (
    <nav className="navbar navbar-light bg-light px-3">
      <a className="navbar-brand" href="#">
        <img src={logo} alt="Logo" width="150" height="70" />
      </a>

      <div className="dropdown ms-3">
        <button
          className="btn btn-secondary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
        >
          <MenuDown className="me-2" />
          Menu
        </button>
        <ul className="dropdown-menu">
          <li>
            <a className="dropdown-item" href="#about-us">
              About Us
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="#contact">
              Contact
            </a>
          </li>
        </ul>
      </div>

      <div className="ms-auto">
        <Link to="/login" className="btn btn-outline-dark">
          <Person className="me-2" />
          Login/Signup
        </Link>
      </div>
    </nav>
  );
}

export default LandingNavbar;
