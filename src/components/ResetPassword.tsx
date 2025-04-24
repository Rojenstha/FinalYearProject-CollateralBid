import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  const { token } = useParams();
  const navigate = useNavigate();

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/user/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Password reset successfully.");
        setResetSuccess(true);
      } else {
        setError(data.message || "Error resetting password.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    }
  };

  const goToLogin = () => {
    navigate("/login");
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

            <h2 className="text-center mb-4">
              CollateralBid- Reset Your Password
            </h2>

            {message && <p className="alert alert-success">{message}</p>}
            {error && <p className="alert alert-danger">{error}</p>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Reset Password
              </button>
            </form>

            {resetSuccess && (
              <button
                onClick={goToLogin}
                className="btn btn-outline-success mt-3 w-100"
              >
                Go to Login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
