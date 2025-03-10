import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Call the API to send the password reset email
    try {
      const response = await fetch(
        "http://localhost:5000/send-password-reset-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setMessage(
          "A password reset email has been sent if the email exists in our records."
        );
      } else {
        setMessage("There was an error. Please try again.");
      }
    } catch (error) {
      setMessage("There was an error. Please try again.");
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
                <label className="form-label">
                  Enter your email to send a Verification Code
                </label>
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
