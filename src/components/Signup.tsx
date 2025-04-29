import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/register",
        formData
      );
      setMessage(response.data.message);
    } catch (error: any) {
      setMessage(error.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex p-0">
      {/* Left Panel */}

      <div
        className="col-md-6 d-flex flex-column justify-content-center align-items-center text-white p-5 text-center"
        style={{
          backgroundImage: "url('/src/assets/bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(0,0,0,0.4)",
            zIndex: 1,
          }}
        ></div>

        <div style={{ zIndex: 2 }}>
          <h1 className="pb-5" style={{ fontSize: "5rem", fontWeight: "bold" }}>
            Welcome to CollateralBid!
          </h1>
          <p className="fs-3">
            Discover amazing auctions, bid on your favorite items, and enjoy the
            thrill of winning!
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="col-md-6 d-flex justify-content-center align-items-center bg-light text-dark">
        <div className="w-75">
          <h3 className="text-center mb-4">Create an Account</h3>
          {message && <div className="alert alert-info">{message}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control bg-secondary text-white border-0"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <div className="input-group">
                <span className="input-group-text">+977</span>
                <input
                  type="text"
                  className="form-control bg-secondary text-white border-0"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 10) {
                      setFormData({ ...formData, phone: value });
                    }
                  }}
                  placeholder="10-digit number"
                  required
                />
              </div>
              {formData.phone.length !== 10 && (
                <div className="text-danger mt-1">
                  Phone number must be 10 digits
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control bg-secondary text-white border-0"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control bg-secondary text-white border-0"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
              />
            </div>

            <div className="form-check mb-3">
              <input className="form-check-input" type="checkbox" required />
              <label className="form-check-label">
                I agree to the{" "}
                <a href="#" className="text-info">
                  terms of service
                </a>
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-outline-success w-100 fw-bold text-dark"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center mt-3">
            Already have an account?{" "}
            <Link to="/login" className="text-primary">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
