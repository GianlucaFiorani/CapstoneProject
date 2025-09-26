import { useEffect, useState } from "react";
import { Button, Dropdown, ListGroup, Modal } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import PrintRating from "./PrintRating";
import { formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { fetchReviewAction, reviewAction } from "../../../redux/action";

const RviewList = ({ reviews, setLoading, setOpenEdit }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);

  const deleteReview = async () => {
    try {
      const response = await fetch("http://localhost:3001/reviews/" + toDelete, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        dispatch(fetchReviewAction(token, params.id, setLoading));
      } else {
        throw new Error("Errore nel eliminazione del commento");
      }
    } catch (error) {
      console.log(error);
      setHasError(true);
      setErrorMessage(error.message);
    } finally {
      setShowModal(false);
    }
  };

  return (
    <>
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setToDelete(null);
        }}
        centered
      >
        <Modal.Header closeButton className="border-0 "></Modal.Header>
        <Modal.Body className="fs-5 fw-semibold align-self-center py-1">Confermi eliminazione?</Modal.Body>
        <Modal.Footer className="d-flex justify-content-center gap-2 border-0">
          <Button
            className="py-1 px-5 border-0 text-black delete-button"
            style={{ background: "#f0d9bb" }}
            onClick={() => {
              setShowModal(false);
              setToDelete(null);
            }}
          >
            Annulla
          </Button>
          <Button
            className="py-1 px-5 text-danger border-0 delete-button "
            style={{ background: "#f0d9bb" }}
            onClick={() => {
              deleteReview();
            }}
          >
            Elimina
          </Button>
        </Modal.Footer>
      </Modal>

      <ListGroup>
        {reviews.map((review) => (
          <ListGroup.Item key={review.id} className="d-flex flex-column shadow-sm border-0 p-5" style={{ backgroundColor: "#f6f5f529" }}>
            <Dropdown className="position-absolute border-0 top-0 end-0 me-3 p-0">
              <Dropdown.Toggle className="fs-4 border-0 p-0 mb-5" variant="none" id="dropdown-basic">
                <BsThreeDots />
              </Dropdown.Toggle>

              <Dropdown.Menu className="shadow" style={{ background: "antiquewhite" }}>
                <Dropdown.Item href="#/action-1">Segnala</Dropdown.Item>
                {(review.user.id == decoded.sub || decoded.role == "ADMIN") && (
                  <>
                    <Dropdown.Item
                      onClick={() => {
                        dispatch(reviewAction(review.id, review.rating, review.comment, review.imageUrl));
                        setOpenEdit(true);
                      }}
                    >
                      Modifica
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => {
                        setToDelete(review.id);
                        setShowModal(true);
                      }}
                    >
                      Elimina
                    </Dropdown.Item>
                  </>
                )}
              </Dropdown.Menu>
            </Dropdown>

            <div className="d-flex gap-2 align-items-center mb-2">
              <img
                src={review.user.avatar}
                alt="avatar"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <div style={{ width: "100%" }}>
                <div className="d-flex flex-wrap justify-content-between">
                  <div className="d-flex">
                    <span className="fw-semibold fs-5">
                      {review.user.name} {review.user.surname}
                    </span>
                    <span className="fs-8 align-self-center fw-semibold ms-1 mt-2">@{review.user.username}</span>
                  </div>
                  <span className="fs-6" style={{ color: "#494949ed" }}>
                    {formatDistanceToNow(new Date(review.date), {
                      addSuffix: true,
                      locale: it,
                    })}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <PrintRating ratingAv={review.rating} size={"20px"} translate={"-32px"} />
            </div>
            <div className="fs-5">{review.comment}</div>
            {review.imageUrl && (
              <>
                <img
                  onClick={() => setShow(true)}
                  src={review.imageUrl}
                  alt="reviewImg"
                  style={{
                    width: "100%",
                    borderRadius: "4%",
                    objectFit: "cover",
                    marginTop: "20px",
                  }}
                />
                <Modal show={show} onHide={() => setShow(false)} size="lg" centered>
                  <Modal.Body className="p-0 bg-dark">
                    <img src={review.imageUrl} alt="fullscreen" style={{ width: "100%", height: "auto", display: "block" }} />
                  </Modal.Body>
                </Modal>
              </>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
      <div style={{ width: "100%", height: "130px" }} />
    </>
  );
};
export default RviewList;
