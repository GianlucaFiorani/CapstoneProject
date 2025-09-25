import { useEffect, useState } from "react";
import ReviewList from "./ReviewList";
import { Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import RatingModal from "./RatingModal";

const ReviewsArea = () => {
  const params = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReviews = async (e) => {
    const token = localStorage.getItem("token");
    setLoading(true);
    fetch("http://localhost:3001/reviews/" + params.id, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore caricamento");
        return res.json();
      })
      .then((data) => {
        setReviews(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="my-2" style={{ width: "95%", height: "100vh", display: "flex", flexDirection: "column" }}>
      <div className="sticky-top">
        <RatingModal />
      </div>
      <div style={{ overflowY: "auto", height: "100%", paddingBottom: 20 }}>
        {loading ? <Spinner animation="border" variant="danger" size="lg" /> : <ReviewList fetchPass={fetchReviews} reviews={reviews} />}
      </div>
    </div>
  );
};
export default ReviewsArea;
