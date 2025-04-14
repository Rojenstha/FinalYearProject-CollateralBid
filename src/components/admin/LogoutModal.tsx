import { Modal, Button } from "react-bootstrap";

type LogoutModalProps = {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const LogoutModal = ({ show, onClose, onConfirm }: LogoutModalProps) => (
  <Modal show={show} onHide={onClose}>
    <Modal.Header closeButton>
      <Modal.Title>Confirm Logout</Modal.Title>
    </Modal.Header>
    <Modal.Body>Are you sure you want to sign out?</Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onClose}>
        Cancel
      </Button>
      <Button variant="danger" onClick={onConfirm}>
        Sign out
      </Button>
    </Modal.Footer>
  </Modal>
);

export default LogoutModal;
