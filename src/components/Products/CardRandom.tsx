import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { getAllProducts } from "../ProductWork/productService";
import moment from "moment";
import numWords from "num-words";

interface AuctionItem {
  excludeId?: string;
  _id: string;
  title: string;
  image: {
    filePath: string;
  };
  currentBid: number;
  price: number;
  bids: number;
  isSoldOut: boolean;
  startTime: string;
  endTime: string;
}

const CardRandom: React.FC<CardRandomProps> = ({ excludeId }) => {
  const [items, setItems] = useState<AuctionItem[]>([]);
  const [displayItems, setDisplayItems] = useState<AuctionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getAllProducts();

        // Filter out the current product
        const filtered = products.filter((item) => item._id !== excludeId);

        // Shuffle and pick 5 random items
        const shuffled = filtered.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 5);

        setItems(selected);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    const interval = setInterval(() => {
      setItems((prevItems) => [...prevItems]); // Force re-render every second
    }, 1000);

    return () => clearInterval(interval);
  }, [excludeId]);

  // Function to shuffle and pick 5 random products, excluding the selected one
  const getRandomProducts = (products: AuctionItem[]) => {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5); // Return only 5 products
  };

  // Handle the card click: scroll to top, then navigate
  const handleCardClick = (item: AuctionItem) => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    setTimeout(() => {
      navigate(`/product/${item._id}`);
    }, 600);
  };

  // Calculate time left for auction
  const calculateTimeLeft = (endTime: string) => {
    const end = new Date(endTime).getTime();
    const now = new Date().getTime();
    const difference = end - now;

    if (difference <= 0)
      return { h: "00", m: "00", s: "00", lessThanHour: false };

    const h = Math.floor(difference / (1000 * 60 * 60));
    const m = Math.floor((difference / (1000 * 60)) % 60);
    const s = Math.floor((difference / 1000) % 60);

    return {
      h: String(h).padStart(2, "0"),
      m: String(m).padStart(2, "0"),
      s: String(s).padStart(2, "0"),
      lessThanHour: h < 1,
    };
  };

  // Get auction status (Not started, Active, or Ended)
  const getAuctionStatus = (item: AuctionItem) => {
    const now = new Date();
    const start = new Date(item.startTime);
    const end = new Date(item.endTime);
    const { lessThanHour } = calculateTimeLeft(item.endTime);

    if (now < start) return <span className="text-secondary">Not Started</span>;
    if (now >= start && now <= end) {
      return lessThanHour ? (
        <span className="text-warning">Last Hour Active</span>
      ) : (
        <span className="text-success">Auction-Active</span>
      );
    }
    return <span className="text-danger">Ended</span>;
  };

  return (
    <div className="my-5 ps-4 bg-light py-4">
      <h2 className="mb-4 text-start">Other Auctions</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="d-flex flex-wrap">
          {displayItems.map((item) => {
            const timeLeft = calculateTimeLeft(item.endTime);

            return (
              <div
                key={item._id}
                className="card shadow-sm me-3 mb-4"
                style={{ width: "20rem", cursor: "pointer" }}
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
                    <strong>Starting Price:</strong> रु {item.price.toFixed(2)}
                    <small>
                      (Rs.
                      {numWords(item.price || 0).replace(/\b\w/g, (l) =>
                        l.toUpperCase()
                      )}
                      )
                    </small>
                  </p>
                  <p className="mb-1">
                    <strong>Current Bid:</strong> रु{" "}
                    {item.currentBid.toFixed(2)}
                    <small>
                      (Rs.
                      {numWords(item.currentBid || 0).replace(/\b\w/g, (l) =>
                        l.toUpperCase()
                      )}
                      )
                    </small>
                  </p>

                  <p className="mb-1">
                    <strong>Started:</strong>{" "}
                    {moment(item.startTime).format("LLL")}
                  </p>
                  <p className="mb-1">
                    <strong>End:</strong> {moment(item.endTime).format("LLL")}
                  </p>
                  <p className="mb-1">
                    <strong>Status:</strong> {getAuctionStatus(item)}
                  </p>
                  <div className="mb-2">
                    <strong>Time Left:</strong>
                    <div
                      className={`mt-1 p-2 text-center rounded text-white ${
                        timeLeft.lessThanHour ? "bg-danger" : "bg-primary"
                      }`}
                    >
                      {timeLeft.h}:{timeLeft.m}:{timeLeft.s}
                    </div>
                  </div>
                  <span className="badge bg-success">{item.bids} Bids</span>
                </div>
                <div className="card-footer text-center">
                  {new Date(item.endTime) < new Date() ? (
                    <button className="btn btn-danger w-100" disabled>
                      Ended
                    </button>
                  ) : item.isSoldOut ? (
                    <button className="btn btn-secondary w-100" disabled>
                      Not Available
                    </button>
                  ) : (
                    <button className="btn btn-outline-primary w-100">
                      Place Bid
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CardRandom;
