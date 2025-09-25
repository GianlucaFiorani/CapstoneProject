import { useParams } from "react-router-dom";
import { Container, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import "./HorizontalScroll.css";
import ReviewsArea from "./ReviewsArea";
import PrintRating from "./PrintRating";

const CourtDetails = () => {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [court, setCourt] = useState();

  const fetchCourt = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      setError("Non sei autenticato");
      setLoading(false);
      return;
    } else {
      fetch("http://localhost:3001/courts/" + params.id, {
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
          setCourt(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    fetchCourt();
  }, []);

  if (loading) {
    return (
      <Container
        fluid
        className="text-center"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #e78f0cff 0%, #fbf6e0ff 100%)",
          color: "#f1f1f1",
        }}
      >
        <Spinner className="mt-5" animation="border" variant="danger" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container
        fluid
        className="mt-5"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #e78f0cff 0%, #fbf6e0ff 100%)",
        }}
      >
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e78f0cff 0%, #fbf6e0ff 100%)",
        overflowX: "hidden",
        position: "fixed",
      }}
    >
      <h1>{court.name}</h1>

      <PrintRating ratingAv={court.ratingAv} size={"20px"} />

      <div className="scroll-container">
        <div className="page page1">
          <ReviewsArea />
        </div>
        <div className="page page2">Pagina 2</div>
        <div className="page page3">Pagina 3</div>
      </div>
    </div>
  );
};
export default CourtDetails;
