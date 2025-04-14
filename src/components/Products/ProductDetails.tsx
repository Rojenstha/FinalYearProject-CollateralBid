import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../ProductWork/productService";
import { placeBid, getBiddingHistory } from "../ProductWork/productService";
import { Form, Button, Card, Row, Col, Spinner, Alert } from "react-bootstrap";
import Header from "../user/Header";
import Footer from "../user/Footer";
import AuctionCard from "./AuctionCard";
import UserNav from "../user/UserNav";
import Yapp from "../user/Yapp";

interface Product {
  _id: string;
  title: string;
  image: {
    filePath: string;
  };
  currentBid?: number;
  price?: number;
  bids: number;
  isSoldOut: boolean;
  description?: string;
}

interface Bid {
  user: {
    name: string;
    email: string;
  };
  amount: number;
  createdAt: string;
}

const ProductDetail: React.FC = () => {
  const { productId: id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [biddingHistory, setBiddingHistory] = useState<any[]>([]);

  const fetchProduct = async () => {
    try {
      if (id) {
        const data = await getProductById(id);
        setProduct(data);
        setBidAmount(data.currentBid ?? data.price ?? 0);
      }
    } catch (error) {
      console.error("Failed to fetch product details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBidSubmit = async () => {
    try {
      if (!product || !id) return;

      await placeBid(id, bidAmount);
      await fetchProduct(); // Refresh product data
      await fetchBiddingHistory(); // Refresh bidding history
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to place bid.");
    }
  };
  const fetchBiddingHistory = async () => {
    if (!id) return;

    try {
      const history = await getBiddingHistory(id);
      console.log("Fetched bidding history:", history);

      // Check if history is an array or nested
      if (Array.isArray(history)) {
        setBiddingHistory(history);
      } else if (Array.isArray(history?.bids)) {
        setBiddingHistory(history.bids); // <-- example structure
      } else {
        setBiddingHistory([]); // fallback
        console.warn("Bidding history format is unexpected:", history);
      }
    } catch (error) {
      console.error("Error fetching bidding history:", error);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchData = async () => {
      await fetchProduct();
      await fetchBiddingHistory();
    };

    fetchData();
    interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  return (
    <>
      <UserNav />
      <div className="container my-5">
        <Row>
          <Col md={6}>
            <Card>
              <Card.Img
                variant="top"
                src={product.image.filePath}
                alt={product.title}
                style={{ maxHeight: "450px", objectFit: "cover" }}
              />
            </Card>
          </Col>
          <Col md={6}>
            <h2>{product.title}</h2>
            <p>
              <strong>Asset Verified:</strong> No
            </p>
            <Row className="mb-3 text-center">
              {["149 Days", "12 Hours", "36 Minutes", "51 Seconds"].map(
                (val, idx) => (
                  <Col key={idx}>
                    <Card>
                      <Card.Body>
                        <Card.Title>{val.split(" ")[0]}</Card.Title>
                        <Card.Text>{val.split(" ")[1]}</Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                )
              )}
            </Row>
            <p>
              <strong>Auction ends:</strong> 4 Aug 2024
            </p>
            <p>
              <strong>Timezone:</strong> UTC 0
            </p>
            <p>
              <strong>Price:</strong> रु {product.price}
            </p>
            <strong>Current bid:</strong> रु{" "}
            {product.currentBid ?? product.price}
            <p>
              <strong>Total Bids:</strong> {product.bids}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {product.isSoldOut ? (
                <span className="text-danger">Sold Out</span>
              ) : (
                <span className="text-success">Available</span>
              )}
            </p>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form inline className="d-flex gap-2 mt-3">
              <Form.Control
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(parseFloat(e.target.value))}
                className="me-2"
              />
              <Button variant="primary" onClick={handleBidSubmit}>
                Submit
              </Button>
            </Form>
          </Col>
        </Row>

        {/* Tabs like Description, Auction History, etc. */}
        <div className="mt-5">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <a className="nav-link active" href="#">
                Description
              </a>
            </li>
          </ul>
          <div className="mt-3">
            <p>{product.description ?? "No description provided."}</p>
          </div>

          <div className="mt-3">
            <h5>Bidding History</h5>
            {biddingHistory.length === 0 ? (
              <p>No bids yet.</p>
            ) : (
              <ul className="list-group">
                {biddingHistory.map((bid, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <span>{bid.user?.name || "Anonymous"}</span>
                    <span>${bid.price}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <AuctionCard />
      <Yapp />
      <Footer />
    </>
  );
};

export default ProductDetail;
