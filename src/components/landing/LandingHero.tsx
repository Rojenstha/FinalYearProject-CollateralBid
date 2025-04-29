import { useState } from "react";
import background from "../../assets/bg.jpg";
import pop from "../../assets/pop.jpg";
import { GraphUpArrow, X } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

const LandingHero = () => {
  const [showPanel, setShowPanel] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className="container-fluid text-light d-flex align-items-center"
      style={{
        minHeight: "80vh",
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backgroundBlendMode: "darken",
      }}
    >
      <div className="container">
        <h1 className="pb-5" style={{ fontSize: "5rem", fontWeight: "bold" }}>
          Welcome to CollateralBid!
        </h1>
        <p className="fs-3">
          Join Us Now to view all the assets auctioned by Our Associated Banks
          through proper processes.
        </p>
        <button
          className="btn btn-outline-light mt-3"
          onClick={() => setShowPanel(true)}
        >
          <GraphUpArrow className="me-2" /> Join Now!
        </button>
      </div>

      {/* Popup Panel */}
      {showPanel && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 1050,
          }}
        >
          <div
            className="bg-white rounded p-4 position-relative"
            style={{
              width: "90%",
              maxWidth: "500px",
              backgroundImage: `url(${pop})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <button
              className="btn-close position-absolute top-0 end-0 m-3"
              onClick={() => setShowPanel(false)}
            ></button>
            <h3 className="fw-bold mb-3 text-dark">
              Get Started with CollateralBid
            </h3>
            <p className="text-muted">
              Unlock access to auctions and exclusive listings by creating your
              account or logging in if you're already a member.
            </p>
            <div className="d-grid gap-2 mt-4">
              <button
                className="btn btn-outline-dark"
                onClick={() => navigate("/login")}
              >
                Already have an account
              </button>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/signup")}
              >
                Join Us Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingHero;
