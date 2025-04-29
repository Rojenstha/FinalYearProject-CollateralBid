import { Link } from "react-router-dom";
import { Box, GraphUp, Bell } from "react-bootstrap-icons";

const MDashboardStats = () => (
  <div className="row g-4">
    <div className="col-12 col-md-4">
      <Link to="/in-auction">
        <div className="bg-secondary text-white p-3 rounded shadow-sm text-center">
          <h4>
            <Box className="me-2" /> Total Number of Auctions
          </h4>
          <h2>25</h2>
        </div>
      </Link>
    </div>
    <div className="col-12 col-md-4">
      <Link to="/in-auction">
        <div className="bg-secondary text-white p-3 rounded shadow-sm text-center">
          <h4>
            <GraphUp className="me-2" /> Active Auctions
          </h4>
          <h2>12</h2>
        </div>
      </Link>
    </div>
    <div className="col-12 col-md-4">
      <Link to="/manager-notification">
        <div className="bg-secondary text-white p-3 rounded shadow-sm text-center">
          <h4>
            <Bell className="me-2" /> Notifications
          </h4>
          <h2>10</h2>
        </div>
      </Link>
    </div>
  </div>
);

export default MDashboardStats;
