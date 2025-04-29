import { useState } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Sidebar from "./MSidebar";
import LogoutModal from "./MLogoutModal";
import axios from "axios";

const ManagerAddProduct = () => {
  const [active, setActive] = useState("Add Product");
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = new FormData();
    for (const key in formData) {
      payload.append(key, formData[key]);
    }
    if (imageFile) {
      payload.append("image", imageFile);
    }
    console.log("Form data:", formData);
    console.log("Image file:", imageFile);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/product/create",
        payload
      );
      console.log(response.data); // Log successful response
      alert("Product added successfully!");
      navigate("/manager-dashboard");
    } catch (err: any) {
      console.error("Error response:", err.response); // Log full error response
      alert(
        `Failed to add product: ${err.response?.data?.message || err.message}`
      );
    }
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    setShowLogoutPopup(false);
    navigate("/");
  };

  return (
    <div className="d-flex">
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
                  <Form.Control
                    type="number"
                    name="price"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Minimum Increment</Form.Label>
                  <Form.Control
                    type="number"
                    name="minimumIncrement"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Maximum Increment</Form.Label>
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
                  <Form.Label>Start Time</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="startTime"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>End Time</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="endTime"
                    onChange={handleChange}
                    required
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
    </div>
  );
};

export default ManagerAddProduct;
