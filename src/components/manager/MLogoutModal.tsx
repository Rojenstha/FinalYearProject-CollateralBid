import { Modal, Button } from "react-bootstrap";

const MLogoutModal = ({ show, onCancel, onConfirm }: any) => (
  <Modal show={show} onHide={onCancel}>
    <Modal.Header closeButton>
      <Modal.Title>Confirm Logout</Modal.Title>
    </Modal.Header>
    <Modal.Body>Are you sure you want to sign out?</Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onCancel}>
        Cancel
      </Button>
      <Button variant="danger" onClick={onConfirm}>
        Sign out
      </Button>
    </Modal.Footer>
  </Modal>
);

export default MLogoutModal;
