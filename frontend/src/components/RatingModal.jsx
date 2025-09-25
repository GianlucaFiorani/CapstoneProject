import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Ball from "./svg/Ball";
import { id } from "date-fns/locale";
import { useParams } from "react-router-dom";

const RatingModal = () => {
  const params = useParams();
  const [hover, setHover] = useState(null);
  const [rating, setRating] = useState(null);
  const [imageUrl, setIamgeUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [comment, setComment] = useState("");

  const handleClick = (value) => {
    setRating(value);
    setShowModal(true);
  };

  const createOrEditReview = async () => {
    const token = localStorage.getItem("token");
    const URL = id ? "http://localhost:3001/reviews" : `http://localhost:3001/reviews/${id}`;
    setIsLoading(true);
    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courtId: params.id, comment, rating, imageUrl }),
      });

      if (response.ok) {
        fetchPass();
      } else {
        throw new Error("Errore nella creazione del commento");
      }
    } catch (error) {
      console.log(error);
      setHasError(true);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
      setShowModal(false);
    }
  };

  const handleSubmit = () => {
    createOrEditReview();
    console.log("Valutazione:", rating);
    console.log("Commento:", comment);
    setComment("");
    setRating(null);
  };

  return (
    <>
      <div className="d-flex justify-content-center gap-1 my-3">
        {[...Array(5)].map((_, index) => {
          const value = index + 1;
          return (
            <div
              key={index}
              onClick={() => handleClick(value)}
              onMouseEnter={() => setHover(value)}
              onMouseLeave={() => setHover(null)}
              style={{
                width: "50px",
                cursor: "pointer",
                fill: value <= (hover || rating) ? " #795548" : "#f4e7e7ff",
              }}
            >
              <Ball />
            </div>
          );
        })}
      </div>

      <Modal
        show={showModal}
        onHide={() => {
          setRating(null);
          setShowModal(false);
        }}
        centered
      >
        <Modal.Header closeButton className="border-0 pb-0"></Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-center gap-1">
            {[...Array(5)].map((_, index) => {
              const value = index + 1;
              return (
                <div
                  key={index}
                  onClick={() => handleClick(value)}
                  onMouseEnter={() => setHover(value)}
                  onMouseLeave={() => setHover(null)}
                  style={{
                    width: "50px",
                    cursor: "pointer",
                    fill: value <= (hover || rating) ? " #795548" : "#a5a5a5ff",
                  }}
                >
                  <Ball />
                </div>
              );
            })}
          </div>
          <Form>
            <Form.Group className="mt-3">
              <Form.Control
                className="border-c1"
                style={{ background: "none" }}
                as="textarea"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
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
              setRating(null);
              setShowModal(false);
            }}
          >
            Annulla
          </Button>
          <Button variant="primary" className="bg-1 border-0" onClick={handleSubmit}>
            Invia
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RatingModal;
