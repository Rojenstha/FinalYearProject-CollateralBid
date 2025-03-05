import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    bank: "",
  });

  const [showBankField, setShowBankField] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowBankField(e.target.checked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const loginData = showBankField
        ? formData
        : { email: formData.email, password: formData.password }; // ✅ Send only necessary fields

      const response = await axios.post(
        "http://localhost:5000/login",
        loginData
      );

      setMessage(response.data.message);
      localStorage.setItem("token", response.data.token);

      if (response.data.isManager) {
        navigate("/manager-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } catch (error: any) {
      setMessage(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-lg p-4">
            <a className="text-center mb-4" href="#">
              <img
                src="/src/assets/logo.png"
                alt="Bootstrap"
                width="100"
                height="45"
              />
            </a>
            <h2 className="text-center mb-4">Login to Collateral-Bid</h2>

            {message && <p className="alert alert-info">{message}</p>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="toggleBankField"
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label" htmlFor="toggleBankField">
                  Manager (**Check only for officials**)
                </label>
              </div>

              {showBankField && (
                <div className="mb-3">
                  <label className="form-label">Bank Code</label>
                  <input
                    type="text"
                    className="form-control"
                    name="bank"
                    value={formData.bank}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <button type="submit" className="btn btn-primary w-100">
                Login
              </button>
            </form>
            <p className="text-center mt-3">
              <Link to="/forgotpassword">Forgot Password?</Link>
            </p>
            <p className="text-center mt-3">
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
