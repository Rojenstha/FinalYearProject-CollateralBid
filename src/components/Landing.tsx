import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import logo from "../assets/logo.png";
import background from "../assets/bg.jpeg";

function Landing() {
  return (
    <div className="container-fluid vh-100 d-flex flex-column">
      {/* Navbar */}
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
            Menu
          </button>
          <ul className="dropdown-menu">
            <li>
              <a className="dropdown-item" href="#about-us">
                About Us
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#auction">
                Auction
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
            Login/Signup
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div
        className="container-fluid text-light d-flex align-items-center justify-content-left text-left"
        style={{
          minHeight: "80vh",
          width: "100%",
          //backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          backgroundBlendMode: "darken",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <div className="container">
          <h1 className="pb-5" style={{ fontSize: "5rem", fontWeight: "bold" }}>
            Welcome to Our Auction Platform
          </h1>
          <p className="fs-3">
            Discover amazing auctions, bid on your favorite items, and enjoy the
            thrill of winning! Explore unique items and win exclusive deals.
          </p>

          {/* Button below paragraph */}
          <a className="btn btn-outline-light mt-3" href="#auction">
            View Auctions
          </a>
        </div>
      </div>

      {/* Auction Section */}
      <div
        id="auction"
        className="container-fluid text-dk d-flex align-items-center justify-content-left text-left"
      >
        <div className="row align-items-center">
          <div>
            <h1 className="fw-bold">Auction</h1>
          </div>
          <div>
            <p className="fs-4">
              Browse our exciting auction listings, place your bids, and get
              ready to win amazing products!
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section - Left-Aligned */}
      <div
        id="contact"
        className="container-fluid text-dk d-flex align-items-center justify-content-left text-left"
      >
        <div className="row">
          <div className="col-md-6">
            <h2 className="fw-bold">Contact Us</h2>
            <p>
              Get in touch with us for any inquiries, support, or feedback. We
              are here to assist you!
            </p>
            <form>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Your Name"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Your Email"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Comment</label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Your Message"
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white text-center p-3">
        &copy; {new Date().getFullYear()} Auction Platform. All rights reserved.
      </footer>
    </div>
  );
}

export default Landing;
