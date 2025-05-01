import { useEffect, useState } from "react";
import { GraphUp } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import Sidebar from "./MSidebar";
import DashboardStats from "./MDashboardStats";
import LogoutModal from "./MLogoutModal";
import axios from "axios";

const InAuction = () => {
  const [active, setActive] = useState("In-Auction");
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/products/manager", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts(); // Refresh list after deletion
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    setShowLogoutPopup(false);
    navigate("/");
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/product/manager",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProducts(res.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);
  console.log(products);

  return (
    <div className="d-flex">
      <div className="p-4" style={{ marginLeft: "250px" }}></div>
      <Sidebar
        active={active}
        setActive={setActive}
        onLogout={() => setShowLogoutPopup(true)}
      />

      <div className="p-4 w-100">
        <h1>Welcome to Manager Dashboard</h1>
        <p>Manage auctions, transactions efficiently from this dashboard.</p>
        <h2>
          <GraphUp className="me-4" />
          Insight Statistics <hr />
        </h2>
        <DashboardStats />

        <h3 className="mt-5">Your Listed Products</h3>
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Price</th>
              <th>Highest Bidd</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(products) &&
              products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <img
                      src={product.image?.filePath || "/placeholder.png"}
                      alt={product.title}
                      style={{
                        width: "80px",
                        height: "60px",
                        objectFit: "cover",
                      }}
                    />
                  </td>
                  <td>{product.title}</td>
                  <td>रु {product.price}</td>
                  <td>रु {product.biddingPrice}</td>
                  <td>{product.isVerify}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() =>
                        navigate(`/manager/update-product/${product._id}`)
                      }
                    >
                      View Listing
                    </button>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() =>
                        navigate(`/manager/update-product/${product._id}`)
                      }
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(product._id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <LogoutModal
        show={showLogoutPopup}
        onCancel={() => setShowLogoutPopup(false)}
        onConfirm={confirmLogout}
      />
    </div>
  );
};

export default InAuction;
