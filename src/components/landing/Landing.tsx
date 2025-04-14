import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import LandingNavbar from "./LandingNav";
import LandingHero from "./LandingHero";
import AssosiatedBank from "../user/AssociatedBank";
import ContactForm from "../user/ContactForm";
import Yapp from "../user/Yapp";
import Footer from "../user/Footer";

function Landing() {
  return (
    <div className="container-fluid vh-100 d-flex flex-column">
      <LandingNavbar />
      <LandingHero />
      <AssosiatedBank />
      <Yapp />
      <Footer />
    </div>
  );
}

export default Landing;
