import { Modal, Button, Form } from "react-bootstrap";

const AddProductModal = ({ show, onHide, onChange, onSubmit }: any) => (
  <Modal show={show} onHide={onHide}>
    <Modal.Header closeButton>
      <Modal.Title>Add Product</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form onSubmit={onSubmit}>
        {["name", "image", "location", "description"].map((field) => (
          <Form.Group key={field}>
            <Form.Label>
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </Form.Label>
            <Form.Control
              type="text"
              name={field}
              onChange={onChange}
              required
            />
          </Form.Group>
        ))}
        <Button variant="primary" type="submit" className="mt-3">
          Submit
        </Button>
      </Form>
    </Modal.Body>
  </Modal>
);

export default AddProductModal;
