import { useEffect, useState } from "react";
import ReviewList from "./ReviewList";
import { ListGroup } from "react-bootstrap";
import { useParams } from "react-router-dom";
import RatingModal from "./RatingModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviewAction } from "../../../redux/action";
import "./Review.css";

const ReviewsArea = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [empty, setEmpty] = useState(true);
  const [openEdit, setOpenEdit] = useState(false);
  const reviews = useSelector((state) => state.reviewData.data);
  const token = localStorage.getItem("token");

  useEffect(() => {
    dispatch(fetchReviewAction(token, params.id, setLoading));
  }, []);

  useEffect(() => {
    if (!loading) {
      reviews.length == 0 ? setEmpty(true) : setEmpty(false);
    }
  }, [reviews]);

  return (
    <div className="my-2" style={{ width: "95%", height: "100vh", display: "flex", flexDirection: "column" }}>
      <div className="sticky-top">
        <RatingModal openEdit={openEdit} setOpenEdit={setOpenEdit} setLoading={setLoading} />
      </div>
      <div style={{ overflowY: "auto", height: "100%", paddingBottom: 20 }}>
        {loading ? (
          <ListGroup>
            {[...Array(5)].map((_, idex) => (
              <ListGroup.Item
                key={idex}
                className="d-flex flex-column shadow-sm border-0 p-6 blink"
                style={{ backgroundColor: "#f6f5f529", height: "180px" }}
              ></ListGroup.Item>
            ))}
          </ListGroup>
        ) : empty ? (
          <div className="d-flex align-items-center justify-content-center" style={{ height: "100%" }}>
            Nessuna recensione
          </div>
        ) : (
          <ReviewList reviews={reviews} setOpenEdit={setOpenEdit} setLoading={setLoading} />
        )}
      </div>
    </div>
  );
};
export default ReviewsArea;
