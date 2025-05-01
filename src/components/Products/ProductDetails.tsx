import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getProductById,
  placeBid,
  getBiddingHistory,
} from "../ProductWork/productService";
import { Form, Button, Card, Row, Col, Spinner, Alert } from "react-bootstrap";
import Header from "../user/Header";
import Footer from "../user/Footer";
import UserNav from "../user/UserNav";
import Yapp from "../user/Yapp";
import moment from "moment";
import numWords from "num-words";
import CardRandom from "./CardRandom";

interface Product {
  _id: string;
  title: string;
  image: { filePath: string };
  currentBid?: number;
  price?: number;
  bids: number;
  city: string;
  isSoldOut: boolean;
  isVerify?: boolean;
  description?: string;
  startTime?: string;
  endTime?: string;
  auctionStatus?: string;
  minimumIncrement?: number;
  maximumIncrement?: number;
}

interface Bid {
  user: { name: string; email: string };
  price: number;
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
  const [biddingHistory, setBiddingHistory] = useState<Bid[]>([]);
  const [timeLeft, setTimeLeft] = useState({
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  const [isLessThanOneHour, setIsLessThanOneHour] = useState(false);

  const calculateTimeLeft = () => {
    if (!product?.endTime) return;

    const end = new Date(product.endTime).getTime();
    const now = new Date().getTime();
    const difference = end - now;

    if (difference <= 0) {
      setTimeLeft({ hours: "00", minutes: "00", seconds: "00" });
      setIsLessThanOneHour(false);
      return;
    }

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    const pad = (num: number) => String(num).padStart(2, "0");

    setTimeLeft({
      hours: pad(hours),
      minutes: pad(minutes),
      seconds: pad(seconds),
    });

    setIsLessThanOneHour(hours < 1);
  };

  const fetchProduct = async () => {
    try {
      if (id) {
        const data = await getProductById(id);
        setProduct(data);
        setBidAmount(
          (data.currentBid ?? data.price ?? 0) + (data.minimumIncrement || 1000)
        );
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
      await fetchProduct();
      await fetchBiddingHistory();
      setSuccess("Bid placed successfully");
      setError(null);
    } catch (err: any) {
      setSuccess(null);
      setError(err.response?.data?.message || "Failed to place bid.");
    }
  };

  const fetchBiddingHistory = async () => {
    if (!id) return;
    try {
      const history = await getBiddingHistory(id);
      if (Array.isArray(history)) setBiddingHistory(history);
      else setBiddingHistory([]);
    } catch (error) {
      console.error("Error fetching bidding history:", error);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchBiddingHistory();

    const productInterval = setInterval(() => {
      fetchProduct();
      fetchBiddingHistory();
    }, 5000);

    const countdownInterval = setInterval(() => {
      calculateTimeLeft();
    }, 1000);

    return () => {
      clearInterval(productInterval);
      clearInterval(countdownInterval);
    };
  }, [id, product?.endTime]);

  if (loading) return <Spinner animation="border" variant="primary" />;
  if (!product) return <p>Product not found.</p>;

  const now = new Date();
  const isAuctionOngoing =
    new Date(product.startTime || "") <= now &&
    now <= new Date(product.endTime || "");
  const isBiddingAllowed = isAuctionOngoing && !product.isSoldOut;

  return (
    <>
      <UserNav />
      <div className="container my-5">
        <Row>
          <Col md={6}>
            <Card>
              <Card.Img
                variant="top"
                src={product.image?.filePath}
                alt={product.title}
                style={{ maxHeight: "450px", objectFit: "cover" }}
              />
            </Card>
          </Col>
          <Col md={6}>
            <h2>{product.title}</h2>
            <p>
              <strong>City: {product.city}</strong>
            </p>
            <p>
              <strong>Auction Timeline:</strong>
            </p>

            <ul>
              <li>Start: {moment(product.startTime).format("LLL")}</li>
              <li>
                End: {moment(product.endTime).format("LLL")} <br />
                <Row className="mb-3 text-center">
                  {[
                    { label: "Hours", value: timeLeft.hours },
                    { label: "Minutes", value: timeLeft.minutes },
                    { label: "Seconds", value: timeLeft.seconds },
                  ].map((item, idx) => (
                    <Col key={idx}>
                      <Card
                        className={isLessThanOneHour ? "border-danger" : ""}
                        style={{
                          borderWidth: "2px",
                          borderColor: isLessThanOneHour ? "red" : undefined,
                        }}
                      >
                        <Card.Body>
                          <Card.Title
                            style={{
                              color: isLessThanOneHour ? "red" : "inherit",
                            }}
                          >
                            {item.value}
                          </Card.Title>
                          <Card.Text>{item.label}</Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </li>
            </ul>

            <p>
              <strong>Auction Status:</strong>{" "}
              {new Date(product.endTime || "") < new Date() ? (
                <span className="text-danger">Ended</span>
              ) : isLessThanOneHour ? (
                <span className="text-warning">Last Hour Active</span>
              ) : isAuctionOngoing ? (
                <span className="text-success">Auction - Active</span>
              ) : (
                product.auctionStatus
              )}
            </p>

            <p>
              <strong>Starting Price:</strong> रु {product.price}{" "}
              <small>
                (Rs.
                {numWords(product.price || 0).replace(/\b\w/g, (l) =>
                  l.toUpperCase()
                )}
                )
              </small>
            </p>

            <p>
              <strong>Current Bid:</strong> रु{" "}
              {product.currentBid ?? product.price}{" "}
              <small>
                (Rs.
                {numWords(product.currentBid ?? (product.price || 0)).replace(
                  /\b\w/g,
                  (l) => l.toUpperCase()
                )}
                )
              </small>
            </p>

            <p>
              <strong>Total Bids:</strong> {product.bids}
            </p>
            <p>
              <strong>Sold Status:</strong>{" "}
              {product.isSoldOut ? (
                <span className="text-danger">Sold Out</span>
              ) : (
                <span className="text-success">In-process</span>
              )}
            </p>
            <p>
              <strong>Min Increment:</strong> {product.minimumIncrement ?? 1000}{" "}
              | <strong>Max Increment:</strong>{" "}
              {product.maximumIncrement ?? "∞"}
            </p>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form className="d-flex gap-2 mt-3">
              <Form.Control
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(parseFloat(e.target.value))}
                disabled={!isBiddingAllowed}
              />
              <Button
                variant="primary"
                onClick={handleBidSubmit}
                disabled={!isBiddingAllowed}
              >
                Submit Bid
              </Button>
            </Form>
          </Col>
        </Row>

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
                    <div>
                      <strong>{bid.user?.name || "Anonymous"}</strong> <br />
                      <small>{moment(bid.createdAt).format("LLL")}</small>
                    </div>
                    <span>रु {bid.price}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <CardRandom excludeId={id} />
      <Yapp />
      <Footer />
    </>
  );
};

export default ProductDetail;
