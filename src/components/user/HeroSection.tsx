import background from "../../assets/bg.jpg";
import { GraphUpArrow } from "react-bootstrap-icons";

const HeroSection = () => (
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
        Discover amazing auctions, bid on your favorite items, and enjoy the
        thrill of winning!
      </p>
      <a className="btn btn-outline-light mt-3" href="#auction">
        <GraphUpArrow className="me-2" /> View Auctions
      </a>
    </div>
  </div>
);

export default HeroSection;
