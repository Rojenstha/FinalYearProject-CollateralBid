import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaLinkedinIn,
  FaPinterestP,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-dark text-light pt-5 pb-4 mt-5">
      <div className="container">
        <div className="row text-start">
          <div className="col-md-3 mb-4">
            <h2 className="fw-bold">CollateralBid</h2>
            <ul className="list-unstyled">
              <li>Email: collateralbid@gmail.com</li>
              <li>Contact: +977 9821124832</li>
              <li>Locate us at: Naxal, Kathmandu</li>
              <li>&copy; {new Date().getFullYear()} CollateralBid Pvt. Ltd.</li>
            </ul>
          </div>

          <div className="col-md-3 mb-4">
            <h5>Follow Us</h5>
            <div className="d-flex gap-3 fs-5">
              <FaFacebookF />
              <FaInstagram />
              <FaYoutube />
              <FaTiktok />
              <FaLinkedinIn />
              <FaPinterestP />
            </div>
          </div>
        </div>

        <hr className="border-secondary" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-3">
          <div className="mb-2 mb-md-0">
            &copy; {new Date().getFullYear()} Auction Platform. All rights
            reserved.
          </div>
          <div className="d-flex gap-3 small">
            <span>Terms</span>
            <span>Privacy</span>
            <span>Sitemap</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
