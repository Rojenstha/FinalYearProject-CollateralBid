import { useState } from "react";
import axios from "axios";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/admin/register", { name, email, password })
      .then((result) => console.log(result))
      .catch((error) => console.log(error));
  };
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="login-container p-4 border rounded shadow-lg">
        <h2 className="text-center mb-4">CollateralBid- Admin SignUp</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              name="email"
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
