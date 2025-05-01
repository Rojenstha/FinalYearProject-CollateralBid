import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

interface BidModalProps {
  show: boolean;
  onClose: () => void;
  onBidSubmit: (increment: number) => Promise<void>;
  currentBid: number;
  startingPrice: number;
  minIncrement: number;
  maxIncrement?: number;
}

const BidModal: React.FC<BidModalProps> = ({
  show,
  onClose,
  onBidSubmit,
  currentBid,
  startingPrice,
  minIncrement,
  maxIncrement,
}) => {
  const [increment, setIncrement] = useState<number>(minIncrement);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const activeBid = currentBid || startingPrice;
  const newBid = activeBid + increment;

  useEffect(() => {
    if (show) {
      setIncrement(minIncrement);
      setError(null);
      setSuccess(null);
    }
  }, [show, activeBid, minIncrement]);

  const validateBid = () => {
    if (increment < minIncrement) {
      return `Minimum increment is NPR ${minIncrement}.`;
    }
    if (maxIncrement && increment > maxIncrement) {
      return `Maximum increment is NPR ${maxIncrement}.`;
    }
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateBid();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await onBidSubmit(increment);
      setSuccess("Bid placed successfully!");
      setError(null);
      onClose();
    } catch (err) {
      setError("Failed to place bid.");
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Place Your Bid</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form.Group>
          <Form.Label>Bid Increment (NPR)</Form.Label>
          <Form.Control
            type="number"
            value={increment}
            onChange={(e) => setIncrement(Number(e.target.value))}
            min={minIncrement}
          />
          <Form.Text className="text-muted">
            Starting Price: NPR {startingPrice}
            <br />
            Current Bid: NPR {activeBid}
            <br />
            Minimum Increment: +{minIncrement}
            <br />
            Maximum Increment: +{maxIncrement ?? "∞"}
            <br />
            <strong>Your New Bid: NPR {newBid}</strong>
          </Form.Text>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "Submitting..." : "Submit Bid"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BidModal;
