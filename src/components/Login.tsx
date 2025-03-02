import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [companies, setCompanies] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/companies")
      .then((response) => setCompanies(response.data))
      .catch((error) => console.error("Error fetching companies:", error));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowDropdown(e.target.checked);
  };

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCompany(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const loginData = showDropdown
        ? { ...formData, company: selectedCompany }
        : formData;
      const response = await axios.post(
        "http://localhost:5000/auth/login",
        loginData
      );

      setMessage(response.data.message);

      localStorage.setItem("token", response.data.token);

      if (showDropdown && response.data.company) {
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
                  id="toggleDropdown"
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label" htmlFor="toggleDropdown">
                  Manager (**Check only for bank staff**)
                </label>
              </div>

              {/* Dropdown (Only Visible if Checkbox is Checked) */}
              {showDropdown && (
                <div className="mb-3">
                  <label className="form-label">Company Name</label>
                  <select
                    className="form-select"
                    value={selectedCompany}
                    onChange={handleDropdownChange}
                    required
                  >
                    <option value="">Choose a company</option>
                    {companies.map((company, index) => (
                      <option key={index} value={company}>
                        {company}
                      </option>
                    ))}
                  </select>
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
