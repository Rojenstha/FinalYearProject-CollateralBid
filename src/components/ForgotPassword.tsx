import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/auth/forgot-password", { email });
      setMessage(response.data.message);
    } catch (error: any) {
      setMessage(error.response?.data?.error || "Failed to send reset link");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-lg p-4">
            <h2 className="text-center mb-4">Forgot Password?</h2>

            {message && <p className="alert alert-info">{message}</p>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Enter your email to send a Verification Code</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Send Reset Link
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
