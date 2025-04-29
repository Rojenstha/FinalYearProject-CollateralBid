import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";
import UserNav from "./UserNav";

interface UserInfo {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  isVerified: boolean;
  role: string;
}

interface Bid {
  product: {
    title: string;
    _id: string;
    isSoldOut: boolean;
    soldTo: string;
  };
  price: number;
}

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [showEditPopup, setShowEditPopup] = useState(false);

  const winningBids = Array.isArray(bids)
    ? bids.filter(
        (bid) => bid.product.isSoldOut && bid.product.soldTo === userInfo?._id
      )
    : [];

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      try {
        const parsedUser = JSON.parse(storedUserInfo);
        setUserInfo(parsedUser);
      } catch (error) {
        console.error("Error parsing userInfo from localStorage:", error);
        navigate("/login");
      }
    } else {
      console.warn("No userInfo found in localStorage.");
      navigate("/login");
    }

    const fetchUserBids = async () => {
      try {
        const token = Cookies.get("token");
        const bidsRes = await axios.get("/api/bidding/user", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setBids(Array.isArray(bidsRes.data?.bids) ? bidsRes.data.bids : []);
      } catch (err) {
        console.error("Fetch error (bids):", err);
      }
    };

    fetchUserBids();
  }, [navigate]);

  return (
    <>
      <UserNav />
      <div className="position-relative">
        <div className="container-fluid mt-4 mb-5 position-relative">
          <div className="row">
            <div className="col-md-3">
              <Sidebar name={userInfo?.name} email={userInfo?.email} />
            </div>

            <div className="col-md-9 d-flex flex-column">
              <div
                className="card text-white bg-secondary bg-opacity-75 rounded p-4 shadow-sm flex-grow-1 d-flex flex-column justify-content-between backdrop-blur"
                style={{ minHeight: "80vh" }}
              >
                <div>
                  <h4 className="mb-4">User Profile</h4>
                  <p>
                    <strong>Name:</strong> {userInfo?.name || "N/A"}
                  </p>
                  <p>
                    <strong>Email:</strong> {userInfo?.email || "N/A"}
                  </p>
                  <p>
                    <strong>Phone:</strong> {userInfo?.phone || "Not provided"}
                  </p>
                  <p>
                    <strong>Verified:</strong>{" "}
                    {userInfo?.isVerified ? (
                      <span className="text-success">✅ Verified</span>
                    ) : (
                      <span className="text-danger">❌ Not Verified</span>
                    )}
                  </p>

                  <div className="d-flex align-items-center gap-2 mb-3">
                    <button
                      className="btn btn-sm btn-outline-warning"
                      onClick={() => setShowEditPopup(true)}
                    >
                      Edit
                    </button>
                    {userInfo?.isVerified && (
                      <span className="badge bg-success">Verified</span>
                    )}
                  </div>

                  <hr />
                  <h5 className="mt-4">Bidding History</h5>
                  {Array.isArray(bids) && bids.length > 0 ? (
                    <ul className="list-group mb-4">
                      {bids.map((bid, idx) => (
                        <li
                          className="list-group-item d-flex justify-content-between"
                          key={idx}
                        >
                          <span>{bid.product.title}</span>
                          <strong>${bid.price}</strong>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted">No bids placed yet.</p>
                  )}

                  <h5 className="mt-4">Winning Bids</h5>
                  {Array.isArray(winningBids) && winningBids.length > 0 ? (
                    <ul className="list-group">
                      {winningBids.map((bid, idx) => (
                        <li
                          className="list-group-item d-flex justify-content-between"
                          key={idx}
                        >
                          <span>{bid.product.title}</span>
                          <strong>${bid.price}</strong>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted">No winning bids yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {showEditPopup && (
          <div
            className="modal d-block"
            tabIndex={-1}
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Edit</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowEditPopup(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to edit your profile?</p>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowEditPopup(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setShowEditPopup(false);
                      alert("Redirect to edit profile page or open form here.");
                    }}
                  >
                    Proceed
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default UserDashboard;
