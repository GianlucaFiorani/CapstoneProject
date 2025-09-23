import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Review = () => {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]);

  const fetchReview = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      setError("Non sei autenticato");
      setLoading(false);
      return;
    } else {
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
    }
  };

  useEffect(() => {
    fetchReview();
  }, []);

  return (
    <>
      {reviews.map((review) => (
        <div key={review.id}>
          <h1>
            {review.user.username} <span>{review.rating}</span>
          </h1>
          <p>{review.comment}</p>
        </div>
      ))}
    </>
  );
};
export default Review;
