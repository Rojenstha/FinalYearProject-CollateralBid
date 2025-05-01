import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const extractErrorMessage = (error: any): string => {
    if (error.response) {
      const { data } = error.response;
      if (typeof data === "string") return data;
      if (data.error) return data.error;
      if (data.message) return data.message;
      if (Array.isArray(data.errors))
        return data.errors[0]?.msg || "An error occurred.";
    }
    return "Login failed. Please try again.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/login",
        formData,
        { withCredentials: true }
      );

      const { token, role, ...userInfo } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userInfo", JSON.stringify(userInfo));

      Cookies.set("token", token, { expires: 1 });
      Cookies.set("userInfo", encodeURIComponent(JSON.stringify(userInfo)), {
        expires: 1,
      });

      toast.success("Logged in successfully!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });

      setTimeout(() => {
        navigate(role === "seller" ? "/manager-dashboard" : "/home");
      }, 2000); // Delay redirect until after the toast shows
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error);
      setMessage(errorMessage);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex p-0">
      <ToastContainer />
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
      <div className="col-md-6 d-flex justify-content-center align-items-center bg-white text-dark">
        <div className="w-75">
          <h3 className="text-center mb-4 fw-bold">Login to Collateral Bid</h3>

          {message && <div className="alert alert-info">{message}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="email"
                className="form-control bg-light border-0"
                placeholder="Email address"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control bg-light border-0"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-outline-primary w-100 fw-bold"
            >
              Login
            </button>
          </form>

          <div className="text-center mt-3">
            <Link to="/forgotpassword" className="text-muted">
              Forgot Password?
            </Link>
          </div>

          <div className="text-center mt-2">
            Don't have an account?{" "}
            <Link to="/signup" className="text-success fw-semibold">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
