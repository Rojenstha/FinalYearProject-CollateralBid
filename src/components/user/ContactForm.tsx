import { useState } from "react";
import axios from "axios";
import { Person } from "react-bootstrap-icons";

const ContactForm = () => {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/message/", {
        name,
        email,
        comment,
      });
      setMessage(res.data.message);
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Message failed.");
    }
  };

  return (
    <section
      id="contact"
      className="py-5"
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="container d-flex justify-content-center">
        <div
          className="card p-4 w-100 mx-3"
          style={{
            maxWidth: "500px",
            borderRadius: "1rem",
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            boxShadow: "0 0 20px rgba(0,0,0,0.3)",
          }}
        >
          <h4 className="mb-1 fw-bold">
            <Person className="me-2" />
            Contact Us
          </h4>
          <p className="text-muted">
            Get in touch with us for any inquiries, support, or feedback.
          </p>

          <form onSubmit={sendMessage}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <textarea
                className="form-control"
                placeholder="Message"
                rows={4}
                onChange={(e) => setComment(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Send Message
            </button>
            {message && <div className="alert alert-info mt-3">{message}</div>}
          </form>

          <p
            className="text-center text-muted mt-3"
            style={{ fontSize: "0.85rem" }}
          >
            We respect your privacy. No spam ever.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
