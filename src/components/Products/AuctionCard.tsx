import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { getAllProducts } from "../ProductWork/productService";

interface AuctionItem {
  _id: string;
  title: string;
  image: {
    filePath: string;
  };
  currentBid: number;
  bids: number;
  isSoldOut: boolean;
}

const AuctionCard: React.FC = () => {
  const [items, setItems] = useState<AuctionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getAllProducts();
        setItems(products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleCardClick = (item: AuctionItem) => {
    navigate(`/product/${item._id}`);
  };

  return (
    <div className="my-5 ps-4 bg-light py-4">
      {" "}
      <h2 className="mb-4 text-start">Live Auction</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="d-flex flex-wrap">
          {items.map((item) => (
            <div
              key={item._id}
              className="card shadow-sm me-3 mb-4"
              style={{ width: "18rem", cursor: "pointer" }}
              onClick={() => handleCardClick(item)}
            >
              <img
                src={item.image.filePath}
                className="card-img-top"
                alt={item.title}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title">{item.title}</h5>
                <p className="mb-1">
                  <strong>Current Bid:</strong> रु {item.currentBid.toFixed(2)}
                </p>
                <p className="mb-1">
                  <strong>Status:</strong>{" "}
                  {item.isSoldOut ? (
                    <span className="text-danger">Sold Out</span>
                  ) : (
                    <span className="text-success">Available</span>
                  )}
                </p>
                <span className="badge bg-info">{item.bids} Bids</span>
              </div>
              <div className="card-footer text-center">
                <button
                  className="btn btn-outline-primary w-100"
                  disabled={item.isSoldOut}
                >
                  {item.isSoldOut ? "Not Available" : "Place Bid"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuctionCard;
