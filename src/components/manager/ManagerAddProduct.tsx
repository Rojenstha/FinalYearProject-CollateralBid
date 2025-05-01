import { useState } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Sidebar from "./MSidebar";
import LogoutModal from "./MLogoutModal";
import axios from "axios";
import numWords from "num-words";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ManagerAddProduct = () => {
  const formatIndianNumber = (num: number): string => {
    return num.toLocaleString("en-IN");
  };

  const [active, setActive] = useState("Add Product");
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const [priceInWords, setPriceInWords] = useState("");
  const [incrementInWords, setIncrementInWords] = useState("");
  const [maximumIncrementInWords, setMaximumIncrementInWords] = useState("");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));

    if (name === "price") {
      const num = parseInt(value);
      if (!isNaN(num))
        setPriceInWords(numWords(num).replace(/\b\w/g, (l) => l.toUpperCase()));
    }

    if (name === "minimumIncrement") {
      const num = parseInt(value);
      if (!isNaN(num))
        setIncrementInWords(
          numWords(num).replace(/\b\w/g, (l) => l.toUpperCase())
        );
    }
    if (name === "maximumIncrement") {
      const num = parseInt(value);
      if (!isNaN(num)) {
        setMaximumIncrementInWords(
          numWords(num).replace(/\b\w/g, (l) => l.toUpperCase())
        );
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Show loading popup
    const payload = new FormData();
    const fullData = { ...formData };
    if (startTime) fullData.startTime = startTime.toISOString();
    if (endTime) fullData.endTime = endTime.toISOString();

    for (const key in fullData) {
      payload.append(key, fullData[key]);
    }

    if (imageFile) {
      payload.append("image", imageFile);
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/product/create",
        payload
      );
      alert("Product added successfully!");
      navigate("/manager-dashboard");
    } catch (err: any) {
      alert(
        `Failed to add product: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setLoading(false); // Hide loading popup
    }
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    setShowLogoutPopup(false);
    navigate("/");
  };

  return (
    <div className="d-flex">
      <div className="p-4" style={{ marginLeft: "250px" }}></div>

      <Sidebar
        active={active}
        setActive={setActive}
        onLogout={() => setShowLogoutPopup(true)}
      />

      <Container fluid className="p-4">
        <h2>Add Auction Product</h2>
        <Card className="p-4 mt-3">
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>{" "}
                  {/* Changed from city to location */}
                  <Form.Control
                    type="text"
                    name="city"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    onChange={handleChange}
                    rows={3}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Image</Form.Label>
                  <Form.Control
                    type="file"
                    name="image"
                    onChange={handleFileChange}
                    accept="image/*"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Starting Price</Form.Label>
                  <Form.Text className="text-muted">
                    रु {formatIndianNumber(Number(formData.price || 0))} —{" "}
                    {priceInWords}
                  </Form.Text>

                  <Form.Control
                    type="number"
                    name="price"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Minimum Increment</Form.Label>
                  <Form.Text className="text-muted">
                    रु{" "}
                    {formatIndianNumber(Number(formData.minimumIncrement || 0))}{" "}
                    — {incrementInWords}
                  </Form.Text>

                  <Form.Control
                    type="number"
                    name="minimumIncrement"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Maximum Increment</Form.Label>
                  <Form.Text className="text-muted">
                    रु{" "}
                    {formatIndianNumber(Number(formData.maximumIncrement || 0))}{" "}
                    — {maximumIncrementInWords}
                  </Form.Text>
                  <Form.Control
                    type="number"
                    name="maximumIncrement"
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    as="select" // Use 'as="select"' for a dropdown
                    name="category"
                    onChange={handleChange}
                    required
                  >
                    <option value="All">All</option>
                    <option value="Land">Land</option>
                    <option value="Land and Building">Land and Building</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Start Auction: </Form.Label>
                  <DatePicker
                    selected={startTime}
                    onChange={(date) => setStartTime(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className="form-control"
                    placeholderText="Select start time"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>End Auction: </Form.Label>
                  <DatePicker
                    selected={endTime}
                    onChange={(date) => setEndTime(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className="form-control"
                    placeholderText="Select end time"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button type="submit" variant="primary" className="mt-3 w-10">
              Submit Product
            </Button>
          </Form>
        </Card>
      </Container>

      <LogoutModal
        show={showLogoutPopup}
        onCancel={() => setShowLogoutPopup(false)}
        onConfirm={confirmLogout}
      />
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1050,
          }}
        >
          <div className="bg-white p-4 rounded shadow">
            <strong>Submitting product...</strong>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerAddProduct;
