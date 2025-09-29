import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";

const ReportModal = ({ showModal, setShowModal, reviewId }) => {
  const params = useParams();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const createReport = async () => {
    const token = localStorage.getItem("token");
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3001/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message, courtId: reviewId ? null : params.id, reviewId }),
      });

      if (response.ok) {
        console.log("Segnalazione inviata");
      } else {
        throw new Error("Errore nella creazione della segnalazione");
      }
    } catch (error) {
      console.log(error);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
      setShowModal(false);
      setMessage("");
    }
  };

  const handleSubmit = () => {
    if (message) {
      createReport();
    }
  };

  return (
    <>
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setMessage("");
        }}
        centered
      >
        <Modal.Header closeButton className="border-0 pb-0"></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mt-3">
              <p className="fw-semibold fs-5">Cosa vuoi segnalare?</p>
              <Form.Control
                className="border-c1"
                style={{ background: "none" }}
                as="textarea"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Scrivi qualcosa..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button
            className="border-0"
            variant="secondary"
            onClick={() => {
              setShowModal(false);
              setMessage("");
            }}
          >
            Annulla
          </Button>
          <Button variant="primary" className={message ? "bg-1 border-0" : "bg-light border-0 text-secondary"} onClick={handleSubmit}>
            Invia
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ReportModal;
